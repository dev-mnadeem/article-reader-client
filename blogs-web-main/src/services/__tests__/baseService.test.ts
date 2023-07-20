import { InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import type { Mock } from 'vitest';

type RequestHook = (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;

const loadRequestHook = async (): Promise<RequestHook> => {
  vi.resetModules();
  const { default: freshAxios } = await import('axios');

  await import('services/baseService');

  return (freshAxios.interceptors.request.use as Mock).mock.calls[0][0];
};

describe('baseService request hook', () => {
  afterEach(() => Cookies.remove('authtoken'));

  it('sends the token stored at request time, not at module load', async () => {
    const onRequest = await loadRequestHook();

    Cookies.set('authtoken', 'fresh-token');

    const config = onRequest({ headers: {} } as InternalAxiosRequestConfig);

    expect(config.headers.authtoken).toBe('fresh-token');
  });

  it('drops a stale header once the cookie is gone', async () => {
    const onRequest = await loadRequestHook();
    const config = onRequest({ headers: { authtoken: 'stale' } } as unknown as InternalAxiosRequestConfig);

    expect(config.headers.authtoken).toBeUndefined();
  });
});
