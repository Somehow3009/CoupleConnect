import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Switch } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { mockCurrentUser } from '@/services/mockData';
import { spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useAlert } from '@/template';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { showAlert } = useAlert();
  const { colors, preferences, isDark } = useTheme();
  const [user, setUser] = useState(mockCurrentUser);

  const handleLogout = () => {
    showAlert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => {
        showAlert('Success', 'Logged out successfully');
      }},
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top, backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Profile</Text>
          <Pressable style={styles.iconButton}>
            <MaterialIcons name="settings" size={24} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Profile Info */}
        <View style={[styles.profileSection, { backgroundColor: colors.surface }]}>
          <Avatar uri={user.avatar} size={80} showOnline isOnline />
          <Text style={[styles.displayName, { color: colors.textPrimary }]}>{user.displayName}</Text>
          <Text style={[styles.username, { color: colors.textSecondary }]}>@{user.username}</Text>
          {user.bio && <Text style={[styles.bio, { color: colors.textSecondary }]}>{user.bio}</Text>}
          
          <Button
            title="Edit Profile"
            onPress={() => showAlert('Edit Profile', 'Profile editing coming soon!')}
            variant="secondary"
            size="sm"
            style={styles.editButton}
          />
        </View>

        {/* Theme Settings */}
        <Pressable 
          style={[styles.themeCard, { backgroundColor: colors.surface }]}
          onPress={() => router.push('/theme-settings')}
        >
          <View style={styles.themeCardLeft}>
            <View style={[styles.themeIcon, { backgroundColor: colors.primary }]}>
              <MaterialIcons name="palette" size={28} color="#FFFFFF" />
            </View>
            <View>
              <Text style={[styles.themeCardTitle, { color: colors.textPrimary }]}>
                Theme & Appearance
              </Text>
              <Text style={[styles.themeCardDesc, { color: colors.textSecondary }]}>
                {isDark ? 'Dark' : 'Light'} · {preferences.accentColor} · {preferences.fontFamily}
              </Text>
            </View>
          </View>
          <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
        </Pressable>

        {/* Settings */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Privacy & Settings</Text>
          
          <View style={[styles.settingItem, { borderBottomColor: colors.borderSubtle }]}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="location-on" size={24} color={colors.textSecondary} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>Location Sharing</Text>
            </View>
            <Switch
              value={user.locationSharing}
              onValueChange={value => setUser({ ...user, locationSharing: value })}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={user.locationSharing ? colors.primary : colors.surface}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: colors.borderSubtle }]}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="visibility-off" size={24} color={colors.textSecondary} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>Ghost Mode</Text>
            </View>
            <Switch
              value={user.ghostMode}
              onValueChange={value => setUser({ ...user, ghostMode: value })}
              trackColor={{ false: colors.border, true: colors.primaryLight }}
              thumbColor={user.ghostMode ? colors.primary : colors.surface}
            />
          </View>

          <Pressable style={[styles.settingItem, { borderBottomColor: colors.borderSubtle }]}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="notifications" size={24} color={colors.textSecondary} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>Notifications</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={[styles.settingItem, { borderBottomColor: colors.borderSubtle }]}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="lock" size={24} color={colors.textSecondary} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>Privacy</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <MaterialIcons name="block" size={24} color={colors.textSecondary} />
              <Text style={[styles.settingText, { color: colors.textPrimary }]}>Blocked Users</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
          </Pressable>
        </View>

        {/* Actions */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
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
    borderBottomWidth: 1,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
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
    marginBottom: spacing.md,
  },
  displayName: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginTop: spacing.md,
  },
  username: {
    fontSize: typography.sizes.md,
    marginTop: spacing.xs,
  },
  bio: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  editButton: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.xl,
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
  themeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  themeCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  themeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeCardTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
    marginBottom: spacing.xs,
  },
  themeCardDesc: {
    fontSize: typography.sizes.sm,
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
  },
  actionButton: {
    marginTop: spacing.md,
  },
});
