import {
  adminRequest,
  getAdminApiErrorMessage as getSharedAdminApiErrorMessage,
} from "@/features/admin/shared/api";
import type { AdminCategory, CategoryInput } from "./types";

export const categoryAdminApi = {
  list: () => adminRequest<AdminCategory[]>("categories"),

  create: (input: CategoryInput) =>
    adminRequest<string>("categories", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  update: (id: string, input: CategoryInput) =>
    adminRequest<void>(`categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),

  remove: (id: string) =>
    adminRequest<void>(`categories/${id}`, { method: "DELETE" }),
};

export function getAdminApiErrorMessage(error: unknown) {
  return getSharedAdminApiErrorMessage(error, "دسته‌بندی");
}
