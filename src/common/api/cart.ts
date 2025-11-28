import axios from './axios';
export const addCart = async ({
  userId,
  products = {},
  shopId,
}: {
  userId: string;
  products: object;
  shopId: string;
}) => {
  const response = await axios.post('/cart', {
    userId,
    shopId,
    products,
  });
  return response.data;
};

export const updateCart = async ({
  userId,
  item_products = {},
}: {
  userId: string;
  item_products: object;
}) => {
  const response = await axios.post('/cart/update', {
    userId,
    item_products,
  });
  return response.data;
};

export const getListCart = async () => {
  const response = await axios.get('/cart', {});
  return response.data;
};

export const deleteCart = async ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  const response = await axios.delete('/cart', {
    data: { userId, productId },
  });
  return response.data;
};
