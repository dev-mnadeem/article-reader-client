import * as Yup from 'yup';

// Mirrors blogs-server's `createPostSchema`.
export const postSchema = Yup.object().shape({
  title: Yup.string().trim().min(3, 'Title must be at least 3 characters').max(200).required('Title is required'),
  content: Yup.string().trim().required('Content is required'),
});
