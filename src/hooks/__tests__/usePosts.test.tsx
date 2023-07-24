import { act, renderHook, waitFor } from '@testing-library/react';
import { httpError, mockedAxios, mockPostsPage, networkError, resetApiMock } from 'testUtils/apiMock';
import { NETWORK_ERROR_MESSAGE } from 'types/apiError';

import { mockedPosts } from 'fixtures/posts';
import { usePosts } from 'hooks/usePosts';

describe('usePosts', () => {
  beforeEach(resetApiMock);

  it('starts loading and settles on the first page', async () => {
    mockPostsPage(4);

    const { result } = renderHook(() => usePosts(4));

    expect(result.current.status).toBe('loading');

    await waitFor(() => expect(result.current.status).toBe('ready'));

    expect(result.current.posts).toHaveLength(4);
    expect(result.current.meta.totalPages).toBe(3);
    expect(result.current.error).toBeNull();
  });

  it('refetches when the page changes', async () => {
    mockPostsPage(4);

    const { result } = renderHook(() => usePosts(4));

    await waitFor(() => expect(result.current.status).toBe('ready'));

    act(() => result.current.setPage(2));

    await waitFor(() => expect(result.current.meta.page).toBe(2));

    expect(result.current.posts[0].title).toBe(mockedPosts[4].title);
    expect(mockedAxios.get).toHaveBeenLastCalledWith('/posts', { params: { page: 2, limit: 4 } });
  });

  it('reports a dead server instead of throwing out of the effect', async () => {
    mockedAxios.get.mockRejectedValue(networkError());

    const { result } = renderHook(() => usePosts());

    await waitFor(() => expect(result.current.status).toBe('error'));

    expect(result.current.error).toBe(NETWORK_ERROR_MESSAGE);
    expect(result.current.posts).toEqual([]);
  });

  it('recovers when reload is called after a failure', async () => {
    mockedAxios.get.mockRejectedValueOnce(httpError(500, 'Something went wrong'));

    const { result } = renderHook(() => usePosts(4));

    await waitFor(() => expect(result.current.status).toBe('error'));

    mockPostsPage(4);

    act(() => result.current.reload());

    await waitFor(() => expect(result.current.status).toBe('ready'));

    expect(result.current.posts).toHaveLength(4);
  });
});
