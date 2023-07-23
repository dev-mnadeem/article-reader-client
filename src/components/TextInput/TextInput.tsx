import { TextField, TextFieldProps } from '@mui/material';
import { useField } from 'formik';

type TextInputProps = Omit<TextFieldProps, 'name' | 'error'> & {
  name: string;
};

/**
 * Formik field bound to a MUI text field.
 *
 * The original spread Formik's whole `meta` object onto the input, so React
 * warned about `initialValue`, `initialTouched`, `initialError` and `touched`
 * landing on a DOM node, and the field rendered in its red error state before
 * the user had typed anything. Only the field's own props go to the DOM now,
 * and the error is shown once the field has been touched or the form
 * submitted.
 */
export const TextInput = ({ name, helperText, ...props }: TextInputProps): JSX.Element => {
  const [field, meta] = useField(name);
  const hasError = Boolean(meta.touched && meta.error);

  return (
    <TextField
      margin="normal"
      fullWidth
      id={name}
      {...props}
      {...field}
      error={hasError}
      helperText={hasError ? meta.error : helperText}
      FormHelperTextProps={{ className: hasError ? 'error-message' : undefined }}
    />
  );
};
