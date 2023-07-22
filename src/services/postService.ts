import { Envelope } from 'types/envelope';
import { NewPostPayload } from 'types/newPostPayload';
import { DEFAULT_PAGE_SIZE, Page, PageMeta, PageRequest } from 'types/pagination';
import { PostType } from 'types/post';

import { httpClient } from './httpClient';

export const postApi = {
  posts: '/posts',
};

/**
 * `GET /api/posts` used to return the whole table; it is paginated now. A
 * server that predates `meta` still answers with a bare `payload`, so a
 * single-page meta is synthesised rather than letting the UI read `undefined`.
 */
const resolveMeta = (meta: PageMeta | undefined, items: PostType[], request: PageRequest): PageMeta => {
  if (meta) {
    return meta;
  }

  const limit = request.limit ?? DEFAULT_PAGE_SIZE;

  return { total: items.length, page: request.page ?? 1, limit, totalPages: items.length ? 1 : 0 };
};

export const getPosts = async (request: PageRequest = {}): Promise<Page<PostType>> => {
  const { page = 1, limit = DEFAULT_PAGE_SIZE, title } = request;
  const { data } = await httpClient.get<Envelope<PostType[]>>(postApi.posts, {
    params: { page, limit, ...(title ? { title } : {}) },
  });
  const items = Array.isArray(data.payload) ? data.payload : [];

  return { items, meta: resolveMeta(data.meta, items, request) };
};

export const createPost = async (values: NewPostPayload): Promise<PostType> => {
  const { data } = await httpClient.post<Envelope<PostType>>(postApi.posts, values);

  return data.payload;
};
