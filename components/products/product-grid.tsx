"use client";

import { useMemo, useState } from "react";
import { Product } from "@/lib/products/types";
import ProductCard from "./product-card";

type ProductGridProps = {
  products: Product[];
};

const PRODUCTS_PER_PAGE = 12;

export default function ProductGrid({
  products,
}: ProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(
    PRODUCTS_PER_PAGE
  );

  const visibleProducts = useMemo(
    () => products.slice(0, visibleCount),
    [products, visibleCount]
  );

  const hasMore =
    visibleCount < products.length;

  return (
    <div className="flex w-full flex-col hp ">
      <div className="grid w-full grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {visibleProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center py-20">
          <button
            type="button"
            onClick={() =>
              setVisibleCount(
                (current) =>
                  current + PRODUCTS_PER_PAGE
              )
            }
            className="border-b border-foreground/50 pb-1 text-xs text-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            نمایش بیشتر
          </button>
        </div>
      )}
    </div>
  );
}