import { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { Alert, Box, Button, CircularProgress, Container, InputAdornment, TextField, Typography } from '@mui/material';
import { AuthContext } from 'contexts/AuthContext';
import { PostType } from 'types/post';

import { Header } from 'components/Header/Header';
import { Post } from 'components/Post/Post';
import { routes } from 'constants/routes';
import { getPosts } from 'services/postService';

type ApiFailure = { response?: { status?: number } };

const SEARCH_DELAY_MS = 300;

export const Posts = (): JSX.Element => {
  const { signOut } = useContext(AuthContext);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const query = search.trim();

  useEffect(() => {
    let isActive = true;
    const fetchPosts = async (): Promise<void> => {
      setLoading(true);
      setError('');

      try {
        const response = await getPosts(query);

        if (isActive) {
          setPosts(response.data.payload);
        }
      } catch (err) {
        if (!isActive) {
          return;
        }

        // An expired or revoked token cannot recover; send the reader back to sign in.
        if ((err as ApiFailure).response?.status === 401) {
          signOut();

          return;
        }

        setError('Posts could not be loaded. Check that the API is running and try again.');
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };
    const timer = setTimeout(fetchPosts, query ? SEARCH_DELAY_MS : 0);

    return () => {
      isActive = false;
      clearTimeout(timer);
    };
  }, [query, signOut]);

  const hasNoResults = !isLoading && !error && posts.length === 0;

  return (
    <>
      <Header />
      <Container component="main" maxWidth="md" sx={{ py: { xs: 4, sm: 6 } }}>
        <Box
          component="header"
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'stretch', sm: 'flex-end' },
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography variant="overline" color="secondary.main" sx={{ fontWeight: 600, letterSpacing: 1.5 }}>
              Shared notebook
            </Typography>
            <Typography component="h1" variant="h1">
              Notes worth sharing.
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: '50ch' }}>
              Short observations from everyone signed in, newest first.
            </Typography>
          </Box>
          <Button component={RouterLink} to={routes.newPost} variant="contained" size="large">
            Create New Post
          </Button>
        </Box>

        <TextField
          id="post-search"
          label="Search titles"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          fullWidth
          size="small"
          sx={{ mb: 2, bgcolor: 'background.paper' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" aria-hidden />
              </InputAdornment>
            ),
          }}
        />

        <Box aria-live="polite" aria-busy={isLoading}>
          {isLoading && (
            <Box role="status" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 4, color: 'text.secondary' }}>
              <CircularProgress size={20} aria-hidden />
              Loading posts…
            </Box>
          )}
          {error && (
            <Alert severity="error" sx={{ my: 3 }}>
              {error}
            </Alert>
          )}
          {hasNoResults && (
            <Box sx={{ py: 6, textAlign: 'center', borderTop: 1, borderColor: 'divider' }}>
              <Typography variant="h2" component="p">
                {query ? `No titles match “${query}”.` : 'No posts yet.'}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {query ? 'Try a shorter word.' : 'Write the first note for everyone to read.'}
              </Typography>
            </Box>
          )}
          {!isLoading && !error && posts.map((post) => <Post key={post.id} post={post} />)}
        </Box>
      </Container>
    </>
  );
};
