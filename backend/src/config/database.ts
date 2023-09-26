import mongoose from 'mongoose';

export function connectDatabase() {
  const MONGO_URI = process.env.MONGO_URI as string;

  mongoose
    .connect(MONGO_URI, {})
    .then(() => {
      console.log('Connection to the database was successful');
    })
    .catch((error) => {
      console.log('Database connection failed. Exiting...');
      console.error(error);
      process.exit(1);
    });
}
