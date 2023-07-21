import { Envelope } from 'types/envelope';
import { AuthToken, SigninPayload } from 'types/signin';
import { SignupPayload, SignupResult } from 'types/signupPayload';

import { httpClient } from './httpClient';

export const authApi = {
  login: '/auth/login',
  signup: '/auth/signup',
};

export const login = async (values: SigninPayload): Promise<AuthToken> => {
  const { data } = await httpClient.post<Envelope<AuthToken>>(authApi.login, values);

  return data.payload;
};

export const signup = async (values: SignupPayload): Promise<SignupResult> => {
  const { data } = await httpClient.post<Envelope<SignupResult>>(authApi.signup, values);

  return data.payload;
};
