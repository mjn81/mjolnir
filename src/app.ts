import express from 'express';
import { config } from 'dotenv';
import 'express-async-errors';

import {
  fileRouter,
  authRouter,
  playgroundRouter,
} from './routers';

import {
  errorHandler,
  corsMiddleware,
  uploadeMiddleware,
} from './middlewares';

config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

const PORT = process.env.PORT || 3000;

const main = () => {
  const app = express();

  // middlewares
  app.use(corsMiddleware);
  app.use(express.json());
  app.use('/files', uploadeMiddleware);
  app.use(express.urlencoded({ extended: true }));

  // routers
  app.use('/file', fileRouter);
  app.use('/playground', playgroundRouter);
  app.use('/auth', authRouter);

  // error Handler
  app.use(errorHandler);

  // start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

main();
