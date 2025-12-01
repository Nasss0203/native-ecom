import { IOrderPayment, IOrderStatus } from '../types/order.type';
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

type OrderUpdate = {
  order_status?: IOrderStatus;
  order_payment?: IOrderPayment;
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
  return response.data;
};

export const getOrder = async (orderId: string) => {
  const response = await axios.get(`/order/${orderId}`, {});
  return response.data;
};

export const updateOrderByUser = async ({
  orderId,
  order_status,
}: {
  orderId: string;
  order_status: IOrderStatus;
}) => {
  const response = await axios.patch(`/order/update/${orderId}`, {
    order_status,
  });
  console.log('🚀 ~ response~updateOrderByUser', response);
  return response.data;
};
