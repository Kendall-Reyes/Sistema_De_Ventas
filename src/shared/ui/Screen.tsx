import type { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors, spacing } from '@/shared/theme';

type ScreenProps = PropsWithChildren<{
  edges?: readonly Edge[];
  /** Set to false for screens that render a full-bleed list or map. */
  padded?: boolean;
}>;

export function Screen({ children, edges = ['top', 'bottom'], padded = true }: ScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      <View style={[styles.content, padded && styles.padded]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
});
