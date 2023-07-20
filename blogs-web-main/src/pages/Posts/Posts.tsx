import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Box, Button, Container, Grid, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import { PostType } from 'types/post';

import { Header } from 'components/Header/Header';
import { Post } from 'components/Post/Post';
import { routes } from 'constants/routes';
import { getPosts } from 'services/postService';

export const Posts = (): JSX.Element => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;
    const fetchPosts = async (): Promise<void> => {
      try {
        const response = await getPosts(Cookies.get('authtoken') as string);

        if (isActive) {
          setPosts(response.data.payload);
        }
      } catch {
        if (isActive) {
          setError('Posts could not be loaded. Your session may have expired; sign out and try again.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <>
      <Header />
      <Container>
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h3" sx={{ mb: 2 }}>
            Notes worth sharing.
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            A shared text feed for small ideas. Read, write, and keep it simple.
          </Typography>
          <Button variant="contained" onClick={() => navigate(routes.newPost)}>
            Create New Post
          </Button>
          {isLoading && <p role="status">Loading posts…</p>}
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
          {!isLoading && !error && posts.length === 0 && <p>No posts yet. Write the first note.</p>}
          <Grid container spacing={4} sx={{ mt: 3 }}>
            {posts.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </Grid>
        </Box>
      </Container>
    </>
  );
};
