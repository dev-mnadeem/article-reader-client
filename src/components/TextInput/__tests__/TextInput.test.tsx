import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

import { TextInput } from 'components/TextInput/TextInput';

const schema = Yup.object().shape({ email: Yup.string().required('Email is required') });
const renderField = (): void => {
  render(
    <Formik initialValues={{ email: '' }} validationSchema={schema} onSubmit={jest.fn()}>
      <Form>
        <TextInput name="email" label="Email Address" helperText="We never share it." />
      </Form>
    </Formik>
  );
};

describe('<TextInput />', () => {
  it('shows its helper text and no error before the field is touched', () => {
    renderField();

    expect(screen.getByText('We never share it.')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toHaveAttribute('aria-invalid', 'false');
  });

  it('shows the validation error once the field has been touched', async () => {
    renderField();

    const field = screen.getByLabelText('Email Address');

    userEvent.click(field);
    userEvent.tab();

    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    await waitFor(() => expect(field).toHaveAttribute('aria-invalid', 'true'));
    expect(screen.queryByText('We never share it.')).not.toBeInTheDocument();
  });

  it('keeps Formik internals off the DOM node', () => {
    renderField();

    const field = screen.getByLabelText('Email Address');

    expect(field).not.toHaveAttribute('touched');
    expect(field).not.toHaveAttribute('initialvalue');
    expect(field).not.toHaveAttribute('initialtouched');
    expect(field).not.toHaveAttribute('initialerror');
  });
});
