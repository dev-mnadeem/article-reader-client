import axios from 'axios';
import { PostType } from 'types/post';

import { mockedMeta, mockedPosts } from 'fixtures/posts';

/**
 * `src/__mocks__/axios.js` replaces axios for every test, and `axios.create`
 * returns that same mock, so the shared `httpClient` instance routes through
 * these functions. No test touches the network.
 */
export const mockedAxios = axios as unknown as {
  get: jest.Mock;
  post: jest.Mock;
  put: jest.Mock;
  patch: jest.Mock;
  delete: jest.Mock;
};

export const resetApiMock = (): void => {
  mockedAxios.get.mockReset();
  mockedAxios.post.mockReset();
  mockedAxios.put.mockReset();
  mockedAxios.patch.mockReset();
  mockedAxios.delete.mockReset();
};

/** Builds the `{ payload, meta }` envelope blogs-server returns for a list. */
export const postsPage = (
  page: number,
  limit: number,
  posts: PostType[] = mockedPosts
): { data: { payload: PostType[]; meta: ReturnType<typeof mockedMeta> } } => ({
  data: {
    payload: posts.slice((page - 1) * limit, page * limit),
    meta: mockedMeta(page, limit, posts.length),
  },
});

/** An axios-shaped rejection carrying an HTTP response, as the API would. */
export const httpError = (status: number, message: string): unknown => ({
  isAxiosError: true,
  response: { status, data: { payload: {}, message } },
});

/** An axios-shaped rejection with no response at all, as a dead server would. */
export const networkError = (): unknown => ({ isAxiosError: true, request: {} });

export const mockPostsPage = (limit: number, posts: PostType[] = mockedPosts): void => {
  mockedAxios.get.mockImplementation((_url: string, config?: { params?: { page?: number } }) =>
    Promise.resolve(postsPage(config?.params?.page ?? 1, limit, posts))
  );
};
