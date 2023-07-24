import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from 'testUtils/renderWithProviders';

import { Header } from 'components/Header/Header';
import { routes } from 'constants/routes';
import { configureTokenStore, createMemoryTokenStore, TokenStore } from 'services/tokenStore';

describe('<Header />', () => {
  let store: TokenStore;

  beforeEach(() => {
    store = createMemoryTokenStore();
    configureTokenStore(store);
    store.write('a-token');
  });

  it('links to the feed with a router link rather than a page reload', () => {
    renderWithProviders(<Header />, { route: routes.posts });

    expect(screen.getByRole('link', { name: 'Blogs' })).toHaveAttribute('href', routes.posts);
    expect(screen.getByRole('link', { name: 'Posts' })).toHaveAttribute('href', routes.posts);
  });

  it('clears the token and returns to sign in on sign out', async () => {
    const { history } = renderWithProviders(<Header />, { route: routes.posts });

    userEvent.click(screen.getByRole('button', { name: /sign out/i }));

    await waitFor(() => expect(history.location.pathname).toBe(routes.signin));
    expect(store.read()).toBeUndefined();
  });
});
