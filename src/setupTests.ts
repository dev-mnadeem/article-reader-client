// jest-dom adds matchers such as toBeInTheDocument / toHaveAttribute.
import axios from 'axios';

import { configureTokenStore, createMemoryTokenStore } from 'services/tokenStore';

import '@testing-library/jest-dom';

interface MockedAxios {
  create: jest.Mock;
  isAxiosError: jest.Mock;
}

/**
 * Create React App runs Jest with `resetMocks: true`, which wipes the
 * implementations `src/__mocks__/axios.js` installs at module scope - so
 * `axios.create()` would return `undefined` in any test that builds a client
 * itself. Re-install them per test. Files that call `jest.unmock('axios')`
 * hold the real module here, and are skipped.
 */
beforeEach(() => {
  const mocked = axios as unknown as MockedAxios;

  if (jest.isMockFunction(mocked.create)) {
    mocked.create.mockImplementation(() => mocked);
    mocked.isAxiosError.mockImplementation((error: { isAxiosError?: boolean } | undefined) =>
      Boolean(error?.isAxiosError)
    );
  }
});

/**
 * Tests get an in-memory token store rather than jsdom cookies: state cannot
 * leak between test files, and the swap exercises the same seam a future
 * httpOnly-cookie backend would use.
 */
beforeEach(() => {
  configureTokenStore(createMemoryTokenStore());
});

/**
 * React reports prop violations and `act` warnings through console.error
 * rather than throwing, so they are easy to accumulate unnoticed - the old
 * TextInput spread Formik's `meta` onto a DOM node and produced four of them
 * per field. Any console.error now fails the test that caused it.
 */
const originalConsoleError = console.error;
let consoleErrors: string[] = [];

beforeEach(() => {
  consoleErrors = [];
  jest.spyOn(console, 'error').mockImplementation((...args: Parameters<typeof console.error>) => {
    consoleErrors.push(args.map((arg) => String(arg)).join(' '));
  });
});

afterEach(() => {
  const captured = consoleErrors;

  consoleErrors = [];
  jest.restoreAllMocks();

  if (captured.length > 0) {
    originalConsoleError(captured.join('\n'));
    throw new Error(`Unexpected console.error output:\n${captured.join('\n')}`);
  }
});
