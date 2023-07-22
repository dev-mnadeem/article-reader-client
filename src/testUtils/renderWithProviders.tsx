import { ReactElement } from 'react';
import { Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { render, RenderResult } from '@testing-library/react';
import { AuthProvider } from 'contexts/AuthContext';
import { createMemoryHistory, MemoryHistory } from 'history';
import { theme } from 'theme';

interface Options {
  route?: string;
  history?: MemoryHistory;
}

export interface RenderWithProvidersResult extends RenderResult {
  history: MemoryHistory;
}

/**
 * Renders a component inside the same providers `App` uses, so tests exercise
 * the real theme, the real auth context and a real router.
 */
export const renderWithProviders = (ui: ReactElement, options: Options = {}): RenderWithProvidersResult => {
  const history = options.history ?? createMemoryHistory({ initialEntries: [options.route ?? '/'] });
  const result = render(
    <ThemeProvider theme={theme}>
      <Router location={history.location} navigator={history}>
        <AuthProvider>{ui}</AuthProvider>
      </Router>
    </ThemeProvider>
  );

  return { ...result, history };
};
