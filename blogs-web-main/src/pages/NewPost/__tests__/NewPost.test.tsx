import { Router } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { AuthProvider } from 'contexts/AuthContext';
import { createMemoryHistory } from 'history';

import { routes } from 'constants/routes';

import { NewPost } from '../NewPost';

const history = createMemoryHistory();
const renderComponent = (): void => {
  (axios.post as jest.Mock).mockImplementation((requestUrl) => {
    if (requestUrl.includes('/posts')) {
      return Promise.resolve({ data: {} });
    }

    return Promise.reject();
  });

  render(
    <Router location={routes.signin} navigator={history}>
      <AuthProvider>
        <NewPost />
      </AuthProvider>
    </Router>
  );
};

describe('<NewPost />', () => {
  it('renders post form', () => {
    renderComponent();

    expect(screen.getByRole('heading', { level: 1, name: 'Create new post' })).toBeInTheDocument();

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Content')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Create Post' })).toBeInTheDocument();
  });

  it('renders error if values are missing', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: 'Create Post' });

    userEvent.click(submitButton);

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Content is required')).toBeInTheDocument();
  });

  it('allows submitting form once required fields are filled', async () => {
    renderComponent();

    const titleField = screen.getByLabelText('Title');
    const contentField = screen.getByLabelText('Content');

    userEvent.type(titleField, 'Post Title');
    userEvent.type(contentField, 'Post content');

    const submitButton = screen.getByRole('button', { name: 'Create Post' });

    userEvent.click(submitButton);

    await waitFor(() => expect(history.location.pathname).toBe(routes.posts));
  });
});
