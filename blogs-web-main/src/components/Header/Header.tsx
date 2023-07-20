import { useContext } from 'react';
import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material';
import { AuthContext } from 'contexts/AuthContext';
import Cookies from 'js-cookie';
export const Header = (): JSX.Element => {
  const { setIsAuthenticated } = useContext(AuthContext);

  return (
    <AppBar position="static" sx={{ bgcolor: '#263e47', boxShadow: 'none' }}>
      <Container>
        <Toolbar disableGutters>
          <Typography
            component="a"
            href="/posts"
            variant="h6"
            sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}
          >
            Fieldnotes
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              Cookies.remove('authtoken');
              setIsAuthenticated(false);
            }}
          >
            Sign out
          </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
