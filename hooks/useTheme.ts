import { useContext } from 'react';
import { ThemeContext } from '@/contexts/ThemeContext';
import { colors as fallbackColors } from '@/constants/theme';

export function useTheme() {
  const context = useContext(ThemeContext);
  
  // Fallback for when ThemeProvider hasn't loaded yet
  if (!context) {
    console.warn('useTheme called outside ThemeProvider - using fallback colors');
    return {
      preferences: {
        mode: 'auto' as const,
        accentColor: 'pink' as const,
        fontFamily: 'system' as const,
        fontSize: 1.0,
        bubbleStyle: 'rounded' as const,
        reducedMotion: false,
      },
      colors: {
        background: fallbackColors.background,
        surface: fallbackColors.surface,
        surfaceElevated: fallbackColors.surfaceElevated,
        textPrimary: fallbackColors.textPrimary,
        textSecondary: fallbackColors.textSecondary,
        textSubtle: fallbackColors.textSubtle,
        primary: fallbackColors.primary,
        primaryDark: fallbackColors.primaryDark,
        primaryLight: fallbackColors.primaryLight,
        border: fallbackColors.border,
        borderSubtle: fallbackColors.borderSubtle,
        bubbleSent: fallbackColors.primary,
        bubbleReceived: fallbackColors.bubbleReceived,
        online: fallbackColors.online,
        overlay: fallbackColors.overlay,
      },
      isDark: false,
      updatePreferences: () => console.warn('updatePreferences called without ThemeProvider'),
      getChatCustomization: () => undefined,
      updateChatCustomization: () => console.warn('updateChatCustomization called without ThemeProvider'),
      resetTheme: () => console.warn('resetTheme called without ThemeProvider'),
    };
  }
  
  return context;
}
