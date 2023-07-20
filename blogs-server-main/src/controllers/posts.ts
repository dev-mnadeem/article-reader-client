import { Response } from 'express';
import { Prisma, PrismaClient } from '@prisma/client';
import RESPONSE_CODES from '../constants/responseCodes';
import { isForeignKeyViolation } from '../helpers/prismaErrors';
import sendResponse from '../helpers/responseHelper';
import { CustomRequest } from '../interfaces/request';
import { createPostSchema } from '../validationSchemas/postsSchema';

const prisma = new PrismaClient();

export const FEED_LIMIT = 50;

const publicPostFields = {
  id: true,
  title: true,
  content: true,
  createdAt: true,
  author: { select: { name: true } },
} satisfies Prisma.PostSelect;

export const addPost = async (req: CustomRequest, res: Response) => {
  const { title, content } = await createPostSchema.validate(req.body);

  try {
    const post = await prisma.post.create({
      data: { title, content, authorId: req.userId as string },
      select: publicPostFields,
    });
    return sendResponse(res, post);
  } catch (error) {
    // A valid token can outlive its account (for example after the database is reset).
    if (isForeignKeyViolation(error)) {
      return sendResponse(res, {}, 'Unauthorized user', RESPONSE_CODES.authorizationError);
    }
    throw error;
  }
};

export const getPosts = async (req: CustomRequest, res: Response) => {
  const title = typeof req.query.title === 'string' ? req.query.title.trim() : '';

  const posts = await prisma.post.findMany({
    where: title ? { title: { contains: title, mode: 'insensitive' } } : undefined,
    orderBy: { createdAt: 'desc' },
    take: FEED_LIMIT,
    select: publicPostFields,
  });

  return sendResponse(res, posts);
};
