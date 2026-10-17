export type CartItem = {
  id: string;
  productId: string;
  productName: string;
  colorId: string;
  colorName: string;
  hexCode: string;
  sizeId: string;
  sizeName: string;
  quantity: number;
  availableStockQuantity: number;
  isAvailable: boolean;
  unitPriceInRials: number;
  lineTotalInRials: number;
  mainImageUrl: string | null;
};

export type Cart = {
  id: string | null;
  items: CartItem[];
  totalQuantity: number;
  productsTotalInRials: number;
  taxPercentage: number;
  taxAmountInRials: number;
  shippingCostInRials: number;
  totalAmountInRials: number;
};

export type Province = { id: string; name: string };
export type City = { id: string; provinceId: string; name: string };

export type CreateOrderInput = {
  fullName: string;
  phoneNumber: string;
  provinceId: string;
  cityId: string;
  address: string;
  postalCode: string;
  deliveryDate: string;
  deliveryTimeSlotId: string;
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

export type Order = Omit<
  CreateOrderInput,
  "deliveryDate" | "deliveryTimeSlotId"
> & {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  deliveryDate: string | null;
  deliveryTimeSlotId: string | null;
  provinceName: string;
  cityName: string;
  items: OrderItem[];
  payments: Payment[];
  totalQuantity: number;
  productsTotalInRials: number;
  taxPercentage: number;
  taxAmountInRials: number;
  shippingCostInRials: number;
  totalAmountInRials: number;
  deliveryWindowStart: string | null;
  deliveryWindowEnd: string | null;
  createdAtUtc: string;
};

export type MyOrderListItem = {
  id: string;
  orderNumber: string;
  status: string;
  itemCount: number;
  totalQuantity: number;
  totalAmountInRials: number;
  deliveryDate: string | null;
  deliveryWindowStart: string | null;
  deliveryWindowEnd: string | null;
  createdAtUtc: string;
};

export type MyOrdersPage = {
  items: MyOrderListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};
