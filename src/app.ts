import express from 'express';
import { config } from 'dotenv';
import 'express-async-errors';

import { fileRouter } from './routers';
import {
  errorHandler,
  uploadeMiddleware,
} from './middlewares';
import { corsMiddleware } from './middlewares/cors';

config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

const PORT = process.env.PORT || 3000;

const main = async () => {
  const app = express();

  // middlewares
  app.use(corsMiddleware);
  app.use(express.json());
  app.use('/files', uploadeMiddleware);
  app.use(express.urlencoded({ extended: true }));
  // routers
  app.use('/files', fileRouter);

  // error Handler
  app.use(errorHandler);

  // start server
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

main();
