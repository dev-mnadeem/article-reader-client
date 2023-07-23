import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { routes } from 'constants/routes';

// Route level code splitting: the sign in and sign up bundles never reach a
// signed-in user, and the editor only loads when someone opens it.
const Posts = lazy(() => import('pages/Posts/Posts').then((module) => ({ default: module.Posts })));
const NewPost = lazy(() => import('pages/NewPost/NewPost').then((module) => ({ default: module.NewPost })));

export const AuthenticatedRoutes = (): JSX.Element => (
  <Routes>
    <Route path={routes.posts} element={<Posts />} />
    <Route path={routes.newPost} element={<NewPost />} />
    <Route path="*" element={<Navigate to={routes.posts} replace />} />
  </Routes>
);
