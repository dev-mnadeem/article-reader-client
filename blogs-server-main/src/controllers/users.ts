import { randomBytes } from 'crypto';
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import RESPONSE_CODES from '../constants/responseCodes';
import { compareData, encryptData } from '../helpers/encryptionHelpers';
import { isUniqueViolation } from '../helpers/prismaErrors';
import sendResponse from '../helpers/responseHelper';
import { issueToken } from '../helpers/tokenConfig';
import { userAuthSchema, userRegistrationSchema } from '../validationSchemas/userSchema';

const prisma = new PrismaClient();

// Unknown emails are compared against this hash so both login failures cost one bcrypt round.
const unknownUserHash = encryptData(randomBytes(16).toString('hex'));

export const handleSignup = async (req: Request, res: Response) => {
  const { name, email, password } = await userRegistrationSchema.validate(req.body);

  try {
    await prisma.user.create({ data: { name, email, password: await encryptData(password) } });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return sendResponse(res, null, 'User already exists', RESPONSE_CODES.conflictError);
    }
    throw error;
  }
  return sendResponse(res);
};

export const handleLogin = async (req: Request, res: Response) => {
  const { email, password } = await userAuthSchema.validate(req.body);

  const user = await prisma.user.findUnique({ where: { email } });
  const isAuth = await compareData(password, user?.password ?? (await unknownUserHash));
  if (!user || !isAuth) {
    return sendResponse(res, null, 'Invalid email/password', RESPONSE_CODES.authorizationError);
  }
  return sendResponse(res, { authtoken: issueToken(user.id) });
};
