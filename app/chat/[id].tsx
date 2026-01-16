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
import { colors, spacing, typography, borderRadius } from '@/constants/theme';
import { Message } from '@/types';

export default function ChatScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const chatId = Array.isArray(id) ? id[0] : id;
  
  const { messages, loading, sendMessage } = useMessages(chatId, mockCurrentUser.id);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const chat = mockChats.find(c => c.id === chatId);
  const isCouple = chat?.relationshipStatus === 'couple';

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

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === mockCurrentUser.id;
    
    return (
      <View style={[styles.messageRow, isMine && styles.messageRowMine]}>
        {!isMine && (
          <Avatar uri="https://i.pravatar.cc/150?img=5" size={32} />
        )}
        <View
          style={[
            styles.bubble,
            isMine ? styles.bubbleMine : styles.bubbleTheirs,
            isCouple && isMine && styles.bubbleCouple,
          ]}
        >
          <Text style={[styles.messageText, isMine && styles.messageTextMine]}>
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
    <SafeAreaView style={styles.container} edges={['bottom']}>
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
        <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
          <Pressable style={styles.attachButton}>
            <MaterialIcons name="add-circle" size={28} color={colors.primary} />
          </Pressable>
          
          <TextInput
            style={styles.input}
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
    backgroundColor: colors.background,
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
    backgroundColor: colors.bubbleReceived,
    borderBottomLeftRadius: spacing.xs,
  },
  bubbleMine: {
    backgroundColor: colors.bubbleSent,
    borderBottomRightRadius: spacing.xs,
  },
  bubbleCouple: {
    backgroundColor: colors.primary,
  },
  messageText: {
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    lineHeight: typography.lineHeights.normal * typography.sizes.md,
  },
  messageTextMine: {
    color: colors.surface,
  },
  timestamp: {
    fontSize: 10,
    color: colors.textSubtle,
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
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: spacing.sm,
  },
  attachButton: {
    marginBottom: spacing.xs,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.xl,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    fontSize: typography.sizes.md,
    color: colors.textPrimary,
    maxHeight: 100,
  },
  sendButton: {
    marginBottom: spacing.xs,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
