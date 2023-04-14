import dotenv from 'dotenv';
import app from './app';
import mongoose, { ConnectOptions } from 'mongoose';

// HANDLING UNCAUGHT EXCEPTIONS
process.on('uncaughtException', (err: Error) => {
  console.log('❌❌❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message, err.stack);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const db: string =
  process.env.DATABASE?.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD ?? ''
  ) ?? '';

mongoose.set('strictQuery', true);
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then((): void => {
    console.log('Successfully connected to the database');
  });

const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`Don't forget to reactivate rate limiter`);
  console.log(`App listening for requests on port ${port}...`);
});

// HANDLING UNHANDLED REJECTIONS
process.on('unhandledRejection', (err: Error) => {
  console.log('❌❌❌ UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message, err.stack);
  server.close(() => {
    process.exit(1);
  });
});
