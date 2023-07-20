import { useCallback } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { Form, Formik, FormikHelpers } from 'formik';
import { postSchema } from 'schemas/postSchema';
import { NewPostPayload } from 'types/newPostPayload';

import { TextInput } from 'components/TextInput/TextInput';
import { routes } from 'constants/routes';
import { createPost } from 'services/postService';

export const PostForm = (): JSX.Element => {
  const navigate = useNavigate();
  const handleSubmit = useCallback(
    async (values: NewPostPayload, { setFieldError }: FormikHelpers<NewPostPayload>) => {
      await createPost(values)
        .then(() => {
          navigate(routes.posts);
        })
        .catch((error) => {
          setFieldError(
            'content',
            error?.response?.data?.message || 'Unable to complete the request. Please try again.'
          );
        });
    },
    [navigate]
  );

  return (
    <Formik initialValues={{ title: '', content: '' }} onSubmit={handleSubmit} validationSchema={postSchema}>
      {({ isSubmitting }) => (
        <Form>
          <TextInput fullWidth name="title" label="Title" autoComplete="off" />
          <TextInput name="content" label="Content" autoComplete="off" multiline fullWidth minRows={4} />
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button component={RouterLink} to={routes.posts} variant="outlined" sx={{ flex: 1 }}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} variant="contained" sx={{ flex: 2 }}>
              Create Post
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};
