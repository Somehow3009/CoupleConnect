import { FontFamily } from '@/constants/fonts';

export type ThemeMode = 'light' | 'dark' | 'auto';
export type AccentColor = 'pink' | 'purple' | 'blue' | 'green' | 'orange';
export type BubbleStyle = 'rounded' | 'minimal' | 'ios' | 'square';

export interface ThemeColors {
  background: string;
  surface: string;
  surfaceElevated: string;
  textPrimary: string;
  textSecondary: string;
  textSubtle: string;
  primary: string;
  primaryDark: string;
  primaryLight: string;
  border: string;
  borderSubtle: string;
  bubbleSent: string;
  bubbleReceived: string;
  online: string;
  overlay: string;
}

export interface ThemePreferences {
  mode: ThemeMode;
  accentColor: AccentColor;
  fontFamily: FontFamily;
  fontSize: number; // Scale factor: 0.8 - 1.3
  bubbleStyle: BubbleStyle;
  reducedMotion: boolean;
}

export interface ChatCustomization {
  chatId: string;
  theme?: AccentColor;
  bubbleStyle?: BubbleStyle;
  wallpaper?: string;
}

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  accentColor: AccentColor;
  bubbleStyle: BubbleStyle;
  icon: string;
}
