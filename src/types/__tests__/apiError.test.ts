import { DEFAULT_ERROR_MESSAGE, NETWORK_ERROR_MESSAGE, toErrorMessage } from 'types/apiError';

describe('toErrorMessage', () => {
  it('uses the message the API sent', () => {
    expect(toErrorMessage({ response: { data: { message: 'Invalid credentials' } } })).toBe('Invalid credentials');
  });

  it('falls back to a generic message when the API responded without one', () => {
    expect(toErrorMessage({ response: { data: {} } })).toBe(DEFAULT_ERROR_MESSAGE);
    expect(toErrorMessage({ response: { data: { message: '   ' } } })).toBe(DEFAULT_ERROR_MESSAGE);
  });

  it('reports a request that never got a response as a network failure', () => {
    expect(toErrorMessage({ request: {} })).toBe(NETWORK_ERROR_MESSAGE);
  });

  it('never throws on values that are not shaped like an axios error', () => {
    expect(toErrorMessage(undefined)).toBe(DEFAULT_ERROR_MESSAGE);
    expect(toErrorMessage(new Error('boom'))).toBe(DEFAULT_ERROR_MESSAGE);
    expect(toErrorMessage('nope')).toBe(DEFAULT_ERROR_MESSAGE);
  });
});
