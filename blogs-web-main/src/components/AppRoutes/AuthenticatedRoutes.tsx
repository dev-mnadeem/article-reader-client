import { Navigate, Route, Routes } from 'react-router-dom';
import { NewPost } from 'pages/NewPost/NewPost';
import { Posts } from 'pages/Posts/Posts';

import { routes } from 'constants/routes';

export const AuthenticatedRoutes = (): JSX.Element => (
  <Routes>
    <Route path={routes.posts} Component={Posts} />
    <Route path={routes.newPost} Component={NewPost} />
    <Route path="*" element={<Navigate to={routes.posts} replace />} />
  </Routes>
);
