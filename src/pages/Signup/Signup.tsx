import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';

import { FormContainer } from 'components/FormContainer/FormContainer';
import { SignupForm } from 'components/Forms/SignupForm/SignupForm';

export const Signup = (): JSX.Element => (
  <FormContainer
    title="Sign up"
    description="Create an account to start publishing. It takes a name, an email and a password."
    icon={<PersonAddAltOutlinedIcon />}
  >
    <SignupForm />
  </FormContainer>
);
