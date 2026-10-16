import { apiRequest } from "@/lib/api/client";
import type {
  Cart,
  City,
  CreateOrderInput,
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
};
