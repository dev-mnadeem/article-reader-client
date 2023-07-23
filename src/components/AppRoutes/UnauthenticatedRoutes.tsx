import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { routes } from 'constants/routes';

const Signin = lazy(() => import('pages/Signin/Signin').then((module) => ({ default: module.Signin })));
const Signup = lazy(() => import('pages/Signup/Signup').then((module) => ({ default: module.Signup })));

export const UnauthenticatedRoutes = (): JSX.Element => (
  <Routes>
    <Route path={routes.signin} element={<Signin />} />
    <Route path={routes.signup} element={<Signup />} />
    <Route path="*" element={<Navigate to={routes.signin} replace />} />
  </Routes>
);
