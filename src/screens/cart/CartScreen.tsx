// CartScreen.tsx
import { IconOutline } from '@ant-design/icons-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { reviewCheckout } from '../../common/api/checkout';
import { useUser } from '../../hooks/auth/useUser';
import { useAddCart } from '../../hooks/cart/useCart';
import { RootStackParamList } from '../../navigation/RootNavigator';

type CartItem = {
  id: string; // dùng productId từ backend
  name: string;
  price: number;
  image: string;
  quantity: number;
  selected: boolean;
};

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

export default function CartScreen({ navigation, route }: Props) {
  const { dataListCart, updateCartItem, removeFromCart } = useAddCart();
  const { user } = useUser();
  const [items, setItems] = useState<CartItem[]>([]);

  // Khi dataListCart thay đổi -> map sang CartItem để hiển thị
  useEffect(() => {
    const cartProducts = (dataListCart as any)?.data?.cart_products ?? [];

    const mapped: CartItem[] = cartProducts.map((p: any) => ({
      id: p.productId,
      name: p.name,
      price: p.price,
      image: p.image,
      quantity: p.quantity,
      selected: true, // mặc định tick hết
    }));

    setItems(mapped);
  }, [dataListCart]);

  // tổng tiền các item đang chọn
  const totalPrice = useMemo(
    () =>
      items
        .filter(i => i.selected)
        .reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  const allSelected = items.length > 0 && items.every(i => i.selected);

  const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + 'đ';

  const handleIncrease = (id: string) => {
    setItems(prev =>
      prev.map(i => {
        if (i.id !== id) return i;

        const old_quantity = i.quantity;
        const new_quantity = i.quantity + 1;

        if (user?.userId) {
          updateCartItem({
            userId: user.userId,
            item_products: [
              {
                productId: i.id,
                quantity: new_quantity, // số lượng mới
                old_quantity, // số lượng cũ

                price: i.price,
              },
            ],
          });
        }

        return { ...i, quantity: new_quantity };
      }),
    );
  };

  const handleDecrease = (id: string) => {
    setItems(prev =>
      prev.map(i => {
        if (i.id !== id || i.quantity <= 1) return i;

        const old_quantity = i.quantity;
        const new_quantity = i.quantity - 1;

        if (user?.userId) {
          updateCartItem({
            userId: user.userId,
            item_products: [
              {
                productId: i.id,
                quantity: new_quantity,
                old_quantity,
                price: i.price,
              },
            ],
          });
        }

        return { ...i, quantity: new_quantity };
      }),
    );
  };

  const handleRemove = (id: string) => {
    if (user?.userId) {
      removeFromCart({
        userId: user.userId,
        productId: id,
      });
    }
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const toggleSelect = (id: string) => {
    setItems(prev =>
      prev.map(i => (i.id === id ? { ...i, selected: !i.selected } : i)),
    );
  };

  const toggleSelectAll = () => {
    setItems(prev => prev.map(i => ({ ...i, selected: !allSelected })));
  };

  const renderItem = ({ item }: { item: CartItem }) => (
    <TouchableOpacity
      activeOpacity={10}
      style={styles.cardContainer}
      onPress={() => toggleSelect(item.id)}
    >
      <View style={styles.itemCheckboxWrapper}>
        <View
          style={[styles.checkbox, item.selected && styles.checkboxChecked]}
        >
          {item.selected && <Text style={styles.checkboxTick}>✓</Text>}
        </View>
      </View>

      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.image} />

        <View style={styles.cardRight}>
          <Text style={styles.name} numberOfLines={2}>
            {item.name}
          </Text>

          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => handleDecrease(item.id)}
            >
              <Text style={styles.qtyText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.qtyNumber}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => handleIncrease(item.id)}
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.trashButton}
              onPress={() => handleRemove(item.id)}
            >
              <IconOutline
                name="close-circle"
                size={20}
                color="#DC0000"
                style={{ marginHorizontal: 8 }}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.price}>{formatCurrency(item.price)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const cartCheck = dataListCart?.data;

  const handleCheckout = async () => {
    const reviewCheck = await reviewCheckout({
      cartId: cartCheck?._id,
      userId: cartCheck?.cart_userId,
      shopId: cartCheck?.cart_shopId,
      order_ids: [
        {
          userId: cartCheck?.cart_userId,
          items_products: cartCheck?.cart_products,
        },
      ],
    });
    // TODO: điều hướng sang màn hình checkout, truyền selectedItems
    navigation.navigate('Checkout', { checkoutId: reviewCheck?.data?._id });
  };

  return (
    <>
      <FlatList
        data={items}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomLeft}
          onPress={toggleSelectAll}
          activeOpacity={0.8}
        >
          <View
            style={[styles.checkbox, allSelected && styles.checkboxChecked]}
          >
            {allSelected && <Text style={styles.checkboxTick}>✓</Text>}
          </View>
          <Text style={styles.bottomLabel}>Tất cả</Text>
        </TouchableOpacity>

        <View style={styles.bottomRight}>
          <Text style={styles.totalText}>{formatCurrency(totalPrice)}</Text>

          <TouchableOpacity
            style={styles.buyButton}
            onPress={handleCheckout}
            activeOpacity={0.9}
          >
            <Text style={styles.buyButtonText}>Mua hàng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const BORDER_RADIUS = 12;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  cardContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  itemCheckboxWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS,
    padding: 8,
    elevation: 1,
  },
  image: {
    width: 60,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: 'contain',
  },
  cardRight: {
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    fontSize: 18,
    lineHeight: 18,
  },
  qtyNumber: {
    width: 32,
    textAlign: 'center',
    fontSize: 14,
  },
  trashButton: {
    marginLeft: 'auto',
    paddingHorizontal: 6,
  },
  trashText: {
    fontSize: 16,
  },
  price: {
    marginTop: 4,
    fontSize: 15,
    fontWeight: '600',
  },
  bottomBar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#ddd',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1.2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  checkboxTick: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  bottomLabel: {
    marginLeft: 6,
    fontSize: 14,
  },
  bottomRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  totalText: {
    color: '#FF3B30',
    fontWeight: '600',
    marginRight: 8,
  },
  buyButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#007bff',
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
});
