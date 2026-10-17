import type { PagedProducts, Product } from "@/features/catalog/model/types";

export type { PagedProducts, Product };

export type ProductReference = {
  id: string;
  name: string;
  hexCode?: string;
};

export type ProductVariantInput = {
  colorId: string;
  sizeId: string;
  stockQuantity: number;
};

export type ProductInput = {
  name: string;
  description: string | null;
  priceInRials: number;
  brandId: string;
  categoryId: string;
  materialId: string;
  liningId: string;
  isMan: boolean;
  variants: ProductVariantInput[];
  imageIds: string[];
  mainImageId: string;
};

export type UploadedImage = {
  id: string;
  originalName: string;
  contentType: string;
  sizeInBytes: number;
  url: string;
};
