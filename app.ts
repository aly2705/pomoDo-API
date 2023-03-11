import express, { Express, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import cors from 'cors';
import taskRouter from './routes/taskRoutes';
import userRouter from './routes/userRoutes';
import reportRouter from './routes/reportRoutes';
import overviewRouter from './routes/overviewRoutes';
import globalErrorHandler from './controllers/errorController';
import AppError from './utilities/AppError';
import cookieParser from 'cookie-parser';

const app: Express = express();

// CORS
app.use(cors());
app.options('*', cors());

// SECURITY MIDDLEWARE

// 1) Security headers
app.use(helmet());

// 2) Rate limiting
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests fro this IP, please try again in an hour',
});
app.use('/api', limiter);

// 3) Body-parser with transfer limit & cookie-parser
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// 4) Data sanitization (for NoSQL query injection)
app.use(mongoSanitize());

// 5) Data sanitization (against cross-site scripting)
app.use(xss());

// 6) Prevent parameter pollution
app.use(hpp());

// Mounting routers
app.use('/api/v1/tasks', taskRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/overviews', overviewRouter);
app.use('/api/v1/reports', reportRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const err: AppError = new AppError(`Can't find ${req.originalUrl}`, 404);
  next(err);
});

app.use(globalErrorHandler);

export default app;
