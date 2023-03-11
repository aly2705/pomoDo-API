import { NextFunction, Response } from 'express';
import Task from '../models/taskModel';
import catchAsync from '../utilities/catchAsync';
import { ExtendedRequest } from '../types/types';
import * as handlerFactory from './handlerFactory';

export const deleteAllCompleted = catchAsync(
  async (req: ExtendedRequest, res: Response, next: NextFunction) => {
    await Task.deleteMany({ user: req.user?.id, completed: true });

    res.status(204).json({
      status: 'success',
    });
  }
);

export const getAllTasks = handlerFactory.getAll(Task);
export const createTask = handlerFactory.createOne(Task);
export const getTask = handlerFactory.getOne(Task);
export const updateTask = handlerFactory.updateOne(Task);
export const deleteTask = handlerFactory.deleteOne(Task);
