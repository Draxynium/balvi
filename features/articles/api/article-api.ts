import { apiRequest } from "@/lib/api/client";
import { resolveApiAssetUrl } from "@/lib/api/config";
import type {
  Article,
  ArticleImage,
  PagedArticles,
} from "@/features/articles/model/types";

function normalizeImage(image: ArticleImage | null) {
  return image ? { ...image, url: resolveApiAssetUrl(image.url) ?? "" } : null;
}

export const articleApi = {
  async list(page = 1, pageSize = 20) {
    const result = await apiRequest<PagedArticles>(
      `articles?page=${page}&pageSize=${pageSize}`,
    );
    return {
      ...result,
      items: result.items.map((article) => ({
        ...article,
        mainImage: normalizeImage(article.mainImage),
      })),
    };
  },

  async get(id: string) {
    const article = await apiRequest<Article>(`articles/${id}`);
    return {
      ...article,
      mainImage: normalizeImage(article.mainImage),
      images: article.images.map((image) => normalizeImage(image)!),
    };
  },
};
