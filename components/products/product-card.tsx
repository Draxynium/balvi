"use client";

import Link from "next/link";
import type { ProductListItem } from "@/features/catalog/model/types";
import { formatProductPrice } from "@/features/catalog/lib/format";

type ProductCardProps = {
  product: ProductListItem;
};

export default function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = !product.isAvailable;
  const image = product.mainImage?.url || "/images/boot.png";

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block min-w-0 overflow-hidden"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-white">
        <img
          src={image}
          alt={product.name}
          className={[
            "absolute inset-0 h-full w-full object-contain transition-transform duration-500",
            "group-hover:scale-[1.03]",
          ].join(" ")}
        />

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-end bg-white/40 p-2.5">
            <span className="border-foreground/20 text-foreground rounded-sm border bg-white/90 px-2.5 py-1 text-base font-medium">
              ناموجود
            </span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-col gap-1.5 py-3">
        <div className="flex min-w-0 items-start justify-between gap-2">
          <h2 className="text-foreground min-w-0 flex-1 text-sm leading-snug font-medium sm:text-base">
            {product.name}
          </h2>

          {product.colors.length > 0 && (
            <div className="flex shrink-0 items-center gap-1.5 pt-0.5 sm:gap-2">
              {product.colors.slice(0, 3).map((color) => (
                <span
                  key={color.id}
                  className="border-foreground/20 h-3.5 w-3.5 rounded-full border shadow-sm sm:h-4 sm:w-4"
                  style={{
                    backgroundColor: color.hexCode,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-sm sm:text-base">
          <span
            className={
              isOutOfStock ? "text-foreground/40" : "text-foreground/80"
            }
          >
            {formatProductPrice(product.priceInRials)}
          </span>
        </div>
      </div>
    </Link>
  );
}
