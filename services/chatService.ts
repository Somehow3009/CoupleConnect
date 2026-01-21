import { getSupabaseClient } from '@/template';
import { Chat, Message, MessageType, MessageStatus } from '@/types';

class ChatService {
  private supabase = getSupabaseClient();

  async getChats(userId: string): Promise<Chat[]> {
    const { data, error } = await this.supabase
      .from('chat_participants')
      .select(`
        chat_id,
        is_pinned,
        is_muted,
        last_read_at,
        chats (
          id,
          type,
          group_name,
          group_avatar,
          created_at
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    const chats: Chat[] = await Promise.all(
      (data || []).map(async (item: any) => {
        const chat = item.chats;
        
        // Get all participants
        const { data: participants } = await this.supabase
          .from('chat_participants')
          .select('user_id')
          .eq('chat_id', chat.id);

        // Get last message
        const { data: lastMessageData } = await this.supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chat.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        // Get unread count
        const { count } = await this.supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('chat_id', chat.id)
          .gt('created_at', item.last_read_at || '1970-01-01');

        // Get relationship status for 1-1 chats
        let relationshipStatus: 'stranger' | 'friend' | 'couple' = 'stranger';
        if (chat.type === '1-1') {
          const otherUserId = participants?.find((p: any) => p.user_id !== userId)?.user_id;
          if (otherUserId) {
            const { data: relationship } = await this.supabase
              .from('relationships')
              .select('status')
              .eq('user_id', userId)
              .eq('related_user_id', otherUserId)
              .single();
            
            relationshipStatus = relationship?.status || 'friend';
          }
        }

        return {
          id: chat.id,
          type: chat.type,
          participants: participants?.map((p: any) => p.user_id) || [],
          lastMessage: lastMessageData ? {
            ...lastMessageData,
            timestamp: new Date(lastMessageData.created_at),
          } : undefined,
          unreadCount: count || 0,
          isPinned: item.is_pinned || false,
          isMuted: item.is_muted || false,
          relationshipStatus,
          groupName: chat.group_name,
          groupAvatar: chat.group_avatar,
        };
      })
    );

    // Sort: couple pinned first, then by last message time
    return chats.sort((a, b) => {
      if (a.relationshipStatus === 'couple' && b.relationshipStatus !== 'couple') return -1;
      if (a.relationshipStatus !== 'couple' && b.relationshipStatus === 'couple') return 1;
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      const aTime = a.lastMessage?.timestamp.getTime() || 0;
      const bTime = b.lastMessage?.timestamp.getTime() || 0;
      return bTime - aTime;
    });
  }

  async getMessages(chatId: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('created_at', { ascending: true });

    if (error) throw error;

    return (data || []).map(msg => ({
      ...msg,
      timestamp: new Date(msg.created_at),
      status: 'seen' as MessageStatus, // Simplified for now
    }));
  }

  async sendMessage(
    chatId: string,
    senderId: string,
    type: MessageType,
    content: string,
    mediaUrl?: string
  ): Promise<Message> {
    const { data, error } = await this.supabase
      .from('messages')
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        type,
        content,
        media_url: mediaUrl,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      ...data,
      timestamp: new Date(data.created_at),
      status: 'sent',
    };
  }

  async uploadMedia(file: Blob, bucket: string, path: string): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file);

    if (error) throw error;

    const { data: urlData } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  }

  async markAsRead(chatId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('chat_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('chat_id', chatId)
      .eq('user_id', userId);

    if (error) throw error;
  }

  subscribeToMessages(chatId: string, callback: (message: Message) => void) {
    return this.supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          callback({
            ...payload.new,
            timestamp: new Date(payload.new.created_at),
            status: 'sent' as MessageStatus,
          } as Message);
        }
      )
      .subscribe();
  }
}

export const chatService = new ChatService();
