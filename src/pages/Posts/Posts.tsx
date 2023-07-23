import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { Alert, Box, Button, Container, Grid, Pagination, Stack, Typography } from '@mui/material';

import { Header } from 'components/Header/Header';
import { Post } from 'components/Post/Post';
import { PostSkeleton } from 'components/Post/PostSkeleton';
import { routes } from 'constants/routes';
import { usePosts } from 'hooks/usePosts';

const SKELETON_COUNT = 6;

export const Posts = (): JSX.Element => {
  const navigate = useNavigate();
  const { posts, meta, status, error, page, setPage, reload } = usePosts();

  return (
    <>
      <Header />
      <Box component="main" sx={{ bgcolor: 'background.default', minHeight: 'calc(100vh - 64px)', py: 5 }}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
            spacing={2}
            sx={{ mb: 4 }}
          >
            <Box>
              <Typography variant="h1" component="h1">
                Latest posts
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {status === 'ready'
                  ? `${meta.total} post${meta.total === 1 ? '' : 's'} - page ${meta.page} of ${Math.max(
                      meta.totalPages,
                      1
                    )}`
                  : 'Everything published by everyone, newest first.'}
              </Typography>
            </Box>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate(routes.newPost)}>
              Create New Post
            </Button>
          </Stack>

          {status === 'error' ? (
            <Alert
              severity="error"
              role="alert"
              action={
                <Button color="inherit" size="small" onClick={reload}>
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          ) : null}

          {status === 'ready' && posts.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 10, border: '1px dashed #cfd5dd', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>
                No posts yet
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Be the first to publish something.
              </Typography>
              <Button variant="outlined" startIcon={<AddIcon />} onClick={() => navigate(routes.newPost)}>
                Write the first post
              </Button>
            </Box>
          ) : null}

          {status === 'loading' ? (
            <Grid container spacing={3} role="status" aria-label="Loading posts">
              {Array.from({ length: SKELETON_COUNT }, (_, index) => (
                <Grid item xs={12} md={6} key={`skeleton-${index}`}>
                  <PostSkeleton />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3}>
              {posts.map((post) => (
                <Grid item xs={12} md={6} key={post.id}>
                  <Post post={post} />
                </Grid>
              ))}
            </Grid>
          )}

          {meta.totalPages > 1 ? (
            <Stack alignItems="center" sx={{ mt: 5 }}>
              <Pagination
                count={meta.totalPages}
                page={page}
                onChange={(_event, value) => setPage(value)}
                color="primary"
                shape="rounded"
              />
            </Stack>
          ) : null}
        </Container>
      </Box>
    </>
  );
};
