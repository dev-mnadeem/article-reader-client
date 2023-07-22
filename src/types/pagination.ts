/** Mirrors the `meta` object `GET /api/posts` returns alongside `payload`. */
export interface PageMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Page<T> {
  items: T[];
  meta: PageMeta;
}

export interface PageRequest {
  page?: number;
  limit?: number;
  /** Case-insensitive substring match on the post title. */
  title?: string;
}

export const DEFAULT_PAGE_SIZE = 6;
