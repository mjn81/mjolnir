import { folderController } from 'controllers';
import { Router } from 'express';

const router = Router();

router.get('/', folderController.rootList);

export const folderRouter = router;
