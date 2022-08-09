import express from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { test } from './routers';

config({
  path:
    process.env.NODE_ENV === 'production'
      ? '.env.production'
      : '.env.development',
});

const PORT = process.env.PORT || 3000;

const main = async () => {
  const app = express();
  app.use(cors());
  console.log(test);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};

main();
