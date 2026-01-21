import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useTheme } from '@/hooks/useTheme';
import { useAlert } from '@/template';
import { friendService, FriendRequest, Friend } from '@/services/friendService';
import { spacing, typography, borderRadius } from '@/constants/theme';

export default function FriendsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { showAlert } = useAlert();

  const [tab, setTab] = useState<'requests' | 'search' | 'list'>('requests');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadFriendRequests();
    loadFriends();
  }, []);

  const loadFriendRequests = async () => {
    try {
      const data = await friendService.getFriendRequests();
      setFriendRequests(data);
    } catch (err) {
      console.error('Failed to load requests:', err);
    }
  };

  const loadFriends = async () => {
    try {
      const data = await friendService.getFriends();
      setFriends(data);
    } catch (err) {
      console.error('Failed to load friends:', err);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const results = await friendService.searchUsers(searchQuery.trim());
      setSearchResults(results);
    } catch (err) {
      showAlert('Error', 'Failed to search users');
    } finally {
      setLoading(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      await friendService.sendFriendRequest(userId);
      showAlert('Success', 'Friend request sent');
      setSearchResults(prev => prev.filter(u => u.id !== userId));
    } catch (err: any) {
      showAlert('Error', err.message || 'Failed to send request');
    }
  };

  const handleAcceptRequest = async (requestId: string, fromUserId: string) => {
    try {
      await friendService.acceptFriendRequest(requestId, fromUserId);
      showAlert('Success', 'Friend request accepted');
      loadFriendRequests();
      loadFriends();
    } catch (err: any) {
      showAlert('Error', err.message || 'Failed to accept request');
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await friendService.rejectFriendRequest(requestId);
      loadFriendRequests();
    } catch (err: any) {
      showAlert('Error', err.message || 'Failed to reject request');
    }
  };

  const handleUpgradeToCouple = async (friendId: string, friendName: string) => {
    showAlert('Upgrade to Couple', `Make ${friendName} your special partner?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes',
        onPress: async () => {
          try {
            await friendService.upgradeToCouple(friendId);
            showAlert('Success', 'Relationship upgraded to Couple! 💕');
            loadFriends();
          } catch (err: any) {
            showAlert('Error', err.message || 'Failed to upgrade');
          }
        },
      },
    ]);
  };

  const renderRequestItem = ({ item }: { item: FriendRequest }) => (
    <View style={[styles.requestCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Image
        source={{ uri: item.from_user.avatar || 'https://i.pravatar.cc/150' }}
        style={styles.avatar}
        contentFit="cover"
      />
      <View style={styles.requestInfo}>
        <Text style={[styles.userName, { color: colors.textPrimary }]}>
          {item.from_user.username || item.from_user.email}
        </Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
          {item.from_user.email}
        </Text>
      </View>
      <View style={styles.requestActions}>
        <Pressable
          style={[styles.acceptButton, { backgroundColor: colors.primary }]}
          onPress={() => handleAcceptRequest(item.id, item.from_user_id)}
        >
          <MaterialIcons name="check" size={20} color="#FFFFFF" />
        </Pressable>
        <Pressable
          style={[styles.rejectButton, { backgroundColor: colors.surfaceElevated }]}
          onPress={() => handleRejectRequest(item.id)}
        >
          <MaterialIcons name="close" size={20} color={colors.textSecondary} />
        </Pressable>
      </View>
    </View>
  );

  const renderSearchResult = ({ item }: { item: any }) => (
    <View style={[styles.searchCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Image
        source={{ uri: item.avatar || 'https://i.pravatar.cc/150' }}
        style={styles.avatar}
        contentFit="cover"
      />
      <View style={styles.searchInfo}>
        <Text style={[styles.userName, { color: colors.textPrimary }]}>
          {item.username || 'User'}
        </Text>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
          {item.email}
        </Text>
      </View>
      <Pressable
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => handleSendRequest(item.id)}
      >
        <MaterialIcons name="person-add" size={20} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  const renderFriendItem = ({ item }: { item: Friend }) => (
    <View style={[styles.friendCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Image
        source={{ uri: item.related_user.avatar || 'https://i.pravatar.cc/150' }}
        style={styles.avatar}
        contentFit="cover"
      />
      <View style={styles.friendInfo}>
        <View style={styles.friendHeader}>
          <Text style={[styles.userName, { color: colors.textPrimary }]}>
            {item.related_user.username || item.related_user.email}
          </Text>
          {item.status === 'couple' && <Text style={styles.coupleBadge}>💕</Text>}
        </View>
        <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
          {item.related_user.email}
        </Text>
      </View>
      {item.status === 'friend' && (
        <Pressable
          style={[styles.upgradeButton, { borderColor: colors.primary }]}
          onPress={() => handleUpgradeToCouple(item.related_user_id, item.related_user.username || 'this friend')}
        >
          <MaterialIcons name="favorite" size={18} color={colors.primary} />
        </Pressable>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Friends</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable
          style={[styles.tab, tab === 'requests' && { borderBottomColor: colors.primary }]}
          onPress={() => setTab('requests')}
        >
          <MaterialIcons name="person-add" size={20} color={tab === 'requests' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, { color: tab === 'requests' ? colors.primary : colors.textSecondary }]}>
            Requests
          </Text>
          {friendRequests.length > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.primary }]}>
              <Text style={styles.badgeText}>{friendRequests.length}</Text>
            </View>
          )}
        </Pressable>

        <Pressable
          style={[styles.tab, tab === 'search' && { borderBottomColor: colors.primary }]}
          onPress={() => setTab('search')}
        >
          <MaterialIcons name="search" size={20} color={tab === 'search' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, { color: tab === 'search' ? colors.primary : colors.textSecondary }]}>
            Search
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, tab === 'list' && { borderBottomColor: colors.primary }]}
          onPress={() => setTab('list')}
        >
          <MaterialIcons name="people" size={20} color={tab === 'list' ? colors.primary : colors.textSecondary} />
          <Text style={[styles.tabText, { color: tab === 'list' ? colors.primary : colors.textSecondary }]}>
            My Friends
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {tab === 'requests' && (
          <FlatList
            data={friendRequests}
            keyExtractor={item => item.id}
            renderItem={renderRequestItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.empty}>
                <MaterialIcons name="inbox" size={48} color={colors.textSubtle} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No pending requests
                </Text>
              </View>
            }
          />
        )}

        {tab === 'search' && (
          <View style={styles.searchContainer}>
            <View style={[styles.searchBar, { backgroundColor: colors.surface }]}>
              <TextInput
                style={[styles.searchInput, { color: colors.textPrimary }]}
                placeholder="Search by username or email"
                placeholderTextColor={colors.textSubtle}
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
              />
              <Pressable style={[styles.searchButton, { backgroundColor: colors.primary }]} onPress={handleSearch}>
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <MaterialIcons name="search" size={24} color="#FFFFFF" />
                )}
              </Pressable>
            </View>

            <FlatList
              data={searchResults}
              keyExtractor={item => item.id}
              renderItem={renderSearchResult}
              contentContainerStyle={styles.list}
              ListEmptyComponent={
                searchQuery ? (
                  <View style={styles.empty}>
                    <MaterialIcons name="search-off" size={48} color={colors.textSubtle} />
                    <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                      No users found
                    </Text>
                  </View>
                ) : null
              }
            />
          </View>
        )}

        {tab === 'list' && (
          <FlatList
            data={friends}
            keyExtractor={item => item.id}
            renderItem={renderFriendItem}
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <View style={styles.empty}>
                <MaterialIcons name="people-outline" size={48} color={colors.textSubtle} />
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                  No friends yet
                </Text>
              </View>
            }
          />
        )}
      </View>
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
  title: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: typography.weights.bold,
  },
  content: {
    flex: 1,
  },
  list: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  searchContainer: {
    flex: 1,
  },
  searchBar: {
    flexDirection: 'row',
    margin: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.sizes.md,
  },
  searchButton: {
    width: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  searchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  friendCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  requestInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  searchInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  friendInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  friendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  userName: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  userEmail: {
    fontSize: typography.sizes.sm,
    marginTop: 2,
  },
  coupleBadge: {
    fontSize: 18,
  },
  requestActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  acceptButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  upgradeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xxxl,
  },
  emptyText: {
    fontSize: typography.sizes.md,
    marginTop: spacing.md,
  },
});
