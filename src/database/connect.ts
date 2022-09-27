import { S3Client } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';

export const prisma = new PrismaClient();

let db;

export const createMongo = () =>
  MongoClient.connect(process.env.MONGODB_URL ?? '', (err, client) => {
    if (err || !client) {
      console.log(err);
      process.exit(0);
    }
    console.log('connected to mongo');

    db = client.db('FileCluster');
  });

export const getMongo = () => db;

let s3;
export const createS3 = () => {
  s3 = new S3Client({
    region: 'default',
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY ?? '',
      secretAccessKey: process.env.S3_SECRET ?? '',
    },
  });
  return s3;
};

export const getS3 = () => s3;

export const BUCKET_NAME = {
  drive: 'mjolnir',
  profile: 'mjolnir-profile',
};
