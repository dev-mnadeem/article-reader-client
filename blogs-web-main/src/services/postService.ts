import { AxiosResponse } from 'axios';
import { NewPostPayload } from 'types/newPostPayload';
import { PostType } from 'types/post';

import { baseService } from './baseService';

export const postApi = {
  posts: '/posts',
};

export function getPosts(): Promise<AxiosResponse<{ payload: PostType[] }>> {
  return baseService.get(postApi.posts);
}

export function createPost(values: NewPostPayload): Promise<AxiosResponse<{ payload: PostType }>> {
  return baseService.post(postApi.posts, values);
}
