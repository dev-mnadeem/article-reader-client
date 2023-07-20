import * as Yup from 'yup';

export const signupSchema = Yup.object().shape({
  name: Yup.string().trim().min(3, 'Name needs at least 3 characters').required('Name is required'),
  email: Yup.string().email('Please enter a valid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password needs at least 8 characters')
    .max(72, 'Password can be at most 72 characters')
    .required('Password is required'),
});
