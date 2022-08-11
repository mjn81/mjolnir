import { PrismaClient } from '@prisma/client';
import mongoose from 'mongoose';

export const prisma = new PrismaClient();

export const connectMongo = () =>
  mongoose.connect(process.env.MONGODB_URL ?? '');
