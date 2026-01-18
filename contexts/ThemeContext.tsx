import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeMode, ThemeColors, ThemePreferences, ChatCustomization } from '@/types/theme';
import { colors as baseColors } from '@/constants/theme';

interface ThemeContextType {
  preferences: ThemePreferences;
  colors: ThemeColors;
  isDark: boolean;
  updatePreferences: (updates: Partial<ThemePreferences>) => void;
  getChatCustomization: (chatId: string) => ChatCustomization | undefined;
  updateChatCustomization: (chatId: string, customization: Partial<ChatCustomization>) => void;
  resetTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_preferences';
const CHAT_CUSTOM_STORAGE_KEY = '@chat_customizations';

const defaultPreferences: ThemePreferences = {
  mode: 'auto',
  accentColor: 'pink',
  fontFamily: 'system',
  fontSize: 1.0,
  bubbleStyle: 'rounded',
  reducedMotion: false,
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [preferences, setPreferences] = useState<ThemePreferences>(defaultPreferences);
  const [chatCustomizations, setChatCustomizations] = useState<ChatCustomization[]>([]);

  // Determine if dark mode is active
  const isDark =
    preferences.mode === 'dark' ||
    (preferences.mode === 'auto' && systemColorScheme === 'dark');

  // Get themed colors
  const getThemedColors = (): ThemeColors => {
    const accentMap = {
      pink: baseColors.primary,
      purple: baseColors.accentPurple,
      blue: baseColors.accentBlue,
      green: baseColors.accentGreen,
      orange: baseColors.accentOrange,
    };

    const primary = accentMap[preferences.accentColor];

    return {
      background: isDark ? baseColors.backgroundDark : baseColors.background,
      surface: isDark ? baseColors.surfaceDark : baseColors.surface,
      surfaceElevated: isDark ? baseColors.surfaceElevatedDark : baseColors.surfaceElevated,
      textPrimary: isDark ? baseColors.textPrimaryDark : baseColors.textPrimary,
      textSecondary: isDark ? baseColors.textSecondaryDark : baseColors.textSecondary,
      textSubtle: isDark ? baseColors.textSubtleDark : baseColors.textSubtle,
      primary,
      primaryDark: isDark ? baseColors.primaryLight : baseColors.primaryDark,
      primaryLight: isDark ? baseColors.primaryDark : baseColors.primaryLight,
      border: isDark ? baseColors.borderDark : baseColors.border,
      borderSubtle: isDark ? baseColors.borderSubtleDark : baseColors.borderSubtle,
      bubbleSent: primary,
      bubbleReceived: isDark ? baseColors.bubbleReceivedDark : baseColors.bubbleReceived,
      online: baseColors.online,
      overlay: baseColors.overlay,
    };
  };

  // Load preferences from storage
  useEffect(() => {
    loadPreferences();
    loadChatCustomizations();
  }, []);

  const loadPreferences = async () => {
    try {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load theme preferences:', err);
    }
  };

  const loadChatCustomizations = async () => {
    try {
      const stored = await AsyncStorage.getItem(CHAT_CUSTOM_STORAGE_KEY);
      if (stored) {
        setChatCustomizations(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load chat customizations:', err);
    }
  };

  const updatePreferences = async (updates: Partial<ThemePreferences>) => {
    const newPreferences = { ...preferences, ...updates };
    setPreferences(newPreferences);
    
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(newPreferences));
    } catch (err) {
      console.error('Failed to save theme preferences:', err);
    }
  };

  const getChatCustomization = (chatId: string): ChatCustomization | undefined => {
    return chatCustomizations.find(c => c.chatId === chatId);
  };

  const updateChatCustomization = async (
    chatId: string,
    customization: Partial<ChatCustomization>
  ) => {
    const existing = chatCustomizations.find(c => c.chatId === chatId);
    
    let newCustomizations: ChatCustomization[];
    if (existing) {
      newCustomizations = chatCustomizations.map(c =>
        c.chatId === chatId ? { ...c, ...customization } : c
      );
    } else {
      newCustomizations = [...chatCustomizations, { chatId, ...customization }];
    }

    setChatCustomizations(newCustomizations);
    
    try {
      await AsyncStorage.setItem(CHAT_CUSTOM_STORAGE_KEY, JSON.stringify(newCustomizations));
    } catch (err) {
      console.error('Failed to save chat customization:', err);
    }
  };

  const resetTheme = async () => {
    setPreferences(defaultPreferences);
    setChatCustomizations([]);
    
    try {
      await AsyncStorage.removeItem(THEME_STORAGE_KEY);
      await AsyncStorage.removeItem(CHAT_CUSTOM_STORAGE_KEY);
    } catch (err) {
      console.error('Failed to reset theme:', err);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        preferences,
        colors: getThemedColors(),
        isDark,
        updatePreferences,
        getChatCustomization,
        updateChatCustomization,
        resetTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
