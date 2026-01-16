import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { colors, borderRadius } from '@/constants/theme';

interface AvatarProps {
  uri?: string;
  size?: number;
  style?: ViewStyle;
  showOnline?: boolean;
  isOnline?: boolean;
}

export function Avatar({ uri, size = 48, style, showOnline, isOnline }: AvatarProps) {
  return (
    <View style={[style, { width: size, height: size }]}>
      <Image
        source={uri || 'https://i.pravatar.cc/150'}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }]}
        contentFit="cover"
      />
      {showOnline && (
        <View
          style={[
            styles.statusDot,
            {
              width: size * 0.25,
              height: size * 0.25,
              borderRadius: size * 0.125,
              backgroundColor: isOnline ? colors.online : colors.offline,
            },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceElevated,
  },
  statusDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: colors.surface,
  },
});
