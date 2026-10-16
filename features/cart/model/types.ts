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

export type Order = CreateOrderInput & {
  id: string;
  orderNumber: string;
  userId: string;
  status: string;
  provinceName: string;
  cityName: string;
  items: OrderItem[];
  totalQuantity: number;
  productsTotalInRials: number;
  shippingCostInRials: number;
  totalAmountInRials: number;
  createdAtUtc: string;
};
