import { MESSAGES } from '../constants';
import { Request, Response } from 'express';

export const playgroundController = (
  _req: Request,
  res: Response,
) => {
  res.send({ message: MESSAGES['PLAY_GROUND'] });
};
