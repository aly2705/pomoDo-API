import { Request, Response, NextFunction } from 'express';
import AppError from './AppError';

const catchAsync =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err: Error | AppError) => next(err));
  };

export default catchAsync;
