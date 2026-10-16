"use client";

import { useMemo, useState } from "react";
import type { ProductListItem } from "@/features/catalog/model/types";
import ProductCard from "./product-card";

type ProductGridProps = {
  products: ProductListItem[];
};

const PRODUCTS_PER_PAGE = 12;

export default function ProductGrid({ products }: ProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  const visibleProducts = useMemo(
    () => products.slice(0, visibleCount),
    [products, visibleCount],
  );

  const hasMore = visibleCount < products.length;

  return (
    <div className="hp flex w-full flex-col">
      <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center py-20">
          <button
            type="button"
            onClick={() =>
              setVisibleCount((current) => current + PRODUCTS_PER_PAGE)
            }
            className="border-foreground/50 text-foreground hover:border-foreground hover:text-foreground border-b pb-1 text-xs transition-colors"
          >
            نمایش بیشتر
          </button>
        </div>
      )}
    </div>
  );
}
