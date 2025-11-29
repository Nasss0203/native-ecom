import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  AuthSession,
  clearSession,
  getSession,
} from '../../common/storage/authStorage';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const s = await getSession();
        setSession(s);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await clearSession();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Chưa login
  if (!session) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Bạn chưa đăng nhập</Text>
        <Text style={styles.subtitle}>
          Hãy đăng nhập để xem thông tin tài khoản.
        </Text>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => navigation.replace('SignIn')}
        >
          <Text style={styles.primaryText}>Đăng nhập ngay</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const firstLetter =
    session.email?.charAt(0).toUpperCase() ||
    session.userId?.charAt(0).toUpperCase() ||
    '?';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header avatar + tên */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{firstLetter}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>
            {session.username || session.email || 'Tài khoản'}
          </Text>
          <Text style={styles.email}>{session.email}</Text>
        </View>
      </View>

      {/* Nút logout */}
      <TouchableOpacity style={styles.dangerBtn} onPress={handleLogout}>
        <Text style={styles.dangerText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  center: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  email: {
    color: '#6b7280',
  },

  // card
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: {
    fontWeight: '600',
    marginBottom: 12,
    fontSize: 16,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#6b7280',
  },
  value: {
    fontWeight: '500',
    maxWidth: '60%',
    textAlign: 'right',
  },

  // roles
  rolesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#e0ebff',
  },
  roleText: {
    color: '#1d4ed8',
    fontSize: 12,
    fontWeight: '600',
  },

  // buttons
  primaryBtn: {
    marginTop: 16,
    borderRadius: 999,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },
  dangerBtn: {
    marginTop: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingVertical: 12,
    alignItems: 'center',
  },
  dangerText: {
    color: '#ef4444',
    fontWeight: '700',
  },

  title: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#6b7280', textAlign: 'center' },
});
