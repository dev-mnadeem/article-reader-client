import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import { postSchema } from 'schemas/postSchema';
import { toErrorMessage } from 'types/apiError';
import { NewPostPayload } from 'types/newPostPayload';

import { FormError } from 'components/Forms/FormError/FormError';
import { TextInput } from 'components/TextInput/TextInput';
import { routes } from 'constants/routes';
import { createPost } from 'services/postService';

const initialValues: NewPostPayload = { title: '', content: '' };

export const PostForm = (): JSX.Element => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const handleSubmit = useCallback(
    async (values: NewPostPayload) => {
      setFormError(null);

      try {
        await createPost(values);
        navigate(routes.posts);
      } catch (error) {
        setFormError(toErrorMessage(error));
      }
    },
    [navigate]
  );

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={postSchema}>
      {({ isSubmitting }) => (
        <Form noValidate>
          <Stack spacing={1}>
            <FormError message={formError} />
            <TextInput name="title" label="Title" autoComplete="off" />
            <TextInput name="content" label="Content" multiline minRows={6} autoComplete="off" />
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : 'Create Post'}
              </Button>
              <Button type="button" variant="text" onClick={() => navigate(routes.posts)}>
                Cancel
              </Button>
            </Stack>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
