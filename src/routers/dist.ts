import { Router } from 'express';

import { paramsValidator, queryValidator } from '../middlewares';
import { distController } from '../controllers';
import {
  deleteDistSchema,
  paramServeDistSchema,
  queryServeDistSchema,
} from '../schemas';

const router = Router();

router.get('/', distController.getRoute);

router.post('/', distController.createRoute);

router.delete(
  '/:id',
  paramsValidator(deleteDistSchema),
  distController.deleteRoute,
);

router.get(
  '/:route/:id',
  paramsValidator(paramServeDistSchema),
  queryValidator(queryServeDistSchema),
  distController.serve,
);

export const distRouter = router;
