import supertest from 'supertest';
import { app } from '../../src/app';
import prisma from '../../src/db';

export const api = () => supertest(app);

export const resetDatabase = async () => {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();
};

export const demoUser = {
  name: 'Ines Calloway',
  email: 'ines.calloway@example.com',
  password: 'margin-notes-1',
};

export const signUpAndLogin = async (user: typeof demoUser = demoUser): Promise<string> => {
  await api().post('/api/auth/signup').send(user).expect(200);
  const res = await api().post('/api/auth/login').send({ email: user.email, password: user.password }).expect(200);
  return res.body.payload.authtoken;
};

export { prisma };
