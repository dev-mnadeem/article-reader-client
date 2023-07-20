import '@testing-library/jest-dom/vitest';

// Every test talks to a mocked axios instance; tests stub get/post per case.
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => mockAxios),
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  };

  return { default: mockAxios };
});
