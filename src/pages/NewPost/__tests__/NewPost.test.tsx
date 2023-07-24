import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { httpError, mockedAxios, resetApiMock } from 'testUtils/apiMock';
import { renderWithProviders } from 'testUtils/renderWithProviders';

import { routes } from 'constants/routes';
import { configureTokenStore, createMemoryTokenStore } from 'services/tokenStore';

import { NewPost } from '../NewPost';

const fillForm = (title = 'Deploying Node Applications'): void => {
  userEvent.type(screen.getByLabelText('Title'), title);
  userEvent.type(screen.getByLabelText('Content'), 'A health check your orchestrator can believe.');
};

describe('<NewPost />', () => {
  beforeEach(() => {
    resetApiMock();
    const store = createMemoryTokenStore();

    configureTokenStore(store);
    store.write('a-token');
  });

  it('renders the editor', () => {
    renderWithProviders(<NewPost />, { route: routes.newPost });

    expect(screen.getByRole('heading', { level: 1, name: 'Create new post' })).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByLabelText('Content')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Post' })).toBeInTheDocument();
  });

  it('reports missing values', async () => {
    renderWithProviders(<NewPost />, { route: routes.newPost });

    userEvent.click(screen.getByRole('button', { name: 'Create Post' }));

    expect(await screen.findByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Content is required')).toBeInTheDocument();
  });

  it('enforces the minimum title length the API requires', async () => {
    renderWithProviders(<NewPost />, { route: routes.newPost });

    fillForm('ab');

    userEvent.click(screen.getByRole('button', { name: 'Create Post' }));

    expect(await screen.findByText('Title must be at least 3 characters')).toBeInTheDocument();
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('publishes the post and goes back to the feed', async () => {
    mockedAxios.post.mockResolvedValue({ data: { payload: { id: 'p1' } } });

    const { history } = renderWithProviders(<NewPost />, { route: routes.newPost });

    fillForm();

    userEvent.click(screen.getByRole('button', { name: 'Create Post' }));

    await waitFor(() => expect(history.location.pathname).toBe(routes.posts));
    expect(mockedAxios.post).toHaveBeenCalledWith('/posts', {
      title: 'Deploying Node Applications',
      content: 'A health check your orchestrator can believe.',
    });
  });

  it('keeps the draft on screen and explains a rejection', async () => {
    mockedAxios.post.mockRejectedValue(httpError(401, 'Authentication required'));

    const { history } = renderWithProviders(<NewPost />, { route: routes.newPost });

    fillForm();

    userEvent.click(screen.getByRole('button', { name: 'Create Post' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Authentication required');
    expect(history.location.pathname).toBe(routes.newPost);
    expect(screen.getByLabelText('Title')).toHaveValue('Deploying Node Applications');
  });

  it('abandons the draft from the cancel button', async () => {
    const { history } = renderWithProviders(<NewPost />, { route: routes.newPost });

    userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    await waitFor(() => expect(history.location.pathname).toBe(routes.posts));
  });
});
