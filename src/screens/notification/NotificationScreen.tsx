import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Notification'>;

const items = [
  {
    _id: '1',
    image: '',
    title: 'Đơn hàng #1234 đã được xác nhận',
    description:
      'Cảm ơn bạn đã đặt hàng, chúng tôi đang chuẩn bị để giao cho bạn.',
    time: '2 giờ trước',
  },
  {
    _id: '2',
    image: '',
    title: 'Khuyến mãi 11.11',
    description: 'Giảm đến 50% cho tất cả sản phẩm trong hôm nay.',
    time: 'Hôm nay',
  },
];

const NotificationItem = ({ item }: { item: (typeof items)[number] }) => {
  return (
    <View style={styles.card}>
      <View style={styles.avatarWrapper}>
        <Image
          source={
            {
              uri: item.image,
            }
            // hoặc icon tạm
          }
          style={styles.avatar}
        />
      </View>

      {/* Nội dung */}
      <View style={styles.textWrapper}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title || 'Tiêu đề thông báo'}
          </Text>
          {item.time ? (
            <Text style={styles.time} numberOfLines={1}>
              {item.time}
            </Text>
          ) : null}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description ||
            'Mô tả ngắn gọn nội dung thông báo sẽ hiển thị tại đây.'}
        </Text>
      </View>
    </View>
  );
};

const NotificationScreen = ({ navigation, route }: Props) => {
  return (
    <FlatList
      data={items}
      keyExtractor={item => item._id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => <NotificationItem item={item} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  // Card thông báo
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 8,

    // Shadow iOS
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    // Shadow Android
    elevation: 2,
  },

  avatarWrapper: {
    marginRight: 12,
  },

  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E5E7EB', // xám nhạt cho placeholder
  },

  textWrapper: {
    flex: 1,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },

  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  time: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 8,
  },

  description: {
    marginTop: 4,
    fontSize: 12,
    color: '#4B5563',
  },

  // List
  listContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#F3F4F6',
  },
});
