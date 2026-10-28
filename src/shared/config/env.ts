import { z } from 'zod';

/**
 * Public runtime configuration. Only EXPO_PUBLIC_ variables are available here:
 * Expo inlines them at build time, so never put secrets in this file.
 */
const envSchema = z.object({
  apiUrl: z.url(),
  google: z.object({
    webClientId: z.string().min(1).optional(),
    iosClientId: z.string().min(1).optional(),
    androidClientId: z.string().min(1).optional(),
  }),
});

const DEV_FALLBACK_API_URL = 'http://localhost:3000/api';

const parsed = envSchema.safeParse({
  apiUrl: process.env.EXPO_PUBLIC_API_URL ?? (__DEV__ ? DEV_FALLBACK_API_URL : undefined),
  google: {
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || undefined,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || undefined,
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || undefined,
  },
});

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join(', ');

  throw new Error(`Invalid environment configuration: ${details}`);
}

export const env = parsed.data;
