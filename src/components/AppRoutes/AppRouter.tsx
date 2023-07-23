import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

import { useAuth } from 'hooks/useAuth';

import { AuthenticatedRoutes } from './AuthenticatedRoutes';
import { UnauthenticatedRoutes } from './UnauthenticatedRoutes';

const RouteFallback = (): JSX.Element => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
    <CircularProgress aria-label="Loading" />
  </Box>
);

/**
 * The route table a visitor gets depends on whether they hold a token. Keeping
 * the two tables separate means an unauthenticated user cannot reach a
 * protected route even momentarily.
 */
export const AppRouter = (): JSX.Element => {
  const { isAuthenticated } = useAuth();

  return (
    <Suspense fallback={<RouteFallback />}>
      {isAuthenticated ? <AuthenticatedRoutes /> : <UnauthenticatedRoutes />}
    </Suspense>
  );
};
