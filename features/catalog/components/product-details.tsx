"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, LoaderCircle, Minus, Plus, ShoppingBag } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";
import ProductCard from "@/components/products/product-card";
import { cartApi } from "@/features/cart/api/cart-api";
import { formatProductPrice } from "@/features/catalog/lib/format";
import type { Product } from "@/features/catalog/model/types";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { getApiErrorMessage } from "@/lib/api/client";

export function ProductDetails({ product }: { product: Product }) {
  const firstColor = product.colorOptions.find((color) => color.isAvailable);
  const firstSize = firstColor?.sizes.find((size) => size.isAvailable);
  const [colorId, setColorId] = useState(firstColor?.id ?? "");
  const [sizeId, setSizeId] = useState(firstSize?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { status, openDialog } = useAuth();

  const selectedColor = product.colorOptions.find(
    (color) => color.id === colorId,
  );
  const selectedSize = selectedColor?.sizes.find((size) => size.id === sizeId);
  const images = useMemo(() => {
    const availableImages = [...product.images]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((image) => image.url)
      .filter(Boolean);
    return availableImages.length ? availableImages : ["/images/boot.png"];
  }, [product.images]);

  const selectColor = (nextColorId: string) => {
    const nextColor = product.colorOptions.find(
      (color) => color.id === nextColorId,
    );
    const nextSize = nextColor?.sizes.find((size) => size.isAvailable);
    setColorId(nextColorId);
    setSizeId(nextSize?.id ?? "");
    setQuantity(1);
    setError("");
    setMessage("");
  };

  const addToCart = async () => {
    if (status !== "authenticated") {
      openDialog();
      return;
    }
    if (!selectedColor || !selectedSize?.isAvailable) {
      setError("یک رنگ و سایز موجود انتخاب کنید.");
      return;
    }

    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      await cartApi.addItem({
        productId: product.id,
        colorId: selectedColor.id,
        sizeId: selectedSize.id,
        quantity,
      });
      setMessage("محصول به سبد خرید اضافه شد.");
    } catch (reason) {
      setError(getApiErrorMessage(reason));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main dir="rtl" className="w-full">
      <section className="mx-auto w-full max-w-7xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:gap-10">
          <ScrollReveal direction="right" distance={70} className="w-full">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-muted col-span-2 aspect-[16/11] overflow-hidden rounded-lg">
                <img
                  src={images[0]}
                  alt={product.name}
                  className="h-full w-full object-contain"
                />
              </div>
              {images.slice(1, 3).map((image) => (
                <div
                  key={image}
                  className="bg-muted aspect-square overflow-hidden rounded-lg"
                >
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-contain"
                  />
                </div>
              ))}
            </div>
          </ScrollReveal>

          <div className="h-fit lg:sticky lg:top-24">
            <ScrollReveal direction="left" distance={60}>
              <p className="text-muted-foreground mb-3 text-sm">
                {product.categoryPath
                  .map((category) => category.name)
                  .join(" / ") || product.category.name}
              </p>
              <h1 className="text-3xl leading-tight font-medium sm:text-4xl md:text-5xl">
                {product.name}
              </h1>
              <p className="mt-5 text-2xl font-medium">
                {formatProductPrice(product.priceInRials)}
              </p>
              {product.description && (
                <p className="text-muted-foreground mt-6 max-w-md text-base leading-8">
                  {product.description}
                </p>
              )}
            </ScrollReveal>

            <div className="mt-9 space-y-7">
              <div>
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="font-medium">رنگ</span>
                  <span className="text-muted-foreground">
                    {selectedColor?.name ?? "ناموجود"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colorOptions.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => selectColor(color.id)}
                      disabled={!color.isAvailable}
                      aria-label={color.name}
                      aria-pressed={color.id === colorId}
                      className={`h-10 w-10 rounded-full border-2 p-1 transition disabled:cursor-not-allowed disabled:opacity-30 ${
                        color.id === colorId
                          ? "border-foreground"
                          : "border-transparent"
                      }`}
                    >
                      <span
                        className="border-foreground/10 block h-full w-full rounded-full border"
                        style={{ backgroundColor: color.hexCode }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="mb-4 block text-sm font-medium">سایز</span>
                <div className="grid grid-cols-5 gap-2">
                  {selectedColor?.sizes.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => {
                        setSizeId(size.id);
                        setQuantity(1);
                        setError("");
                        setMessage("");
                      }}
                      disabled={!size.isAvailable}
                      className={`h-12 rounded-md border text-sm transition disabled:cursor-not-allowed disabled:opacity-30 ${
                        size.id === sizeId
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:border-foreground"
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="flex h-14 items-center justify-between gap-5 rounded-md border px-4">
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) => Math.max(1, value - 1))
                    }
                    aria-label="کاهش تعداد"
                  >
                    <Minus size={17} />
                  </button>
                  <span className="min-w-4 text-center font-medium">
                    {quantity.toLocaleString("fa-IR")}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity((value) =>
                        Math.min(selectedSize?.stockQuantity ?? 1, value + 1),
                      )
                    }
                    aria-label="افزایش تعداد"
                  >
                    <Plus size={17} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={addToCart}
                  disabled={submitting || !product.isAvailable}
                  className="bg-foreground text-background flex h-14 flex-1 items-center justify-center gap-2 rounded-md font-medium transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {submitting ? (
                    <LoaderCircle className="animate-spin" size={18} />
                  ) : (
                    <ShoppingBag size={18} />
                  )}
                  {product.isAvailable ? "افزودن به سبد خرید" : "ناموجود"}
                </button>
              </div>

              {message && (
                <p className="text-primary flex items-center gap-2 text-sm">
                  <Check size={16} /> {message}{" "}
                  <Link href="/cart" className="underline">
                    مشاهده سبد
                  </Link>
                </p>
              )}
              {error && (
                <p role="alert" className="text-destructive text-sm">
                  {error}
                </p>
              )}

              <div className="border-t">
                {[
                  ["برند", product.brand.name],
                  ["جنس", product.material?.name],
                  ["آستر", product.lining?.name],
                  [
                    "موجودی",
                    product.totalStockQuantity.toLocaleString("fa-IR"),
                  ],
                ]
                  .filter(([, value]) => Boolean(value))
                  .map(([label, value]) => (
                    <div
                      key={label}
                      className="flex justify-between border-b py-4 text-sm"
                    >
                      <span>{label}</span>
                      <span className="text-muted-foreground">{value}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {product.relatedProducts.length > 0 && (
        <section className="mx-auto w-full max-w-7xl border-t px-4 py-20 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-3xl font-medium">
            شاید این‌ها را هم بپسندید
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {product.relatedProducts.slice(0, 4).map((related) => (
              <ProductCard key={related.id} product={related} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
