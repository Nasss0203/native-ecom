// src/hooks/useOrders.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrderByStatus, updateOrderByUser } from '../../common/api/order';
import { IOrderStatus, OrderItem } from '../../common/types/order.type';

type UseOrdersResult = {
  orders: OrderItem[];
  isLoading: boolean;
  isError: boolean;
  cancelOrder: (orderId: string) => void;
  isCancelling: boolean;
  isSuc: boolean;
};

export function useOrders(activeTab: IOrderStatus): UseOrdersResult {
  const queryClient = useQueryClient();

  // Query: lấy orders theo status (activeTab)
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['order', activeTab],
    queryFn: async () => {
      const res = await getOrderByStatus(activeTab);
      return res?.data ?? [];
    },
  });

  // Mutation: hủy đơn
  const {
    mutate: cancelOrder,
    isPending: isCancelling,
    isSuccess: isSuc,
  } = useMutation({
    mutationFn: async ({ orderId }: { orderId: string }) =>
      updateOrderByUser({
        orderId,
        order_status: IOrderStatus.CANCELLED,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', activeTab] });
      isSuc === true;
    },

    onError: err => {
      console.error('Cancel order error:', err);
    },
  });

  return {
    orders,
    isLoading,
    isError,
    cancelOrder: (orderId: string) => cancelOrder({ orderId }),
    isCancelling,
    isSuc,
  };
}
