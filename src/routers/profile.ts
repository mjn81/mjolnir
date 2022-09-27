import { Router } from 'express';

import { profileController } from '../controllers';
import { paramsValidator, upload } from '../middlewares';
import { serveProfileSchema } from '../schemas';

const router = Router();

router.post('/', upload.single('profile'), profileController.create);

router.delete(
  '/:id',
  paramsValidator(serveProfileSchema),
  profileController.delete,
);

router.get(
  '/:id',
  paramsValidator(serveProfileSchema),
  profileController.serve,
);

export const profileRouter = router;
