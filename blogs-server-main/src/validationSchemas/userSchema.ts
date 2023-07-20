import { object, string } from 'yup';

const email = string().trim().lowercase().email().required();

export const userRegistrationSchema = object({
  name: string().trim().required().min(3).max(80),
  email,
  // bcrypt only reads the first 72 bytes, so longer passwords would be silently truncated.
  password: string().required().min(8).max(72),
});

export const userAuthSchema = object({
  email,
  password: string().required(),
});
