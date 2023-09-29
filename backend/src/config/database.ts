import mongoose from 'mongoose';
import { mongooseFactory } from '../util/mongooseFactory';

export function connectDatabase() {
  const MONGO_URI = process.env.MONGO_URI as string;

  mongooseFactory(MONGO_URI).then((config) => {
    mongoose
      .connect(config.uri, {})
      .then(() => {
        console.log('Connection to the database was successful');
      })
      .catch((error) => {
        console.log('Database connection failed. Exiting...');
        console.error(error);
        process.exit(1);
      });
  });
}

export async function disconnectDatabase() {
  await mongoose.connection.close();
}
