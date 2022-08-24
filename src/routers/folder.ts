import { folderController } from '../controllers';
import { Router } from 'express';
import { bodyValidator, paramsValidator } from '../middlewares';
import { folderCreateSchema, folderDetailSchema } from '../schemas';

const router = Router();

router.get('/', folderController.rootList);

router.post(
  '/',
  bodyValidator(folderCreateSchema),
  folderController.create,
);

router.get(
  '/:id',
  paramsValidator(folderDetailSchema),
  folderController.subFolder,
);

export const folderRouter = router;
