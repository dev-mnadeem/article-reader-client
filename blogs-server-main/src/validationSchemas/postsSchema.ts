import { object, string } from 'yup';

export const createPostSchema = object({
  title: string().trim().required().min(3).max(200),
  content: string().trim().required().max(10000),
});
