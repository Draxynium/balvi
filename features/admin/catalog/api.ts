import { adminRequest } from "@/features/admin/shared/api";
import type { CatalogInput, CatalogItem } from "./types";

export type CatalogAdminApi = {
  list: () => Promise<CatalogItem[]>;
  create: (input: CatalogInput) => Promise<string>;
  update: (id: string, input: CatalogInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

function createCatalogApi(resource: "brands" | "colors"): CatalogAdminApi {
  const body = (input: CatalogInput) =>
    resource === "colors"
      ? { name: input.name, hexCode: input.hexCode }
      : { name: input.name };

  return {
    list: () => adminRequest<CatalogItem[]>(resource),

    create: (input) =>
      adminRequest<string>(resource, {
        method: "POST",
        body: JSON.stringify(body(input)),
      }),

    update: (id, input) =>
      adminRequest<void>(`${resource}/${id}`, {
        method: "PUT",
        body: JSON.stringify(body(input)),
      }),

    remove: (id) =>
      adminRequest<void>(`${resource}/${id}`, { method: "DELETE" }),
  };
}

export const brandAdminApi = createCatalogApi("brands");
export const colorAdminApi = createCatalogApi("colors");
