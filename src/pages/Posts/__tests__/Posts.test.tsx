import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { httpError, mockedAxios, mockPostsPage, networkError, resetApiMock } from 'testUtils/apiMock';
import { renderWithProviders } from 'testUtils/renderWithProviders';
import { NETWORK_ERROR_MESSAGE } from 'types/apiError';
import { DEFAULT_PAGE_SIZE } from 'types/pagination';

import { routes } from 'constants/routes';
import { mockedPosts } from 'fixtures/posts';

import { Posts } from '../Posts';

const renderPosts = (): ReturnType<typeof renderWithProviders> =>
  renderWithProviders(<Posts />, { route: routes.posts });

describe('<Posts />', () => {
  beforeEach(resetApiMock);

  it('requests one page and renders it', async () => {
    mockPostsPage(DEFAULT_PAGE_SIZE);

    renderPosts();

    expect(await screen.findByText(mockedPosts[0].title)).toBeInTheDocument();
    expect(mockedAxios.get).toHaveBeenCalledWith('/posts', { params: { page: 1, limit: DEFAULT_PAGE_SIZE } });

    mockedPosts.slice(0, DEFAULT_PAGE_SIZE).forEach((post) => {
      expect(screen.getByRole('heading', { level: 2, name: post.title })).toBeInTheDocument();
    });

    // The rest of the table stays on the server.
    expect(screen.queryByText(mockedPosts[DEFAULT_PAGE_SIZE].title)).not.toBeInTheDocument();
    expect(screen.getByText(`${mockedPosts.length} posts - page 1 of 2`)).toBeInTheDocument();
  });

  it('loads the next page when a page number is clicked', async () => {
    mockPostsPage(DEFAULT_PAGE_SIZE);

    renderPosts();

    await screen.findByText(mockedPosts[0].title);

    userEvent.click(within(screen.getByRole('navigation')).getByRole('button', { name: /page 2/i }));

    expect(await screen.findByText(mockedPosts[DEFAULT_PAGE_SIZE].title)).toBeInTheDocument();
    expect(mockedAxios.get).toHaveBeenLastCalledWith('/posts', { params: { page: 2, limit: DEFAULT_PAGE_SIZE } });
  });

  it('shows a skeleton while the first page is in flight', async () => {
    mockPostsPage(DEFAULT_PAGE_SIZE);

    renderPosts();

    expect(screen.getByRole('status', { name: 'Loading posts' })).toBeInTheDocument();

    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
    expect(screen.getByRole('heading', { level: 2, name: mockedPosts[0].title })).toBeInTheDocument();
  });

  it('surfaces a failed fetch and retries on demand', async () => {
    mockedAxios.get.mockRejectedValueOnce(networkError());

    renderPosts();

    expect(await screen.findByRole('alert')).toHaveTextContent(NETWORK_ERROR_MESSAGE);

    mockPostsPage(DEFAULT_PAGE_SIZE);

    userEvent.click(screen.getByRole('button', { name: 'Retry' }));

    expect(await screen.findByText(mockedPosts[0].title)).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('shows the API message when the server rejects the request', async () => {
    mockedAxios.get.mockRejectedValue(httpError(500, 'Something went wrong'));

    renderPosts();

    expect(await screen.findByRole('alert')).toHaveTextContent('Something went wrong');
  });

  it('invites the first post when the feed is empty', async () => {
    mockPostsPage(DEFAULT_PAGE_SIZE, []);

    renderPosts();

    expect(await screen.findByText('No posts yet')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });

  it('navigates to the editor from the create button', async () => {
    mockPostsPage(DEFAULT_PAGE_SIZE);

    const { history } = renderPosts();

    await screen.findByText(mockedPosts[0].title);

    userEvent.click(screen.getByRole('button', { name: 'Create New Post' }));

    await waitFor(() => expect(history.location.pathname).toBe(routes.newPost));
  });
});
