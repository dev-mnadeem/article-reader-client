import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { PostType } from 'types/post';

interface Props {
  post: PostType;
}

export const Post = ({ post }: Props): JSX.Element => (
  <Grid item xs={12} md={6}>
    <article>
      <Card sx={{ display: 'flex' }}>
        <CardContent sx={{ flex: 1 }}>
          <Typography component="h2" variant="h5">
            {post.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {new Date(post.createdAt).toLocaleString()}
          </Typography>
          <Typography variant="subtitle1" paragraph>
            {post.content}
          </Typography>
        </CardContent>
      </Card>
    </article>
  </Grid>
);
