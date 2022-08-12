import { Router } from 'express';
import {
  bodyValidator,
  paramsValidator,
  upload,
} from '../middlewares';

import { fileController } from '../controllers';
import {
  fileServeSchema,
  fileUpdateBody,
  fileUploadParam,
} from '../schemas';

const router = Router();

router.post(
  '/',
  upload.single('file'),
  fileController.upload,
);

router.get('/all', fileController.list);

router.get(
  '/:id',
  paramsValidator(fileServeSchema),
  fileController.serve,
);

router.delete(
  '/:id',
  paramsValidator(fileServeSchema),
  fileController.delete,
);

router.put(
  '/:id',
  paramsValidator(fileUploadParam),
  bodyValidator(fileUpdateBody),
  fileController.update,
);

export const fileRouter = router;
