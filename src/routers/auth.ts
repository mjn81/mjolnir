import { Router } from 'express';

import { authController } from '../controllers';
import { bodyValidator } from '../middlewares';
import { distTokenSchema, loginSchema, registerSchema } from '../schemas';

const router = Router();

router.post('/login', bodyValidator(loginSchema), authController.login);

router.post(
  '/register',
  bodyValidator(registerSchema),
  authController.register,
);

router.post('/dist-token', bodyValidator(distTokenSchema), authController.distToken);

router.get('/me', authController.profile);

export const authRouter = router;
