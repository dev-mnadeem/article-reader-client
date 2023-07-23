import { Box, Card, CardContent, Chip, Typography } from '@mui/material';
import { PostType } from 'types/post';

interface Props {
  post: PostType;
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});
const WORDS_PER_MINUTE = 200;
const readingMinutes = (content: string): number =>
  Math.max(1, Math.round(content.trim().split(/\s+/).length / WORDS_PER_MINUTE));

export const Post = ({ post }: Props): JSX.Element => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flex: 1, p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: '.08em' }}>
          {dateFormatter.format(new Date(post.createdAt))}
        </Typography>
        <Chip label={`${readingMinutes(post.content)} min read`} size="small" variant="outlined" />
      </Box>
      <Typography component="h2" variant="h5" gutterBottom>
        {post.title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {post.content}
      </Typography>
    </CardContent>
  </Card>
);
