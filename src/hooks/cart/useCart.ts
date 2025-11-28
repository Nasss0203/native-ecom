import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addCart,
  deleteCart,
  getListCart,
  updateCart,
} from '../../common/api/cart';
import { useUser } from '../auth/useUser';

type UpdateItem = {
  quantity: number;
  price: number;
  old_quantity: number;
  productId: string;
};

type CartProduct = any; // TODO: khai báo type đúng
type CartData = {
  _id: string;
  cart_shopId: string;
  cart_state: string;
  cart_userId: string;
  cart_count_product: number;
  cart_products: CartProduct[];
};

type CartResponse = {
  statusCode: number;
  message: string;
  data: CartData;
};

export function useAddCart() {
  const queryClient = useQueryClient();
  const { user } = useUser();

  const cartKey = ['cart', user?.userId];

  // 1. Lấy giỏ hàng
  const {
    isPending: isPendingListCart,
    data: dataListCart,
    error: listCartError,
  } = useQuery<CartResponse>({
    queryKey: cartKey,
    enabled: !!user?.userId,
    queryFn: () => getListCart(), // nếu API cần userId thì truyền vào đây
  });

  // 2. Thêm vào giỏ (optimistic update)
  const {
    mutate: addToCart,
    error: addError,
    isPending: isAddingCart,
  } = useMutation({
    mutationFn: async ({
      userId,
      products,
      shopId,
    }: {
      userId: string;
      products: CartProduct; // 1 sản phẩm
      shopId: string;
    }) => addCart({ userId, products, shopId }),

    onMutate: async ({ products }) => {
      if (!user?.userId) return;

      await queryClient.cancelQueries({ queryKey: cartKey });

      const previousCart = queryClient.getQueryData<CartResponse>(cartKey);

      // không có dữ liệu cũ thì thôi, để server trả về
      if (!previousCart) {
        return { previousCart };
      }

      queryClient.setQueryData<CartResponse>(cartKey, old => {
        if (!old) return old;

        const prevProducts = old.data.cart_products ?? [];
        const nextProducts = [...prevProducts, products];

        return {
          ...old,
          data: {
            ...old.data,
            cart_products: nextProducts,
            cart_count_product: nextProducts.length,
          },
        };
      });

      return { previousCart };
    },

    onError: (_err, _vars, context) => {
      if (!user?.userId) return;
      if (context?.previousCart) {
        queryClient.setQueryData(cartKey, context.previousCart);
      }
    },

    onSettled: () => {
      if (!user?.userId) return;
      queryClient.invalidateQueries({ queryKey: cartKey });
    },
  });

  // 3. Cập nhật item
  const {
    mutate: updateCartItem,
    error: updateError,
    isPending: isUpdatingCart,
  } = useMutation({
    mutationFn: async ({
      userId,
      item_products,
    }: {
      userId: string;
      item_products: UpdateItem[];
    }) =>
      updateCart({
        userId,
        item_products,
      }),

    onSuccess: () => {
      if (!user?.userId) return;
      queryClient.invalidateQueries({ queryKey: cartKey });
    },

    onError: err => {
      console.error('Update cart error:', err);
    },
  });

  // 4. Xoá item
  const {
    mutate: removeFromCart,
    error: deleteError,
    isPending: isDeletingCart,
  } = useMutation({
    mutationFn: async ({
      userId,
      productId,
    }: {
      userId: string;
      productId: string;
    }) => deleteCart({ userId, productId }),

    onSuccess: () => {
      if (!user?.userId) return;
      queryClient.invalidateQueries({ queryKey: cartKey });
    },

    onError: err => {
      console.error('Delete cart error:', err);
    },
  });

  return {
    dataListCart, // response đầy đủ
    cart: dataListCart?.data, // tiện đọc trong UI
    isPendingListCart,
    listCartError,

    addToCart,
    isAddingCart,
    addError,

    updateCartItem,
    isUpdatingCart,
    updateError,

    removeFromCart,
    isDeletingCart,
    deleteError,
  };
}
