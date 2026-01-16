import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Image } from 'expo-image';
import { MaterialIcons } from '@expo/vector-icons';
import { Moment } from '@/types';
import { Avatar } from '@/components/ui/Avatar';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';

interface MomentCardProps {
  moment: Moment;
  onReact: (emoji: string) => void;
  onComment: () => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - spacing.lg * 2;

export function MomentCard({ moment, onReact, onComment }: MomentCardProps) {
  const [showReactions, setShowReactions] = useState(false);

  const quickReactions = ['❤️', '😍', '😂', '😮', '👍', '🔥'];

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const userReaction = moment.reactions.find(r => r.userId === 'user-1');

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Avatar uri={moment.user.avatar} size={40} showOnline isOnline={moment.user.status === 'online'} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{moment.user.displayName}</Text>
          <Text style={styles.time}>{formatTime(moment.timestamp)}</Text>
        </View>
      </View>

      {/* Image */}
      <Pressable
        onPress={() => setShowReactions(!showReactions)}
        onLongPress={() => setShowReactions(true)}
      >
        <Image
          source={{ uri: moment.imageUrl }}
          style={styles.image}
          contentFit="cover"
        />
      </Pressable>

      {/* Quick Reactions */}
      {showReactions && (
        <View style={styles.reactionsBar}>
          {quickReactions.map(emoji => (
            <Pressable
              key={emoji}
              style={styles.reactionButton}
              onPress={() => {
                onReact(emoji);
                setShowReactions(false);
              }}
            >
              <Text style={styles.reactionEmoji}>{emoji}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Caption */}
      {moment.caption && (
        <Text style={styles.caption}>{moment.caption}</Text>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <Pressable
          style={styles.actionButton}
          onPress={() => setShowReactions(!showReactions)}
        >
          <Text style={styles.actionEmoji}>{userReaction?.emoji || '❤️'}</Text>
          <Text style={[styles.actionText, userReaction && styles.actionTextActive]}>
            {moment.reactions.length > 0 ? moment.reactions.length : 'React'}
          </Text>
        </Pressable>

        <Pressable style={styles.actionButton} onPress={onComment}>
          <MaterialIcons name="chat-bubble-outline" size={20} color={colors.textSecondary} />
          <Text style={styles.actionText}>
            {moment.comments.length > 0 ? moment.comments.length : 'Comment'}
          </Text>
        </Pressable>
      </View>

      {/* Comments Preview */}
      {moment.comments.length > 0 && (
        <View style={styles.commentsPreview}>
          {moment.comments.slice(0, 2).map(comment => (
            <View key={comment.id} style={styles.comment}>
              <Text style={styles.commentUser}>{comment.user.displayName}</Text>
              <Text style={styles.commentText}>{comment.content}</Text>
            </View>
          ))}
          {moment.comments.length > 2 && (
            <Pressable onPress={onComment}>
              <Text style={styles.viewMore}>View all {moment.comments.length} comments</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  userInfo: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  userName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  time: {
    fontSize: typography.sizes.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  image: {
    width: CARD_WIDTH,
    height: CARD_WIDTH * 1.25,
    backgroundColor: colors.surfaceElevated,
  },
  reactionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.sm,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.md,
    margin: spacing.md,
    ...shadows.sm,
  },
  reactionButton: {
    padding: spacing.sm,
  },
  reactionEmoji: {
    fontSize: 24,
  },
  caption: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    lineHeight: typography.lineHeights.relaxed * typography.sizes.md,
  },
  actions: {
    flexDirection: 'row',
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
    gap: spacing.xs,
  },
  actionEmoji: {
    fontSize: 20,
  },
  actionText: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.weights.medium,
  },
  actionTextActive: {
    color: colors.primary,
  },
  commentsPreview: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  comment: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  commentUser: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginRight: spacing.xs,
  },
  commentText: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
    flex: 1,
  },
  viewMore: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
