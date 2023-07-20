import { createTheme } from '@mui/material/styles';

const serif = "'Literata', 'Iowan Old Style', 'Palatino Linotype', Georgia, serif";
const sans = "'IBM Plex Sans', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif";

// Field-notebook palette: moss ink on warm paper, with a pencil-ochre accent.
export const theme = createTheme({
  palette: {
    primary: { main: '#2f5d50', dark: '#21443a', contrastText: '#fffdf8' },
    secondary: { main: '#9a6114', contrastText: '#fffdf8' },
    background: { default: '#f5f1e8', paper: '#fffdf8' },
    text: { primary: '#1f2a2e', secondary: '#55615f' },
    error: { main: '#a3271d' },
    divider: '#ddd5c4',
  },
  shape: { borderRadius: 6 },
  typography: {
    fontFamily: sans,
    h1: { fontFamily: serif, fontWeight: 600, fontSize: '2.4rem', lineHeight: 1.15 },
    h2: { fontFamily: serif, fontWeight: 600, fontSize: '1.45rem', lineHeight: 1.3 },
    h5: { fontFamily: serif, fontWeight: 600 },
    h6: { fontFamily: serif, fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
  },
  components: {
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiAppBar: { defaultProps: { elevation: 0 } },
    MuiLink: { styleOverrides: { root: { fontWeight: 500 } } },
  },
});
