import { adminRequest } from "@/features/admin/shared/api";
import type { PagedUsers } from "./types";

export const userAdminApi = {
  list(
    filters: {
      search?: string;
      isActive?: boolean;
      page?: number;
      pageSize?: number;
    } = {},
  ) {
    const query = new URLSearchParams({
      page: String(filters.page ?? 1),
      pageSize: String(filters.pageSize ?? 20),
    });
    if (filters.search?.trim()) query.set("search", filters.search.trim());
    if (filters.isActive !== undefined) {
      query.set("isActive", String(filters.isActive));
    }
    return adminRequest<PagedUsers>(`users?${query}`);
  },

  setActive(id: string, isActive: boolean) {
    return adminRequest<void>(`users/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ isActive }),
    });
  },

  resetPassword(id: string, newPassword: string) {
    return adminRequest<void>(`users/${id}/password`, {
      method: "PUT",
      body: JSON.stringify({ newPassword }),
    });
  },
};
