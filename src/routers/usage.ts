import { usageController } from '../controllers';
import { Router } from 'express';
import { usageDetailSchema, usageUpdateSchema } from '../schemas';
import { paramsValidator } from '../middlewares';

const router = Router();

router.put('/', paramsValidator(usageUpdateSchema), usageController.update);

router.get(
  '/:id',
  paramsValidator(usageDetailSchema),
  usageController.details,
);
