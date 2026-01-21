import { getSupabaseClient } from '@/template';

export interface FriendRequest {
  id: string;
  from_user_id: string;
  to_user_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  from_user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
  };
}

export interface Friend {
  id: string;
  user_id: string;
  related_user_id: string;
  status: 'friend' | 'couple';
  created_at: string;
  related_user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    status?: string;
    last_seen?: string;
  };
}

class FriendService {
  private supabase = getSupabaseClient();

  async searchUsers(query: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('user_profiles')
      .select('id, username, email, avatar')
      .or(`username.ilike.%${query}%,email.ilike.%${query}%`)
      .limit(20);

    if (error) throw error;
    return data || [];
  }

  async sendFriendRequest(toUserId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await this.supabase
      .from('friend_requests')
      .insert({
        from_user_id: user.id,
        to_user_id: toUserId,
        status: 'pending',
      });

    if (error) throw error;
  }

  async getFriendRequests(): Promise<FriendRequest[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await this.supabase
      .from('friend_requests')
      .select(`
        id,
        from_user_id,
        to_user_id,
        status,
        created_at,
        from_user:user_profiles!friend_requests_from_user_id_fkey(
          id,
          username,
          email,
          avatar
        )
      `)
      .eq('to_user_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async acceptFriendRequest(requestId: string, fromUserId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Update request status
    const { error: updateError } = await this.supabase
      .from('friend_requests')
      .update({ status: 'accepted' })
      .eq('id', requestId);

    if (updateError) throw updateError;

    // Create relationship
    const { error: relationshipError } = await this.supabase
      .from('relationships')
      .insert({
        user_id: user.id,
        related_user_id: fromUserId,
        status: 'friend',
      });

    if (relationshipError) throw relationshipError;

    // Create reverse relationship
    const { error: reverseError } = await this.supabase
      .from('relationships')
      .insert({
        user_id: fromUserId,
        related_user_id: user.id,
        status: 'friend',
      });

    if (reverseError) throw reverseError;

    // Create 1-1 chat
    const { data: chatData, error: chatError } = await this.supabase
      .from('chats')
      .insert({
        type: '1-1',
      })
      .select()
      .single();

    if (chatError) throw chatError;

    // Add both users as participants
    const { error: participantError } = await this.supabase
      .from('chat_participants')
      .insert([
        { chat_id: chatData.id, user_id: user.id },
        { chat_id: chatData.id, user_id: fromUserId },
      ]);

    if (participantError) throw participantError;
  }

  async rejectFriendRequest(requestId: string): Promise<void> {
    const { error } = await this.supabase
      .from('friend_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);

    if (error) throw error;
  }

  async getFriends(): Promise<Friend[]> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await this.supabase
      .from('relationships')
      .select(`
        id,
        user_id,
        related_user_id,
        status,
        created_at,
        related_user:user_profiles!relationships_related_user_id_fkey(
          id,
          username,
          email,
          avatar,
          status,
          last_seen
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async upgradeToCouple(friendId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Update relationship status
    const { error: updateError } = await this.supabase
      .from('relationships')
      .update({ status: 'couple' })
      .eq('user_id', user.id)
      .eq('related_user_id', friendId);

    if (updateError) throw updateError;

    // Update reverse relationship
    const { error: reverseError } = await this.supabase
      .from('relationships')
      .update({ status: 'couple' })
      .eq('user_id', friendId)
      .eq('related_user_id', user.id);

    if (reverseError) throw reverseError;
  }

  async breakCouple(partnerId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Downgrade to friend
    const { error: updateError } = await this.supabase
      .from('relationships')
      .update({ status: 'friend' })
      .eq('user_id', user.id)
      .eq('related_user_id', partnerId);

    if (updateError) throw updateError;

    // Update reverse relationship
    const { error: reverseError } = await this.supabase
      .from('relationships')
      .update({ status: 'friend' })
      .eq('user_id', partnerId)
      .eq('related_user_id', user.id);

    if (reverseError) throw reverseError;
  }

  async removeFriend(friendId: string): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Delete relationship
    const { error: deleteError } = await this.supabase
      .from('relationships')
      .delete()
      .eq('user_id', user.id)
      .eq('related_user_id', friendId);

    if (deleteError) throw deleteError;

    // Delete reverse relationship
    const { error: reverseError } = await this.supabase
      .from('relationships')
      .delete()
      .eq('user_id', friendId)
      .eq('related_user_id', user.id);

    if (reverseError) throw reverseError;
  }
}

export const friendService = new FriendService();
