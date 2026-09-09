"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, ChevronDown } from "lucide-react";

import ScrollReveal from "@/components/scroll-reveal";
import ScrollParallax from "@/components/scroll-parallax";
import ItemCard from "@/components/item-card";
import ProductCarousel from "@/components/items-carousel";

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
      {/* Hero */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 pt-18 pb-24">
        <div className="grid lg:grid-cols-[1.35fr_0.65fr] gap-8 items-start">
          {/* Product Images */}
          <ScrollReveal
            direction="right"
            distance={70}
            duration={1.1}
            className="w-full"
          >
            <div className="grid grid-cols-2 gap-4">
              <div
                className="col-span-2 aspect-[4/3] rounded-lg overflow-hidden bg-muted"
              >
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

              <div
                className="aspect-square rounded-lg overflow-hidden bg-muted"
              >
                <img
                  src={product.images[1]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <div
                className="aspect-square rounded-lg overflow-hidden bg-muted"
              >
                <img
                  src={product.images[2]}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </ScrollReveal>

          {/* Product Info */}
          <div className="lg:sticky lg:top-24 h-fit">
            <ScrollReveal
              direction="left"
              distance={60}
              duration={1}
              delay={0.15}
            >
              <p className="text-sm text-muted-foreground mb-4">
                {product.category}
              </p>

              <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.1]">
                {product.name}
              </h1>

              <div className="flex items-center gap-3 mt-6">
                <span className="text-2xl font-medium">
                  {product.price.toLocaleString("fa-IR")} تومان
                </span>

                <span className="text-base text-muted-foreground line-through">
                  {product.beforePrice.toLocaleString("fa-IR")} تومان
                </span>
              </div>

              <p className="text-lg leading-[1.6] text-muted-foreground mt-7 max-w-md">
                {product.description}
              </p>
            </ScrollReveal>

            <div className="mt-10 space-y-8">
              {/* Color */}
              <ScrollReveal direction="left" distance={40} delay={0.3}>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">رنگ</span>
                    <span className="text-muted-foreground">{color}</span>
                  </div>

                  <div className="flex gap-3">
                    {product.colors.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => setColor(item.name)}
                        className={`w-9 h-9 rounded-full border-2 p-1 ${
                          color === item.name
                            ? "border-foreground"
                            : "border-transparent"
                        }`}
                        aria-label={item.name}
                      >
                        <span
                          className="block w-full h-full rounded-full"
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
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-medium">سایز</span>

                    <button className="text-sm text-muted-foreground flex items-center gap-1">
                      راهنمای سایز
                      <ChevronDown size={15} />
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-2">
                    {product.sizes.map((item) => (
                      <button
                        key={item}
                        onClick={() => setSize(item)}
                        className={`h-12 rounded-md border transition ${
                          size === item
                            ? "bg-foreground text-background border-foreground"
                            : "border-border hover:border-foreground"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* Quantity + Add */}
              <ScrollReveal direction="left" distance={40} delay={0.5}>
                <div className="flex gap-3">
                  <div className="h-14 border rounded-md flex items-center px-4 gap-5">
                    <button
                      onClick={() =>
                        setQuantity((value) => Math.max(1, value - 1))
                      }
                    >
                      <Minus size={17} />
                    </button>

                    <span className="min-w-4 text-center">{quantity}</span>

                    <button
                      onClick={() => setQuantity((value) => value + 1)}
                    >
                      <Plus size={17} />
                    </button>
                  </div>

                  <button className="flex-1 h-14 rounded-md bg-foreground text-background flex items-center justify-center gap-2 text-base hover:opacity-90 transition">
                    <ShoppingBag size={19} />
                    افزودن به سبد خرید
                  </button>
                </div>
              </ScrollReveal>
            </div>

            {/* Details */}
            <ScrollReveal direction="left" distance={40} delay={0.6}>
              <div className="mt-10 border-t">
                <div className="py-5 border-b flex justify-between">
                  <span>جنس</span>
                  <span className="text-muted-foreground">
                    چرم طبیعی گاوی
                  </span>
                </div>

                <div className="py-5 border-b flex justify-between">
                  <span>آستر</span>
                  <span className="text-muted-foreground">
                    چرم گوساله
                  </span>
                </div>

                <div className="py-5 border-b flex justify-between">
                  <span>ساخت</span>
                  <span className="text-muted-foreground">
                    تولید بالوی
                  </span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Product Story */}
      <section
        dir="rtl"
        className="w-full max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-0"
      >
        <ScrollReveal
          direction="bottom"
          distance={40}
          duration={1.2}
        >
          <div className="max-w-4xl">
            <p className="text-sm text-muted-foreground mb-6">
              داستان محصول
            </p>

            <h2 className="text-4xl md:text-6xl font-medium leading-[1.12] tracking-tight">
              برای ساختن چیزی ماندگار، باید از چیزی اصیل آغاز کرد.
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="bottom" distance={50} delay={0.25}>
          <p className="max-w-2xl text-xl md:text-2xl leading-[1.6] text-muted-foreground mt-16 mr-auto">
            این محصول با نگاهی به ریشه‌های هنر چرم‌دوزی و توجه به نیازهای امروز
            ساخته شده است؛ از انتخاب متریال تا آخرین جزئیات، هر بخش با دقت انتخاب
            و پرداخته شده تا زیبایی آن با گذر زمان ماندگار بماند.
          </p>
        </ScrollReveal>
      </section>

      {/* Details Gallery */}
      <section
        dir="rtl"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 pb-32"
      >
        <div className="grid md:grid-cols-2 gap-4">
          <ScrollReveal direction="right" distance={60}>
            <div
              className="aspect-[4/5] rounded-lg overflow-hidden bg-muted"
            >
              <img
                src="/images/product-d.jpg"
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          </ScrollReveal>

          <div className="flex flex-col gap-4">
            <ScrollReveal direction="left" distance={60} delay={0.15}>
              <div
                className="aspect-[4/3] rounded-lg overflow-hidden bg-muted"
              >
                <img
                  src="/images/product-e.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="left" distance={60} delay={0.3}>
              <div
                className="aspect-[4/3] rounded-lg overflow-hidden bg-muted"
              >
                <img
                  src="/images/product-f.jpg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Product Features */}
      <section
        dir="rtl"
        className="w-full max-w-7xl mx-auto py-32 px-4 sm:px-6 lg:px-0 border-t"
      >
        <div className="grid md:grid-cols-2 gap-16">
          <ScrollReveal direction="right" distance={60}>
            <div>
              <p className="text-sm text-muted-foreground mb-5">
                جزئیات
              </p>

              <h2 className="text-4xl md:text-5xl font-medium leading-[1.15]">
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
                <div className="py-5 border-b flex justify-between text-lg">
                  <span>{label}</span>
                  <span className="text-muted-foreground">{value}</span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section
        dir="rtl"
        className="w-full max-w-7xl mx-auto pt-16 px-4 sm:px-6 lg:px-0"
      >
        <ScrollReveal direction="bottom" distance={40}>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-sm text-muted-foreground mb-4">
                انتخابی دیگر
              </p>

              <h2 className="text-4xl md:text-5xl font-medium">
                شاید این‌ها را هم بپسندید
              </h2>
            </div>
          </div>
        </ScrollReveal>

        <ProductCarousel>
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
        </ProductCarousel>
      </section>
    </main>
  );
}