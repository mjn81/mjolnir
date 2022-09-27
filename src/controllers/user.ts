import { Role } from '@prisma/client';
import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { MESSAGES } from '../constants';
import { InvalidRoleError, SingleValidationError } from '../errors';
import { prisma } from '../database';
import { roleBaseAuth } from '../helpers';
import {
  IUserCreateSchema,
  IUserDeleteSchema,
  IUserUpdateSchema,
} from '../schemas';
import { hash, checkHash } from '../utils';

class UserController {
  async create(req: ValidatedRequest<IUserCreateSchema>, res: Response) {
    await roleBaseAuth(prisma, req.user, [Role.ADMIN]);
    const { userName, fullName, email, password, role } = req.body;
    if (!Role[role]) {
      throw new InvalidRoleError(MESSAGES['INVALID_ROLE_ERROR']);
    }
    const checkUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (checkUser)
      throw new SingleValidationError(MESSAGES['USER_EXISTS']);

    const hashedPassword = await hash(password);
    const user = await prisma.user.create({
      data: {
        userName,
        fullName,
        email,
        password: hashedPassword,
        role: Role[role],
        usage: {
          create: {},
        },
      },
    });

    return res.send({
      message: MESSAGES['USER_CREATED'],
      user,
    });
  }

  async list(req: Request, res: Response) {
    await roleBaseAuth(prisma, req.user, [Role.ADMIN]);

    // phase 3 add pagination
    const count = await prisma.user.count();
    const users = await prisma.user.findMany();
    return res.send({
      users,
      count,
    });
  }

  async delete(req: ValidatedRequest<IUserDeleteSchema>, res: Response) {
    const user = await roleBaseAuth(prisma, req.user);
    const { id } = req.params;
    if (user.role !== Role.ADMIN && user.id !== id) {
      throw new InvalidRoleError(MESSAGES['INSUFFICIENT_PERMISSION']);
    }
    const deleted = await prisma.user.delete({
      where: {
        id,
      },
    });

    return res.send({
      message: MESSAGES['USER_DELETED'],
      user: deleted,
    });
  }

  async detail(req: ValidatedRequest<IUserDeleteSchema>, res: Response) {
    await roleBaseAuth(prisma, req.user, [Role.ADMIN]);
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    return res.json({
      user,
    });
  }

  async update(req: ValidatedRequest<IUserUpdateSchema>, res: Response) {
    await roleBaseAuth(prisma, req.user, [Role.ADMIN]);
    const { id } = req.params;
    const { userName, fullName, email, password, role } = req.body;

    if (!Role[role]) {
      throw new InvalidRoleError(MESSAGES['INVALID_ROLE_ERROR']);
    }

    let hashedPassword = password;

    if (checkHash(password)) {
      hashedPassword = await hash(password);
    }

    const user = await prisma.user.update({
      where: {
        id,
      },
      data: {
        userName,
        fullName,
        email,
        password: hashedPassword,
        role: Role[role],
      },
    });

    return res.send({
      message: MESSAGES['USER_UPDATED'],
      user,
    });
  }

  me = async (req: Request, res: Response) => {
    const user = await roleBaseAuth(prisma, req.user);
    const userProfile = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
        userName: true,
        fullName: true,
        email: true,
        profile: {
          select: {
            id: true,
            path: true,
          },
        },
        role: true,
        usage: {
          select: {
            limit: true,
            used: true,
          }
        }
      }
    });

    res.json({
      ...userProfile
    });
  }
}

export const userController = new UserController();
