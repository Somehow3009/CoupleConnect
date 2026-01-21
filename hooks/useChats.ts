import { useState, useEffect } from 'react';
import { Chat } from '@/types';
import { chatService } from '@/services/chatService';
import { useAuth } from '@/template';

export function useChats() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadChats();
    }
  }, [user]);

  const loadChats = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await chatService.getChats(user.id);
      setChats(data);
      setError(null);
    } catch (err) {
      setError('Failed to load chats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (chatId: string) => {
    if (!user) return;
    
    try {
      await chatService.markAsRead(chatId, user.id);
      setChats(prev =>
        prev.map(chat =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        )
      );
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  return {
    chats,
    loading,
    error,
    refresh: loadChats,
    markAsRead,
  };
}
