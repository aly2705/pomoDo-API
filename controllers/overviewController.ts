import { Response, NextFunction } from 'express';
import Overview from '../models/overviewModel';
import catchAsync from '../utilities/catchAsync';
import { ExtendedRequest } from '../types/types';
import * as handlerFactory from './handlerFactory';
import AppError from '../utilities/AppError';

export const getCurrentUserOverview = catchAsync(
  async (req: ExtendedRequest, res: Response) => {
    const overviews = await Overview.find({ user: req.user?.id });

    const overview: Overview | null = overviews.at(0) || null;

    res.status(200).json({
      status: 'success',
      overview,
    });
  }
);

export const updateCurrentUserOverview = catchAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    const overview = await Overview.find({ user: req.user?.id });

    if (!overview.length)
      return next(new AppError('There is no overview for this user', 404));

    const updatedDocument: Document | null = await Overview.findByIdAndUpdate(
      overview.at(0)?._id,
      req.body,
      {
        new: true, //returns the new document
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        document: updatedDocument,
      },
    });
  }
);

export const getAllOverviews = handlerFactory.getAll(Overview);
export const getOverview = handlerFactory.getOne(Overview);
export const createOverview = handlerFactory.createOne(Overview);
export const updateOverview = handlerFactory.updateOne(Overview);
export const deleteOverview = handlerFactory.deleteOne(Overview);
