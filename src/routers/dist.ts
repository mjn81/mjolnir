import { distController } from 'controllers/dist';
import { Router } from 'express';

const router = Router();

router.get('/', distController.distRoute);

export const distRouter = router;
