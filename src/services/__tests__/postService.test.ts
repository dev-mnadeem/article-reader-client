import { mockedAxios, postsPage, resetApiMock } from 'testUtils/apiMock';

import { mockedPosts } from 'fixtures/posts';
import { createPost, getPosts } from 'services/postService';

describe('postService', () => {
  beforeEach(resetApiMock);

  it('asks the API for one page at a time', async () => {
    mockedAxios.get.mockResolvedValue(postsPage(2, 4));

    const page = await getPosts({ page: 2, limit: 4 });

    expect(mockedAxios.get).toHaveBeenCalledWith('/posts', { params: { page: 2, limit: 4 } });
    expect(page.items).toHaveLength(4);
    expect(page.meta).toEqual({ total: mockedPosts.length, page: 2, limit: 4, totalPages: 3 });
  });

  it('forwards a title filter only when one was given', async () => {
    mockedAxios.get.mockResolvedValue(postsPage(1, 6));

    await getPosts({ title: 'react' });

    expect(mockedAxios.get).toHaveBeenCalledWith('/posts', { params: { page: 1, limit: 6, title: 'react' } });
  });

  it('synthesises meta for a server that predates pagination', async () => {
    mockedAxios.get.mockResolvedValue({ data: { payload: mockedPosts } });

    const page = await getPosts({ limit: 6 });

    expect(page.items).toHaveLength(mockedPosts.length);
    expect(page.meta).toEqual({ total: mockedPosts.length, page: 1, limit: 6, totalPages: 1 });
  });

  it('survives a payload that is not a list', async () => {
    mockedAxios.get.mockResolvedValue({ data: { payload: {} } });

    const page = await getPosts();

    expect(page.items).toEqual([]);
    expect(page.meta.totalPages).toBe(0);
  });

  it('posts a new post and returns the created record', async () => {
    mockedAxios.post.mockResolvedValue({ data: { payload: mockedPosts[0] } });

    const created = await createPost({ title: 'Title', content: 'Body' });

    expect(mockedAxios.post).toHaveBeenCalledWith('/posts', { title: 'Title', content: 'Body' });
    expect(created).toEqual(mockedPosts[0]);
  });
});
