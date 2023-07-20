import { Response } from 'express';
import { CustomRequest } from '../interfaces/request';
import sendResponse from '../helpers/responseHelper';
import { createPostSchema } from '../validationSchemas/postsSchema';
import { PrismaClient } from '@prisma/client';

// Initialize Prisma client
const prisma = new PrismaClient();

// Function to add a new post
export const addPost = async (req: CustomRequest, res: Response) => {
  // Validate request body
  await createPostSchema.validate(req.body);
  const userId = req.userId as string;
  const { title, content } = req.body;
  // Create post in the database
  await prisma.post.create({
    data: {
      title,
      content,
      authorId: userId,
    },
  });
  // Send success response
  sendResponse(res);
};

// Function to get posts based on query parameters
export const getPosts = async (req: CustomRequest, res: Response) => {
  const title = req.query.title as string;

  // Define where options for querying posts
  const whereOptions: any = {};

  // If title query parameter is provided, filter posts by title
  if (title) {
    whereOptions.title = {
      contains: title,
      mode: 'insensitive',
    };
  }

  // Find posts in the database based on where options
  const posts = await prisma.post.findMany({
    where: whereOptions,
  });

  // Send response with retrieved posts
  sendResponse(res, posts);
};
