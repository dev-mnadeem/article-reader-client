import * as Yup from 'yup';

export const postSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .min(3, 'Title needs at least 3 characters')
    .max(200, 'Title can be at most 200 characters')
    .required('Title is required'),
  content: Yup.string().trim().max(10000, 'Content can be at most 10,000 characters').required('Content is required'),
});
