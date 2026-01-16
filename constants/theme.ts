// Design System - Social App Theme
export const colors = {
  // Base
  background: '#FAFAFA',
  backgroundDark: '#0A0A0A',
  surface: '#FFFFFF',
  surfaceDark: '#1A1A1A',
  surfaceElevated: '#F5F5F5',
  surfaceElevatedDark: '#2A2A2A',
  
  // Text
  textPrimary: '#1A1A1A',
  textPrimaryDark: '#FFFFFF',
  textSecondary: '#666666',
  textSecondaryDark: '#999999',
  textSubtle: '#999999',
  textSubtleDark: '#666666',
  
  // Brand - Couple theme
  primary: '#FF6B9D',
  primaryDark: '#FF4081',
  primaryLight: '#FFB3D1',
  
  // Accent variations
  accentPurple: '#9D5CFF',
  accentBlue: '#5C9DFF',
  accentGreen: '#5CFFB3',
  accentOrange: '#FFB35C',
  
  // Status
  online: '#4CAF50',
  offline: '#9E9E9E',
  typing: '#2196F3',
  
  // Semantic
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  
  // Chat bubbles
  bubbleSent: '#FF6B9D',
  bubbleReceived: '#F0F0F0',
  bubbleSentDark: '#FF4081',
  bubbleReceivedDark: '#2A2A2A',
  
  // Borders
  border: '#E0E0E0',
  borderDark: '#333333',
  borderSubtle: '#F0F0F0',
  borderSubtleDark: '#1F1F1F',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const typography = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.8,
  },
};

export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
};

export const hitSlop = {
  sm: { top: 8, right: 8, bottom: 8, left: 8 },
  md: { top: 12, right: 12, bottom: 12, left: 12 },
  lg: { top: 16, right: 16, bottom: 16, left: 16 },
};

// Theme presets
export type ThemeType = 'light' | 'dark';
export type AccentColor = 'pink' | 'purple' | 'blue' | 'green' | 'orange';

export const getAccentColor = (accent: AccentColor): string => {
  const map = {
    pink: colors.primary,
    purple: colors.accentPurple,
    blue: colors.accentBlue,
    green: colors.accentGreen,
    orange: colors.accentOrange,
  };
  return map[accent] || colors.primary;
};
