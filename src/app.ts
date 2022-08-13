import express from 'express';
import { config } from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';
import helmet from 'helmet';

import swaggerDoc from './docs';
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
  logMiddleware,
} from './middlewares';
import { createMongo } from './database';
import { PORT, SWAGGER_OPTS } from './constants';

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
config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

const main = () => {
  createMongo();
  const app = express();
  app.disable('x-powered-by');

  // middlewares
  app.use(
    helmet({
      frameguard: true,
      noSniff: true,
      hsts: true,
    }),
  );
  app.use(logMiddleware());
  app.use(corsMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(userAuthMiddleware);
  // routers
  app.use(
    '/api/doc',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDoc, SWAGGER_OPTS),
  );
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
