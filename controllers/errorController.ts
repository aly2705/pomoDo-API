import AppError from '../utilities/AppError';
import { NextFunction, Request, Response } from 'express';
import { Error, MongooseError } from 'mongoose';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { MongoServerError } from 'mongodb';

// #ff0000: Complete with specific messages for operational errors

// JWT Errors
const handleJWTExpired = () => {
  const message = 'Your token has expired! Please log in again!';
  return new AppError(message, 401);
};
const handleJWTInvalid = () => {
  const message = `Invalid token! Please log in again!`;
  return new AppError(message, 401);
};

// DB Errors
const handleCastErrorDB = (err: Error.CastError) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};
const handleDuplicateFieldDB = (err: MongoServerError) => {
  console.log(err);

  const value = err.errmsg.match(/(["'])(?:\\.|[^\\])*?\1/)?.at(0) || '';
  const message = `Duplicate field value: ${value} . Please use another value`;

  return new AppError(message, 400);
};
const handleValidationErrorDB = (err: Error.ValidationError) => {
  const errors = Object.values(err.errors).map(value => value.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

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
  caughtError: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error: AppError;

  if (process.env.NODE_ENV === 'development') {
    if (!(caughtError instanceof AppError)) {
      error = new AppError(caughtError.message, 500, false);
    } else error = caughtError;
    sendErrorDev(error, res);
  } else {
    error = Object.create(caughtError);

    if (caughtError instanceof Error.CastError)
      error = handleCastErrorDB(caughtError);

    if (caughtError instanceof MongoServerError && caughtError.code === 11000)
      error = handleDuplicateFieldDB(caughtError);

    if (caughtError instanceof Error.ValidationError)
      error = handleValidationErrorDB(caughtError);

    if (caughtError instanceof JsonWebTokenError) error = handleJWTInvalid();

    if (caughtError instanceof TokenExpiredError) error = handleJWTExpired();

    sendErrorProd(error, res);
  }
};

export default globalErrorHandler;
