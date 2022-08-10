import { Router } from 'express';

import { uploadController } from '../controllers';

const router = Router();

router.post('/', uploadController);

export const fileRouter = router;
