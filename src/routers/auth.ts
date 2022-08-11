import { Router } from 'express';

import {
  loginController,
  registerController,
} from '../controllers';
import { bodyValidator } from '../middlewares';
import {
  loginSchema,
  registerSchema,
} from '../schemas';

const router = Router();

router.post(
  '/login',
  bodyValidator(loginSchema),
  loginController,
);

router.post(
  '/register',
  bodyValidator(registerSchema),
  registerController,
);

export const authRouter = router;
