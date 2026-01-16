import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Chat } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { colors, spacing, typography, borderRadius } from '@/constants/theme';

interface ChatListItemProps {
  chat: Chat;
  currentUserId: string;
}

export function ChatListItem({ chat, currentUserId }: ChatListItemProps) {
  const router = useRouter();

  const otherParticipant = chat.participants.find(p => p !== currentUserId);
  
  // Get participant info from chat
  const displayName = chat.groupName || chat.lastMessage?.senderId || 'Unknown';
  const avatar = chat.groupAvatar;

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const isCouple = chat.relationshipStatus === 'couple';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        isCouple && styles.coupleContainer,
        pressed && styles.pressed,
      ]}
      onPress={() => router.push(`/chat/${chat.id}`)}
    >
      <Avatar uri={avatar} size={56} showOnline isOnline />

      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {displayName}
            </Text>
            {isCouple && (
              <MaterialIcons name="favorite" size={16} color={colors.primary} />
            )}
            {chat.isPinned && (
              <MaterialIcons name="push-pin" size={14} color={colors.textSecondary} />
            )}
          </View>
          {chat.lastMessage && (
            <Text style={styles.time}>{formatTime(chat.lastMessage.timestamp)}</Text>
          )}
        </View>

        <View style={styles.messageRow}>
          <Text style={styles.message} numberOfLines={1}>
            {chat.lastMessage?.content || 'No messages yet'}
          </Text>
          {chat.unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{chat.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  coupleContainer: {
    backgroundColor: '#FFF9FB',
  },
  pressed: {
    backgroundColor: colors.surfaceElevated,
  },
  content: {
    flex: 1,
    marginLeft: spacing.md,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    flex: 1,
  },
  name: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    flex: 1,
  },
  time: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    flex: 1,
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  badge: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
    minWidth: 20,
    height: 20,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
  badgeText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.surface,
  },
});
