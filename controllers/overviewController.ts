import { Response, NextFunction } from 'express';
import Overview from '../models/overviewModel';
import catchAsync from '../utilities/catchAsync';
import { ExtendedRequest } from '../utilities/types';
import * as handlerFactory from './handlerFactory';

export const getCurrentUserOverview = catchAsync(
  async (req: ExtendedRequest, res: Response) => {
    const overview = await Overview.find({ user: req.user?.id });

    res.status(200).json({
      status: 'success',
      overview,
    });
  }
);

export const getAllOverviews = handlerFactory.getAll(Overview);
export const getOverview = handlerFactory.getOne(Overview);
export const createOverview = handlerFactory.createOne(Overview);
export const updateOverview = handlerFactory.updateOne(Overview);
export const deleteOverview = handlerFactory.deleteOne(Overview);
