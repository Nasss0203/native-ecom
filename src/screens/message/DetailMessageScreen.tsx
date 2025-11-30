import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'DetailMessage'>;

type Message = {
  id: string;
  text: string;
  createdAt: string;
  isMe: boolean;
};

const initialMessages: Message[] = [
  {
    id: '1',
    text: 'Chào bạn, mình có thể hỗ trợ gì cho đơn hàng #1234?',
    createdAt: '10:00',
    isMe: false,
  },
  {
    id: '2',
    text: 'Mình muốn hỏi về thời gian giao hàng dự kiến.',
    createdAt: '10:01',
    isMe: true,
  },
  {
    id: '3',
    text: 'Đơn của bạn dự kiến giao trong 2–3 ngày tới nhé.',
    createdAt: '10:02',
    isMe: false,
  },
];

const MessageBubble = ({ message }: { message: Message }) => {
  const containerAlign = message.isMe ? 'flex-end' : 'flex-start';
  const bubbleStyle = message.isMe ? styles.bubbleMe : styles.bubbleOther;
  const textStyle = message.isMe ? styles.textMe : styles.textOther;

  return (
    <View style={[styles.messageRow, { justifyContent: containerAlign }]}>
      <View style={[styles.bubble, bubbleStyle]}>
        <Text style={textStyle}>{message.text}</Text>
        <Text style={styles.time}>{message.createdAt}</Text>
      </View>
    </View>
  );
};

const DetailMessageScreen = ({ navigation, route }: Props) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: trimmed,
      createdAt: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isMe: true,
    };

    // Thêm message mới lên đầu (vì list inverted)
    setMessages(prev => [newMessage, ...prev]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      {/* Danh sách chat */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.listContent}
        inverted
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      {/* Thanh nhập tin nhắn */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor="#9CA3AF"
          value={input}
          onChangeText={setInput}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            !input.trim() && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          activeOpacity={0.7}
          disabled={!input.trim()}
        >
          <Text style={styles.sendText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DetailMessageScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  listContent: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 8,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
  },
  bubbleMe: {
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 2,
  },
  bubbleOther: {
    backgroundColor: '#E5E7EB',
    borderBottomLeftRadius: 2,
  },
  textMe: {
    color: '#fff',
    fontSize: 14,
  },
  textOther: {
    color: '#111827',
    fontSize: 14,
  },
  time: {
    marginTop: 4,
    fontSize: 10,
    color: '#9CA3AF',
    alignSelf: 'flex-end',
  },

  // Input bar
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  input: {
    flex: 1,
    maxHeight: 120,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: '#F9FAFB',
    color: '#111827',
  },
  sendButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  sendText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 13,
  },
});
