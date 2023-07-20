import { Router } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { AuthProvider } from 'contexts/AuthContext';
import { createMemoryHistory } from 'history';

import { routes } from 'constants/routes';

import { Signup } from '../Signup';

const history = createMemoryHistory();
const renderComponent = (): void => {
  (axios.post as jest.Mock).mockImplementation((requestUrl) => {
    if (requestUrl.includes('/signup')) {
      return Promise.resolve({ data: {} });
    }

    return Promise.reject();
  });

  render(
    <Router location={routes.signup} navigator={history}>
      <AuthProvider>
        <Signup />
      </AuthProvider>
    </Router>
  );
};

describe('<Signup />', () => {
  it('renders signup form', () => {
    renderComponent();

    expect(screen.getByRole('heading', { level: 1, name: 'Sign up' })).toBeInTheDocument();

    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Already have an account? Sign In' })).toHaveAttribute(
      'href',
      routes.signin
    );
  });

  it('renders error if values are missing or invalid', async () => {
    renderComponent();

    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    userEvent.click(submitButton);

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();

    const emailField = screen.getByLabelText('Email Address');

    userEvent.type(emailField, 'email');

    expect(await screen.findByText('Please enter a valid email')).toBeInTheDocument();
  });

  it('allows submitting form once required fields are filled', async () => {
    renderComponent();

    const nameField = screen.getByLabelText('Full Name');
    const emailField = screen.getByLabelText('Email Address');
    const passwordField = screen.getByLabelText('Password');

    userEvent.type(nameField, 'name');
    userEvent.type(emailField, 'email@email.com');
    userEvent.type(passwordField, 'password1');

    const submitButton = screen.getByRole('button', { name: 'Sign Up' });

    userEvent.click(submitButton);

    await waitFor(() => expect(history.location.pathname).toBe(routes.signin));
  });

  it('reports an existing account next to the email field', async () => {
    renderComponent();
    (axios.post as jest.Mock).mockRejectedValue({
      response: { status: 409, data: { message: 'User already exists' } },
    });

    userEvent.type(screen.getByLabelText('Full Name'), 'Ines Calloway');
    userEvent.type(screen.getByLabelText('Email Address'), 'ines@example.com');
    userEvent.type(screen.getByLabelText('Password'), 'margin-notes-1');
    userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(await screen.findByText('User already exists')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toHaveAttribute('aria-invalid', 'true');
  });

  it('asks for at least 8 password characters before calling the API', async () => {
    renderComponent();

    userEvent.type(screen.getByLabelText('Password'), 'short');
    userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(await screen.findByText('Password needs at least 8 characters')).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });
});
