export type OrderStatus =
  | "PendingPayment"
  | "Paid"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "PaymentFailed";

export type AdminOrderListItem = {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  fullName: string;
  phoneNumber: string;
  provinceId: string;
  provinceName: string;
  cityId: string;
  cityName: string;
  itemCount: number;
  totalQuantity: number;
  productsTotalInRials: number;
  taxPercentage: number;
  taxAmountInRials: number;
  shippingCostInRials: number;
  totalAmountInRials: number;
  deliveryDate: string | null;
  deliveryWindowStart: string | null;
  deliveryWindowEnd: string | null;
  createdAtUtc: string;
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  colorId: string;
  colorName: string;
  hexCode: string;
  sizeId: string;
  sizeName: string;
  quantity: number;
  unitPriceInRials: number;
  lineTotalInRials: number;
  mainImageUrl: string | null;
};

export type Payment = {
  id: string;
  amountInRials: number;
  status: "Succeeded" | "Failed";
  provider: string;
  referenceNumber: string | null;
  failureReason: string | null;
  createdAtUtc: string;
};

export type AdminOrder = {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  fullName: string;
  phoneNumber: string;
  provinceId: string;
  provinceName: string;
  cityId: string;
  cityName: string;
  address: string;
  postalCode: string;
  items: OrderItem[];
  payments: Payment[];
  totalQuantity: number;
  productsTotalInRials: number;
  taxPercentage: number;
  taxAmountInRials: number;
  shippingCostInRials: number;
  totalAmountInRials: number;
  deliveryDate: string | null;
  deliveryTimeSlotId: string | null;
  deliveryWindowStart: string | null;
  deliveryWindowEnd: string | null;
  createdAtUtc: string;
};

export type PagedOrders = {
  items: AdminOrderListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};
