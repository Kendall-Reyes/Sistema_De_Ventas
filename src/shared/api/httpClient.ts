import { env } from '@/shared/config/env';

import { ApiError } from './ApiError';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export type ApiRequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  /** Access token for authenticated calls. Auth wiring arrives with the session module. */
  authToken?: string | null;
  timeoutMs?: number;
};

const DEFAULT_TIMEOUT_MS = 15_000;

function buildUrl(path: string): string {
  const base = env.apiUrl.replace(/\/+$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;

  return `${base}${normalized}`;
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }
}

function messageFromPayload(payload: unknown): string | undefined {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const { message } = payload as { message?: unknown };

  if (typeof message === 'string') {
    return message;
  }

  if (Array.isArray(message) && message.every((item) => typeof item === 'string')) {
    return message.join(', ');
  }

  return undefined;
}

/**
 * Single entry point for HTTP calls to the REST API. Every feature talks to the
 * backend through this function so timeouts, headers and error normalization
 * stay in one place.
 */
export async function apiRequest<TResponse>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<TResponse> {
  const { method = 'GET', body, headers, authToken, timeoutMs = DEFAULT_TIMEOUT_MS } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(buildUrl(path), {
      method,
      headers: {
        Accept: 'application/json',
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    const raw = await response.text();
    const payload = raw.length > 0 ? parseJson(raw) : undefined;

    if (!response.ok) {
      throw new ApiError(
        messageFromPayload(payload) ?? `Request failed with status ${response.status}`,
        { status: response.status, payload },
      );
    }

    return payload as TResponse;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const aborted = error instanceof Error && error.name === 'AbortError';

    throw new ApiError(aborted ? 'Request timed out' : 'Network request failed', {
      status: 0,
      isNetworkError: true,
    });
  } finally {
    clearTimeout(timer);
  }
}
