import { Box, Typography } from '@mui/material';
import { PostType } from 'types/post';

interface Props {
  post: PostType;
}

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' });

export const formatPostDate = (iso: string): string => dateFormat.format(new Date(iso));

export const Post = ({ post }: Props): JSX.Element => (
  <Box component="article" sx={{ py: 3, borderTop: 1, borderColor: 'divider' }}>
    <Typography component="h2" variant="h2">
      {post.title}
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
      {post.author?.name && <span>{post.author.name} · </span>}
      <time dateTime={post.createdAt}>{formatPostDate(post.createdAt)}</time>
    </Typography>
    <Typography sx={{ mt: 1.5, whiteSpace: 'pre-line', lineHeight: 1.7, maxWidth: '65ch' }}>{post.content}</Typography>
  </Box>
);
