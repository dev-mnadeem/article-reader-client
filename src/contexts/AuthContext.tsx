import { createContext, PropsWithChildren, useCallback, useEffect, useMemo, useState } from 'react';
import { AuthToken } from 'types/signin';

import { onUnauthorized } from 'services/httpClient';
import { tokenStore } from 'services/tokenStore';

export interface AuthContextType {
  isAuthenticated: boolean;
  signIn: (token: AuthToken) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  signIn: () => undefined,
  signOut: () => undefined,
});
/**
 * Authentication state is *derived from the token*, never stored beside it.
 * The previous version kept an `isAuthenticated` flag in localStorage, so once
 * the cookie expired the flag still said "signed in" and the user landed on a
 * feed that could only answer 401.
 */
const AuthProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(tokenStore.read()));
  const signIn = useCallback((token: AuthToken) => {
    tokenStore.write(token.authtoken, token.expiresIn);
    setIsAuthenticated(true);
  }, []);
  const signOut = useCallback(() => {
    tokenStore.clear();
    setIsAuthenticated(false);
  }, []);

  // A 401 from any request means the token is gone or expired; the HTTP client
  // has already cleared it, so the UI only has to catch up.
  useEffect(() => onUnauthorized(() => setIsAuthenticated(false)), []);

  const value = useMemo(() => ({ isAuthenticated, signIn, signOut }), [isAuthenticated, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
