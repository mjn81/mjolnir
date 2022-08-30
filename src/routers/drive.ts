import { Router } from 'express';
import { paramsValidator } from '../middlewares';
import { driveController } from '../controllers';
import { driveDetailSchema } from '../schemas';

const router = Router();

router.get('/', driveController.rootDrive);

router.get(
  '/:id',
  paramsValidator(driveDetailSchema),
  driveController.subDrive,
);

export const driveRouter = router;
