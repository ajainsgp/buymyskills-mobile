import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import API_BASE from '../../shared/utils/apiBase';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
  isRead: boolean;
}

export default function MessageChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const { receiverId, receiverName, from } = useLocalSearchParams();
  const { user } = useAuth();

  useEffect(() => {
    if (user && receiverId) {
      loadMessages();
    }
  }, [user, receiverId]);

  const loadMessages = async () => {
    if (!user || !receiverId) return;

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/messages?contactId=${receiverId}`, {
        headers: {
          'x-current-user': JSON.stringify(user),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        Alert.alert('Error', 'Failed to load messages');
      }
    } catch (error) {
      console.error('Load messages error:', error);
      Alert.alert('Error', 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    if (!receiverId || !user) {
      Alert.alert('Error', 'Missing recipient information');
      return;
    }

    setSending(true);
    try {
      const response = await fetch(`${API_BASE}/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-current-user': JSON.stringify(user),
        },
        body: JSON.stringify({
          receiverId: receiverId,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        const newMsg = await response.json();
        setMessages(prev => [...prev, newMsg.message]);
        setNewMessage('');
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Send message error:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (!receiverName) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.centerContent}>
          <ThemedText type="title" style={styles.errorTitle}>
            Error
          </ThemedText>
          <ThemedText style={styles.errorText}>
            Recipient information is missing
          </ThemedText>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(tabs)/messages')}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.senderId === user?.id;
    return (
      <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
        <Text style={[styles.messageText, isOwnMessage ? styles.ownMessageText : styles.otherMessageText]}>
          {item.content}
        </Text>
        <Text style={[styles.messageTime, isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime]}>
          {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => {
          if (from === 'explore') {
            router.push('/(tabs)/explore');
          } else {
            router.push('/(tabs)/messages');
          }
        }} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <ThemedText type="title" style={styles.title}>
          {receiverName}
        </ThemedText>
      </View>

      {loading ? (
        <View style={styles.centerContent}>
          <Text>Loading messages...</Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderMessage}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContainer}
          inverted={false}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          maxLength={1000}
        />
        <TouchableOpacity
          style={[styles.sendButton, (sending || !newMessage.trim()) && styles.buttonDisabled]}
          onPress={handleSendMessage}
          disabled={sending || !newMessage.trim()}
        >
          <Text style={styles.sendButtonText}>
            {sending ? '...' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#007bff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007bff',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageText: {
    padding: 12,
    borderRadius: 16,
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    backgroundColor: '#007bff',
    color: '#ffffff',
  },
  otherMessageText: {
    backgroundColor: '#ffffff',
    color: '#495057',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  messageTime: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'right',
  },
  ownMessageTime: {
    color: '#6c757d',
  },
  otherMessageTime: {
    color: '#6c757d',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#dee2e6',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    marginRight: 12,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
