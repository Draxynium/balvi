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
    <Link href={`/products/${product.id}`} className="group block">
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

      <div className="flex flex-col gap-1.5 py-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-foreground text-base leading-snug font-medium">
            {product.name}
          </h2>

          {product.colors.length > 0 && (
            <div className="flex shrink-0 items-center gap-2 pt-0.5">
              {product.colors.map((color) => (
                <span
                  key={color.id}
                  className="border-foreground/20 h-4 w-4 rounded-full border shadow-sm"
                  style={{
                    backgroundColor: color.hexCode,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-base">
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
