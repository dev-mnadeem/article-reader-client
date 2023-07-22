import { SigninPayload } from './signin';

export type SignupPayload = {
  name: string;
} & SigninPayload;

export interface SignupResult {
  id: string;
  name: string;
  email: string;
}
