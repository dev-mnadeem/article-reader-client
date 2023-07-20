import { AxiosResponse } from 'axios';
import { ApiError } from 'types/apiError';
import { SigninPayload, SigninResponse } from 'types/signin';
import { SignupPayload } from 'types/signupPayload';

import { baseService } from './baseService';

// Object containing authentication API endpoints
export const authApi = {
  login: '/auth/login',
  signup: '/auth/signup',
};

// Function to log in a user
export function login(values: SigninPayload): Promise<AxiosResponse<SigninResponse, ApiError>> {
  return baseService.post(authApi.login, values);
}

// Function to sign up a user
export function signup(values: SignupPayload): Promise<AxiosResponse<void, ApiError>> {
  return baseService.post(authApi.signup, values);
}
