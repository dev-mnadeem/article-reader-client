export interface PostType {
  /** The API issues uuids. The original client typed this as `number`. */
  id: string;
  title: string;
  content: string;
  authorId?: string;
  createdAt: string;
  updatedAt?: string;
}
