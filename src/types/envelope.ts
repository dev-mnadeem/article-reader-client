import { PageMeta } from './pagination';

/** Every blogs-server response is `{ payload }`, with `meta` on list endpoints. */
export interface Envelope<T> {
  payload: T;
  meta?: PageMeta;
}
