import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Moment } from '@/types';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';

interface MomentCardProps {
  moment: Moment;
  size: number;
}

export function MomentCard({ moment, size }: MomentCardProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const hasReactions = moment.reactions.length > 0;

  return (
    <Pressable
      style={[styles.container, { width: size, height: size * 1.3 }]}
      onPress={() => {
        // Navigate to full view
      }}
    >
      {/* Image */}
      <Image
        source={{ uri: moment.imageUrl }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
      />

      {/* Gradient Overlay */}
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Info Overlay */}
      <View style={styles.overlay}>
        <View style={styles.topInfo}>
          {hasReactions && (
            <View style={styles.reactionBadge}>
              <Text style={styles.reactionCount}>{moment.reactions.length}</Text>
              <Text style={styles.reactionEmoji}>{moment.reactions[0].emoji}</Text>
            </View>
          )}
        </View>

        <View style={styles.bottomInfo}>
          <Text style={styles.userName} numberOfLines={1}>
            {moment.user.displayName}
          </Text>
          <Text style={styles.time}>{formatTime(moment.timestamp)}</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
    backgroundColor: colors.surfaceElevated,
    ...shadows.md,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  topInfo: {
    alignItems: 'flex-end',
  },
  reactionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    gap: spacing.xs,
  },
  reactionCount: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.surface,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  bottomInfo: {
    gap: 2,
  },
  userName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    color: colors.surface,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  time: {
    fontSize: typography.sizes.xs,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: typography.weights.medium,
  },
});
