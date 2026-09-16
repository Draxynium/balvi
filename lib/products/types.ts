import { ProductCategory } from "./categories";

export type Product = {
  id: string;
  slug: string;
  name: string;
  gender: "male" | "female";
  category: ProductCategory;
  price: number;
  beforePrice?: number | null;
  image: string;
  secondImage: string | null;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  description?: string;
};