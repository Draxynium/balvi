export type ProductImage = {
  id: string;
  originalName: string;
  url: string;
  isMain: boolean;
  sortOrder: number;
};

export type ProductColor = { id: string; name: string; hexCode: string };
export type ProductCategory = { id: string; name: string };
export type ProductAttribute = { id: string; name: string };

export type ProductListItem = {
  id: string;
  name: string;
  priceInRials: number;
  totalStockQuantity: number;
  isAvailable: boolean;
  isMan: boolean;
  brand: { id: string; name: string };
  category: ProductCategory;
  mainImage: ProductImage | null;
  colors: ProductColor[];
};

export type ProductSizeOption = {
  id: string;
  name: string;
  stockQuantity: number;
  isAvailable: boolean;
};

export type ProductVariant = {
  colorId: string;
  colorName: string;
  hexCode: string;
  sizeId: string;
  sizeName: string;
  stockQuantity: number;
};

export type ProductColorOption = ProductColor & {
  isAvailable: boolean;
  sizes: ProductSizeOption[];
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  priceInRials: number;
  totalStockQuantity: number;
  isAvailable: boolean;
  isMan: boolean;
  brand: { id: string; name: string };
  category: ProductCategory;
  categoryPath: ProductCategory[];
  material: ProductAttribute | null;
  lining: ProductAttribute | null;
  variants: ProductVariant[];
  colorOptions: ProductColorOption[];
  images: ProductImage[];
  mainImage: ProductImage | null;
  relatedProducts: ProductListItem[];
  createdAtUtc: string;
  updatedAtUtc: string | null;
};

export type PagedProducts = {
  items: ProductListItem[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type CategoryNode = {
  id: string;
  name: string;
  children: CategoryNode[];
};
