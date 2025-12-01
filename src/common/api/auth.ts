import { LoginFormValues } from '../../validation/auth';
import { AuthSession, clearSession } from '../storage/authStorage';
import axios from './axios';

export const register = async ({ email, username, password }: any) => {
  const response = await axios.post('/auth/register', {
    email,
    username,
    password,
  });
  const data = response.data;
  return data;
};

export const login = async ({
  email,
  password,
}: LoginFormValues): Promise<AuthSession> => {
  const response = await axios.post('/auth/login', {
    email,
    password,
  });

  const data = response.data.data;

  return {
    access_token: data.tokens.access_token,
    refresh_token: data.tokens.refresh_token,
    username: data.username,
    userId: data._id,
    email: data.email,
    roles: data.roles,
    shopId: data.shop_id,
  };
};

export const logoutService = async () => {
  try {
    await axios.post('/auth/logout');
  } catch (err) {
    console.warn('Logout API failed, continue clearing session locally.');
  } finally {
    await clearSession(); // luôn xoá local session
  }
};
