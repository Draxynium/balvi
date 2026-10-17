import { adminRequest } from "@/features/admin/shared/api";
import type { PagedPayments, PaymentStatus } from "./types";

export const paymentAdminApi = {
  list(
    filters: {
      search?: string;
      status?: PaymentStatus | "";
      fromUtc?: string;
      toUtc?: string;
      page?: number;
      pageSize?: number;
    } = {},
  ) {
    const query = new URLSearchParams({
      page: String(filters.page ?? 1),
      pageSize: String(filters.pageSize ?? 20),
    });
    if (filters.search?.trim()) query.set("search", filters.search.trim());
    if (filters.status) query.set("status", filters.status);
    if (filters.fromUtc)
      query.set("fromUtc", `${filters.fromUtc}T00:00:00.000Z`);
    if (filters.toUtc) query.set("toUtc", `${filters.toUtc}T23:59:59.999Z`);
    return adminRequest<PagedPayments>(`payments?${query}`);
  },
};
