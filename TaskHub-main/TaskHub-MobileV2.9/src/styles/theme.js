export const COLORS = {
  primary: '#0A0E3D',
  accent: '#2D5BE3',
  background: '#F6F7FB',
  white: '#FFFFFF',
  text: '#111827',
  secondaryText: '#6B7280',

  high: '#FEE2E2',
  highText: '#991B1B',
  medium: '#DBEAFE',
  mediumText: '#1E40AF',
  low: '#DCFCE7',
  lowText: '#166534',
  warning: '#FEF3C7',
  warningText: '#92400E',
  purple: '#F3E8FF',
  purpleText: '#5B21B6',

  border: '#E5E7EB',
  textOnDark: '#FFFFFF',

  // compatibilidade antiga
  surface: '#FFFFFF',
  textMuted: '#6B7280',
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  error: '#EF4444',
};

export const SPACING = {
  xs: 6,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
};

export const RADIUS = {
  sm: 10,
  md: 18,
  lg: 24,
};

export const TYPOGRAPHY = {
  title: 28,
  subtitle: 18,
  body: 15,
  small: 13,

  // compatibilidade antiga
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
  xxxl: 36,
  bold: '800',
  semibold: '600',
};

export const shadows = {
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
};

// COMPATIBILIDADE COM CÓDIGO ANTIGO
export const colors = COLORS;
export const spacing = SPACING;
export const radius = RADIUS;
export const typography = TYPOGRAPHY;