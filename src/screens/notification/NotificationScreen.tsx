// src/screens/notification/NotificationScreen.tsx
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import {
  fetchNotifications,
  NotificationItemDto,
} from '../../common/api/notification';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Notification'>;

const NotificationItem = ({ item }: { item: NotificationItemDto }) => {
  return (
    <View style={styles.card}>
      <View style={styles.avatarWrapper}>
        <Image
          source={{ uri: 'https://via.placeholder.com/44x44.png?text=OD' }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.textWrapper}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.time} numberOfLines={1}>
            {/* tạm thời, sau muốn thì format createdAt */}
            {new Date(item.createdAt).toLocaleTimeString('vi-VN')}
          </Text>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.message}
        </Text>
      </View>
    </View>
  );
};

const NotificationScreen = ({ navigation }: Props) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchNotifications({ page: 1, limit: 50 }),
  });

  const notifications = data?.items ?? [];
  console.log('🚀 ~ notifications~', notifications);

  if (isLoading) {
    return (
      <View style={[styles.listContent, { justifyContent: 'center' }]}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (!notifications.length) {
    return (
      <View style={[styles.listContent, { justifyContent: 'center' }]}>
        <Text>Chưa có thông báo nào</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={notifications}
      keyExtractor={item => item._id}
      contentContainerStyle={styles.listContent}
      renderItem={({ item }) => <NotificationItem item={item} />}
      showsVerticalScrollIndicator={false}
      refreshing={isLoading}
      onRefresh={refetch}
    />
  );
};

export default NotificationScreen;

// ... styles giữ nguyên như bạn đang có

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
