import { Router } from 'express';

import {
  playgroundController,
  uploadController,
} from '../controllers';

const router = Router();

router.get('/playground', playgroundController);

router.post('/', uploadController);

export const fileRouter = router;
