import { getJwtKey } from './tokenConfig';
import { PrismaClient } from '@prisma/client';
import { compareData } from './encryptionHelpers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export const generateAuthToken = async (email: string, password: string) => {
  let token = '';
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) {
    const isAuth = compareData(password, user.password);
    const jwtKey = getJwtKey();
    if (isAuth) {
      token = jwt.sign({ user: user.id }, jwtKey, { algorithm: 'HS256', expiresIn: '1h' });
    }
  }
  return token;
};
