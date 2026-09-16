"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, ChevronDown } from "lucide-react";

import ScrollReveal from "@/components/scroll-reveal";
import ScrollParallax from "@/components/scroll-parallax";
import ItemCard from "@/components/item-card";
import ItemsCarousel from "@/components/items-carousel";

export default function ProductPage() {
  const [size, setSize] = useState("42");
  const [color, setColor] = useState("مشکی");
  const [quantity, setQuantity] = useState(1);

  const product = {
    name: "بوت چرمی کلاسیک",
    category: "کفش چرم",
    price: 2850000,
    beforePrice: 3200000,
    description:
      "ساخته‌شده از چرم طبیعی با طراحی ساده و ماندگار؛ ترکیبی از اصالت، راحتی و ظرافت در جزئیات.",
    images: [
      "/images/product-a.jpg",
      "/images/product-b.jpg",
      "/images/product-c.jpg",
    ],
    colors: [
      { name: "مشکی", value: "#1c1c1c" },
      { name: "قهوه‌ای", value: "#4a2d1f" },
    ],
    sizes: ["40", "41", "42", "43", "44"],
  };

  return (
    <main dir="rtl" className="w-full">
      {/* ============ HERO ============ */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-20 md:pt-18 pb-16 sm:pb-20 md:pb-24">
        <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-8 lg:gap-10 items-start">
          {/* ---- Product Images ---- */}
          <ScrollReveal
            direction="right"
            distance={70}
            duration={1.1}
            className="w-full"
          >
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="col-span-2 aspect-[4/3] sm:aspect-[16/11] rounded-lg overflow-hidden bg-muted">
                <ScrollParallax
                  axis="y"
                  strength={25}
                  speed={0.04}
                  className="w-full h-full"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover scale-110"
                  />
                </ScrollParallax>
              </div>

              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.images[1]}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={product.images[2]}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* ---- Product Info ---- */}
          <div className="lg:sticky lg:top-24 h-fit">
            <ScrollReveal
              direction="left"
              distance={60}
              duration={1}
              delay={0.15}
            >
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                {product.category}
              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-[1.15] sm:leading-[1.1]">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mt-4 sm:mt-6">
                <span className="text-xl sm:text-2xl font-medium">
                  {product.price.toLocaleString("fa-IR")} تومان
                </span>

                <span className="text-sm sm:text-base text-muted-foreground line-through">
                  {product.beforePrice.toLocaleString("fa-IR")} تومان
                </span>
              </div>

              <p className="text-base sm:text-lg leading-[1.6] text-muted-foreground mt-5 sm:mt-7 max-w-md">
                {product.description}
              </p>
            </ScrollReveal>

            <div className="mt-8 sm:mt-10 space-y-6 sm:space-y-8">
              {/* Color */}
              <ScrollReveal direction="left" distance={40} delay={0.3}>
                <div>
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <span className="font-medium text-sm sm:text-base">
                      رنگ
                    </span>
                    <span className="text-muted-foreground text-sm sm:text-base">
                      {color}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {product.colors.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => setColor(item.name)}
                        className={`w-10 h-10 sm:w-9 sm:h-9 rounded-md border-2 p-1 transition-colors ${
                          color === item.name
                            ? "border-foreground"
                            : "border-transparent hover:border-foreground/30"
                        }`}
                        aria-label={item.name}
                        aria-pressed={color === item.name}
                      >
                        <span
                          className="block w-full h-full rounded-md"
                          style={{ backgroundColor: item.value }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Size */}
              <ScrollReveal direction="left" distance={40} delay={0.4}>
                <div>
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <span className="font-medium text-sm sm:text-base">
                      سایز
                    </span>

                    <button className="text-xs sm:text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors">
                      راهنمای سایز
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {product.sizes.map((item) => (
                      <button
                        key={item}
                        onClick={() => setSize(item)}
                        className={`h-11 sm:h-12 rounded-md border text-sm sm:text-base transition ${
                          size === item
                            ? "bg-foreground text-background border-foreground"
                            : "border-border hover:border-foreground"
                        }`}
                        aria-pressed={size === item}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Quantity + Add to cart */}
              <ScrollReveal direction="left" distance={40} delay={0.5}>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="h-13 sm:h-14 border rounded-md flex items-center justify-between sm:justify-start px-4 gap-4 sm:gap-5">
                    <button
                      onClick={() =>
                        setQuantity((value) => Math.max(1, value - 1))
                      }
                      className="p-1 -m-1 cursor-pointer"
                      aria-label="کاهش تعداد"
                    >
                      <Minus size={17} />
                    </button>

                    <span className="min-w-4 text-center font-medium tabular-nums">
                      {quantity}
                    </span>

                    <button
                      onClick={() => setQuantity((value) => value + 1)}
                      className="p-1 -m-1 cursor-pointer"
                      aria-label="افزایش تعداد"
                    >
                      <Plus size={17} />
                    </button>
                  </div>

                  <button className="flex-1 h-13 sm:h-14 rounded-md bg-foreground text-background flex items-center justify-center gap-2 text-sm sm:text-base font-medium hover:opacity-90 transition active:scale-[0.99]">
                    <ShoppingBag size={18} />
                    افزودن به سبد خرید
                  </button>
                </div>
              </ScrollReveal>
            </div>

            {/* Details */}
            <ScrollReveal direction="left" distance={40} delay={0.6}>
              <div className="mt-8 sm:mt-10 border-t">
                {[
                  ["جنس", "چرم طبیعی گاوی"],
                  ["آستر", "چرم گوساله"],
                  ["ساخت", "تولید بالوی"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="py-4 sm:py-5 border-b flex justify-between text-sm sm:text-base"
                  >
                    <span>{label}</span>
                    <span className="text-muted-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============ PRODUCT STORY ============ */}
      <section
        dir="rtl"
        className="w-full max-w-7xl mx-auto py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8"
      >
        <ScrollReveal direction="bottom" distance={40} duration={1.2}>
          <div className="max-w-4xl">
            <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
              داستان محصول
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-[1.2] sm:leading-[1.15] md:leading-[1.12] tracking-tight">
              برای ساختن چیزی ماندگار، باید از چیزی اصیل آغاز کرد.
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="bottom" distance={50} delay={0.25}>
          <p className="max-w-2xl text-lg sm:text-xl md:text-2xl leading-[1.7] sm:leading-[1.6] text-muted-foreground mt-10 sm:mt-14 md:mt-16 md:mr-auto">
            این محصول با نگاهی به ریشه‌های هنر چرم‌دوزی و توجه به نیازهای امروز
            ساخته شده است؛ از انتخاب متریال تا آخرین جزئیات، هر بخش با دقت انتخاب
            و پرداخته شده تا زیبایی آن با گذر زمان ماندگار بماند.
          </p>
        </ScrollReveal>
      </section>

      {/* ============ DETAILS GALLERY ============ */}
      <section
        dir="rtl"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24 md:pb-32"
      >
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4">
          <ScrollReveal direction="right" distance={60}>
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-muted">
              <img
                src="/images/product-d.jpg"
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>

          <div className="flex flex-col gap-3 sm:gap-4">
            <ScrollReveal direction="left" distance={60} delay={0.15}>
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                <img
                  src="/images/product-e.jpg"
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" distance={60} delay={0.3}>
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-muted">
                <img
                  src="/images/product-f.jpg"
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============ FEATURES ============ */}
      <section
        dir="rtl"
        className="w-full max-w-7xl mx-auto py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 border-t"
      >
        <div className="grid md:grid-cols-2 gap-10 sm:gap-12 md:gap-16">
          <ScrollReveal direction="right" distance={60}>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5">
                جزئیات
              </p>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium leading-[1.2] sm:leading-[1.15]">
                زیبایی، در جزئیات شکل می‌گیرد.
              </h2>
            </div>
          </ScrollReveal>

          <div className="space-y-0">
            {[
              ["چرم", "طبیعی و مرغوب"],
              ["آستر", "چرم گوساله"],
              ["پرداخت", "دقیق و دست‌پرداز"],
              ["رنگ", color],
              ["تولید", "ساخته‌شده در بالوی"],
            ].map(([label, value], index) => (
              <ScrollReveal
                key={label}
                direction="left"
                distance={40}
                delay={index * 0.1}
              >
                <div className="py-4 sm:py-5 border-b flex justify-between text-base sm:text-lg">
                  <span>{label}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ RELATED PRODUCTS ============ */}
      <section
        dir="rtl"
        className="w-full max-w-7xl mx-auto pt-8 sm:pt-12 md:pt-16 px-4 sm:px-6 lg:px-8"
      >
        <ScrollReveal direction="bottom" distance={40}>
          <div className="flex items-end justify-between mb-8 sm:mb-10 md:mb-12">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                انتخابی دیگر
              </p>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium">
                شاید این‌ها را هم بپسندید
              </h2>
            </div>
          </div>
        </ScrollReveal>

        <ItemsCarousel>
          {Array.from({ length: 8 }).map((_, i) => (
            <ItemCard
              key={i}
              item={{
                name: "بوت مشکی",
                colors: ["#1f1f1f", "#301b1b"],
                beforePrice: 2500000,
                price: 2000000,
                image: "/images/boot.png",
              }}
            />
          ))}
        </ItemsCarousel>
      </section>
    </main>
  );
}