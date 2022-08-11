import { Router } from 'express';
import { upload } from '../middlewares';

import { fileController } from '../controllers';

const router = Router();

router.post(
  '/',
  upload.single('file'),
  fileController.upload,
);

export const fileRouter = router;
