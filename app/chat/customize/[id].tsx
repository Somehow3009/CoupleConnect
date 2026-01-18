import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/useTheme';
import { AccentColor, BubbleStyle } from '@/types/theme';
import { mockChats, mockUsers } from '@/services/mockData';
import { spacing, typography, borderRadius } from '@/constants/theme';
import { useAlert } from '@/template';

export default function ChatCustomizeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const chatId = Array.isArray(id) ? id[0] : id;
  const { colors, getChatCustomization, updateChatCustomization } = useTheme();
  const { showAlert } = useAlert();

  const chat = mockChats.find(c => c.id === chatId);
  const customization = getChatCustomization(chatId);

  const accentOptions: { key: AccentColor; label: string; color: string }[] = [
    { key: 'pink', label: 'Pink', color: '#FF6B9D' },
    { key: 'purple', label: 'Purple', color: '#9D5CFF' },
    { key: 'blue', label: 'Blue', color: '#5C9DFF' },
    { key: 'green', label: 'Green', color: '#5CFFB3' },
    { key: 'orange', label: 'Orange', color: '#FFB35C' },
  ];

  const bubbleOptions: { key: BubbleStyle; label: string; icon: string }[] = [
    { key: 'rounded', label: 'Rounded', icon: 'chat-bubble' },
    { key: 'minimal', label: 'Minimal', icon: 'chat' },
    { key: 'ios', label: 'iOS Style', icon: 'message' },
    { key: 'square', label: 'Square', icon: 'check-box-outline-blank' },
  ];

  const handleAccentChange = (accent: AccentColor) => {
    updateChatCustomization(chatId, { theme: accent });
  };

  const handleBubbleChange = (bubble: BubbleStyle) => {
    updateChatCustomization(chatId, { bubbleStyle: bubble });
  };

  const handleResetCustomization = () => {
    showAlert('Reset Customization', 'Reset this chat to default theme?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: () => {
          updateChatCustomization(chatId, { theme: undefined, bubbleStyle: undefined });
          showAlert('Success', 'Chat theme reset to default');
        },
      },
    ]);
  };

  if (!chat) return null;

  const otherUser = mockUsers.find(u => chat.participants.includes(u.id));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Customize Chat</Text>
        <Pressable style={styles.resetButton} onPress={handleResetCustomization}>
          <MaterialIcons name="refresh" size={24} color={colors.textSecondary} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Chat Info */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.chatInfo}>
            {otherUser?.avatar && (
              <Image source={{ uri: otherUser.avatar }} style={styles.avatar} contentFit="cover" />
            )}
            <View>
              <Text style={[styles.chatName, { color: colors.textPrimary }]}>
                {otherUser?.displayName || 'Chat'}
              </Text>
              <Text style={[styles.chatRelation, { color: colors.textSecondary }]}>
                {chat.relationshipStatus === 'couple' ? '💕 Couple' : '👋 Friend'}
              </Text>
            </View>
          </View>
        </View>

        {/* Accent Color */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Chat Theme Color</Text>
          
          <View style={styles.colorGrid}>
            {accentOptions.map(({ key, label, color }) => (
              <Pressable
                key={key}
                style={[
                  styles.colorOption,
                  { borderColor: colors.border },
                  customization?.theme === key && { 
                    borderColor: color, 
                    borderWidth: 3,
                    backgroundColor: colors.surfaceElevated,
                  },
                ]}
                onPress={() => handleAccentChange(key)}
              >
                <View style={[styles.colorCircle, { backgroundColor: color }]} />
                <Text style={[styles.colorLabel, { color: colors.textPrimary }]}>{label}</Text>
                {customization?.theme === key && (
                  <MaterialIcons
                    name="check-circle"
                    size={20}
                    color={color}
                    style={styles.checkIcon}
                  />
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Bubble Style */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Bubble Style</Text>
          
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
                  customization?.bubbleStyle === bubble.key && {
                    borderColor: colors.primary,
                    borderWidth: 3,
                  },
                ]}
                onPress={() => handleBubbleChange(bubble.key)}
              >
                <MaterialIcons
                  name={bubble.icon as any}
                  size={28}
                  color={customization?.bubbleStyle === bubble.key ? colors.primary : colors.textSecondary}
                />
                <Text style={[
                  styles.bubbleLabel,
                  { color: customization?.bubbleStyle === bubble.key ? colors.primary : colors.textPrimary },
                ]}>
                  {bubble.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Preview */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Preview</Text>
          
          <View style={styles.previewContainer}>
            {/* Received message */}
            <View style={styles.previewMessageRow}>
              <View style={[
                styles.previewBubble,
                styles.previewBubbleReceived,
                { backgroundColor: colors.bubbleReceived },
                customization?.bubbleStyle === 'minimal' && styles.bubbleMinimal,
                customization?.bubbleStyle === 'ios' && styles.bubbleIOS,
                customization?.bubbleStyle === 'square' && styles.bubbleSquare,
              ]}>
                <Text style={[styles.previewText, { color: colors.textPrimary }]}>
                  Hey! How are you?
                </Text>
              </View>
            </View>

            {/* Sent message */}
            <View style={[styles.previewMessageRow, styles.previewMessageRowMine]}>
              <View style={[
                styles.previewBubble,
                styles.previewBubbleSent,
                { 
                  backgroundColor: customization?.theme 
                    ? accentOptions.find(a => a.key === customization.theme)?.color 
                    : colors.bubbleSent 
                },
                customization?.bubbleStyle === 'minimal' && styles.bubbleMinimal,
                customization?.bubbleStyle === 'ios' && styles.bubbleIOS,
                customization?.bubbleStyle === 'square' && styles.bubbleSquare,
              ]}>
                <Text style={[styles.previewText, { color: '#FFFFFF' }]}>
                  I am great! Thanks! 😊
                </Text>
              </View>
            </View>
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
  resetButton: {
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
  chatInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  chatName: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  chatRelation: {
    fontSize: typography.sizes.sm,
    marginTop: spacing.xs,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorOption: {
    width: '30%',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    position: 'relative',
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: spacing.xs,
  },
  colorLabel: {
    fontSize: typography.sizes.sm,
  },
  checkIcon: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
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
  previewContainer: {
    gap: spacing.md,
  },
  previewMessageRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  previewMessageRowMine: {
    justifyContent: 'flex-end',
  },
  previewBubble: {
    maxWidth: '70%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  previewBubbleReceived: {
    borderRadius: borderRadius.lg,
    borderBottomLeftRadius: spacing.xs,
  },
  previewBubbleSent: {
    borderRadius: borderRadius.lg,
    borderBottomRightRadius: spacing.xs,
  },
  bubbleMinimal: {
    borderRadius: borderRadius.sm,
  },
  bubbleIOS: {
    borderRadius: borderRadius.xl,
  },
  bubbleSquare: {
    borderRadius: 4,
  },
  previewText: {
    fontSize: typography.sizes.md,
  },
});
