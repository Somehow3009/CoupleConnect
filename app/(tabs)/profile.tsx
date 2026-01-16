import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Switch } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { mockCurrentUser } from '@/services/mockData';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { getAccentColor } from '@/constants/theme';
import { useAlert } from '@/template';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const [user, setUser] = useState(mockCurrentUser);

  const accentColors = [
    { key: 'pink', label: 'Pink', color: '#FF6B9D' },
    { key: 'purple', label: 'Purple', color: '#9D5CFF' },
    { key: 'blue', label: 'Blue', color: '#5C9DFF' },
    { key: 'green', label: 'Green', color: '#5CFFB3' },
    { key: 'orange', label: 'Orange', color: '#FFB35C' },
  ] as const;

  const handleLogout = () => {
    showAlert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => {
        showAlert('Success', 'Logged out successfully');
      }},
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top }]}>
          <Text style={styles.title}>Profile</Text>
          <Pressable style={styles.iconButton}>
            <MaterialIcons name="settings" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Avatar uri={user.avatar} size={80} showOnline isOnline />
          <Text style={styles.displayName}>{user.displayName}</Text>
          <Text style={styles.username}>@{user.username}</Text>
          {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
          
          <Button
            title="Edit Profile"
            onPress={() => showAlert('Edit Profile', 'Profile editing coming soon!')}
            variant="secondary"
            size="sm"
            style={styles.editButton}
          />
        </View>

        {/* Accent Color */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Accent Color</Text>
          <View style={styles.colorGrid}>
            {accentColors.map(({ key, label, color }) => (
              <Pressable
                key={key}
                style={[
                  styles.colorOption,
                  user.accentColor === key && styles.colorOptionActive,
                ]}
                onPress={() => setUser({ ...user, accentColor: key })}
              >
                <View style={[styles.colorCircle, { backgroundColor: color }]} />
                <Text style={styles.colorLabel}>{label}</Text>
                {user.accentColor === key && (
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

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="location-on" size={24} color={colors.textSecondary} />
              <Text style={styles.settingText}>Location Sharing</Text>
            </View>
            <Switch
              value={user.locationSharing}
              onValueChange={value => setUser({ ...user, locationSharing: value })}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={user.locationSharing ? colors.primary : colors.surface}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="visibility-off" size={24} color={colors.textSecondary} />
              <Text style={styles.settingText}>Ghost Mode</Text>
            </View>
            <Switch
              value={user.ghostMode}
              onValueChange={value => setUser({ ...user, ghostMode: value })}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={user.ghostMode ? colors.primary : colors.surface}
            />
          </View>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="notifications" size={24} color={colors.textSecondary} />
              <Text style={styles.settingText}>Notifications</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="lock" size={24} color={colors.textSecondary} />
              <Text style={styles.settingText}>Privacy</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="block" size={24} color={colors.textSecondary} />
              <Text style={styles.settingText}>Blocked Users</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Actions */}
        <View style={styles.section}>
          <Button
            title="Logout"
            onPress={handleLogout}
            variant="secondary"
            style={styles.actionButton}
          />
        </View>

        <View style={{ height: spacing.xxxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flexGrow: 1,
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
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  profileSection: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  displayName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
    marginTop: spacing.md,
  },
  username: {
    fontSize: typography.sizes.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  bio: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  editButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
  },
  section: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  colorOption: {
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
  },
  colorOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceElevated,
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: spacing.xs,
  },
  colorLabel: {
    fontSize: typography.sizes.sm,
    color: colors.textPrimary,
  },
  checkIcon: {
    position: 'absolute',
    top: spacing.xs,
    right: spacing.xs,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  settingText: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
  },
  actionButton: {
    marginTop: spacing.md,
  },
});
