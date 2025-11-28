import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import {
  Image,
  LayoutChangeEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import RenderHTML from 'react-native-render-html';
import { getDetailProduct } from '../../common/api/product.api';
import { QueryKey } from '../../const/queryKey';
import { useUser } from '../../hooks/auth/useUser';
import { useAddCart } from '../../hooks/cart/useCart';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'DetailProduct'>;
const MAX_HEIGHT = 180; // ~ 6–10 dòng, tuỳ font anh chỉnh

export default function DetailProduct({ route, navigation }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const { user } = useUser();

  const onHTMLLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height;
    setContentHeight(height);
  };
  const { width } = useWindowDimensions();
  const { productId } = route.params;

  const { data, status } = useQuery({
    queryKey: [QueryKey.PRODUCTS, productId],
    queryFn: () => getDetailProduct(productId),
  });

  const products = data?.data; // tuỳ backend

  const { addToCart } = useAddCart();

  if (status === 'pending') {
    return (
      <View style={styles.center}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (!products) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy sản phẩm</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{ uri: products.product_thumb }} style={styles.image} />

        <View style={styles.card}>
          <Text style={styles.price}>
            {products.product_price.toLocaleString('vi-VN')} đ
          </Text>
          <Text style={styles.name}>{products.product_name}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
          <View
            style={{
              overflow: 'hidden',
              maxHeight: isExpanded ? undefined : MAX_HEIGHT,
            }}
          >
            <View onLayout={onHTMLLayout}>
              <RenderHTML
                contentWidth={width}
                source={{ html: products.product_description || '' }}
              />
            </View>
          </View>

          {contentHeight > MAX_HEIGHT && (
            <Text
              style={styles.seeMore}
              onPress={() => setIsExpanded(prev => !prev)}
            >
              {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.addButton]}
          onPress={() =>
            addToCart({
              products: {
                productId: products._id,
                quantity: 1,
                name: products.product_name,
                image: products.product_thumb,
                price: products.product_price,
              },
              userId: user?.userId as any,
              shopId: products.product_auth,
            })
          }
          // disabled={isPending}
        >
          <Text style={styles.addButtonText}>Thêm sản phẩm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  image: { width: '100%', height: 320, resizeMode: 'cover' },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 8,
    padding: 12,
  },
  price: { color: '#e53935', fontSize: 20, fontWeight: '700' },
  name: { marginTop: 4, fontSize: 16, fontWeight: '600' },
  sectionTitle: { fontWeight: '600', marginBottom: 8 },
  description: { fontSize: 14, color: '#444', lineHeight: 20 },
  bottomBar: {
    padding: 12,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  seeMore: {
    marginTop: 8,
    color: '#1E88E5',
    fontWeight: '600',
    textAlign: 'center',
  },
});
