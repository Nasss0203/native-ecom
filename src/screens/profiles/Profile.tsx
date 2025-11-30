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

const MENU_ITEMS = [
  {
    key: 'changePassword',
    label: 'Change Password',
    color: '#2563EB',
    icon: '🔒',
    onPress: (navigation: Props['navigation']) => {
      // TODO: điều hướng màn đổi mật khẩu
      // navigation.navigate('ChangePassword');
    },
  },

  {
    key: 'refer',
    label: 'Refer Friends & Businesses',
    color: '#0EA5E9',
    icon: '👥',
    onPress: (navigation: Props['navigation']) => {},
  },
  {
    key: 'thirdParty',
    label: 'Third Party Application',
    color: '#A855F7',
    icon: '📱',
    onPress: (navigation: Props['navigation']) => {},
  },
  {
    key: 'faq',
    label: 'FAQ',
    color: '#22C55E',
    icon: '❓',
    onPress: (navigation: Props['navigation']) => {},
  },
  {
    key: 'contact',
    label: 'Contact us',
    color: '#10B981',
    icon: '📨',
    onPress: (navigation: Props['navigation']) => {},
  },
  {
    key: 'terms',
    label: 'Terms & Conditions',
    color: '#EC4899',
    icon: '📄',
    onPress: (navigation: Props['navigation']) => {},
  },
];

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
    session.username?.charAt(0).toUpperCase() ||
    session.userId?.charAt(0).toUpperCase() ||
    '?';

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Header avatar + tên */}
      <View style={styles.headerCard}>
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{firstLetter}</Text>
          </View>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.name}>
            {session.username || session.email || 'Tài khoản'}
          </Text>
          <Text style={styles.email}>{session.email}</Text>
        </View>
      </View>

      <View style={styles.menuCard}>
        {MENU_ITEMS.map(item => (
          <TouchableOpacity
            key={item.key}
            style={styles.menuItem}
            activeOpacity={0.8}
            onPress={() => item.onPress(navigation)}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
              <Text style={styles.iconText}>{item.icon}</Text>
            </View>

            <View style={styles.menuTextWrapper}>
              <Text style={styles.menuLabel}>{item.label}</Text>
            </View>

            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}

        {/* Logout row */}
        <TouchableOpacity
          style={[styles.menuItem, styles.logoutRow]}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#F97373' }]}>
            <Text style={styles.iconText}>⏻</Text>
          </View>
          <View style={styles.menuTextWrapper}>
            <Text style={[styles.menuLabel, styles.logoutText]}>Logout</Text>
          </View>
          <Text style={[styles.chevron, styles.logoutChevron]}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F3F4F6', // nền xám nhạt giống hình
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },

  center: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },

  // Header card
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  avatarWrapper: {
    marginRight: 12,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  email: {
    color: '#6B7280',
    marginBottom: 6,
  },
  editAccount: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },

  // Menu card
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 8,
    paddingHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  iconText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  menuTextWrapper: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  chevron: {
    fontSize: 20,
    color: '#9CA3AF',
  },

  // Logout row
  logoutRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E7EB',
    marginTop: 4,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
  },
  logoutChevron: {
    color: '#EF4444',
  },

  // Buttons (state chưa login)
  primaryBtn: {
    marginTop: 16,
    borderRadius: 999,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  primaryText: {
    color: '#fff',
    fontWeight: '700',
  },

  title: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  subtitle: { color: '#6b7280', textAlign: 'center' },
});
