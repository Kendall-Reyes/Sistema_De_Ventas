import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const isSupportedPlatform = Platform.OS === 'ios' || Platform.OS === 'android';

function assertSupported(): void {
  if (!isSupportedPlatform) {
    throw new Error(
      'Secure storage is only available on iOS and Android. Persisting session tokens on web requires a reviewed strategy.',
    );
  }
}

/**
 * Small wrapper over Expo SecureStore for sensitive values only (session token,
 * refresh token). Non-sensitive preferences belong in AsyncStorage instead.
 */
export const secureStorage = {
  get(key: string): Promise<string | null> {
    assertSupported();

    return SecureStore.getItemAsync(key);
  },

  async set(key: string, value: string): Promise<void> {
    assertSupported();
    await SecureStore.setItemAsync(key, value);
  },

  async remove(key: string): Promise<void> {
    assertSupported();
    await SecureStore.deleteItemAsync(key);
  },
};
