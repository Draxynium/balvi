import "server-only";

import { backendFetch } from "@/lib/api/server/backend";
import { resolveApiAssetUrl } from "@/lib/api/config";
import type {
  Article,
  ArticleImage,
  PagedArticles,
} from "@/features/articles/model/types";

function normalizeImage(image: ArticleImage | null) {
  return image ? { ...image, url: resolveApiAssetUrl(image.url) ?? "" } : null;
}

export async function getPublishedArticles(page = 1, pageSize = 20) {
  const response = await backendFetch(
    `/api/articles?page=${page}&pageSize=${pageSize}`,
    { headers: { Accept: "application/json" }, cache: "no-store" },
  );
  if (!response.ok) throw new Error(`Shop API returned ${response.status}`);
  const result = (await response.json()) as PagedArticles;
  return {
    ...result,
    items: result.items.map((article) => ({
      ...article,
      mainImage: normalizeImage(article.mainImage),
    })),
  };
}

export async function getPublishedArticle(id: string) {
  const response = await backendFetch(
    `/api/articles/${encodeURIComponent(id)}`,
    { headers: { Accept: "application/json" }, cache: "no-store" },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Shop API returned ${response.status}`);
  const article = (await response.json()) as Article;
  return {
    ...article,
    mainImage: normalizeImage(article.mainImage),
    images: article.images.map((image) => normalizeImage(image)!),
  };
}
