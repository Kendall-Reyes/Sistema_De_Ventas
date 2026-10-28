import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/shared/theme';
import { Screen } from '@/shared/ui/Screen';

const appIcon = require('../../../../assets/icon.png');

export function DashboardScreen() {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Sistema de Ventas</Text>
          <Text style={styles.subtitle}>Ejemplo rÃ¡pido para validar en mobile</Text>
        </View>

        <View style={styles.imageWrapper}>
          <Image
            source={appIcon}
            style={styles.image}
            resizeMode="contain"
            accessibilityRole="image"
            accessibilityLabel="Icono de la aplicaciÃ³n Sistema de Ventas"
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  header: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: typography.title,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  imageWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  image: {
    width: 220,
    height: 220,
  },
});
