import { NextFunction, Response } from 'express';
import User from '../models/userModel';
import AppError from '../utilities/AppError';
import catchAsync from '../utilities/catchAsync';
import { ExtendedRequest } from '../types/types';
import * as handlerFactory from './handlerFactory';

export const getCurrentUser = catchAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const user = await User.findById(req.user?.id);

    if (!user) return next(new AppError('This user no longer exists!', 404));
    res.status(200).json({
      status: 'success',
      data: { user },
    });
  }
);

export const updateCurrentUser = catchAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    if (req.body.password)
      return next(
        new AppError('You cannot update your password using this route!', 403)
      );
    const updatedUser = await User.findByIdAndUpdate(
      req.user?.id,
      {
        name: req.body.name,
        email: req.body.email,
      },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      status: 'success',
      data: { user: updatedUser },
    });
  }
);

export const getAllUsers = handlerFactory.getAll(User);
export const getUser = handlerFactory.getOne(User);
export const updateUser = handlerFactory.updateOne(User);
export const deleteUser = handlerFactory.deleteOne(User);
