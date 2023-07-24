jest.unmock('axios');

/* eslint-disable import/first */
import { act, render, renderHook, screen, waitFor } from '@testing-library/react';
import { AuthProvider } from 'contexts/AuthContext';

import { useAuth } from 'hooks/useAuth';
import { createHttpClient } from 'services/httpClient';
import { configureTokenStore, createMemoryTokenStore, TokenStore } from 'services/tokenStore';
/* eslint-enable import/first */

const wrapper = ({ children }: { children: React.ReactNode }): JSX.Element => <AuthProvider>{children}</AuthProvider>;

describe('AuthProvider', () => {
  let store: TokenStore;

  beforeEach(() => {
    store = createMemoryTokenStore();
    configureTokenStore(store);
  });

  it('derives the signed-in state from the stored token, not a separate flag', () => {
    store.write('existing-token');

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);
  });

  it('stores the token on sign in and drops it on sign out', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);

    act(() => result.current.signIn({ authtoken: 'fresh-token', expiresIn: 3600 }));

    expect(store.read()).toBe('fresh-token');
    expect(result.current.isAuthenticated).toBe(true);

    act(() => result.current.signOut());

    expect(store.read()).toBeUndefined();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('signs the user out when any request comes back 401', async () => {
    store.write('expired-token');
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(true);

    const client = createHttpClient();

    client.defaults.adapter = () => Promise.reject({ response: { status: 401 } });

    await act(async () => {
      await client.get('/posts').catch(() => undefined);
    });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(false));
  });

  it('provides a usable default outside a provider', () => {
    const Probe = (): JSX.Element => <span>{String(useAuth().isAuthenticated)}</span>;

    render(<Probe />);

    expect(screen.getByText('false')).toBeInTheDocument();
  });
});
