import { useState, useEffect } from 'react';
import { Message, MessageType } from '@/types';
import { chatService } from '@/services/chatService';

export function useMessages(chatId: string, currentUserId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessages();
    
    // Subscribe to real-time updates
    const subscription = chatService.subscribeToMessages(chatId, (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [chatId]);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await chatService.getMessages(chatId);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (
    type: MessageType,
    content: string,
    mediaUrl?: string
  ) => {
    try {
      setSending(true);
      const message = await chatService.sendMessage(
        chatId,
        currentUserId,
        type,
        content,
        mediaUrl
      );
      // Don't add to local state - will be added via subscription
      return message;
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    } finally {
      setSending(false);
    }
  };

  return {
    messages,
    loading,
    sending,
    sendMessage,
    refresh: loadMessages,
  };
}