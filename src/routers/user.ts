import { Router } from 'express';
import { userController } from '../controllers';
import { bodyValidator, paramsValidator } from '../middlewares';
import { userDeleteSchema, userUpdateSchema } from '../schemas';

const router = Router();

router.post('/', userController.create);
router.get('/', userController.list);

router.get('/me', userController.me);

router.get(
  '/:id',
  paramsValidator(userDeleteSchema),
  userController.detail,
);

router.delete(
  '/:id',
  paramsValidator(userDeleteSchema),
  userController.delete,
);

router.post(
  '/:id',
  paramsValidator(userDeleteSchema),
  bodyValidator(userUpdateSchema),
  userController.update,
);

export const userRouter = router;
