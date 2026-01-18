import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMoments } from '@/hooks/useMoments';
import { MomentCard } from '@/components/moment/MomentCard';
import { colors, spacing, typography, borderRadius, shadows } from '@/constants/theme';
import { useAlert } from '@/template';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - spacing.lg * 3) / 2;

export default function MomentsScreen() {
  const insets = useSafeAreaInsets();
  const { moments, loading, refresh } = useMoments();
  const { showAlert } = useAlert();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleCapture = () => {
    showAlert('Capture Moment', '📸 Camera will open to capture your daily moment!', [
      { text: 'OK' },
    ]);
  };

  const handleViewHistory = () => {
    showAlert('History', '📅 Calendar view coming soon! View your past moments by date.');
  };

  // Filter moments for today
  const todayMoments = moments.filter(m => {
    const momentDate = new Date(m.timestamp);
    return momentDate.toDateString() === selectedDate.toDateString();
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header - Minimal */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Pressable style={styles.headerButton} onPress={handleViewHistory}>
          <MaterialIcons name="calendar-today" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.title}>Today</Text>
        <Pressable style={styles.headerButton}>
          <MaterialIcons name="person-add" size={24} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <View />
        }
      >
        {/* Camera Button - Center Focus */}
        <View style={styles.captureSection}>
          <Pressable style={styles.captureButton} onPress={handleCapture}>
            <LinearGradient
              colors={[colors.primary, colors.primaryDark]}
              style={styles.captureGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="camera-alt" size={32} color={colors.surface} />
            </LinearGradient>
          </Pressable>
          <Text style={styles.captureText}>Capture your moment</Text>
          <Text style={styles.captureSubtext}>Share with friends once a day</Text>
        </View>

        {/* Grid of Moments */}
        {todayMoments.length > 0 ? (
          <View style={styles.grid}>
            {todayMoments.map(moment => (
              <MomentCard key={moment.id} moment={moment} size={CARD_SIZE} />
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <MaterialIcons name="photo-camera" size={64} color={colors.textSubtle} />
            <Text style={styles.emptyText}>No moments yet today</Text>
            <Text style={styles.emptySubtext}>Be the first to share!</Text>
          </View>
        )}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    color: colors.textPrimary,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  captureSection: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl,
  },
  captureButton: {
    marginBottom: spacing.md,
  },
  captureGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  captureText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  captureSubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.xxxl * 2,
  },
  emptyText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
    color: colors.textSecondary,
    marginTop: spacing.lg,
  },
  emptySubtext: {
    fontSize: typography.sizes.sm,
    color: colors.textSubtle,
    marginTop: spacing.xs,
  },
});
