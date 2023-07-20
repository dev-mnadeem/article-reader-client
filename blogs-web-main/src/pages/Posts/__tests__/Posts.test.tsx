import { Router } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { AuthProvider } from 'contexts/AuthContext';
import { createMemoryHistory } from 'history';

import { routes } from 'constants/routes';
import { mockedPosts } from 'fixtures/posts';

import { Posts } from '../Posts';

const history = createMemoryHistory();
const renderComponent = (): void => {
  (axios.get as jest.Mock).mockImplementation((requestUrl) => {
    if (requestUrl.includes('/posts')) {
      return Promise.resolve({ data: { payload: mockedPosts } });
    }

    return Promise.reject();
  });

  render(
    <Router location={routes.signin} navigator={history}>
      <AuthProvider>
        <Posts />
      </AuthProvider>
    </Router>
  );
};

describe('<Posts />', () => {
  it('renders posts page', async () => {
    renderComponent();

    expect(screen.getByRole('button', { name: 'Create New Post' })).toBeInTheDocument();

    expect(await screen.findByText(mockedPosts[0].title)).toBeInTheDocument();

    mockedPosts.forEach((post) => {
      expect(screen.getByText(post.title)).toBeInTheDocument();
      expect(screen.getByText(post.content)).toBeInTheDocument();
      expect(screen.getByText(new Date(post.createdAt).toLocaleString())).toBeInTheDocument();
    });
  });

  it('redirects to create post page when clicked on create new post button', async () => {
    renderComponent();

    userEvent.click(screen.getByRole('button', { name: 'Create New Post' }));

    await waitFor(() => expect(history.location.pathname).toBe(routes.newPost));
  });
});
