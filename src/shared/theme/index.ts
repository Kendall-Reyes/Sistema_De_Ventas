/**
 * Design tokens for the whole app. Components must read from here instead of
 * hardcoding spacing, radius or typography, so a visual change happens in one place.
 */
export { colors } from '@/shared/colors';
export type { AppColors } from '@/shared/colors';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  full: 999,
} as const;

export const typography = {
  title: 24,
  subtitle: 18,
  body: 15,
  caption: 13,
} as const;

export const theme = { colors, spacing, radius, typography } as const;

export type AppTheme = typeof theme;
