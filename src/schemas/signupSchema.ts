import * as Yup from 'yup';

// Mirrors blogs-server's `signupSchema`, so the server never rejects something
// the form accepted.
export const signupSchema = Yup.object().shape({
  name: Yup.string().trim().min(3, 'Name must be at least 3 characters').max(80).required('Name is required'),
  email: Yup.string().email('Please enter a valid email').required('Email is required'),
  password: Yup.string().min(8, 'Password must be at least 8 characters').max(72).required('Password is required'),
});
