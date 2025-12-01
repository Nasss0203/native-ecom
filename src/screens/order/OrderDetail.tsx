import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  IOrderStatus,
  mapStatusButton,
  mapStatusLabel,
} from '../../common/types/order.type';
import { useOrders } from '../../hooks/orders/useOrder';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderDetail'>;

const OrderDetailScreen = ({ route, navigation }: Props) => {
  const { order } = route.params;

  const statuCancel =
    order.order_status === IOrderStatus.PENDING ||
    order.order_status === IOrderStatus.CONFIRMED
      ? 'center'
      : 'flex-end';

  const createdAtText = order.createdAt
    ? new Date(order.createdAt).toLocaleString('vi-VN')
    : '';

  const subtotal = order.order_checkout?.totalPrice ?? 0;
  const discount = order.order_checkout?.totalApplyDiscount ?? 0;
  const shippingFee = order.order_checkout?.feeShip ?? 0;
  const grandTotal = order.order_checkout?.grandTotal ?? 0;

  const { cancelOrder, isCancelling, isSuc } = useOrders(order.order_status);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Đơn hàng #${order._id.slice(-6)}`,
    });
  }, [navigation, order._id]);

  if (isSuc) {
    navigation.navigate('Order');
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* THÔNG TIN CHUNG */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin đơn hàng</Text>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Mã đơn:</Text>
          <Text style={styles.value}>{order._id}</Text>
        </View>

        {!!createdAtText && (
          <View style={styles.rowBetween}>
            <Text style={styles.label}>Ngày đặt:</Text>
            <Text style={styles.value}>{createdAtText}</Text>
          </View>
        )}

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Trạng thái đơn:</Text>
          <Text style={[styles.value, styles.bold]}>
            {mapStatusLabel(order.order_status)}
          </Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Thanh toán:</Text>
          <Text style={styles.value}>{order.order_payment}</Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Mã vận đơn:</Text>
          <Text style={styles.value}>{order.order_tracking || 'Chưa có'}</Text>
        </View>
      </View>

      {/* SẢN PHẨM */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sản phẩm</Text>

        {order.order_products.map((item: any, index: any) => (
          <View key={index} style={styles.productRow}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.productMeta}>Số lượng: {item.quantity}</Text>
              <Text style={styles.productMeta}>
                Đơn giá: {item.price.toLocaleString()} ₫
              </Text>
              {item.discount > 0 && (
                <Text style={styles.productMeta}>
                  Giảm giá: {item.discount.toLocaleString()} ₫
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* TÓM TẮT THANH TOÁN */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thanh toán</Text>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Tạm tính:</Text>
          <Text style={styles.value}>{subtotal.toLocaleString()} ₫</Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Tổng giảm giá:</Text>
          <Text style={styles.value}>
            {discount > 0 ? `- ${discount.toLocaleString()} ₫` : '0 ₫'}
          </Text>
        </View>

        <View style={styles.rowBetween}>
          <Text style={styles.label}>Phí vận chuyển:</Text>
          <Text style={styles.value}>{shippingFee.toLocaleString()} ₫</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.rowBetween}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalValue}>{grandTotal.toLocaleString()} ₫</Text>
        </View>
      </View>

      {/* THÔNG TIN GIAO HÀNG */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>

        <View style={{ marginTop: 4 }}>
          <Text style={styles.label}>Địa chỉ:</Text>
          <Text style={styles.value}>{order.order_shipping.street}</Text>
          <Text style={styles.value}>
            {order.order_shipping.city}, {order.order_shipping.country}
          </Text>
        </View>
      </View>

      <View
        style={
          (styles.section,
          {
            flexDirection: 'row',
            justifyContent: statuCancel as any,
            alignItems: 'center',
            gap: 8,
            padding: 12,
            borderRadius: 12,
            backgroundColor: '#FFF',
          })
        }
      >
        {order.order_status === IOrderStatus.PENDING ||
        order.order_status === IOrderStatus.CONFIRMED ? (
          <TouchableOpacity
            style={styles.statusCancel}
            onPress={() => cancelOrder(order._id)}
            disabled={isCancelling}
          >
            <Text style={styles.statusCancelText}>
              {isCancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
            </Text>
          </TouchableOpacity>
        ) : null}

        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>
            {mapStatusButton(order.order_status)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default OrderDetailScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 12,
    paddingBottom: 24,
  },

  section: {
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: '#FFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  label: {
    fontSize: 14,
    color: '#555',
  },
  value: {
    fontSize: 14,
    color: '#111',
  },
  bold: {
    fontWeight: '600',
  },

  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    width: '48%',
    borderColor: '#1E88E5',
  },
  statusBadgeText: {
    fontSize: 12,
    color: '#1E88E5',
    textAlign: 'center',
    fontWeight: '600',
  },

  statusCancel: {
    alignSelf: 'flex-start',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    width: '48%',
    borderColor: '#e41212',
  },
  statusCancelText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#e41212',
    fontWeight: '600',
  },

  productRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  productInfo: {
    flex: 1,
    marginLeft: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
  },
  productMeta: {
    fontSize: 12,
    marginTop: 2,
    color: '#666',
  },
  productPrice: {
    marginTop: 4,
    fontWeight: '700',
    fontSize: 14,
  },

  divider: {
    marginVertical: 8,
    height: 1,
    backgroundColor: '#EEE',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#D32F2F',
  },
});
