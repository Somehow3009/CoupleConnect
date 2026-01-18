import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useMessages } from '@/hooks/useMessages';
import { Avatar } from '@/components/ui/Avatar';
import { mockCurrentUser, mockChats } from '@/services/mockData';
import { spacing, typography, borderRadius } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { Message } from '@/types';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const chatId = Array.isArray(id) ? id[0] : id;
  const { colors, getChatCustomization } = useTheme();
  
  const { messages, loading, sendMessage } = useMessages(chatId, mockCurrentUser.id);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const chat = mockChats.find(c => c.id === chatId);
  const isCouple = chat?.relationshipStatus === 'couple';
  const customization = getChatCustomization(chatId);

  const accentMap = {
    pink: '#FF6B9D',
    purple: '#9D5CFF',
    blue: '#5C9DFF',
    green: '#5CFFB3',
    orange: '#FFB35C',
  };
  
  const bubbleSentColor = customization?.theme 
    ? accentMap[customization.theme] 
    : colors.bubbleSent;

  const handleSend = async () => {
    if (!inputText.trim()) return;

    try {
      await sendMessage('text', inputText.trim());
      setInputText('');
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (err) {
      console.error('Failed to send:', err);
    }
  };

  const getBubbleStyle = (isMine: boolean) => {
    const baseStyle = [styles.bubble];
    
    if (isMine) {
      baseStyle.push(styles.bubbleMine);
      baseStyle.push({ backgroundColor: bubbleSentColor });
    } else {
      baseStyle.push(styles.bubbleTheirs);
      baseStyle.push({ backgroundColor: colors.bubbleReceived });
    }

    // Apply custom bubble style
    if (customization?.bubbleStyle === 'minimal') {
      baseStyle.push(styles.bubbleMinimal);
    } else if (customization?.bubbleStyle === 'ios') {
      baseStyle.push(styles.bubbleIOS);
    } else if (customization?.bubbleStyle === 'square') {
      baseStyle.push(styles.bubbleSquare);
    }

    return baseStyle;
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === mockCurrentUser.id;
    
    return (
      <View style={[styles.messageRow, isMine && styles.messageRowMine]}>
        {!isMine && (
          <Avatar uri="https://i.pravatar.cc/150?img=5" size={32} />
        )}
        <View style={getBubbleStyle(isMine)}>
          <Text style={[styles.messageText, { color: isMine ? '#FFFFFF' : colors.textPrimary }]}>
            {item.content}
          </Text>
          <Text style={[styles.timestamp, isMine && styles.timestampMine]}>
            {new Date(item.timestamp).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        </View>
        {isMine && (
          <MaterialIcons
            name={
              item.status === 'seen'
                ? 'done-all'
                : item.status === 'delivered'
                ? 'done-all'
                : 'done'
            }
            size={16}
            color={item.status === 'seen' ? colors.primary : colors.textSubtle}
            style={styles.statusIcon}
          />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {/* Custom Header */}
      <View style={[styles.customHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <MaterialIcons name="arrow-back" size={24} color={colors.textPrimary} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]} numberOfLines={1}>
            {chat?.groupName || 'Chat'}
          </Text>
        </View>
        <Pressable 
          onPress={() => router.push(`/chat/customize/${chatId}` as any)} 
          style={styles.headerButton}
        >
          <MaterialIcons name="palette" size={24} color={colors.textSecondary} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id}
          renderItem={renderMessage}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
        />

        {/* Input Bar */}
        <View style={[
          styles.inputBar, 
          { 
            paddingBottom: Math.max(insets.bottom, spacing.sm),
            backgroundColor: colors.surface,
            borderTopColor: colors.border,
          }
        ]}>
          <Pressable style={styles.attachButton}>
            <MaterialIcons name="add-circle" size={28} color={colors.primary} />
          </Pressable>
          
          <TextInput
            style={[styles.input, { backgroundColor: colors.surfaceElevated, color: colors.textPrimary }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.textSubtle}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />

          <Pressable
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <MaterialIcons
              name="send"
              size={24}
              color={inputText.trim() ? colors.primary : colors.textSubtle}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold,
  },
  flex: {
    flex: 1,
  },
  messagesList: {
    padding: spacing.lg,
    flexGrow: 1,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  messageRowMine: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '70%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  bubbleTheirs: {
    borderBottomLeftRadius: spacing.xs,
  },
  bubbleMine: {
    borderBottomRightRadius: spacing.xs,
  },
  bubbleMinimal: {
    borderRadius: borderRadius.sm,
  },
  bubbleIOS: {
    borderRadius: borderRadius.xl,
  },
  bubbleSquare: {
    borderRadius: 4,
  },
  messageText: {
    fontSize: typography.sizes.md,
    lineHeight: typography.lineHeights.normal * typography.sizes.md,
  },
  timestamp: {
    fontSize: 10,
    color: 'rgba(128, 128, 128, 0.7)',
    marginTop: spacing.xs,
  },
  timestampMine: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statusIcon: {
    marginBottom: spacing.xs,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    gap: spacing.sm,
  },
  attachButton: {
    marginBottom: spacing.xs,
  },
  input: {
    flex: 1,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.md,
    maxHeight: 100,
  },
  sendButton: {
    marginBottom: spacing.xs,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
