import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import {
  AuthSession,
  clearSession,
  getSession,
} from '../../common/storage/authStorage';

export function useUser() {
  const [user, setUser] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<any>();

  // Lấy session từ AsyncStorage
  const loadUser = useCallback(async () => {
    setLoading(true);
    const session = await getSession();
    setUser(session);
    setLoading(false);
  }, []);

  // Chạy 1 lần khi mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Logout
  const logout = async () => {
    await clearSession();
    setUser(null);
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  return {
    user,
    loading,
    refresh: loadUser, // nếu cần reload user sau login/register
    logout,
    isLoggedIn: !!user,
  };
}
