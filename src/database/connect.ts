import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';

export const prisma = new PrismaClient();

let db;

export const createMongo = () =>
  MongoClient.connect(
    process.env.MONGODB_URL ?? '',
    (err, client) => {
      if (err || !client) {
        console.log(err);
        process.exit(0);
      }
      console.log('connected to mongo');

      db = client.db('FileCluster');
    },
  );

export const getMongo = () => db;
