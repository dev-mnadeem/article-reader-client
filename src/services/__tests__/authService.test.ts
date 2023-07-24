import { httpError, mockedAxios, resetApiMock } from 'testUtils/apiMock';

import { login, signup } from 'services/authService';

describe('authService', () => {
  beforeEach(resetApiMock);

  it('unwraps the token envelope returned by POST /auth/login', async () => {
    mockedAxios.post.mockResolvedValue({ data: { payload: { authtoken: 'jwt-value', expiresIn: 3600 } } });

    await expect(login({ email: 'a@b.com', password: 'abcd1234' })).resolves.toEqual({
      authtoken: 'jwt-value',
      expiresIn: 3600,
    });
    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', { email: 'a@b.com', password: 'abcd1234' });
  });

  it('propagates an API rejection instead of swallowing it', async () => {
    mockedAxios.post.mockRejectedValue(httpError(401, 'Invalid email or password'));

    await expect(login({ email: 'a@b.com', password: 'wrong' })).rejects.toMatchObject({
      response: { data: { message: 'Invalid email or password' } },
    });
  });

  it('unwraps the user envelope returned by POST /auth/signup', async () => {
    mockedAxios.post.mockResolvedValue({ data: { payload: { id: 'u1', name: 'Ada', email: 'ada@example.com' } } });

    await expect(signup({ name: 'Ada', email: 'ada@example.com', password: 'abcd1234' })).resolves.toEqual({
      id: 'u1',
      name: 'Ada',
      email: 'ada@example.com',
    });
  });
});
