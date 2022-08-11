import { Router } from 'express';

import { bodyValidator } from '../middlewares';
import { fileUploadSchema } from '../schemas';
import { uploadController } from '../controllers';

const router = Router();

router.post(
  '/',
  bodyValidator(fileUploadSchema),
  uploadController,
);

export const fileRouter = router;
