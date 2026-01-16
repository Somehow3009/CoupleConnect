// User relationship types
export type RelationshipStatus = 'stranger' | 'friend' | 'couple';

// User profile
export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  phoneNumber?: string;
  bio?: string;
  status: 'online' | 'offline';
  lastSeen?: Date;
}

// Current user with settings
export interface CurrentUser extends User {
  accentColor: 'pink' | 'purple' | 'blue' | 'green' | 'orange';
  theme: 'light' | 'dark';
  fontSize: number;
  locationSharing: boolean;
  ghostMode: boolean;
}

// Relationship
export interface Relationship {
  userId: string;
  status: RelationshipStatus;
  user: User;
  chatTheme?: string;
  bubbleStyle?: string;
  isPinned?: boolean;
  isMuted?: boolean;
  isBlocked?: boolean;
}

// Chat message types
export type MessageType = 'text' | 'image' | 'video' | 'voice' | 'file' | 'sticker';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'seen';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  status: MessageStatus;
  replyTo?: string;
  reactions?: Reaction[];
  mediaUrl?: string;
  fileName?: string;
  fileSize?: number;
  duration?: number;
}

export interface Reaction {
  userId: string;
  emoji: string;
  timestamp: Date;
}

// Chat
export interface Chat {
  id: string;
  type: '1-1' | 'group';
  participants: string[];
  lastMessage?: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
  relationshipStatus: RelationshipStatus;
  theme?: string;
  groupName?: string;
  groupAvatar?: string;
}

// Moments
export type MomentVisibility = 'friends' | 'selected' | 'public';

export interface Moment {
  id: string;
  userId: string;
  user: User;
  imageUrl: string;
  caption?: string;
  timestamp: Date;
  visibility: MomentVisibility;
  reactions: Reaction[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  user: User;
  content: string;
  timestamp: Date;
}

// Location
export interface Location {
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  accuracy?: number;
  address?: string;
}

export interface Geofence {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number;
  userId: string;
  enabled: boolean;
}

// Typing indicator
export interface TypingIndicator {
  chatId: string;
  userId: string;
  isTyping: boolean;
  timestamp: Date;
}
