import { Router } from 'express';

import { usageController } from '../controllers';
import { usageDetailSchema, usageUpdateSchema } from '../schemas';
import { bodyValidator, paramsValidator } from '../middlewares';

const router = Router();

router.put(
  '/',
  bodyValidator(usageUpdateSchema),
  usageController.update,
);

router.get(
  '/:id',
  paramsValidator(usageDetailSchema),
  usageController.details,
);


export const usageRouter = router;