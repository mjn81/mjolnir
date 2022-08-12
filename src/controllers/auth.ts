import { Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';

import { MESSAGES } from '../constants';
import {
  SingleValidationError,
  ValidationError,
} from '../errors';
import {
  createToken,
  hashVerify,
  hash,
} from '../utils';
import { prisma } from '../database';
import {
  ILoginSchema,
  IRegisterSchema,
} from '../schemas';

// phase 2 : add refresh token

class AuthController {
  async login(
    req: ValidatedRequest<ILoginSchema>,
    res: Response,
  ) {
    const { email, password } = req.body;

    const user =
      await prisma.users.findUniqueOrThrow({
        where: {
          email,
        },
      });

    const verify = await hashVerify(
      user.password,
      password,
    );

    if (!verify)
      throw new ValidationError(
        MESSAGES['WRONG_PASSWORD'],
        'password',
      );

    const token = createToken({
      username: user.userName,
      id: user.id,
    });

    res.send({
      message: MESSAGES['LOGIN_SUCCESS'],
      token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
      },
    });
  }

  async register(
    req: ValidatedRequest<IRegisterSchema>,
    res: Response,
  ) {
    const {
      fullName,
      userName,
      email,
      password,
    } = req.body;

    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });

    if (user)
      throw new SingleValidationError(
        MESSAGES['USER_EXISTS'],
      );

    const hashedPassword = await hash(password);

    const newUser = await prisma.users.create({
      data: {
        fullName,
        userName,
        email,
        password: hashedPassword,
      },
    });

    const token = createToken({
      username: newUser.userName,
      id: newUser.id,
    });

    res.send({
      message: MESSAGES['REGISTER_SUCCESS'],
      token,
      user: {
        id: newUser.id,
        userName: newUser.userName,
        email: newUser.email,
      },
    });
  }
}

export const authController =
  new AuthController();
