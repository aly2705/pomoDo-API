import express, { Express, NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import taskRouter from './routes/taskRoutes';
import userRouter from './routes/userRoutes';
import globalErrorHandler from './controllers/errorController';
import AppError from './utilities/AppError';
import cookieParser from 'cookie-parser';

const app: Express = express();

// Requests logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Body-parser & cookie-parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Mounting routers
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err: AppError = new AppError(`Can't find ${req.originalUrl}`, 404);
  next(err);
});

app.use(globalErrorHandler);

export default app;
