import Cookies from 'js-cookie';

import { configureTokenStore, cookieTokenStore, createMemoryTokenStore, tokenStore } from 'services/tokenStore';

describe('tokenStore', () => {
  afterEach(() => {
    Cookies.remove('authtoken');
  });

  it('round-trips a token through the cookie store', () => {
    cookieTokenStore.write('token-abc');

    expect(cookieTokenStore.read()).toBe('token-abc');

    cookieTokenStore.clear();

    expect(cookieTokenStore.read()).toBeUndefined();
  });

  it('keeps memory stores isolated from each other', () => {
    const first = createMemoryTokenStore();
    const second = createMemoryTokenStore();

    first.write('only-mine');

    expect(first.read()).toBe('only-mine');
    expect(second.read()).toBeUndefined();
  });

  it('routes the shared facade to whichever store is configured', () => {
    const store = createMemoryTokenStore();

    configureTokenStore(store);
    tokenStore.write('swapped');

    expect(store.read()).toBe('swapped');
    expect(Cookies.get('authtoken')).toBeUndefined();

    tokenStore.clear();

    expect(tokenStore.read()).toBeUndefined();
  });
});
