// src/storage/authStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_KEY = 'auth_session';

export type AuthSession = {
  username: string;
  access_token: string;
  refresh_token?: string;
  userId: string;
  email: string;
  roles: string[];
  shopId?: string;
};

export async function saveSession(session: AuthSession) {
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

export async function getSession(): Promise<AuthSession | null> {
  const raw = await AsyncStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export async function clearSession() {
  await AsyncStorage.removeItem(AUTH_KEY);
}
