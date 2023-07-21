import { useCallback, useEffect, useMemo, useState } from 'react';
import { toErrorMessage } from 'types/apiError';
import { DEFAULT_PAGE_SIZE, PageMeta } from 'types/pagination';
import { PostType } from 'types/post';

import { getPosts } from 'services/postService';

export type PostsStatus = 'loading' | 'ready' | 'error';

export interface UsePostsResult {
  posts: PostType[];
  meta: PageMeta;
  status: PostsStatus;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  reload: () => void;
}

const emptyMeta = (limit: number): PageMeta => ({ total: 0, page: 1, limit, totalPages: 0 });

/**
 * Owns everything about "a page of posts": request state, the page cursor and
 * error recovery. The page component stays declarative, and the same hook can
 * back a future search box by passing a `title`.
 */
export const usePosts = (limit: number = DEFAULT_PAGE_SIZE): UsePostsResult => {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [meta, setMeta] = useState<PageMeta>(() => emptyMeta(limit));
  const [status, setStatus] = useState<PostsStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [reloadToken, setReloadToken] = useState(0);
  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  useEffect(() => {
    let isActive = true;

    setStatus('loading');
    setError(null);

    getPosts({ page, limit })
      .then((result) => {
        if (!isActive) {
          return;
        }

        setPosts(result.items);
        setMeta(result.meta);
        setStatus('ready');
      })
      .catch((cause: unknown) => {
        if (!isActive) {
          return;
        }

        setPosts([]);
        setError(toErrorMessage(cause));
        setStatus('error');
      });

    return () => {
      isActive = false;
    };
  }, [page, limit, reloadToken]);

  return useMemo(
    () => ({ posts, meta, status, error, page, setPage, reload }),
    [posts, meta, status, error, page, reload]
  );
};
