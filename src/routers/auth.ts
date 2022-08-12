import { Router } from 'express';

import { authController } from '../controllers';
import { bodyValidator } from '../middlewares';
import {
  loginSchema,
  registerSchema,
} from '../schemas';

const router = Router();

router.post(
  '/login',
  bodyValidator(loginSchema),
  authController.login,
);

router.post(
  '/register',
  bodyValidator(registerSchema),
  authController.register,
);

router.get(
  '/distToken',
  authController.distToken,
);

export const authRouter = router;
