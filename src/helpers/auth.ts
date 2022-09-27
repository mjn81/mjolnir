import { PrismaClient, Role } from '@prisma/client';
import { MESSAGES } from '../constants';
import { AuthorizationError } from '../errors';

type Payload = {
  id: string;
  email: string;
};
export const roleBaseAuth = async (
  prisma: PrismaClient,
  payload?: Payload,
  roles?: Role[],
) => {
  if (!payload) throw new AuthorizationError(MESSAGES['UNAUTHORIZED']);
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
    },
  });

  if (!roles) return user;
  if (roles.find((role) => user.role === role)) {
    return user;
  }

  throw new AuthorizationError(MESSAGES['INSUFFICIENT_PERMISSION']);
};
