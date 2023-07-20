import { TextField, TextFieldProps } from '@mui/material';
import { useField } from 'formik';

type TextInputProps = TextFieldProps & {
  name: string;
};

// helperText wires the message to the input via aria-describedby, so screen readers announce it.
export const TextInput = ({ name, ...props }: TextInputProps): JSX.Element => {
  const [field, meta] = useField(name);
  const errorText = meta.touched ? meta.error : undefined;

  return (
    <TextField
      margin="normal"
      fullWidth
      id={name}
      {...field}
      error={Boolean(errorText)}
      helperText={errorText}
      {...props}
    />
  );
};
