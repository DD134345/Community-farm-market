import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { mockChatConversations, mockChatMessages, mockSellers } from '../data/mockData';
import { ChatConversation, ChatMessage, Seller } from '../types';
import { colors, spacing, borderRadius, fontSize } from '../utils/theme';

interface ChatScreenProps {
  navigation: any;
}

interface ChatDetailScreenProps {
  navigation: any;
  route: { params: { sellerId: string; sellerName: string } };
}

function ChatListScreen({ navigation }: ChatScreenProps) {
  const [conversations] = useState<ChatConversation[]>(mockChatConversations);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60));
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return `${Math.floor(diff / 1440)}d ago`;
  };

  const renderConversation = ({ item }: { item: ChatConversation }) => {
    const otherIndex = item.participantIds[0] === 'current' ? 1 : 0;
    const seller = mockSellers.find(s => s.id === item.participantIds[otherIndex]);

    return (
      <TouchableOpacity
        style={styles.conversationItem}
        onPress={() => navigation.navigate('ChatDetail', {
          sellerId: item.participantIds[otherIndex],
          sellerName: item.participantNames[otherIndex]
        })}
      >
        <View style={styles.avatar}>
          {seller ? (
            <View style={[styles.avatarImage, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="storefront" size={20} color={colors.primary} />
            </View>
          ) : (
            <View style={[styles.avatarImage, { backgroundColor: colors.border }]}>
              <Ionicons name="person" size={20} color={colors.textMuted} />
            </View>
          )}
        </View>
        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={styles.sellerName}>{item.participantNames[otherIndex]}</Text>
            <Text style={styles.timeText}>{formatTime(item.lastMessageTime)}</Text>
          </View>
          <View style={styles.conversationFooter}>
            <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={80} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>No messages yet</Text>
          <Text style={styles.emptySubtitle}>Start a conversation with a seller!</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={item => item.id}
          renderItem={renderConversation}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

function ChatDetailScreen({ navigation, route }: ChatDetailScreenProps) {
  const { sellerId, sellerName } = route.params;
  const [messages, setMessages] = useState<ChatMessage[]>(
    mockChatMessages.filter(m => 
      (m.senderId === sellerId && m.receiverId === 'current') || 
      (m.senderId === 'current' && m.receiverId === sellerId)
    )
  );
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const seller = mockSellers.find(s => s.id === sellerId);

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      senderId: 'current',
      receiverId: sellerId,
      senderName: 'John Doe',
      senderAvatar: 'https://picsum.photos/seed/currentuser/200',
      content: inputText,
      timestamp: new Date(),
      read: false
    };

    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isOwn = item.senderId === 'current';

    return (
      <View style={[styles.messageBubble, isOwn ? styles.ownMessage : styles.otherMessage]}>
        {!isOwn && (
          <View style={styles.messageAvatar}>
            <Ionicons name="storefront" size={12} color={colors.primary} />
          </View>
        )}
        <View style={[styles.messageContent, isOwn ? styles.ownContent : styles.otherContent]}>
          <Text style={[styles.messageText, isOwn && styles.ownText]}>{item.content}</Text>
          <Text style={[styles.messageTime, isOwn && styles.ownTime]}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>{sellerName}</Text>
          {seller && (
            <View style={styles.sellerMeta}>
              <Ionicons name="star" size={12} color={colors.rating} />
              <Text style={styles.sellerRating}>{seller.rating}</Text>
              <Text style={styles.sellerResponse}>• Responds {seller.responseTime}</Text>
            </View>
          )}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
          placeholderTextColor={colors.textMuted}
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, inputText.trim() && styles.sendButtonActive]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Ionicons name="send" size={20} color={inputText.trim() ? colors.textLight : colors.textMuted} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: colors.text,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.lg,
  },
  emptySubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  avatar: {
    marginRight: spacing.md,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sellerName: {
    fontSize: fontSize.md,
    fontWeight: '600',
    color: colors.text,
  },
  timeText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  conversationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  lastMessage: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginRight: spacing.sm,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCount: {
    fontSize: fontSize.xs,
    color: colors.textLight,
    fontWeight: '600',
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: '600',
    color: colors.text,
  },
  sellerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  sellerRating: {
    fontSize: fontSize.xs,
    color: colors.text,
    marginLeft: 2,
  },
  sellerResponse: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  messageList: {
    padding: spacing.md,
  },
  messageBubble: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.xs,
  },
  messageContent: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  ownContent: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 2,
  },
  otherContent: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 2,
  },
  messageText: {
    fontSize: fontSize.md,
    color: colors.text,
  },
  ownText: {
    color: colors.textLight,
  },
  messageTime: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: spacing.xs,
    alignSelf: 'flex-end',
  },
  ownTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  sendButtonActive: {
    backgroundColor: colors.primary,
  },
});

export default ChatListScreen;
export { ChatDetailScreen };
