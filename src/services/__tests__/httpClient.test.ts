jest.unmock('axios');

/* eslint-disable import/first */
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { createHttpClient, onUnauthorized } from 'services/httpClient';
import { configureTokenStore, createMemoryTokenStore, TokenStore } from 'services/tokenStore';
/* eslint-enable import/first */

const okAdapter =
  (seen: InternalAxiosRequestConfig[]) =>
  (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
    seen.push(config);

    return Promise.resolve({ data: { payload: [] }, status: 200, statusText: 'OK', headers: {}, config });
  };
const failingAdapter =
  (status: number) =>
  (config: InternalAxiosRequestConfig): Promise<AxiosResponse> => {
    const error = new AxiosError('request failed', String(status), config, {}, {
      data: { message: 'nope' },
      status,
      statusText: 'Error',
      headers: {},
      config,
    } as AxiosResponse);

    return Promise.reject(error);
  };

describe('httpClient', () => {
  let store: TokenStore;

  beforeEach(() => {
    store = createMemoryTokenStore();
    configureTokenStore(store);
  });

  it('attaches the current token to every request, reading it at request time', async () => {
    const seen: InternalAxiosRequestConfig[] = [];
    const client = createHttpClient();

    client.defaults.adapter = okAdapter(seen);

    // No token yet: this is the state the module used to be frozen in, because
    // it read the cookie once when it was first imported.
    await client.get('/posts');
    store.write('token-from-login');
    await client.get('/posts');

    expect(seen[0].headers.authtoken).toBeUndefined();
    expect(seen[1].headers.authtoken).toBe('token-from-login');
    expect(seen[1].headers.Authorization).toBe('Bearer token-from-login');
  });

  it('clears the token and notifies subscribers on 401', async () => {
    const client = createHttpClient();

    client.defaults.adapter = failingAdapter(401);
    store.write('expired');
    const handler = jest.fn();
    const unsubscribe = onUnauthorized(handler);

    await expect(client.get('/posts')).rejects.toBeDefined();

    expect(store.read()).toBeUndefined();
    expect(handler).toHaveBeenCalledTimes(1);

    unsubscribe();
  });

  it('leaves the token alone for failures that are not 401', async () => {
    const client = createHttpClient();

    client.defaults.adapter = failingAdapter(500);
    store.write('still-good');
    const handler = jest.fn();
    const unsubscribe = onUnauthorized(handler);

    await expect(client.get('/posts')).rejects.toBeDefined();

    expect(store.read()).toBe('still-good');
    expect(handler).not.toHaveBeenCalled();

    unsubscribe();
  });

  it('stops calling a handler once it unsubscribes', async () => {
    const client = createHttpClient();

    client.defaults.adapter = failingAdapter(401);
    const handler = jest.fn();

    onUnauthorized(handler)();

    await expect(client.get('/posts')).rejects.toBeDefined();

    expect(handler).not.toHaveBeenCalled();
  });
});
