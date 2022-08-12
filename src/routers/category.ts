import { Router } from 'express';

import { categoryController } from '../controllers';
import {
  bodyValidator,
  paramsValidator,
} from '../middlewares';
import {
  catUpdateBody,
  catUpdateParam,
} from '../schemas';

const router = Router();

router.post('/', categoryController.create);
router.patch(
  '/:id',
  paramsValidator(catUpdateParam),
  bodyValidator(catUpdateBody),
  categoryController.update,
);

export const categoryRouter = router;
