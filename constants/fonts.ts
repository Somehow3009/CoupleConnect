// Font System - Multiple font families for customization
export type FontFamily = 'system' | 'rounded' | 'serif' | 'mono' | 'casual';

export const fonts = {
  system: {
    name: 'System Default',
    family: 'System',
    ios: 'System',
    android: 'Roboto',
    description: 'Clean and modern',
  },
  rounded: {
    name: 'Rounded',
    family: 'System',
    ios: 'Avenir Next Rounded',
    android: 'sans-serif',
    description: 'Friendly and soft',
  },
  serif: {
    name: 'Serif',
    family: 'System',
    ios: 'Georgia',
    android: 'serif',
    description: 'Classic and elegant',
  },
  mono: {
    name: 'Monospace',
    family: 'System',
    ios: 'Courier',
    android: 'monospace',
    description: 'Tech and minimal',
  },
  casual: {
    name: 'Casual',
    family: 'System',
    ios: 'Marker Felt',
    android: 'casual',
    description: 'Fun and playful',
  },
};

export const fontSizes = {
  xs: { base: 11, min: 10, max: 14 },
  sm: { base: 13, min: 11, max: 16 },
  md: { base: 15, min: 13, max: 18 },
  lg: { base: 17, min: 15, max: 20 },
  xl: { base: 19, min: 17, max: 22 },
  xxl: { base: 22, min: 19, max: 26 },
  xxxl: { base: 28, min: 24, max: 34 },
};

// Scale font sizes based on user preference
export const scaleFontSize = (baseSize: number, scale: number): number => {
  return Math.round(baseSize * scale);
};
