import { IOrderStatus } from '../types/order.type';
import axios from './axios';

type OrderType = {
  cartId: string;
  userId: string;
  checkoutId: string;
  shopId: string;
  user_address: {
    street: string;
    city: string;
    country: string;
  };
};

export const createOrder = async ({
  userId,
  cartId,
  checkoutId,
  user_address,
  shopId,
}: OrderType) => {
  const response = await axios.post('/order/create', {
    userId,
    cartId,
    checkoutId,
    shopId,
    user_address,
  });
  console.log('🚀 ~ response~', response);
  return response.data;
};

export const getOrderByStatus = async (status: IOrderStatus) => {
  const response = await axios.get(`/order/status`, {
    params: {
      status,
    },
  });
  console.log('🚀 ~ response~', response);
  return response.data;
};
