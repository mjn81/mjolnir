import { Router } from 'express';
import { upload } from '../middlewares';

import { uploadController } from '../controllers';

const router = Router();

router.post(
  '/',
  upload.single('file'),
  uploadController,
);

export const fileRouter = router;
