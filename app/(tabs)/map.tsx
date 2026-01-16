import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocations } from '@/hooks/useLocations';
import { mockUsers, mockCurrentUser } from '@/services/mockData';
import { Avatar } from '@/components/ui/Avatar';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { locations, loading, refresh } = useLocations();
  const [ghostMode, setGhostMode] = useState(mockCurrentUser.ghostMode);

  // Mock map component (real map would use react-native-maps)
  const renderMockMap = () => (
    <View style={styles.mapContainer}>
      <View style={styles.mapPlaceholder}>
        <MaterialIcons name="map" size={64} color={colors.textSubtle} />
        <Text style={styles.mapPlaceholderText}>Map View (Mocked)</Text>
        <Text style={styles.mapPlaceholderSubtext}>
          Real-time location tracking with React Native Maps
        </Text>
      </View>

      {/* Location Markers */}
      <View style={styles.markersContainer}>
        {locations.map((loc, index) => {
          const user = mockUsers.find(u => u.id === loc.userId);
          if (!user) return null;

          return (
            <View key={loc.userId} style={[styles.marker, { top: 100 + index * 80, left: 50 + index * 60 }]}>
              <Avatar uri={user.avatar} size={40} showOnline isOnline={user.status === 'online'} />
              <View style={styles.markerLabel}>
                <Text style={styles.markerName}>{user.displayName}</Text>
                {loc.address && (
                  <Text style={styles.markerAddress} numberOfLines={1}>
                    {loc.address}
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Map</Text>
        <View style={styles.headerActions}>
          <Pressable
            style={[styles.ghostButton, ghostMode && styles.ghostButtonActive]}
            onPress={() => setGhostMode(!ghostMode)}
          >
            <MaterialIcons
              name="visibility-off"
              size={20}
              color={ghostMode ? colors.surface : colors.textSecondary}
            />
            <Text style={[styles.ghostButtonText, ghostMode && styles.ghostButtonTextActive]}>
              Ghost
            </Text>
          </Pressable>
          <Pressable style={styles.iconButton} onPress={refresh}>
            <MaterialIcons name="refresh" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>
      </View>

      {/* Map */}
      {renderMockMap()}

      {/* Friends List */}
      <View style={styles.friendsList}>
        <Text style={styles.friendsTitle}>Friends Nearby</Text>
        {locations.map(loc => {
          const user = mockUsers.find(u => u.id === loc.userId);
          if (!user) return null;

          return (
            <Pressable key={loc.userId} style={styles.friendItem}>
              <Avatar uri={user.avatar} size={40} showOnline isOnline={user.status === 'online'} />
              <View style={styles.friendInfo}>
                <Text style={styles.friendName}>{user.displayName}</Text>
                <Text style={styles.friendLocation} numberOfLines={1}>
                  {loc.address || 'Unknown location'}
                </Text>
              </View>
              <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  headerActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  ghostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceElevated,
  },
  ghostButtonActive: {
    backgroundColor: colors.primary,
  },
  ghostButtonText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
    color: colors.textSecondary,
  },
  ghostButtonTextActive: {
    color: colors.surface,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  mapPlaceholderText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  mapPlaceholderSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textSubtle,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  markersContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  marker: {
    position: 'absolute',
    alignItems: 'center',
  },
  markerLabel: {
    marginTop: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    ...shadows.md,
    maxWidth: 120,
  },
  markerName: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
  },
  markerAddress: {
    fontSize: 10,
    color: colors.textSecondary,
  },
  friendsList: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    padding: spacing.lg,
    maxHeight: 280,
    ...shadows.lg,
  },
  friendsTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  friendInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  friendName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.medium,
    color: colors.textPrimary,
  },
  friendLocation: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
