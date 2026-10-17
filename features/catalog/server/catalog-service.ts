import "server-only";

import { backendFetch } from "@/lib/api/server/backend";
import { resolveApiAssetUrl } from "@/lib/api/config";
import type {
  CategoryNode,
  PagedProducts,
  Product,
  ProductImage,
  ProductListItem,
} from "@/features/catalog/model/types";

type CatalogFilters = {
  gender?: string;
  category?: string;
  search?: string;
  sort?: string;
};

function withAbsoluteImage<T extends ProductImage | null>(image: T): T {
  if (!image) return image;
  return { ...image, url: resolveApiAssetUrl(image.url) ?? "" } as T;
}

function normalizeListItem(item: ProductListItem): ProductListItem {
  return { ...item, mainImage: withAbsoluteImage(item.mainImage) };
}

function flattenCategories(categories: CategoryNode[]): CategoryNode[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children ?? []),
  ]);
}

async function readJson<T>(path: string): Promise<T> {
  const response = await backendFetch(path, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Shop API returned ${response.status}`);
  return response.json() as Promise<T>;
}

export function getCategories() {
  return readJson<CategoryNode[]>("/api/categories");
}

export async function getCatalogProducts(filters: CatalogFilters = {}) {
  let categoryId: string | undefined;
  if (filters.category) {
    const categories = await getCategories();
    categoryId = flattenCategories(categories).find(
      (category) => category.name === filters.category,
    )?.id;

    if (!categoryId) {
      return {
        items: [],
        page: 1,
        pageSize: 100,
        totalCount: 0,
        totalPages: 0,
        hasPreviousPage: false,
        hasNextPage: false,
      } satisfies PagedProducts;
    }
  }

  const query = new URLSearchParams({ page: "1", pageSize: "100" });
  if (filters.search) query.set("search", filters.search);
  if (categoryId) query.set("categoryId", categoryId);
  if (filters.gender === "male") query.set("isMan", "true");
  if (filters.gender === "female") query.set("isMan", "false");
  if (filters.sort === "cheapest") query.set("sort", "1");
  if (filters.sort === "expensive") query.set("sort", "2");

  const result = await readJson<PagedProducts>(`/api/products?${query}`);
  return { ...result, items: result.items.map(normalizeListItem) };
}

export async function getCatalogProduct(id: string) {
  const response = await backendFetch(
    `/api/products/${encodeURIComponent(id)}`,
    {
      headers: { Accept: "application/json" },
      cache: "no-store",
    },
  );

  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Shop API returned ${response.status}`);

  const product = (await response.json()) as Product;
  return {
    ...product,
    mainImage: withAbsoluteImage(product.mainImage),
    images: product.images.map(withAbsoluteImage),
    relatedProducts: product.relatedProducts.map(normalizeListItem),
  };
}
