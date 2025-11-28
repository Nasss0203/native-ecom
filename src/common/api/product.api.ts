import axios from './axios';

export const findAllProduct = async ({
  limit,
  page = 1,
  query,
  filter,
}: any) => {
  try {
    const response = await axios.get('/products', {
      params: {
        limit,
        page,
        ...query,
        ...filter,
      },
    });
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const getDetailProduct = async (id: string) => {
  const response = await axios.get(`/products/${id}`);

  return response.data;
};
