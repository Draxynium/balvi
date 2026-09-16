import { mockProducts } from "./mock-products";

export { productCategories } from "./categories";
export type { ProductCategory } from "./categories";

export async function getProducts() {
  return mockProducts;
}

export async function getProductById(
  id: string
) {
  return mockProducts.find(
    (product) => product.id === id
  );
}