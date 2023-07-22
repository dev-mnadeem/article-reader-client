export interface SigninPayload {
  email: string;
  password: string;
}

export interface AuthToken {
  authtoken: string;
  /** Token lifetime in seconds, as reported by the API. */
  expiresIn?: number;
}
