import { Router } from 'express';
import { playgroundController } from '../controllers';

const router = Router();

router.get('/', playgroundController);

export const playgroundRouter = router;
