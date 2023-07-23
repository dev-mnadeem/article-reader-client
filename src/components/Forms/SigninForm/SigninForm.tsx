import { useCallback, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, Link, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import { signinSchema } from 'schemas/signinSchema';
import { toErrorMessage } from 'types/apiError';
import { SigninPayload } from 'types/signin';

import { FormError } from 'components/Forms/FormError/FormError';
import { TextInput } from 'components/TextInput/TextInput';
import { routes } from 'constants/routes';
import { useAuth } from 'hooks/useAuth';
import { login } from 'services/authService';

const initialValues: SigninPayload = { email: '', password: '' };

export const SigninForm = (): JSX.Element => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const handleSubmit = useCallback(
    async (values: SigninPayload) => {
      setFormError(null);

      try {
        // Navigation happens only after a token actually comes back. The old
        // version stored `response.data.payload.authtoken` unchecked and
        // navigated regardless, so a malformed response signed you "in" with
        // an undefined token.
        signIn(await login(values));
        navigate(routes.posts);
      } catch (error) {
        setFormError(toErrorMessage(error));
      }
    },
    [navigate, signIn]
  );

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={signinSchema}>
      {({ isSubmitting }) => (
        <Form noValidate>
          <Stack spacing={1}>
            <FormError message={formError} />
            <TextInput name="email" label="Email Address" type="email" autoComplete="email" />
            <TextInput name="password" label="Password" type="password" autoComplete="current-password" />
            <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
            <Link component={RouterLink} to={routes.signup} variant="body2" underline="hover" sx={{ pt: 1 }}>
              Don&apos;t have an account? Sign Up
            </Link>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
