import {
  NextFunction,
  Request,
  Response,
} from 'express';

import { TokenError } from '../errors';
import { MESSAGES } from '../constants';
import { verifyToken } from '../utils';

export const userAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.headers?.authorization;
  if (!token) return next();

  const bearer = token?.split(' ') as string[];

  if (!bearer[1] || bearer[0] !== 'Token')
    throw new TokenError(
      MESSAGES['WRONG_BEARER'],
    );

  const payload = verifyToken(bearer[1]);
  if (!payload) return next();
  req.user = {
    id: payload?.id,
    email: payload?.email,
  };

  return next();
};
