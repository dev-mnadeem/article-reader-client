import { useCallback, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, Link, Stack } from '@mui/material';
import { Form, Formik } from 'formik';
import { signupSchema } from 'schemas/signupSchema';
import { toErrorMessage } from 'types/apiError';
import { SignupPayload } from 'types/signupPayload';

import { FormError } from 'components/Forms/FormError/FormError';
import { TextInput } from 'components/TextInput/TextInput';
import { routes } from 'constants/routes';
import { signup } from 'services/authService';

const initialValues: SignupPayload = { name: '', email: '', password: '' };

export const SignupForm = (): JSX.Element => {
  const navigate = useNavigate();
  const [formError, setFormError] = useState<string | null>(null);
  const handleSubmit = useCallback(
    async (values: SignupPayload) => {
      setFormError(null);

      try {
        await signup(values);
        navigate(routes.signin);
      } catch (error) {
        setFormError(toErrorMessage(error));
      }
    },
    [navigate]
  );

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={signupSchema}>
      {({ isSubmitting }) => (
        <Form noValidate>
          <Stack spacing={1}>
            <FormError message={formError} />
            <TextInput name="name" label="Full Name" autoComplete="name" />
            <TextInput name="email" label="Email Address" type="email" autoComplete="email" />
            <TextInput
              name="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              helperText="At least 8 characters."
            />
            <Button type="submit" fullWidth variant="contained" disabled={isSubmitting} sx={{ mt: 2 }}>
              {isSubmitting ? 'Creating account...' : 'Sign Up'}
            </Button>
            <Link component={RouterLink} to={routes.signin} variant="body2" underline="hover" sx={{ pt: 1 }}>
              Already have an account? Sign In
            </Link>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
