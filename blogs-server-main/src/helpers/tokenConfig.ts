export const getJwtKey = (): string => {
  const key = process.env.JWT_KEY;
  if (!key || key.length < 32) throw new Error('JWT_KEY must contain at least 32 characters');
  return key;
};
