import { PropsWithChildren } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';

type FormContainerProps = PropsWithChildren<{
  title: string;
  intro?: string;
}>;

export const FormContainer = ({ title, intro, children }: FormContainerProps): JSX.Element => (
  <Container component="main" maxWidth="sm" sx={{ py: { xs: 4, sm: 8 } }}>
    <Paper variant="outlined" sx={{ p: { xs: 3, sm: 5 }, borderColor: 'divider' }}>
      <Box sx={{ mb: 1 }}>
        <Typography variant="h1" sx={{ fontSize: { xs: '1.8rem', sm: '2.1rem' } }}>
          {title}
        </Typography>
        {intro && (
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {intro}
          </Typography>
        )}
      </Box>
      {children}
    </Paper>
  </Container>
);
