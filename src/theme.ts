import { createTheme, Theme } from '@mui/material/styles';

/**
 * One theme object, created once at module scope. `FormContainer` used to call
 * `createTheme()` on every render, which rebuilt the whole palette and broke
 * memoisation for everything below it.
 */
export const theme: Theme = createTheme({
  palette: {
    primary: { main: '#1b3a6b', light: '#41618f', dark: '#0f2444' },
    secondary: { main: '#c2571c' },
    background: { default: '#f5f6f8', paper: '#ffffff' },
    text: { primary: '#15202b', secondary: '#5b6875' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: "'Roboto', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    h1: { fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.01em' },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { paddingInline: 20, paddingBlock: 10 } },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid #e3e6ea',
          boxShadow: '0 1px 2px rgba(21, 32, 43, 0.04)',
          transition: 'box-shadow 160ms ease, transform 160ms ease',
          '&:hover': { boxShadow: '0 6px 20px rgba(21, 32, 43, 0.10)', transform: 'translateY(-2px)' },
        },
      },
    },
    MuiAppBar: { defaultProps: { elevation: 0 } },
    MuiTextField: { defaultProps: { size: 'medium' } },
  },
});
