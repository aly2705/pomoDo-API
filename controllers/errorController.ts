import AppError from '../utilities/AppError';
import { NextFunction, Request, Response } from 'express';

// #ff0000: Complete with specific messages for operational errors

const sendErrorProd = (err: AppError, res: Response): void => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  } else {
    console.log('ERROR 📛📛📛', err);

    res.status(500).json({
      status: 'error',
      message: `Something went very wrong!`,
    });
  }
};

const sendErrorDev = (err: AppError, res: Response): void => {
  res.status(err.statusCode).json({
    status: 'error',
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const globalErrorHandler = (
  caughtError: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error: AppError;

  if (!(caughtError instanceof AppError)) {
    error = new AppError(caughtError.message, 500, false);
  } else error = caughtError;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
