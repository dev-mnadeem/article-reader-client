import { Typography } from '@mui/material';

import { FormContainer } from 'components/FormContainer/FormContainer';
import { SignupForm } from 'components/Forms/SignupForm/SignupForm';

export const Signup = (): JSX.Element => (
  <>
    <Typography component="p" variant="h6" sx={{ textAlign: 'center', pt: 4, color: 'primary.main' }}>
      Fieldnotes
    </Typography>
    <FormContainer title="Sign up" intro="One account lets you read the shared feed and add your own notes.">
      <SignupForm />
    </FormContainer>
  </>
);
