import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function SkeletonCardProduct() {
  return (
    <View style={styles.card}>
      {/* ảnh */}
      <View style={styles.image} />

      {/* tên */}
      <View style={styles.lineShort} />
      <View style={styles.lineLong} />

      {/* giá */}
      <View style={styles.price} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    marginBottom: 10,
    marginHorizontal: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#E5E7EB',
  },
  lineShort: {
    width: '60%',
    height: 10,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    marginBottom: 6,
  },
  lineLong: {
    width: '90%',
    height: 10,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    marginBottom: 10,
  },
  price: {
    width: '50%',
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
});
