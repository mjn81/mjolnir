import { categoryController } from '../controllers';
import { Router } from 'express';

const router = Router();

router.post('/', categoryController.create);

export const categoryRouter = router;
