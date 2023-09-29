import { MongoMemoryServer } from 'mongodb-memory-server';

const isTest = process.env.NODE_ENV === 'test';

export const mongooseFactory = async (mongoUri: string) => {
  if (!isTest) return { uri: mongoUri };

  const mongod = await MongoMemoryServer.create();
  return { uri: mongod.getUri(), useNewUrlParser: true, useUnifiedTopology: true };
};
