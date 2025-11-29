// CheckoutScreen.tsx
import { IconOutline } from '@ant-design/icons-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getCheckout } from '../../common/api/checkout';
import { createOrder } from '../../common/api/order';
import { RootStackParamList } from '../../navigation/RootNavigator';

type PaymentMethod = 'cod' | 'momo' | 'zalopay';
type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;
export const CheckoutScreen = ({ route, navigation }: Props) => {
  const { checkoutId } = route.params;
  console.log('🚀 ~ checkoutId~', checkoutId);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  const [checkout, setCheckout] = useState<any>();
  console.log('🚀 ~ checkout~', checkout);

  useEffect(() => {
    const fetchCheckout = async () => {
      const data = await getCheckout(checkoutId);

      setCheckout(data);
    };

    fetchCheckout();
  }, [checkoutId]);

  const productCheck = checkout?.data?.checkout_items;
  const orderCheck = checkout?.data;
  console.log('🚀 ~ productCheck~', productCheck);
  const handlePay = async () => {
    const res = await createOrder({
      cartId: orderCheck.checkout_cart,
      checkoutId: orderCheck._id,
      shopId: orderCheck.checkout_shopId,
      userId: orderCheck.checkout_auth,
      user_address: {
        street: '123 Dong Hung Thuan',
        city: 'Ho Chi Minh',
        country: 'Viet Nam',
      },
    });

    navigation.navigate('OrderThank');

    return res;
  };
  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Thông tin người nhận */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>NGUYEN ANH NAM</Text>
              <Text style={styles.phone}> (+84) 876543210</Text>
              <Text style={styles.address}>
                128 Hồng Bàng, Phường Chợ Lớn, TP.HCM
              </Text>
            </View>
            {/* icon mũi tên / chỉnh sửa nếu cần */}
            <IconOutline name="arrow-right" size={20}></IconOutline>
          </View>
        </View>

        {/* Sản phẩm */}

        {productCheck?.length > 0 ? (
          <>
            {productCheck.map((item: any) => (
              <View style={styles.card} key={item.productId}>
                <View style={styles.productRow}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.productName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.productQty}>
                      Số lượng: {item.quantity}
                    </Text>
                    <Text style={styles.productPrice}>
                      {item.totalPrice.toLocaleString('vi-VN')} ₫
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        ) : null}

        {/* Phương thức thanh toán */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

          <RadioRow
            label="Thanh toán khi nhận hàng"
            selected={paymentMethod === 'cod'}
            onPress={() => setPaymentMethod('cod')}
          />
          <RadioRow
            label="MoMo"
            selected={paymentMethod === 'momo'}
            onPress={() => setPaymentMethod('momo')}
          />
          <RadioRow
            label="ZaloPay"
            selected={paymentMethod === 'zalopay'}
            onPress={() => setPaymentMethod('zalopay')}
          />
        </View>

        {/* Chi tiết thanh toán */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>

          <Row
            label="Tổng tiền hàng"
            value={`${checkout?.data?.checkout_totalPrice.toLocaleString(
              'vi-VN',
            )} ₫`}
          />
          <Row label="Tổng tiền phí vận chuyển" value="0 ₫" />
          <Row label="Giảm giá phí vận chuyển" value="0 ₫" />
          <Row label="Tổng cộng Voucher giảm giá" value="0 ₫" />

          <View style={styles.divider} />

          <Row
            label="Tổng cộng"
            value={`${checkout?.data?.checkout_grandTotal.toLocaleString(
              'vi-VN',
            )} ₫`}
            bold
          />
        </View>
      </ScrollView>

      {/* Thanh dưới cùng */}
      <View style={styles.bottomBar}>
        <View style={{ flex: 1 }}>
          <Text style={styles.bottomLabel}>Tổng tiền:</Text>
          <Text
            style={styles.bottomTotal}
          >{`${checkout?.data?.checkout_grandTotal.toLocaleString(
            'vi-VN',
          )} ₫`}</Text>
        </View>
        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payButtonText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

type RadioRowProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

const RadioRow: React.FC<RadioRowProps> = ({ label, selected, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.radioRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.radioOuter}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Text style={styles.radioLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

type RowProps = {
  label: string;
  value: string;
  bold?: boolean;
};

const Row: React.FC<RowProps> = ({ label, value, bold }) => {
  return (
    <View style={styles.rowBetween}>
      <Text style={[styles.rowLabel, bold && styles.rowLabelBold]}>
        {label}
      </Text>
      <Text style={[styles.rowValue, bold && styles.rowValueBold]}>
        {value}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  root: {
    flex: 1,
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 4,
    paddingTop: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  name: {
    fontWeight: '700',
    fontSize: 14,
    color: '#111827',
  },
  phone: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
  address: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
  },
  chevron: {
    fontSize: 20,
    color: '#9CA3AF',
    paddingHorizontal: 4,
  },
  productRow: {
    flexDirection: 'row',
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  productQty: {
    marginTop: 4,
    fontSize: 12,
    color: '#6B7280',
  },
  productPrice: {
    marginTop: 6,
    fontSize: 14,
    color: '#111827',
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
    color: '#111827',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  radioLabel: {
    fontSize: 13,
    color: '#111827',
  },
  rowLabel: {
    fontSize: 13,
    color: '#4B5563',
  },
  rowLabelBold: {
    fontWeight: '700',
    color: '#111827',
  },
  rowValue: {
    fontSize: 13,
    color: '#111827',
  },
  rowValueBold: {
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  bottomLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  bottomTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 2,
  },
  payButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#2563EB',
  },
  payButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default CheckoutScreen;
