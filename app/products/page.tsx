"use client";

import Link from "next/link";
import { ArrowDown, ArrowLeft, ArrowUpLeft } from "lucide-react";
import ProductCarousel from "@/components/items-carousel";
import ItemCard from "@/components/item-card";
import ScrollReveal from "@/components/scroll-reveal";
import ScrollParallax from "@/components/scroll-parallax";

/* ---------------- data ---------------- */

const menProducts = [
  { name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png" },
  { name: "کفش کلاسیک", colors: ["#241c18", "#111111"], beforePrice: 3200000, price: 2800000, image: "/images/boot.png" },
  { name: "بوت چرمی قهوه‌ای", colors: ["#5a3825", "#241c18"], beforePrice: 3500000, price: 3100000, image: "/images/boot.png" },
  { name: "کفش رسمی", colors: ["#111111", "#30251f"], beforePrice: 2900000, price: 2500000, image: "/images/boot.png" },
  { name: "نیم بوت چرمی", colors: ["#30231c", "#171717"], beforePrice: 3300000, price: 2950000, image: "/images/boot.png" },
];

const womenProducts = [
  { name: "بوت زنانه مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2800000, price: 2400000, image: "/images/boot.png" },
  { name: "کفش زنانه کلاسیک", colors: ["#3a2921", "#161616"], beforePrice: 2600000, price: 2250000, image: "/images/boot.png" },
  { name: "بوت قهوه‌ای", colors: ["#62402c", "#241c18"], beforePrice: 3300000, price: 2950000, image: "/images/boot.png" },
  { name: "کفش روزمره", colors: ["#242424", "#4a3024"], beforePrice: 2400000, price: 2100000, image: "/images/boot.png" },
  { name: "بوت بلند چرمی", colors: ["#181818", "#38251d"], beforePrice: 3900000, price: 3500000, image: "/images/boot.png" },
];

/* ---------------- page ---------------- */

export default function ProductsPage() {
  return (
    <main dir="rtl" className="w-full overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="w-full pt-32 pb-14 sm:pt-36 sm:pb-16">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <ScrollReveal direction="bottom" distance={40}>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="tracking-[0.2em]">BALVI / COLLECTION</span>
              <span className="h-px flex-1 bg-foreground/10" />
              <span>2026</span>
            </div>
          </ScrollReveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end lg:gap-20">
            <ScrollReveal direction="right" distance={50} delay={0.1}>
              <h1 className="text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
                مجموعه‌ای
                <br />
                از چرم و دقت.
              </h1>
            </ScrollReveal>

            <ScrollReveal direction="left" distance={50} delay={0.2}>
              <p className="max-w-md text-base leading-8 text-muted-foreground lg:pb-3">
                هر محصول بالوی حاصل انتخاب دقیق چرم، ساخت دست و توجه به
                جزئیاتی است که با گذر زمان دیده می‌شود. مجموعه‌ی مردانه و
                زنانه، هر یک با زبان خودشان.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ================= CATEGORY SPLIT ================= */}
      <section className="w-full pb-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-4 md:grid-cols-2 md:gap-5">
            <CategoryCard
              href="#men"
              eyebrow="MEN / 01"
              title="مردانه"
              description="طراحی ماندگار، چرم طبیعی و ساخت دقیق"
              image="/images/boot.png"
            />
            <CategoryCard
              href="#women"
              eyebrow="WOMEN / 02"
              title="زنانه"
              description="ظرافت، کیفیت و طراحی امروزی در چرم طبیعی"
              image="/images/boot.png"
              delay={0.12}
            />
          </div>
        </div>
      </section>

      {/* ================= MEN ================= */}
      <section id="men" className="w-full scroll-mt-24 pb-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <ScrollReveal direction="right" distance={40}>
            <SectionHeader
              index="01"
              title="مردانه"
              description="طراحی ماندگار، چرم طبیعی و ساخت دقیق"
              href="/products/men"
            />
          </ScrollReveal>

          <ScrollReveal
            direction="bottom"
            distance={40}
            duration={1}
            delay={0.15}
            className="mt-10 w-full"
          >
            <ProductCarousel>
              {menProducts.map((product, i) => (
                <ItemCard key={`${product.name}-${i}`} item={product} />
              ))}
            </ProductCarousel>
          </ScrollReveal>

          <div className="mt-8 flex justify-end sm:hidden">
            <Link
              href="/products/men"
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              مشاهده مجموعه مردانه
              <ArrowLeft size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= EDITORIAL BREAK ================= */}
      <section className="relative h-[50vh] min-h-[360px] w-full overflow-hidden">
        <ScrollParallax
          speed={0.08}
          className="absolute inset-0 h-[115%] w-full"
        >
          <video
            src="/videos/compressed/video-c.mp4"
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        </ScrollParallax>

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex h-full w-full items-center justify-center px-6 text-white">
          <ScrollReveal direction="bottom" distance={35} duration={1}>
            <div className="flex flex-col items-center gap-5 text-center">
              <span className="text-[10px] tracking-[0.3em] text-white/60 sm:text-xs">
                NATURAL LEATHER
              </span>

              <h2 className="max-w-2xl text-3xl leading-[1.25] tracking-tight sm:text-4xl md:text-5xl">
                چرم، ماده‌ای که با گذر زمان
                <br className="hidden sm:block" />
                شخصیت پیدا می‌کند.
              </h2>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= WOMEN ================= */}
      <section id="women" className="w-full scroll-mt-24 pb-24 pt-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <ScrollReveal direction="right" distance={40}>
            <SectionHeader
              index="02"
              title="زنانه"
              description="ظرافت، کیفیت و طراحی امروزی در چرم طبیعی"
              href="/products/women"
            />
          </ScrollReveal>

          <ScrollReveal
            direction="bottom"
            distance={40}
            duration={1}
            delay={0.15}
            className="mt-10 w-full"
          >
            <ProductCarousel>
              {womenProducts.map((product, i) => (
                <ItemCard key={`${product.name}-${i}`} item={product} />
              ))}
            </ProductCarousel>
          </ScrollReveal>

          <div className="mt-8 flex justify-end sm:hidden">
            <Link
              href="/products/women"
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              مشاهده مجموعه زنانه
              <ArrowLeft size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= BRAND STATEMENT ================= */}
      <section className="w-full pb-20">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <ScrollReveal direction="bottom" distance={35} duration={1}>
            <div className="border-y border-foreground/10 py-12">
              <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-lg">
                  <span className="text-xs text-muted-foreground">
                    BALVI / PHILOSOPHY
                  </span>

                  <h2 className="mt-3 text-2xl leading-[1.3] tracking-tight sm:text-3xl">
                    ساخته شده از چرم، پرداخته شده با هنر.
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-6 text-sm sm:grid-cols-3 sm:gap-12">
                  <Statement title="چرم طبیعی" desc="انتخاب شده با دقت" />
                  <Statement title="ساخت دقیق" desc="توجه به جزئیات" />
                  <Statement title="اصالت بالوی" desc="تجربه‌ای ماندگار" />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================= FINAL CTA ================= */}
      <section className="w-full pb-24">
        <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
          <ScrollReveal direction="bottom" distance={30} duration={1}>
            <div className="flex flex-col gap-6 border-t border-foreground/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-sm text-sm leading-7 text-muted-foreground">
                برای دریافت اطلاعات بیشتر درباره محصولات، قیمت عمده یا
                هماهنگی بازدید از کارگاه با ما در تماس باشید.
              </p>

              <Link
                href="/contact"
                className="group flex items-center gap-3 text-sm"
              >
                تماس با ما
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/10 transition-transform duration-300 group-hover:-translate-x-1">
                  <ArrowUpLeft size={15} />
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}

/* ---------------- helpers ---------------- */

function CategoryCard({
  href,
  eyebrow,
  title,
  description,
  image,
  delay = 0,
}: {
  href: string;
  eyebrow: string;
  title: string;
  description: string;
  image: string;
  delay?: number;
}) {
  return (
    <ScrollReveal direction="bottom" distance={40} delay={delay}>
      <Link
        href={href}
        className="group relative flex aspect-[4/3] w-full overflow-hidden rounded-md bg-muted md:aspect-[5/4]"
      >
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-6 text-white sm:p-8">
          <span className="text-[10px] tracking-[0.25em] text-white/70">
            {eyebrow}
          </span>

          <div className="flex items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
                {title}
              </h2>
              <p className="mt-2 max-w-xs text-sm leading-6 text-white/80">
                {description}
              </p>
            </div>

            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 transition-all duration-300 group-hover:bg-white group-hover:text-black">
              <ArrowDown size={16} />
            </span>
          </div>
        </div>
      </Link>
    </ScrollReveal>
  );
}

function SectionHeader({
  index,
  title,
  description,
  href,
}: {
  index: string;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <div className="flex flex-col gap-6 border-t border-foreground/10 pt-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-5 sm:gap-8">
        <span className="pt-3 text-xs text-muted-foreground">{index}</span>

        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
      </div>

      <Link
        href={href}
        className="group hidden items-center gap-2 text-sm sm:flex"
      >
        مشاهده همه
        <ArrowLeft
          size={16}
          className="transition-transform group-hover:-translate-x-1"
        />
      </Link>
    </div>
  );
}

function Statement({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-foreground">{title}</span>
      <span className="text-muted-foreground">{desc}</span>
    </div>
  );
}