// src/common/api/notification.api.ts
import axios from './axios';

export type NotificationItemDto = {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  data?: {
    orderId?: string;
    status?: string;
    total?: number;
    tracking?: string;
  };
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NotificationListResponse = {
  items: NotificationItemDto[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
};

export const fetchNotifications = async ({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
}): Promise<NotificationListResponse> => {
  const res = await axios.get('/notifications', {
    params: { page, limit },
  });

  // res.data = { statusCode, message, data: { items, total, page, limit, success } }
  return res.data.data; // <-- lấy đúng "data" bên trong
};
