import { Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';

import { MESSAGES } from '../constants';
import { SingleValidationError, ValidationError } from '../errors';
import { createToken, hashVerify, hash, createDistToken } from '../utils';
import { prisma } from '../database';
import { ILoginSchema, IRegisterSchema } from '../schemas';
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

  async distToken(req: Request, res: Response) {
    const user = await roleBaseAuth(prisma, req.user);
    const token = createDistToken({
      username: user.userName,
      id: user.id,
    });

    res.json({
      message: MESSAGES['DISTRIBUTOR_TOKEN_SUCCESS'],
      token,
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
