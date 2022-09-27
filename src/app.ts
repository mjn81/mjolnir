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
  userRouter,
  folderRouter,
  driveRouter,
  usageRouter,
} from './routers';
import {
  errorHandler,
  corsMiddleware,
  userAuthMiddleware,
  logMiddleware,
} from './middlewares';
import { createMongo, createS3 } from './database';
import { bigIntJsonParser } from './utils';
import { profileRouter } from 'routers/profile';

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

export const PORT = process.env.PORT || 3000;

export const SWAGGER_OPTS = {
  customSiteTitle: 'Mjolnir API - file upload',
  customfavIcon: (process.env.BASE_HREF + '/' || '/') + 'favicon.ico?v=1',
};

const main = () => {
  // createMongo();
  createS3();
  const app = express();
  app.disable('x-powered-by');

  // middlewares
  app.use(
    helmet({
      frameguard: true,
      noSniff: true,
    }),
  );
  app.use(logMiddleware());
  app.use(corsMiddleware);
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(userAuthMiddleware);

  // big int parser
  bigIntJsonParser();

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
  app.use('/user', userRouter);
  app.use('/folder', folderRouter);
  app.use('/drive', driveRouter);
  app.use('/usage', usageRouter);
  app.use('/profile', profileRouter);
  // error Handler
  app.use(errorHandler);

  // start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

main();
