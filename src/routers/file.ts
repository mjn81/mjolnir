import { Router } from 'express';
import {
  paramsValidator,
  // queryValidator,
  upload,
} from '../middlewares';

import { fileController } from '../controllers';
import { fileServeSchema } from '../schemas';

const router = Router();

router.post(
  '/',
  upload.single('file'),
  fileController.upload,
);

router.get(
  '/:id',
  paramsValidator(fileServeSchema),
  fileController.serve,
);

export const fileRouter = router;
