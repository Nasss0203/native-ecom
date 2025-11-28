// src/screens/home/HomeHeader.tsx
import { IconOutline } from '@ant-design/icons-react-native';
import type { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useAddCart } from '../../hooks/cart/useCart';

const CATEGORIES = [
  {
    key: 'profile',
    title: 'Tài khoản',
    route: 'Profile',
    params: { userId: '42' },
  },
  // { key: 'signin', title: 'Đăng nhập', route: 'SignIn' },
];

export default function HomeHeader({ navigation }: NativeStackHeaderProps) {
  const [query, setQuery] = useState('');
  const { dataListCart } = useAddCart();

  const onSubmitSearch = () => {
    if (!query.trim()) return;
    navigation.navigate('Search', { q: query.trim() });
  };

  return (
    <SafeAreaView edges={['top']} style={{ backgroundColor: 'transparent' }}>
      <LinearGradient
        colors={['#001BB7', '#0046FF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.container}
      >
        {/* Hàng trên: Search + Cart */}
        <View style={styles.topRow}>
          <View style={[styles.searchWrap, { marginRight: 12 }]}>
            <Icon
              name="search"
              size={18}
              color="#a7b4ff"
              style={{ marginHorizontal: 8 }}
            />
            <TextInput
              placeholder="Tìm kiếm sản phẩm..."
              placeholderTextColor="#cfe1ff"
              style={styles.input}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              onSubmitEditing={onSubmitSearch}
            />
            {!!query && (
              <Pressable
                onPress={() => setQuery('')}
                style={{ paddingHorizontal: 8 }}
              >
                <IconOutline name="shopping-cart" size={24} />;
              </Pressable>
            )}
          </View>

          <Pressable
            style={styles.cartBtn}
            onPress={() => navigation.navigate('Cart' as never)}
          >
            <IconOutline name="shopping-cart" size={24} />;
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {dataListCart?.data?.cart_products?.length || 0}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Hàng dưới: scroll ngang chuyển trang */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContent}
        >
          {CATEGORIES.map(c => (
            <Pressable
              key={c.key}
              style={({ pressed }) => [
                styles.tabItem,
                pressed && { opacity: 0.85 },
              ]}
              onPress={() =>
                navigation.navigate(c.route as any, c.params as never)
              }
            >
              <Text style={styles.tabText}>{c.title}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 12 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  cartBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#ff5b5b',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  searchWrap: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { flex: 1, color: '#ffffff', fontSize: 14, paddingVertical: 8 },
  tabsContent: { paddingTop: 12, paddingRight: 4 },
  tabItem: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginRight: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  tabText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
