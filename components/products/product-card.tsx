"use client";

import Link from "next/link";
import { Product } from "@/lib/products/types";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({
  product,
}: ProductCardProps) {
  const isOutOfStock = product.stock === 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group block"
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-white">
        <img
          src={product.image}
          alt={product.name}
          className={[
            "absolute inset-0 h-full w-full object-contain transition-opacity duration-500",
            product.secondImage
              ? "group-hover:opacity-0"
              : "",
          ].join(" ")}
        />

        {product.secondImage && (
          <img
            src={product.secondImage}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-contain opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 flex items-end bg-white/40 p-2.5">
            <span className="rounded-sm border border-foreground/20 bg-white/90 px-2.5 py-1 text-base font-medium text-foreground">
              ناموجود
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 py-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-medium leading-snug text-foreground">
            {product.name}
          </h2>

          {product.colors.length > 0 && (
            <div className="flex shrink-0 items-center gap-2 pt-0.5">
              {product.colors.map((color) => (
                <span
                  key={color}
                  className="h-4 w-4 rounded-full border border-foreground/20 shadow-sm"
                  style={{
                    backgroundColor: color,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 text-base">
          <span
            className={
              isOutOfStock
                ? "text-foreground/40"
                : "text-foreground/80"
            }
          >
            {product.price.toLocaleString("fa-IR")} تومان
          </span>

          {product.beforePrice && (
            <span className="text-sm text-foreground/30 line-through">
              {product.beforePrice.toLocaleString("fa-IR")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}