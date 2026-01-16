import { Chat, Message, MessageType, Relationship } from '@/types';
import { mockChats, mockMessages, mockRelationships } from './mockData';

class ChatService {
  private chats: Chat[] = [...mockChats];
  private messages: Record<string, Message[]> = {
    'chat-1': [...mockMessages],
    'chat-2': [],
    'chat-3': [],
    'chat-4': [],
  };
  private relationships: Relationship[] = [...mockRelationships];

  async getChats(): Promise<Chat[]> {
    // Sort: couple pinned first, then by last message time
    return this.chats.sort((a, b) => {
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
    return this.messages[chatId] || [];
  }

  async sendMessage(
    chatId: string,
    senderId: string,
    type: MessageType,
    content: string,
    mediaUrl?: string
  ): Promise<Message> {
    const message: Message = {
      id: `msg-${Date.now()}`,
      chatId,
      senderId,
      type,
      content,
      timestamp: new Date(),
      status: 'sent',
      mediaUrl,
    };

    if (!this.messages[chatId]) {
      this.messages[chatId] = [];
    }
    this.messages[chatId].push(message);

    // Update chat last message
    const chatIndex = this.chats.findIndex(c => c.id === chatId);
    if (chatIndex !== -1) {
      this.chats[chatIndex].lastMessage = message;
    }

    // Simulate delivery after 1s
    setTimeout(() => {
      message.status = 'delivered';
      // Simulate seen after 2s
      setTimeout(() => {
        message.status = 'seen';
      }, 1000);
    }, 1000);

    return message;
  }

  async markAsRead(chatId: string): Promise<void> {
    const chatIndex = this.chats.findIndex(c => c.id === chatId);
    if (chatIndex !== -1) {
      this.chats[chatIndex].unreadCount = 0;
    }
  }

  async getRelationship(userId: string): Promise<Relationship | null> {
    return this.relationships.find(r => r.userId === userId) || null;
  }

  async updateRelationshipStatus(
    userId: string,
    status: 'stranger' | 'friend' | 'couple'
  ): Promise<void> {
    const index = this.relationships.findIndex(r => r.userId === userId);
    if (index !== -1) {
      this.relationships[index].status = status;
    }
  }
}

export const chatService = new ChatService();
