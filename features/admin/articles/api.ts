import { adminRequest } from "@/features/admin/shared/api";
import type {
  Article,
  ArticleInput,
  PagedArticles,
  UploadedImage,
} from "./types";

export const articleAdminApi = {
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
    if (filters.isActive !== undefined)
      query.set("isActive", String(filters.isActive));
    return adminRequest<PagedArticles>(`articles?${query}`);
  },

  get: (id: string) => adminRequest<Article>(`articles/${id}`),

  create: (input: ArticleInput) =>
    adminRequest<string>("articles", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  update: (id: string, input: ArticleInput) =>
    adminRequest<void>(`articles/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),

  remove: (id: string) =>
    adminRequest<void>(`articles/${id}`, { method: "DELETE" }),

  uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("Images", file));
    return adminRequest<UploadedImage[]>("files/images", {
      method: "POST",
      body: formData,
    });
  },
};
