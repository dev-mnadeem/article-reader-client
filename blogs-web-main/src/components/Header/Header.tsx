import { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material';
import { AuthContext } from 'contexts/AuthContext';

import { routes } from 'constants/routes';

export const Header = (): JSX.Element => {
  const { signOut } = useContext(AuthContext);

  return (
    <AppBar position="static" sx={{ bgcolor: '#263e47', boxShadow: 'none' }}>
      <Container>
        <Toolbar disableGutters>
          <Typography
            component={RouterLink}
            to={routes.posts}
            variant="h6"
            sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
          >
            Fieldnotes
          </Typography>
          <Button color="inherit" onClick={signOut}>
            Sign out
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
