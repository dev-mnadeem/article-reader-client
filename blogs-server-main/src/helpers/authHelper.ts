import { compareData } from './encryptionHelpers';
import { issueToken } from './tokenConfig';
import prisma from '../db';

export const generateAuthToken = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user && (await compareData(password, user.password))) return issueToken(user.id);
  return '';
};
