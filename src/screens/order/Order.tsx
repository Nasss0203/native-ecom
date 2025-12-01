import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
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
  OrderItem,
  TABS,
} from '../../common/types/order.type';
import { useOrders } from '../../hooks/orders/useOrder';
import { RootStackParamList } from '../../navigation/RootNavigator';
// import { getOrders } from '../../apis/order'; // nếu có API thì import

type Props = NativeStackScreenProps<RootStackParamList, 'Order'>;

const OrderScreen = ({ navigation }: Props) => {
  const [activeTab, setActiveTab] = useState<IOrderStatus>(
    IOrderStatus.PENDING,
  );
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [confirmOrderId, setConfirmOrderId] = useState<string | null>(null);

  const { orders, isLoading, isError, cancelOrder, isCancelling } =
    useOrders(activeTab);
  console.log('🚀 ~ orders~', orders);

  const renderOrder = ({ item: order }: { item: OrderItem }) => {
    const isExpanded = expandedOrderId === order._id;
    const productsToShow = isExpanded
      ? order.order_products
      : order.order_products.slice(0, 1);

    const statusCancel = order.order_status;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('OrderDetail', { order })}
      >
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
                onPress={() =>
                  setExpandedOrderId(isExpanded ? null : order._id || null)
                }
              >
                <Text style={styles.textMore}>
                  {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Footer */}

          <View style={styles.cardFooter}>
            {statusCancel === IOrderStatus.PENDING ||
            statusCancel === IOrderStatus.CONFIRMED ? (
              <TouchableOpacity
                style={styles.statusCancel}
                onPress={() => setConfirmOrderId(order._id)}
                disabled={isCancelling}
              >
                <Text style={styles.statusCancelText}>
                  {isCancelling ? 'Đang hủy...' : 'Hủy đơn hàng'}
                </Text>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity style={styles.statusButton}>
              <Text style={styles.statusButtonText}>
                {mapStatusButton(order.order_status)}
              </Text>
            </TouchableOpacity>
          </View>
          {/* Modal xác nhận hủy đơn */}
          <Modal
            visible={!!confirmOrderId}
            transparent
            animationType="fade"
            onRequestClose={() => setConfirmOrderId(null)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Xác nhận hủy đơn</Text>
                <Text style={styles.modalMessage}>
                  Bạn có chắc chắn muốn hủy đơn hàng này không?
                </Text>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonCancel]}
                    onPress={() => setConfirmOrderId(null)}
                    disabled={isCancelling}
                  >
                    <Text style={styles.modalButtonCancelText}>Không</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.modalButtonConfirm]}
                    onPress={() => {
                      if (confirmOrderId) {
                        cancelOrder(confirmOrderId);
                      }
                      setConfirmOrderId(null);
                    }}
                    disabled={isCancelling}
                  >
                    <Text style={styles.modalButtonConfirmText}>
                      {isCancelling ? 'Đang hủy...' : 'Đồng ý'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.screen}>
      {/* TAB STATUS */}
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

      {/* CONTENT */}
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.center}>
            <Text style={styles.loading}>Đang tải...</Text>
          </View>
        ) : isError ? (
          <View style={styles.center}>
            <Text style={styles.empty}>Có lỗi khi tải đơn hàng</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.center}>
            <Text style={styles.empty}>Không có đơn hàng</Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={item => item._id?.toString()}
            renderItem={renderOrder}
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
    height: 44,
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
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
  },
  statusButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E88E5',
  },
  statusButtonText: {
    color: '#1E88E5',
    fontWeight: '600',
  },

  statusCancel: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e41212',
  },
  statusCancelText: {
    color: '#e41212',
    fontWeight: '600',
  },

  viewMore: {
    paddingVertical: 8,
  },
  textMore: {
    textAlign: 'center',
  },
  touchMore: {},

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  modalButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  modalButtonCancel: {
    backgroundColor: '#EEE',
  },
  modalButtonConfirm: {
    backgroundColor: '#e41212',
  },
  modalButtonCancelText: {
    color: '#333',
    fontWeight: '600',
  },
  modalButtonConfirmText: {
    color: '#FFF',
    fontWeight: '600',
  },
});
