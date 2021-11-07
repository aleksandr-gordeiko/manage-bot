import {
  Collection, Db, FindCursor,
} from 'mongodb';
import { Options } from './types';

const { MongoClient } = require('mongodb');

const url: string = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/`;
let client: typeof MongoClient;
let db: Db;

const connectDB = async (): Promise<void> => {
  try {
    client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
    db = client.db(process.env.MONGO_DB_NAME);
  } catch (err) {
    throw new Error(`DB connection error: ${err}`);
  }
};

const closeConnection = async (): Promise<void> => {
  try {
    await client.close();
  } catch (err) {
    throw new Error('DB connection closure fail');
  }
};

const addOrUpdateOptions = async (options: Options): Promise<void> => {
  const collection: Collection = db.collection('options');
  const cursor: FindCursor = collection.find({});
  if (await cursor.count() !== 0) await collection.updateOne({}, { $set: options });
  else await collection.insertOne(options);
};

const getOptions = async (): Promise<Options> => {
  const collection: Collection = db.collection('options');
  const cursor: FindCursor = collection.find({});
  if (await cursor.count() !== 0) return cursor.next();
  return {};
};

export {
  connectDB,
  closeConnection,
  addOrUpdateOptions,
  getOptions,
};
