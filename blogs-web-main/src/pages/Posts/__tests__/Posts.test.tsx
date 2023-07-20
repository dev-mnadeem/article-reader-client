import { Router } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { AuthProvider } from 'contexts/AuthContext';
import { createMemoryHistory } from 'history';
import Cookies from 'js-cookie';
import type { Mock } from 'vitest';

import { formatPostDate } from 'components/Post/Post';
import { routes } from 'constants/routes';
import { mockedPosts } from 'fixtures/posts';

import { Posts } from '../Posts';

const history = createMemoryHistory();
const renderPosts = (): void => {
  render(
    <Router location={routes.posts} navigator={history}>
      <AuthProvider>
        <Posts />
      </AuthProvider>
    </Router>
  );
};
const renderComponent = (): void => {
  (axios.get as Mock).mockImplementation((requestUrl) => {
    if (requestUrl.includes('/posts')) {
      return Promise.resolve({ data: { payload: mockedPosts } });
    }

    return Promise.reject();
  });
  renderPosts();
};

describe('<Posts />', () => {
  it('renders posts page', async () => {
    renderComponent();

    expect(screen.getByRole('link', { name: 'Create New Post' })).toBeInTheDocument();

    expect(await screen.findByText(mockedPosts[0].title)).toBeInTheDocument();

    mockedPosts.forEach((post) => {
      expect(screen.getByRole('heading', { level: 2, name: post.title })).toBeInTheDocument();
      expect(screen.getByText(post.content)).toBeInTheDocument();
      expect(screen.getByText(formatPostDate(post.createdAt))).toBeInTheDocument();
      expect(screen.getByText(`${post.author?.name} ·`, { exact: false })).toBeInTheDocument();
    });
  });

  it('redirects to create post page when clicked on create new post button', async () => {
    renderComponent();

    userEvent.click(screen.getByRole('link', { name: 'Create New Post' }));

    await waitFor(() => expect(history.location.pathname).toBe(routes.newPost));
  });

  it('shows an empty state when nobody has posted yet', async () => {
    (axios.get as Mock).mockResolvedValue({ data: { payload: [] } });
    renderPosts();

    expect(await screen.findByText(/No posts yet/)).toBeInTheDocument();
  });

  it('shows an error when the feed cannot load', async () => {
    (axios.get as Mock).mockRejectedValue(new Error('Network Error'));
    renderPosts();

    expect(await screen.findByRole('alert')).toHaveTextContent('Posts could not be loaded');
  });

  it('signs out when the API rejects the session', async () => {
    Cookies.set('authtoken', 'expired-token');
    (axios.get as Mock).mockRejectedValue({ response: { status: 401 } });
    renderPosts();

    await waitFor(() => expect(Cookies.get('authtoken')).toBeUndefined());
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('searches titles through the API after a short pause', async () => {
    renderComponent();
    await screen.findByText(mockedPosts[0].title);

    userEvent.type(screen.getByLabelText('Search titles'), 'heron');

    await waitFor(() => expect(axios.get).toHaveBeenLastCalledWith('/posts', { params: { title: 'heron' } }));
  });

  it('says when a search has no matches', async () => {
    renderComponent();
    await screen.findByText(mockedPosts[0].title);
    (axios.get as Mock).mockResolvedValue({ data: { payload: [] } });

    userEvent.type(screen.getByLabelText('Search titles'), 'owl');

    expect(await screen.findByText('No titles match “owl”.')).toBeInTheDocument();
  });
});
