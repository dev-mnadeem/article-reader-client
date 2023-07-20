import { TextField, TextFieldProps } from '@mui/material';
import { ErrorMessage, useField } from 'formik';

type TextInputProps = TextFieldProps & {
  name: string;
};
export const TextInput = ({ name, ...props }: TextInputProps): JSX.Element => {
  const [field, meta] = useField(name);

  return (
    <>
      <TextField
        margin="normal"
        fullWidth
        id={name}
        {...field}
        error={Boolean(meta.touched && meta.error)}
        {...props}
      />
      <ErrorMessage className="error-message" component="span" name={name} />
    </>
  );
};
