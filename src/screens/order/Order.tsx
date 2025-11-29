import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getOrderByStatus } from '../../common/api/order';
import {
  IOrderStatus,
  mapStatusButton,
  mapStatusLabel,
  OrderItem,
  TABS,
} from '../../common/types/order.type';
import { RootStackParamList } from '../../navigation/RootNavigator';
// import { getOrders } from '../../apis/order'; // nếu có API thì import

type Props = NativeStackScreenProps<RootStackParamList, 'Order'>;

const renderOrder = ({
  item: order,
  expandedOrderId,
  setExpandedOrderId,
}: {
  item: OrderItem;
  expandedOrderId: string | null;
  setExpandedOrderId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const isExpanded = expandedOrderId === order._id;
  const productsToShow = isExpanded
    ? order.order_products
    : order.order_products.slice(0, 1);

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.cardHeader}>
        <Text style={styles.statusText}>
          Trạng thái: {mapStatusLabel(order.order_status)}
        </Text>
        <Text style={styles.totalText}>
          {order.order_checkout?.grandTotal
            ? order.order_checkout.grandTotal.toLocaleString()
            : order.order_checkout?.totalPrice?.toLocaleString()}{' '}
          ₫
        </Text>
      </View>

      {/* List sản phẩm */}
      {productsToShow.map((item, index) => (
        <View key={index} style={styles.productRow}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={styles.qtyText}>Số lượng: {item.quantity}</Text>
            <Text style={styles.productPrice}>
              {item.totalPrice?.toLocaleString()} ₫
            </Text>
          </View>
        </View>
      ))}

      {/* Xem thêm / Thu gọn */}
      {order.order_products.length > 1 && (
        <View style={styles.viewMore}>
          <TouchableOpacity
            onPress={() => setExpandedOrderId(isExpanded ? null : order._id)}
          >
            <Text style={styles.textMore}>
              {isExpanded ? 'Thu gọn' : 'Xem thêm'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer */}
      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.statusButton}>
          <Text style={styles.statusButtonText}>
            {mapStatusButton(order.order_status)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const OrderScreen = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState<IOrderStatus>(
    IOrderStatus.PENDING,
  );
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const res = await getOrderByStatus(activeTab);
        setOrders(res?.data ?? []);
      } catch (error) {
        console.log('Lỗi load orders:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [activeTab]);

  return (
    <View style={styles.screen}>
      <View style={styles.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}
        >
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabItem,
                activeTab === tab.key && styles.tabItemActive,
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <View style={styles.content}>
        {loading ? (
          <View style={styles.center}>
            <Text style={styles.loading}>Đang tải...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.empty}>Không có đơn hàng</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={item => item._id?.toString()}
            renderItem={({ item }) =>
              renderOrder({ item, expandedOrderId, setExpandedOrderId })
            }
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
      </View>
    </View>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  tabContainer: {
    height: 48,
    borderBottomWidth: 1,
    borderColor: '#EEE',
    backgroundColor: '#FFF',
  },
  tabRow: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  tabItem: {
    paddingVertical: 10,
    marginRight: 16,
  },
  tabItemActive: {
    borderBottomWidth: 2,
    borderColor: '#1E88E5',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
  },
  tabTextActive: {
    fontWeight: '700',
    color: '#000',
  },

  content: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  center: {
    flex: 1,
    alignItems: 'center',
    marginTop: 24,
    justifyContent: 'center',
  },
  loading: {
    color: '#888',
  },
  empty: {
    color: '#999',
  },

  card: {
    marginHorizontal: 12,
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFF',
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusText: {
    fontWeight: '600',
  },
  totalText: {
    fontWeight: '700',
  },
  productRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  productImage: {
    width: 65,
    height: 65,
    borderRadius: 8,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
  },
  qtyText: {
    marginTop: 3,
    color: '#666',
  },
  productPrice: {
    marginTop: 4,
    fontWeight: '700',
  },
  cardFooter: {
    marginTop: 14,
    alignItems: 'flex-end',
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E88E5',
  },
  statusButtonText: {
    color: '#1E88E5',
    fontWeight: '600',
  },

  viewMore: {
    paddingVertical: 8,
  },
  textMore: {
    textAlign: 'center',
  },
  touchMore: {},
});
