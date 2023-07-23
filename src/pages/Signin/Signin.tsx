import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { FormContainer } from 'components/FormContainer/FormContainer';
import { SigninForm } from 'components/Forms/SigninForm/SigninForm';

export const Signin = (): JSX.Element => (
  <FormContainer
    title="Sign in"
    description="Sign in to read the feed and publish your own posts."
    icon={<LockOutlinedIcon />}
  >
    <SigninForm />
  </FormContainer>
);
