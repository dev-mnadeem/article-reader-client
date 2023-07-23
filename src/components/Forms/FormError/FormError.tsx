import { Alert, Collapse } from '@mui/material';

interface Props {
  message: string | null;
}

/** Form-level failure banner. API errors used to be pushed into the password field. */
export const FormError = ({ message }: Props): JSX.Element => (
  <Collapse in={Boolean(message)} unmountOnExit>
    <Alert severity="error" role="alert" sx={{ mb: 1 }}>
      {message}
    </Alert>
  </Collapse>
);
