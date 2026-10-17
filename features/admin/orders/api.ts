import { AdminApiError, adminRequest } from "@/features/admin/shared/api";
import type { AdminOrder, OrderStatus, PagedOrders } from "./types";

export type OrderFilters = {
  search?: string;
  userId?: string;
  status?: OrderStatus | "";
  provinceId?: string;
  cityId?: string;
  fromUtc?: string;
  toUtc?: string;
  minTotalInRials?: number;
  maxTotalInRials?: number;
  sort?: "Newest" | "Oldest" | "HighestAmount" | "LowestAmount";
  page?: number;
  pageSize?: number;
};

export const orderAdminApi = {
  list(filters: OrderFilters = {}) {
    const query = new URLSearchParams({
      page: String(filters.page ?? 1),
      pageSize: String(filters.pageSize ?? 20),
      sort: filters.sort ?? "Newest",
    });
    if (filters.search?.trim()) query.set("search", filters.search.trim());
    if (filters.userId?.trim()) query.set("userId", filters.userId.trim());
    if (filters.status) query.set("status", filters.status);
    if (filters.provinceId) query.set("provinceId", filters.provinceId);
    if (filters.cityId) query.set("cityId", filters.cityId);
    if (filters.fromUtc)
      query.set("fromUtc", `${filters.fromUtc}T00:00:00.000Z`);
    if (filters.toUtc) query.set("toUtc", `${filters.toUtc}T23:59:59.999Z`);
    if (filters.minTotalInRials !== undefined)
      query.set("minTotalInRials", String(filters.minTotalInRials));
    if (filters.maxTotalInRials !== undefined)
      query.set("maxTotalInRials", String(filters.maxTotalInRials));
    return adminRequest<PagedOrders>(`orders?${query}`);
  },

  get: (id: string) => adminRequest<AdminOrder>(`orders/${id}`),

  updateStatus: (id: string, status: OrderStatus) =>
    adminRequest<AdminOrder>(`orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }),
};

export type LocationOption = { id: string; name: string };

async function getLocations(path: string) {
  const response = await fetch(`/api/store/${path}`, {
    cache: "no-store",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new AdminApiError(response.status);
  return response.json() as Promise<LocationOption[]>;
}

export const locationApi = {
  provinces: () => getLocations("locations/provinces"),
  cities: (provinceId: string) =>
    getLocations(`locations/provinces/${provinceId}/cities`),
};
