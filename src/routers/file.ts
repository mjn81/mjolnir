import { Router } from 'express';
import { bodyValidator, paramsValidator, upload } from '../middlewares';

import { fileController } from '../controllers';
import {
  changeAccessSchema,
  fileServeSchema,
  fileUpdateBody,
  fileUploadParam,
} from '../schemas';

const router = Router();

router.get('/', fileController.list);

router.post('/', upload.single('file'), fileController.upload);

router.get('/:id', paramsValidator(fileServeSchema), fileController.serve);

router.get(
  '/details/:id',
  paramsValidator(fileServeSchema),
  fileController.details,
);

router.put(
  '/access/:id',
  paramsValidator(fileUploadParam),
  bodyValidator(changeAccessSchema),
  fileController.changeAccess,
);


router.delete(
  '/:id',
  paramsValidator(fileServeSchema),
  fileController.delete,
);

router.put(
  '/:id',
  paramsValidator(fileUploadParam),
  bodyValidator(fileUpdateBody),
  fileController.update,
);


export const fileRouter = router;
