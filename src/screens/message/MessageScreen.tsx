import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Message'>;

const conversations = [
  {
    _id: '1',
    name: 'Shop ABC',
    avatar: '',
    lastMessage: 'Đơn hàng của bạn đang được chuẩn bị giao.',
    time: '2 phút trước',
    unreadCount: 2,
  },
  {
    _id: '2',
    name: 'Flash Sale 11.11',
    avatar: '',
    lastMessage: 'Voucher 50% chỉ còn hiệu lực trong hôm nay!',
    time: 'Hôm qua',
    unreadCount: 0,
  },
  {
    _id: '3',
    name: 'Nhân viên CSKH',
    avatar: '',
    lastMessage: 'Cảm ơn bạn đã phản hồi, chúng tôi sẽ hỗ trợ sớm nhất.',
    time: '3 ngày trước',
    unreadCount: 5,
  },
];

type Conversation = (typeof conversations)[number];

const MessageItem = ({
  item,
  onPress,
}: {
  item: Conversation;
  onPress?: () => void;
}) => {
  const isUnread = item.unreadCount > 0;

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Image
          source={
            item.avatar
              ? { uri: item.avatar }
              : { uri: 'https://via.placeholder.com/80' } // placeholder tạm
          }
          style={styles.avatar}
        />
      </View>

      {/* Nội dung */}
      <View style={styles.textWrapper}>
        {/* Hàng trên: Tên + Thời gian */}
        <View style={styles.headerRow}>
          <Text
            style={[styles.name, isUnread && styles.nameUnread]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text style={styles.time} numberOfLines={1}>
            {item.time}
          </Text>
        </View>

        {/* Tin nhắn cuối + badge chưa đọc */}
        <View style={styles.messageRow}>
          <Text
            style={[styles.lastMessage, isUnread && styles.lastMessageUnread]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>

          {isUnread && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {item.unreadCount > 9 ? '9+' : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MessageScreen = ({ navigation }: Props) => {
  const handleOpenConversation = (item: Conversation) => {
    navigation.navigate('DetailMessage', { conversationId: item._id });
  };

  return (
    <FlatList
      data={conversations}
      keyExtractor={item => item._id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => (
        <MessageItem item={item} onPress={() => handleOpenConversation(item)} />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default MessageScreen;

const styles = StyleSheet.create({
  // Card 1 conversation
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  avatarWrapper: {
    marginRight: 12,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
  },

  textWrapper: {
    flex: 1,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },

  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },

  nameUnread: {
    fontWeight: '700',
  },

  time: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 8,
  },

  messageRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  lastMessage: {
    flex: 1,
    fontSize: 13,
    color: '#4B5563',
  },

  lastMessageUnread: {
    color: '#111827',
    fontWeight: '500',
  },

  badge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 4,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },

  badgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },

  listContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#F3F4F6',
  },
});
