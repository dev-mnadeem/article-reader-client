import { PrismaClient } from '@prisma/client';

// One client per process: each PrismaClient opens its own connection pool.
const prisma = new PrismaClient();

export default prisma;
