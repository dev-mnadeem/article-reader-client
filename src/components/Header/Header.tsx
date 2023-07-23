import { Link as RouterLink, useNavigate } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';

import { routes } from 'constants/routes';
import { useAuth } from 'hooks/useAuth';

/**
 * Every destination is a router link. The original used raw `href`s (one of
 * them empty), so clicking the nav threw away the SPA and reloaded the page.
 */
export const Header = (): JSX.Element => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = (): void => {
    signOut();
    navigate(routes.signin);
  };

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ gap: 2 }}>
          <MenuBookIcon />
          <Typography
            variant="h6"
            component={RouterLink}
            to={routes.posts}
            sx={{ color: 'inherit', textDecoration: 'none', letterSpacing: '.02em' }}
          >
            Blogs
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button component={RouterLink} to={routes.posts} color="inherit">
            Posts
          </Button>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={handleSignOut}>
            Sign out
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
