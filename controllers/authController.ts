import jwt, { Secret } from 'jsonwebtoken';
import catchAsync from '../utilities/catchAsync';
import { NextFunction, Request, Response, CookieOptions } from 'express';
import User from '../models/userModel';
import AppError from '../utilities/AppError';
import { promisify } from 'util';
import { ExtendedRequest } from '../types/types';

const signToken = (id: string): string =>
  jwt.sign({ id }, process.env.JWT_SECRET as jwt.Secret, {
    expiresIn: process.env.JWT_EXPIRES,
  });

const createSendToken = (
  res: Response,
  user: User,
  successStatusCode: number
) => {
  const token = signToken(user.id);

  // Send jwt via cookie
  const cookieOptions: CookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(process.env.JWT_EXPIRES as string, 10) * 24 * 3600 * 1000
    ),
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  res.status(successStatusCode).json({
    status: 'success',
    data: {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        photo: user.photo,
      },
    },
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Create new user in the db
    const newUser: User = await User.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    createSendToken(res, newUser, 201);
  }
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Check if email and password exists on the body
    const email: string | undefined = req.body.email;
    const password: string | undefined = req.body.password;
    if (!email || !password)
      return next(new AppError('Please provide email and password', 400));

    // 2) Find user by email
    const user: User | null = await User.findOne({ email }).select('+password');
    // NO USER: Throw operational error
    if (!user) return next(new AppError('Email is invalid!', 400));

    // 3) Check if password is correct
    const passwordIsCorrect: boolean = await user.correctPassword(
      user.password,
      password
    );
    // INCORRECT PASSWORD: Throw error
    if (!passwordIsCorrect)
      return next(new AppError('Incorrect password! Please try again!', 401));

    // 4) Create and send jwt
    createSendToken(res, user, 200);
  }
);

export const protect = catchAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    // 1) Check for token
    let token: string | undefined;
    if (req.headers.authorization?.startsWith('Bearer '))
      token = req.headers.authorization.split(' ').at(1);
    else if (req.cookies.jwt) token = req.cookies.jwt;

    if (!token)
      return next(
        new AppError(
          'You are not logged in! Please login in order to perform this action',
          401
        )
      );
    // 2) Parse and verify token

    const decoded: any = await promisify<string, jwt.Secret>(jwt.verify)(
      token,
      process.env.JWT_SECRET as jwt.Secret
    );

    // 3) Check if user exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser)
      return next(
        new AppError(
          'The user corresponding to the token does no longer exist!',
          404
        )
      );

    // 4) Check if user has changed password after token was issued
    const passwordWasChangedAfter = currentUser.passwordWasChanged(decoded.iat);
    if (passwordWasChangedAfter)
      return next(
        new AppError(
          'User has changed password after token was issued! Please log in again to get access!',
          401
        )
      );

    // GRANT PERMISSION
    req.user = currentUser;
    next();
  }
);

export const restrictTo =
  (...roles: string[]) =>
  (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role))
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    next();
  };

export const updatePassword = catchAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const { user } = req;
    const oldPassword: string = req.body.oldPassword;
    const newPassword: string = req.body.newPassword;
    const newPasswordConfirm: string = req.body.newPasswordConfirm;

    if (!user)
      return next(
        new AppError('Please log in in order to perform this action!', 401)
      );

    const currentUser = await User.findById(user.id).select('+password');
    if (!currentUser)
      return next(
        new AppError('The user could not be found! Please log in again!', 404)
      );
    const passwordIsCorrect = await user.correctPassword(
      currentUser.password,
      oldPassword
    );
    if (!passwordIsCorrect)
      return next(new AppError('Password is incorrect! Please try again', 401));

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    await user.save();

    createSendToken(res, user, 200);
  }
);
