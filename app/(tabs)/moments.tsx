import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, Alert } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useMoments } from '@/hooks/useMoments';
import { MomentCard } from '@/components/moment/MomentCard';
import { colors, spacing, typography } from '@/constants/theme';
import { useAlert } from '@/template';

export default function MomentsScreen() {
  const insets = useSafeAreaInsets();
  const { moments, loading, refresh, addReaction, addComment } = useMoments();
  const { showAlert } = useAlert();
  const [commentingMoment, setCommentingMoment] = useState<string | null>(null);

  const handleCreateMoment = () => {
    showAlert('Create Moment', 'Camera integration coming soon! Use the + button to capture and share your moment.', [
      { text: 'OK' },
    ]);
  };

  const handleReact = async (momentId: string, emoji: string) => {
    await addReaction(momentId, emoji);
  };

  const handleComment = (momentId: string) => {
    showAlert('Add Comment', 'Comment feature coming soon! Share your thoughts on this moment.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'OK' },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <Text style={styles.title}>Moments</Text>
        <Pressable style={styles.addButton} onPress={handleCreateMoment}>
          <MaterialIcons name="add-a-photo" size={24} color={colors.primary} />
        </Pressable>
      </View>

      {/* Moments Feed */}
      <FlatList
        data={moments}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MomentCard
            moment={item}
            onReact={emoji => handleReact(item.id, emoji)}
            onComment={() => handleComment(item.id)}
          />
        )}
        refreshing={loading}
        onRefresh={refresh}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
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
  addButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  list: {
    flexGrow: 1,
    paddingTop: spacing.lg,
  },
});
