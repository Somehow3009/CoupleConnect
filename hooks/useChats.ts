import { useState, useEffect } from 'react';
import { Chat } from '@/types';
import { chatService } from '@/services/chatService';

export function useChats() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      setLoading(true);
      const data = await chatService.getChats();
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
    try {
      await chatService.markAsRead(chatId);
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
