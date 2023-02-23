import express, { Express, Request, Response } from 'express';

const app: Express = express();

app.all('*', (req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl}`,
  });
});

export default app;
