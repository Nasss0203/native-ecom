// src/hooks/useRealtimeNotifications.ts
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import Toast from 'react-native-toast-message';
import io, { Socket } from 'socket.io-client';
import { getSession } from '../../common/storage/authStorage';

const SOCKET_URL = 'https://8257b1da1d72.ngrok-free.app';

export function useRealtimeNotifications() {
  const socketRef = useRef<Socket | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const setup = async () => {
      const session = await getSession();
      if (!session?.userId) {
        console.log('[WS] No session → skip websocket');
        return;
      }

      const socket = io(SOCKET_URL, {
        transports: ['websocket'],
        forceNew: true,
        query: {
          userId: session.userId,
        },
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        console.log('[WS] Connected:', socket.id);
      });

      socket.on('disconnect', () => {
        console.log('[WS] Disconnected');
      });

      // ======== LẮNG NGHE TOÀN BỘ EVENT ========
      socket.on('notification', payload => {
        console.log('[WS] Event:', payload);

        // ---------------------------------------------------
        // 1) THÔNG BÁO ĐẶT HÀNG / HỆ THỐNG
        // ---------------------------------------------------
        if (payload.type === 'ORDER_CREATED') {
          Toast.show({
            type: 'success',
            text1: payload.title,
            text2: payload.message,
          });

          // reload danh sách notification
          queryClient.invalidateQueries({ queryKey: ['notifications'] });
        }

        // ---------------------------------------------------
        // 2) TIN NHẮN CHAT REALTIME
        // ---------------------------------------------------
        if (payload.type === 'CHAT_MESSAGE') {
          const { orderId, text, senderType } = payload;

          // 2.1 – Hiện toast khi có tin nhắn mới
          if (senderType === 'SHOP') {
            Toast.show({
              type: 'info',
              text1: 'Tin nhắn từ shop',
              text2: text,
            });
          }

          // 2.2 – Refresh dữ liệu chat cho đúng order
          queryClient.invalidateQueries({
            queryKey: ['chat-messages', orderId],
          });
        }
      });
    };

    setup();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [queryClient]);
}
