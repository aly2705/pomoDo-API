import dotenv from 'dotenv';
import app from './app';
import mongoose, { ConnectOptions } from 'mongoose';

dotenv.config({ path: './config.env' });

const db: string =
  process.env.DATABASE?.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD ?? ''
  ) ?? '';

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then((): void => {
    console.log('Successfully connected to the database');
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`App listening for requests on port ${port}...`);
});
