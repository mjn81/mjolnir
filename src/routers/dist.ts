import { Router } from 'express';

import {
  bodyValidator,
  paramsValidator,
  queryValidator,
} from '../middlewares';
import { distController } from '../controllers';
import {
  deleteDistSchema,
  distTokenSchema,
  paramServeDistSchema,
  queryServeDistSchema,
} from '../schemas';

const router = Router();

router.get('/', distController.getRoute);

router.post('/', distController.createRoute);

router.post(
  '/dist-token',
  bodyValidator(distTokenSchema),
  distController.createToken,
);

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
