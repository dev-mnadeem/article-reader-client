import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { httpError, mockedAxios, resetApiMock } from 'testUtils/apiMock';
import { renderWithProviders } from 'testUtils/renderWithProviders';

import { routes } from 'constants/routes';

import { Signup } from '../Signup';

const fillForm = (password = 'analytical1843'): void => {
  userEvent.type(screen.getByLabelText('Full Name'), 'Ada Lovelace');
  userEvent.type(screen.getByLabelText('Email Address'), 'ada@example.com');
  userEvent.type(screen.getByLabelText('Password'), password);
};

describe('<Signup />', () => {
  beforeEach(resetApiMock);

  it('renders the sign up form', () => {
    renderWithProviders(<Signup />, { route: routes.signup });

    expect(screen.getByRole('heading', { level: 1, name: 'Sign up' })).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Already have an account? Sign In' })).toHaveAttribute(
      'href',
      routes.signin
    );
  });

  it('reports missing values', async () => {
    renderWithProviders(<Signup />, { route: routes.signup });

    userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
  });

  it('enforces the same password length the API does, before a round trip', async () => {
    renderWithProviders(<Signup />, { route: routes.signup });

    fillForm('short');

    userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(await screen.findByText('Password must be at least 8 characters')).toBeInTheDocument();
    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('sends the account and returns to sign in', async () => {
    mockedAxios.post.mockResolvedValue({ data: { payload: { id: 'u1', name: 'Ada', email: 'ada@example.com' } } });

    const { history } = renderWithProviders(<Signup />, { route: routes.signup });

    fillForm();

    userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => expect(history.location.pathname).toBe(routes.signin));
    expect(mockedAxios.post).toHaveBeenCalledWith('/auth/signup', {
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'analytical1843',
    });
  });

  it('shows the API message when the email is already taken', async () => {
    mockedAxios.post.mockRejectedValue(httpError(409, 'Email already registered'));

    const { history } = renderWithProviders(<Signup />, { route: routes.signup });

    fillForm();

    userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Email already registered');
    expect(history.location.pathname).toBe(routes.signup);
  });
});
