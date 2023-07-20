import { InternalAxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

type RequestHook = (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;

const loadRequestHook = (): RequestHook => {
  let hook: RequestHook | undefined;

  jest.isolateModules(() => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const isolatedAxios = require('axios').default;

    require('services/baseService');
    hook = (isolatedAxios.interceptors.request.use as jest.Mock).mock.calls[0][0];
  });

  return hook as RequestHook;
};

describe('baseService request hook', () => {
  afterEach(() => Cookies.remove('authtoken'));

  it('sends the token stored at request time, not at module load', () => {
    const onRequest = loadRequestHook();

    Cookies.set('authtoken', 'fresh-token');

    const config = onRequest({ headers: {} } as InternalAxiosRequestConfig);

    expect(config.headers.authtoken).toBe('fresh-token');
  });

  it('drops a stale header once the cookie is gone', () => {
    const onRequest = loadRequestHook();
    const config = onRequest({ headers: { authtoken: 'stale' } } as unknown as InternalAxiosRequestConfig);

    expect(config.headers.authtoken).toBeUndefined();
  });
});
