import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material';
import { AuthContext } from 'contexts/AuthContext';

import { routes } from 'constants/routes';

export const Header = (): JSX.Element => {
  const { signOut } = useContext(AuthContext);

  return (
    <AppBar position="static" color="primary">
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ gap: 1 }}>
          <Typography
            component={RouterLink}
            to={routes.posts}
            variant="h6"
            sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
          >
            Fieldnotes
          </Typography>
          <Button color="inherit" onClick={signOut} sx={{ border: '1px solid rgba(255,253,248,0.5)' }}>
            Sign out
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
