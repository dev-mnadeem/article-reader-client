import Cookies from 'js-cookie';

/**
 * Where the access token lives.
 *
 * This is the extension seam of the client. The rest of the app never touches
 * `document.cookie`: it asks the configured store. Swapping cookie storage for
 * an in-memory store (tests, or a future BFF that keeps the token httpOnly) is
 * a one line change in `configureTokenStore` and nothing else moves.
 */
export interface TokenStore {
  read(): string | undefined;
  write(token: string, expiresInSeconds?: number): void;
  clear(): void;
}

const COOKIE_NAME = 'authtoken';

/**
 * Default store. `SameSite=Strict` keeps the token off cross-site requests and
 * `secure` is set whenever the page itself is served over TLS, so local http
 * development still works.
 */
export const cookieTokenStore: TokenStore = {
  read: () => Cookies.get(COOKIE_NAME),
  write: (token, expiresInSeconds) =>
    Cookies.set(COOKIE_NAME, token, {
      sameSite: 'strict',
      secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
      // js-cookie takes days; fall back to a session cookie when the API does
      // not tell us the lifetime.
      ...(expiresInSeconds ? { expires: expiresInSeconds / 86400 } : {}),
    }),
  clear: () => Cookies.remove(COOKIE_NAME),
};

export const createMemoryTokenStore = (): TokenStore => {
  let token: string | undefined;

  return {
    read: () => token,
    write: (value) => {
      token = value;
    },
    clear: () => {
      token = undefined;
    },
  };
};

let activeStore: TokenStore = cookieTokenStore;

export const tokenStore = {
  read: (): string | undefined => activeStore.read(),
  write: (token: string, expiresInSeconds?: number): void => activeStore.write(token, expiresInSeconds),
  clear: (): void => activeStore.clear(),
};

/** Replace the backing store. Call once, at startup or in a test setup hook. */
export const configureTokenStore = (store: TokenStore): void => {
  activeStore = store;
};
