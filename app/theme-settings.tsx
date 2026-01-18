import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { fonts, FontFamily } from '@/constants/fonts';
import { BubbleStyle } from '@/types/theme';
import { themePresets } from '@/constants/themePresets';
import { spacing, typography, borderRadius, shadows } from '@/constants/theme';

export default function ThemeSettingsScreen() {
  const router = useRouter();
  const { preferences, colors, isDark, updatePreferences } = useTheme();

  const fontOptions: { key: FontFamily; label: string; description: string }[] = [
    { key: 'system', label: fonts.system.name, description: fonts.system.description },
    { key: 'rounded', label: fonts.rounded.name, description: fonts.rounded.description },
    { key: 'serif', label: fonts.serif.name, description: fonts.serif.description },
    { key: 'mono', label: fonts.mono.name, description: fonts.mono.description },
    { key: 'casual', label: fonts.casual.name, description: fonts.casual.description },
  ];

  const bubbleOptions: { key: BubbleStyle; label: string; icon: string }[] = [
    { key: 'rounded', label: 'Rounded', icon: 'chat-bubble' },
    { key: 'minimal', label: 'Minimal', icon: 'chat' },
    { key: 'ios', label: 'iOS Style', icon: 'message' },
    { key: 'square', label: 'Square', icon: 'check-box-outline-blank' },
  ];

  const fontSizeOptions = [
    { value: 0.8, label: 'Small' },
    { value: 0.9, label: 'Medium' },
    { value: 1.0, label: 'Default' },
    { value: 1.1, label: 'Large' },
    { value: 1.2, label: 'Extra Large' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Theme Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Theme Mode */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Appearance</Text>
          
          <View style={styles.modeContainer}>
            {(['light', 'dark', 'auto'] as const).map(mode => (
              <Pressable
                key={mode}
                style={[
                  styles.modeOption,
                  { borderColor: colors.border },
                  preferences.mode === mode && { 
                    borderColor: colors.primary, 
                    backgroundColor: colors.surfaceElevated 
                  },
                ]}
                onPress={() => updatePreferences({ mode })}
              >
                <MaterialIcons
                  name={mode === 'light' ? 'wb-sunny' : mode === 'dark' ? 'nightlight-round' : 'brightness-auto'}
                  size={32}
                  color={preferences.mode === mode ? colors.primary : colors.textSecondary}
                />
                <Text style={[
                  styles.modeLabel,
                  { color: preferences.mode === mode ? colors.primary : colors.textPrimary }
                ]}>
                  {mode.charAt(0).toUpperCase() + mode.slice(1)}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Theme Presets */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Quick Presets</Text>
          
          <View style={styles.presetGrid}>
            {themePresets.map(preset => (
              <Pressable
                key={preset.id}
                style={[
                  styles.presetCard,
                  { 
                    backgroundColor: colors.surfaceElevated,
                    borderColor: colors.border,
                  },
                  preferences.accentColor === preset.accentColor && {
                    borderColor: colors.primary,
                    borderWidth: 2,
                  },
                ]}
                onPress={() => updatePreferences({
                  accentColor: preset.accentColor,
                  bubbleStyle: preset.bubbleStyle,
                })}
              >
                <Text style={styles.presetIcon}>{preset.icon}</Text>
                <Text style={[styles.presetName, { color: colors.textPrimary }]}>
                  {preset.name}
                </Text>
                <Text style={[styles.presetDesc, { color: colors.textSecondary }]}>
                  {preset.description}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Font Family */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Font</Text>
          
          {fontOptions.map(font => (
            <Pressable
              key={font.key}
              style={[
                styles.fontOption,
                { borderBottomColor: colors.borderSubtle },
              ]}
              onPress={() => updatePreferences({ fontFamily: font.key })}
            >
              <View style={styles.fontInfo}>
                <Text style={[styles.fontLabel, { color: colors.textPrimary }]}>
                  {font.label}
                </Text>
                <Text style={[styles.fontDesc, { color: colors.textSecondary }]}>
                  {font.description}
                </Text>
              </View>
              {preferences.fontFamily === font.key && (
                <MaterialIcons name="check-circle" size={24} color={colors.primary} />
              )}
            </Pressable>
          ))}
        </View>

        {/* Font Size */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Text Size</Text>
          
          <View style={styles.fontSizeContainer}>
            {fontSizeOptions.map(option => (
              <Pressable
                key={option.value}
                style={[
                  styles.fontSizeOption,
                  { 
                    borderColor: colors.border,
                    backgroundColor: colors.surfaceElevated,
                  },
                  preferences.fontSize === option.value && {
                    borderColor: colors.primary,
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={() => updatePreferences({ fontSize: option.value })}
              >
                <Text style={[
                  styles.fontSizeLabel,
                  { color: preferences.fontSize === option.value ? colors.surface : colors.textPrimary },
                ]}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.previewBox}>
            <Text style={[
              styles.previewText,
              { 
                color: colors.textPrimary,
                fontSize: 16 * preferences.fontSize,
              },
            ]}>
              This is how your messages will look
            </Text>
          </View>
        </View>

        {/* Bubble Style */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Message Bubble Style</Text>
          
          <View style={styles.bubbleGrid}>
            {bubbleOptions.map(bubble => (
              <Pressable
                key={bubble.key}
                style={[
                  styles.bubbleOption,
                  { 
                    borderColor: colors.border,
                    backgroundColor: colors.surfaceElevated,
                  },
                  preferences.bubbleStyle === bubble.key && {
                    borderColor: colors.primary,
                    backgroundColor: colors.primary,
                  },
                ]}
                onPress={() => updatePreferences({ bubbleStyle: bubble.key })}
              >
                <MaterialIcons
                  name={bubble.icon as any}
                  size={28}
                  color={preferences.bubbleStyle === bubble.key ? colors.surface : colors.textSecondary}
                />
                <Text style={[
                  styles.bubbleLabel,
                  { color: preferences.bubbleStyle === bubble.key ? colors.surface : colors.textPrimary },
                ]}>
                  {bubble.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Accessibility */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Accessibility</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="animation" size={24} color={colors.textSecondary} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>
                Reduced Motion
              </Text>
            </View>
            <Switch
              value={preferences.reducedMotion}
              onValueChange={value => updatePreferences({ reducedMotion: value })}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={preferences.reducedMotion ? colors.primary : colors.surface}
            />
          </View>
        </View>

        <View style={{ height: spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  content: {
    flexGrow: 1,
  },
  section: {
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.md,
  },
  modeContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  modeOption: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
  },
  modeLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginTop: spacing.sm,
  },
  presetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  presetCard: {
    width: '48%',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
  },
  presetIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  presetName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  presetDesc: {
    fontSize: typography.sizes.xs,
    textAlign: 'center',
  },
  fontOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  fontInfo: {
    flex: 1,
  },
  fontLabel: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    marginBottom: 2,
  },
  fontDesc: {
    fontSize: typography.sizes.sm,
  },
  fontSizeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  fontSizeOption: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    alignItems: 'center',
  },
  fontSizeLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
  },
  previewBox: {
    padding: spacing.lg,
    borderRadius: borderRadius.md,
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
  },
  previewText: {
    textAlign: 'center',
  },
  bubbleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  bubbleOption: {
    width: '48%',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
  },
  bubbleLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    marginTop: spacing.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingText: {
    fontSize: typography.sizes.md,
  },
});
