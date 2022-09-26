import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { nanoid } from 'nanoid';

import { MESSAGES } from '../constants';
import { SingleValidationError, ValidationError } from '../errors';
import { createToken, hashVerify, hash, createDistToken } from '../utils';
import { prisma } from '../database';
import {
  IDistTokenSchema,
  ILoginSchema,
  IRegisterSchema,
} from '../schemas';
import { roleBaseAuth } from '../helpers';

class AuthController {
  async login(req: ValidatedRequest<ILoginSchema>, res: Response) {
    const { email, password } = req.body;

    const user = await prisma.users.findUniqueOrThrow({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        userName: true,
        fullName: true,
        role: true,
        password: true,
        usage: {
          select: {
            limit: true,
            used: true,
          },
        },
      },
    });
    const verify = await hashVerify(user.password, password);

    if (!verify)
      throw new ValidationError(MESSAGES['WRONG_PASSWORD'], 'password');

    const token = createToken({
      username: user.userName,
      id: user.id,
    });
    const { password: _, ...rest } = user;
    res.json({
      message: MESSAGES['LOGIN_SUCCESS'],
      token,
      user: rest,
    });
  }

  async register(req: ValidatedRequest<IRegisterSchema>, res: Response) {
    const { fullName, userName, email, password } = req.body;

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (user) throw new SingleValidationError(MESSAGES['USER_EXISTS']);

    const hashedPassword = await hash(password);

    const newUser = await prisma.users.create({
      data: {
        fullName,
        userName,
        email,
        password: hashedPassword,
        usage: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        userName: true,
        fullName: true,
        role: true,
        usage: {
          select: {
            limit: true,
            used: true,
          },
        },
      },
    });

    const token = createToken({
      username: newUser.userName,
      id: newUser.id,
    });

    res.json({
      message: MESSAGES['REGISTER_SUCCESS'],
      token,
      user: newUser,
    });
  }

  async distToken(req: ValidatedRequest<IDistTokenSchema>, res: Response) {
    const user = await roleBaseAuth(prisma, req.user);
    const { category, folder } = req.body;

    if (!category && !folder)
      throw new SingleValidationError(MESSAGES['FIELD_EMPTY']);

    const token = createDistToken({
      username: user.userName,
      id: user.id,
    });
    let data: any = {
      token,
      user: {
        connect: {
          id: user.id,
        },
      },
    };

    if (folder)
      data = {
        ...data,
        folder: {
          connect: {
            id: folder,
          },
        },
      };
    if (category)
      data = {
        ...data,
        category: {
          connect: {
            id: category,
          },
        },
      };

    const tokenData = await prisma.distToken.create({
      data: data,
      select: {
        token: true,
        category: {
          select: {
            name: true,
          },
        },
        folder: {
          select: {
            name: true,
          },
        },
      },
    });
    let route = await prisma.distRoute.findUnique({
      where: {
        userId: user.id,
      },
      select: {
        route: true,
      },
    });
    if (!route) {
      const distRoute = nanoid();
      route = await prisma.distRoute.create({
        data: {
          route: distRoute,
          user: {
            connect: {
              id: user.id,
            },
          },
        },
        select: {
          route: true,
        },
      });
    }
    res.json({
      message: MESSAGES['DISTRIBUTOR_TOKEN_SUCCESS'],
      dist: {
        ...tokenData,
        ...route,
      },
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
      },
    });
  }

  async profile(req: Request, res: Response) {
    const user = await roleBaseAuth(prisma, req.user);
    res.json({
      user: {
        ...user,
      },
    });
  }
}

export const authController = new AuthController();
