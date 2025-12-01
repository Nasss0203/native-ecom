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
import { Button, Dialog, Modal, Paragraph, Portal } from 'react-native-paper';
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
  const [loginDialogVisible, setLoginDialogVisible] = useState(false);
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

  const products = data?.data;

  const { addToCart, addSuccess, resetAddSuccess } = useAddCart();

  if (status === 'pending') {
    return (
      <View style={styles.center}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  const handleAddCart = () => {
    if (!user?.userId) {
      setLoginDialogVisible(true);
      return;
    }
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
    });
    setTimeout(() => resetAddSuccess(), 1500);
  };

  const goToLogin = () => {
    setLoginDialogVisible(false);
    navigation.navigate('SignIn'); // đổi tên screen nếu bạn đặt khác
  };

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
        <TouchableOpacity style={[styles.addButton]} onPress={handleAddCart}>
          <Text style={styles.addButtonText}>Thêm sản phẩm</Text>
        </TouchableOpacity>

        <Portal>
          <Modal
            visible={addSuccess}
            onDismiss={resetAddSuccess}
            style={styles.modalBackground}
            contentContainerStyle={styles.modalContainer}
          >
            <Text style={styles.modalText}>Đã thêm vào giỏ hàng</Text>
          </Modal>
        </Portal>

        <Portal>
          <Dialog
            visible={loginDialogVisible}
            onDismiss={() => setLoginDialogVisible(false)}
            style={styles.dialogContainer}
          >
            <Dialog.Title style={styles.dialogTitle}>
              Yêu cầu đăng nhập
            </Dialog.Title>

            <Dialog.Content style={styles.dialogContent}>
              <Paragraph style={styles.dialogText}>
                Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.
              </Paragraph>
            </Dialog.Content>

            <Dialog.Actions style={styles.dialogActions}>
              <Button
                mode="text"
                onPress={() => setLoginDialogVisible(false)}
                style={styles.buttonCancel}
                textColor="#000000" // xám nhạt
              >
                Để sau
              </Button>

              <Button
                mode="contained"
                onPress={goToLogin}
                style={styles.loginButton}
                labelStyle={styles.loginButtonLabel}
              >
                Đăng nhập
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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

  modalBackground: {},

  modalContainer: {
    backgroundColor: 'white', // giữ nguyên, không mờ
    padding: 24,
    marginHorizontal: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalText: {
    fontSize: 16,
    textAlign: 'center',
  },

  dialogContainer: {
    borderRadius: 16,
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  dialogTitle: {
    textAlign: 'center',
    color: '#131922',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: -8,
  },

  dialogContent: {
    marginTop: 4,
    marginBottom: 4,
  },

  dialogText: {
    textAlign: 'center',
    fontSize: 15,
    color: '#131922',
  },

  dialogActions: {
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 6,
    marginTop: 4,
  },

  loginButton: {
    borderRadius: 8,
    backgroundColor: '#2563EB',
    width: '50%',
  },

  buttonCancel: { borderRadius: 8, backgroundColor: '#c4c5c5', width: '50%' },

  loginButtonLabel: {
    color: 'white',
    fontWeight: '600',
  },
});
