// src/components/product/ProductCard.tsx
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type Props = {
  item: Product;
  onPress?: () => void;
  rest?: any;
};

export default function CardProduct({ item, onPress, ...rest }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.card}
      onPress={onPress}
      {...rest}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Tên sản phẩm: không set height, để tự giãn */}
      <Text style={styles.name} numberOfLines={2}>
        {item.name}
      </Text>

      <Text style={styles.price}>{item.price.toLocaleString('vi-VN')}đ</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%', // 2 cột
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
    marginHorizontal: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 6,
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: '#222',
    minHeight: 36,
  },
  price: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '700',
    color: '#d0021b',
  },
});
