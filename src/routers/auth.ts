import {
  loginController,
  registerController,
} from '../controllers';
import { Router } from 'express';

const router = Router();

router.post('/login', loginController);

router.post('/register', registerController);

export const authRouter = router;
