import express from 'express';
import { config } from 'dotenv';
import 'express-async-errors';

import { connectMongo } from './database';
import {
  fileRouter,
  authRouter,
  playgroundRouter,
  categoryRouter,
} from './routers';
import {
  errorHandler,
  corsMiddleware,
  userAuthMiddleware,
} from './middlewares';

config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

const PORT = process.env.PORT || 3000;

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

const main = () => {
  connectMongo();
  const app = express();

  // middlewares
  app.use(corsMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(userAuthMiddleware);
  // routers
  app.use('/file', fileRouter);
  app.use('/playground', playgroundRouter);
  app.use('/auth', authRouter);
  app.use('/category', categoryRouter);
  // error Handler
  app.use(errorHandler);

  // start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

main();
