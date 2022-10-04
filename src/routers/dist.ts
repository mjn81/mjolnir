import { Router } from 'express';

import {
  bodyValidator,
  paramsValidator,
  queryValidator,
} from '../middlewares';
import { distController } from '../controllers';
import {
  deleteDistSchema,
  deleteDistTokenSchema,
  distTokenSchema,
  paramServeDistSchema,
  queryServeDistSchema,
} from '../schemas';

const router = Router();

router.get('/', distController.getRoute);

router.post('/', distController.createRoute);

router.post(
  '/token/',
  bodyValidator(distTokenSchema),
  distController.createToken,
);

router.get('/token/', distController.listToken);

router.delete(
  '/token/:id',
  paramsValidator(deleteDistTokenSchema),
  distController.deleteToken,
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
