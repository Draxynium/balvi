import { apiRequest } from "@/lib/api/client";
import type {
  Cart,
  City,
  CreateOrderInput,
  MyOrdersPage,
  Order,
  Province,
} from "@/features/cart/model/types";

export const cartApi = {
  get: () => apiRequest<Cart>("cart"),

  addItem: (input: {
    productId: string;
    colorId: string;
    sizeId: string;
    quantity: number;
  }) =>
    apiRequest<Cart>("cart/items", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateQuantity: (itemId: string, quantity: number) =>
    apiRequest<Cart>(`cart/items/${itemId}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
    }),

  removeItem: (itemId: string) =>
    apiRequest<void>(`cart/items/${itemId}`, { method: "DELETE" }),

  getProvinces: () => apiRequest<Province[]>("locations/provinces"),

  getCities: (provinceId: string) =>
    apiRequest<City[]>(`locations/provinces/${provinceId}/cities`),

  createOrder: (input: CreateOrderInput) =>
    apiRequest<Order>("orders", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  getOrder: (id: string) => apiRequest<Order>(`orders/${id}`),

  getOrders: (page = 1, pageSize = 20) =>
    apiRequest<MyOrdersPage>(`orders?page=${page}&pageSize=${pageSize}`),

  processTestPayment: (id: string, succeeded: boolean) =>
    apiRequest<Order>(`orders/${id}/payments/test`, {
      method: "POST",
      body: JSON.stringify({ succeeded }),
    }),
};
