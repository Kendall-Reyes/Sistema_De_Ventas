type ApiErrorOptions = {
  /** HTTP status code, or 0 when the request never reached the server. */
  status: number;
  payload?: unknown;
  isNetworkError?: boolean;
};

/**
 * Normalized error for every API call. Features should branch on `status` or
 * `isNetworkError` instead of parsing raw fetch/response objects.
 */
export class ApiError extends Error {
  readonly status: number;
  readonly payload?: unknown;
  readonly isNetworkError: boolean;

  constructor(message: string, options: ApiErrorOptions) {
    super(message);
    this.name = 'ApiError';
    this.status = options.status;
    this.payload = options.payload;
    this.isNetworkError = options.isNetworkError ?? false;
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }
}
