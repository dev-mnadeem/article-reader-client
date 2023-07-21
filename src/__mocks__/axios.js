/**
 * Manual mock for axios, picked up automatically by every test because
 * `src` is the Jest root. `axios.create()` hands back this same object, so the
 * shared `httpClient` instance is mocked too and nothing reaches the network.
 *
 * Tests that need the real axios (the HTTP client's own interceptor tests)
 * call `jest.unmock('axios')`.
 */
const mockAxios = jest.createMockFromModule('axios');

mockAxios.create = jest.fn(() => mockAxios);

mockAxios.interceptors = {
  request: { use: jest.fn() },
  response: { use: jest.fn() },
};

mockAxios.request = jest.fn();
mockAxios.get = jest.fn();
mockAxios.post = jest.fn();
mockAxios.patch = jest.fn();
mockAxios.put = jest.fn();
mockAxios.delete = jest.fn();
mockAxios.isAxiosError = jest.fn((error) => Boolean(error && error.isAxiosError));

export default mockAxios;
