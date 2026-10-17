import { adminRequest } from "@/features/admin/shared/api";
import type {
  PagedProducts,
  Product,
  ProductInput,
  ProductReference,
  UploadedImage,
} from "./types";

export type ProductListFilters = {
  search?: string;
  categoryId?: string;
  isMan?: boolean;
  sort?: "Newest" | "Cheapest" | "MostExpensive";
  page?: number;
  pageSize?: number;
};

function queryString(filters: ProductListFilters) {
  const query = new URLSearchParams({
    page: String(filters.page ?? 1),
    pageSize: String(filters.pageSize ?? 20),
  });
  if (filters.search?.trim()) query.set("search", filters.search.trim());
  if (filters.categoryId) query.set("categoryId", filters.categoryId);
  if (filters.isMan !== undefined) query.set("isMan", String(filters.isMan));
  if (filters.sort) query.set("sort", filters.sort);
  return query.toString();
}

export const productAdminApi = {
  list: (filters: ProductListFilters = {}) =>
    adminRequest<PagedProducts>(`products?${queryString(filters)}`),

  get: (id: string) => adminRequest<Product>(`products/${id}`),

  create: (input: ProductInput) =>
    adminRequest<string>("products", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  update: (id: string, input: ProductInput) =>
    adminRequest<void>(`products/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),

  remove: (id: string) =>
    adminRequest<void>(`products/${id}`, { method: "DELETE" }),

  uploadImages: (files: File[]) => {
    const formData = new FormData();
    for (const file of files) formData.append("Images", file);
    return adminRequest<UploadedImage[]>("files/images", {
      method: "POST",
      body: formData,
    });
  },

  references: () =>
    Promise.all([
      adminRequest<ProductReference[]>("brands"),
      adminRequest<ProductReference[]>("colors"),
      adminRequest<ProductReference[]>("sizes"),
      adminRequest<ProductReference[]>("materials"),
      adminRequest<ProductReference[]>("linings"),
    ]),
};
