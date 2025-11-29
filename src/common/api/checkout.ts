import axios from './axios';

type ProductCheckout = {
  id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderCheckout = {
  userId?: string;
  shop_discounts?: any;
  items_products?: ProductCheckout[];
};

type CheckoutType = {
  cartId?: string;
  userId?: string;
  shopId?: string;
  order_ids?: OrderCheckout[];
};

export const reviewCheckout = async ({
  userId,
  cartId,
  order_ids,
  shopId,
}: CheckoutType) => {
  const response = await axios.post('/checkout/review', {
    shopId,
    userId,
    cartId,
    order_ids,
  });
  console.log('🚀 ~ response~', response);
  return response.data;
};

export const getCheckout = async (id: string) => {
  const response = await axios.get(`/checkout/${id}`);
  return response.data;
};
