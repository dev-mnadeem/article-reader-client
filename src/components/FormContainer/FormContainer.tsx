import { PropsWithChildren, ReactNode } from 'react';
import { Avatar, Box, Container, Paper, Typography } from '@mui/material';

interface Props {
  title: string;
  description?: string;
  icon: ReactNode;
  /** Sign in and sign up fill the viewport; the in-app "new post" form does not. */
  isFullScreen?: boolean;
}

/**
 * The centred card the three forms share, including their heading block.
 * Presentation only: the theme is provided once by `App`, not rebuilt on every
 * render as it used to be.
 */
export const FormContainer = ({
  title,
  description,
  icon,
  isFullScreen = true,
  children,
}: PropsWithChildren<Props>): JSX.Element => (
  <Box
    component="main"
    sx={{
      display: 'flex',
      alignItems: isFullScreen ? 'center' : 'flex-start',
      justifyContent: 'center',
      py: { xs: 4, sm: 6 },
      px: 2,
      ...(isFullScreen ? { minHeight: '100vh', background: 'linear-gradient(160deg, #eef1f6 0%, #f7f8fa 60%)' } : {}),
    }}
  >
    <Container maxWidth="sm" disableGutters>
      <Paper elevation={0} sx={{ px: { xs: 3, sm: 5 }, py: { xs: 4, sm: 5 }, border: '1px solid #e3e6ea' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 3 }}>
          <Avatar sx={{ mb: 2, bgcolor: 'primary.main', width: 48, height: 48 }}>{icon}</Avatar>
          <Typography component="h1" variant="h1" sx={{ fontSize: '1.65rem' }}>
            {title}
          </Typography>
          {description ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, maxWidth: 360 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {children}
      </Paper>
    </Container>
  </Box>
);
