import express, { Express, Request, Response } from 'express';
import taskRouter from './routes/tasksRoutes';

const app: Express = express();

// Body-parser
app.use(express.json({ limit: '10kb' }));

// Mounting routers
app.use('/api/v1/tasks', taskRouter);

app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl}`,
  });
});

export default app;
