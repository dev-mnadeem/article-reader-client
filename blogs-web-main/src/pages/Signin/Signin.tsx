import { Typography } from '@mui/material';

import { FormContainer } from 'components/FormContainer/FormContainer';
import { SigninForm } from 'components/Forms/SigninForm/SigninForm';

export const Signin = (): JSX.Element => (
  <>
    <Typography component="p" variant="h6" sx={{ textAlign: 'center', pt: 4, color: 'primary.main' }}>
      Fieldnotes
    </Typography>
    <FormContainer title="Sign in" intro="Pick up the shared notebook where you left it.">
      <SigninForm />
    </FormContainer>
  </>
);
