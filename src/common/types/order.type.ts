export enum IOrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  SHIPPED = 'shipped',
  CANCELLED = 'cancelled',
  DELIVERED = 'delivered',
}

export enum IOrderPayment {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

export const TABS = [
  { key: IOrderStatus.PENDING, label: 'Chờ thanh toán' },
  { key: IOrderStatus.CONFIRMED, label: 'Đã xác nhận' },
  { key: IOrderStatus.SHIPPED, label: 'Đang giao' },
  { key: IOrderStatus.DELIVERED, label: 'Đã hoàn thành' },
  { key: IOrderStatus.CANCELLED, label: 'Đã hủy' },
];

export function mapStatusLabel(status: IOrderStatus) {
  switch (status) {
    case IOrderStatus.PENDING:
      return 'Chờ thanh toán';
    case IOrderStatus.CONFIRMED:
      return 'Đã xác nhận';
    case IOrderStatus.SHIPPED:
      return 'Đang giao';
    case IOrderStatus.DELIVERED:
      return 'Đã hoàn thành';
    case IOrderStatus.CANCELLED:
      return 'Đã hủy';
    default:
      return status;
  }
}

export function mapStatusButton(status: IOrderStatus) {
  switch (status) {
    case IOrderStatus.PENDING:
      return 'Chờ thanh toán';
    case IOrderStatus.CONFIRMED:
      return 'Chuẩn bị hàng';
    case IOrderStatus.SHIPPED:
      return 'Xem vị trí';
    case IOrderStatus.DELIVERED:
      return 'Mua lại';
    case IOrderStatus.CANCELLED:
      return 'Mua lại';
    default:
      return status;
  }
}

export type OrderItem = {
  _id: string;
  order_status: IOrderStatus;
  order_checkout: {
    totalPrice: number;
    grandTotal: number;
    feeShip: number;
    totalApplyDiscount: number;
  };
  order_products: {
    productId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    totalPrice: number;
  }[];
};
