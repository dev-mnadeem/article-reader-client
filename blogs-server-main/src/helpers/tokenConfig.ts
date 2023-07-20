import jwt from 'jsonwebtoken';

export const TOKEN_ALGORITHM = 'HS256';

export const getJwtKey = (): string => {
  const key = process.env.JWT_KEY;
  if (!key || key.length < 32) throw new Error('JWT_KEY must contain at least 32 characters');
  return key;
};

export const issueToken = (userId: string): string =>
  jwt.sign({ user: userId }, getJwtKey(), { algorithm: TOKEN_ALGORITHM, expiresIn: '1h' });
