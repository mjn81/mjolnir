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

router.get('/', categoryController.list);
router.post('/', categoryController.create);
router.get(
  '/:id',
  paramsValidator(catUpdateParam),
  categoryController.detail,
);
router.put(
  '/:id',
  paramsValidator(catUpdateParam),
  bodyValidator(catUpdateBody),
  categoryController.update,
);
router.delete(
  '/:id',
  paramsValidator(catUpdateParam),
  categoryController.delete,
);

export const categoryRouter = router;
