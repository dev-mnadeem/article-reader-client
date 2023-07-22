export interface ApiErrorBody {
  message?: string;
  payload?: unknown;
}

export const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.';
export const NETWORK_ERROR_MESSAGE = 'Cannot reach the server. Check that the API is running and try again.';

interface HttpErrorShape {
  response?: { data?: ApiErrorBody };
  request?: unknown;
}

/**
 * Turns anything a rejected request can produce into a sentence a user can
 * read. The original code reached straight for `error.response.data.message`,
 * which throws a second time whenever the failure had no HTTP response at all
 * (server down, DNS, CORS) and left the form silently doing nothing.
 */
export const toErrorMessage = (error: unknown): string => {
  const candidate = error as HttpErrorShape | undefined;
  const message = candidate?.response?.data?.message;

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  if (candidate?.response) {
    return DEFAULT_ERROR_MESSAGE;
  }

  if (candidate?.request) {
    return NETWORK_ERROR_MESSAGE;
  }

  return DEFAULT_ERROR_MESSAGE;
};
