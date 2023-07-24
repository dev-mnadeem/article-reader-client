import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { httpError, mockedAxios, networkError, resetApiMock } from 'testUtils/apiMock';
import { renderWithProviders } from 'testUtils/renderWithProviders';

import { routes } from 'constants/routes';
import { configureTokenStore, createMemoryTokenStore, TokenStore } from 'services/tokenStore';

import { Signin } from '../Signin';

const fillAndSubmit = (): void => {
  userEvent.type(screen.getByLabelText('Email Address'), 'ada@example.com');
  userEvent.type(screen.getByLabelText('Password'), 'analytical1843');
  userEvent.click(screen.getByRole('button', { name: 'Sign In' }));
};

describe('<Signin />', () => {
  let store: TokenStore;

  beforeEach(() => {
    resetApiMock();
    store = createMemoryTokenStore();
    configureTokenStore(store);
  });

  it('renders the sign in form', () => {
    renderWithProviders(<Signin />, { route: routes.signin });

    expect(screen.getByRole('heading', { level: 1, name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: "Don't have an account? Sign Up" })).toHaveAttribute('href', routes.signup);
  });

  it('reports missing and invalid values', async () => {
    renderWithProviders(<Signin />, { route: routes.signin });

    userEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();

    userEvent.type(screen.getByLabelText('Email Address'), 'not-an-email');

    expect(await screen.findByText('Please enter a valid email')).toBeInTheDocument();
  });

  it('stores the token from the response and then navigates to the feed', async () => {
    mockedAxios.post.mockResolvedValue({ data: { payload: { authtoken: 'jwt-from-api', expiresIn: 3600 } } });

    const { history } = renderWithProviders(<Signin />, { route: routes.signin });

    fillAndSubmit();

    await waitFor(() => expect(history.location.pathname).toBe(routes.posts));

    // The original test asserted only the redirect, and its fixture spelled the
    // field `authtoke` - so the app "signed in" with an undefined token and the
    // suite stayed green.
    expect(store.read()).toBe('jwt-from-api');
    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/login', {
      email: 'ada@example.com',
      password: 'analytical1843',
    });
  });

  it('stays on the page and shows the API message when the credentials are wrong', async () => {
    mockedAxios.post.mockRejectedValue(httpError(401, 'Invalid email or password'));

    const { history } = renderWithProviders(<Signin />, { route: routes.signin });

    fillAndSubmit();

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid email or password');
    expect(history.location.pathname).toBe(routes.signin);
    expect(store.read()).toBeUndefined();
  });

  it('explains an unreachable server instead of failing silently', async () => {
    mockedAxios.post.mockRejectedValue(networkError());

    renderWithProviders(<Signin />, { route: routes.signin });

    fillAndSubmit();

    expect(await screen.findByRole('alert')).toHaveTextContent('Cannot reach the server');
  });
});
