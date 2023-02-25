import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import catchAsync from '../utilities/catchAsync';
import { NextFunction, Request, Response, CookieOptions } from 'express';
import User from '../models/userModel';
import AppError from '../utilities/AppError';

// type CookieOptions = {
//   expires?: number;
//   httpOnly?: boolean;
//   secure?: boolean;
// };

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
    const email: string = req.body.email;
    const password: string = req.body.password;
    if (!email || !password)
      return next(new AppError('Please provide email and password', 400));

    // 2) Find user by email
    const user = await User.findOne({ email });
    // NO USER: Throw operational error
    if (!user) return next(new AppError('Email is invalid!', 400));

    // 3) Check if password is correct

    // INCORRECT PASSWORD: Throw error
    // 4) Create and send jwt
  }
);
