import { createContext, PropsWithChildren, useCallback, useMemo, useState } from 'react';
import Cookies from 'js-cookie';

import { AUTH_COOKIE } from 'services/baseService';

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const AuthProvider = ({ children }: PropsWithChildren): JSX.Element => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(Cookies.get(AUTH_COOKIE)));
  const signOut = useCallback(() => {
    Cookies.remove(AUTH_COOKIE);
    setIsAuthenticated(false);
  }, []);
  const value = useMemo(() => ({ isAuthenticated, setIsAuthenticated, signOut }), [isAuthenticated, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
