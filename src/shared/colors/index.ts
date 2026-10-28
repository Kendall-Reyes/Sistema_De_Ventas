/**
 * Color tokens for the app.
 * Keep in one place to ensure visual consistency across components.
 */
export const colors = {
  primary: '#0F766E',
  primaryDark: '#115E59',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  border: '#E2E8F0',
  text: '#0F172A',
  textMuted: '#64748B',
  danger: '#DC2626',
  success: '#15803D',
  warning: '#B45309',
} as const;

export type AppColors = typeof colors;
