"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/scroll-reveal";
import ScrollParallax from "@/components/scroll-parallax";
import ItemsCarousel from "@/components/items-carousel";
import ItemCard from "@/components/item-card";

// ─── Product data (with unique IDs) ────────────────────────────────────────
const menProducts = [
  { id: "men-1", name: "بوت چرمی مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 3200000, price: 2850000, image: "/images/boot.png" },
  { id: "men-2", name: "کفش رسمی کلاسیک", colors: ["#1c1c1c", "#4a3024"], beforePrice: 2900000, price: 2500000, image: "/images/shoe.png" },
  { id: "men-3", name: "لوفر چرمی", colors: ["#211b18", "#5a3828"], beforePrice: 2700000, price: 2300000, image: "/images/loafer.png" },
  { id: "men-4", name: "کیف دستی مردانه", colors: ["#1c1c1c", "#38251d"], beforePrice: 4100000, price: 3600000, image: "/images/bag.png" },
  { id: "men-5", name: "بوت چرمی مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 3200000, price: 2850000, image: "/images/boot.png" },
  { id: "men-6", name: "کفش رسمی کلاسیک", colors: ["#1c1c1c", "#4a3024"], beforePrice: 2900000, price: 2500000, image: "/images/shoe.png" },
  { id: "men-7", name: "لوفر چرمی", colors: ["#211b18", "#5a3828"], beforePrice: 2700000, price: 2300000, image: "/images/loafer.png" },
  { id: "men-8", name: "کیف دستی مردانه", colors: ["#1c1c1c", "#38251d"], beforePrice: 4100000, price: 3600000, image: "/images/bag.png" },
];

const womenProducts = [
  { id: "women-1", name: "بوت چرمی زنانه", colors: ["#1f1f1f", "#301b1b"], beforePrice: 3200000, price: 2850000, image: "/images/boot.png" },
  { id: "women-2", name: "کیف چرمی کلاسیک", colors: ["#1f1f1f", "#5a3828"], beforePrice: 3500000, price: 3100000, image: "/images/bag.png" },
  { id: "women-3", name: "کفش چرمی زنانه", colors: ["#1c1c1c", "#4a3024"], beforePrice: 2800000, price: 2400000, image: "/images/shoe.png" },
  { id: "women-4", name: "کیف دوشی چرمی", colors: ["#211b18", "#6a4634"], beforePrice: 3000000, price: 2600000, image: "/images/bag.png" },
  { id: "women-5", name: "لوفر زنانه", colors: ["#1d1d1d", "#513529"], beforePrice: 2600000, price: 2250000, image: "/images/loafer.png" },
  { id: "women-6", name: "کیف دستی کوچک", colors: ["#202020", "#754d39"], beforePrice: 2800000, price: 2450000, image: "/images/bag.png" },
  { id: "women-7", name: "بوت کوتاه چرمی", colors: ["#181818", "#3c2920"], beforePrice: 3100000, price: 2750000, image: "/images/boot.png" },
  { id: "women-8", name: "کفش کلاسیک زنانه", colors: ["#1d1d1d", "#54372a"], beforePrice: 2700000, price: 2350000, image: "/images/shoe.png" },
];

export default function ProductsPage() {
  // ─── Scroll spy state ────────────────────────────────────────────────────
  const [activeSection, setActiveSection] = useState<string>("men");

  useEffect(() => {
    // Smooth scroll for whole document (if not already set globally)
    document.documentElement.style.scrollBehavior = "smooth";

    const sections = document.querySelectorAll<HTMLElement>("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -60% 0px", // adjust for navbar offset
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  return (
    <main dir="rtl" className="w-full overflow-hidden">
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-0 pt-24 pb-28">
        <div className="grid md:grid-cols-2 gap-10 items-end">
          <ScrollReveal direction="right" distance={70} duration={1.1}>
            <div>
              <p className="text-sm text-muted-foreground mb-6">مجموعه بالوی</p>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight leading-[1.05]">
                چرم،
                <br />
                به روایت بالوی.
              </h1>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="left" distance={60} duration={1} delay={0.2}>
            <p className="max-w-md mr-auto text-xl md:text-2xl leading-[1.5] text-muted-foreground">
              مجموعه‌ای از محصولاتی که در آن اصالت چرم، هنر دست و نگاه امروزی
              در کنار هم قرار گرفته‌اند.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── CATEGORY NAV ──────────────────────────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-0 pb-20">
        <ScrollReveal direction="bottom" distance={25}>
          <div className="flex items-center gap-3 border-b pb-5">
            <Link
              href="#men"
              aria-current={activeSection === "men" ? "page" : undefined}
              className={`px-6 py-2.5 rounded-full transition ${
                activeSection === "men"
                  ? "bg-foreground text-background"
                  : "border hover:bg-muted"
              }`}
            >
              مردانه
            </Link>
            <Link
              href="#women"
              aria-current={activeSection === "women" ? "page" : undefined}
              className={`px-6 py-2.5 rounded-full transition ${
                activeSection === "women"
                  ? "bg-foreground text-background"
                  : "border hover:bg-muted"
              }`}
            >
              زنانه
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── MEN ──────────────────────────────────────────────────────────── */}
      <section
        id="men"
        className="w-full max-w-7xl mx-auto px-6 lg:px-0 pb-36 scroll-mt-24"
      >
        <ScrollReveal direction="right" distance={55}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div>
              <p className="text-sm text-muted-foreground mb-4">مجموعه مردانه</p>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
                مردانه
              </h2>
            </div>
            <p className="max-w-md text-lg leading-[1.5] text-muted-foreground">
              طراحی‌هایی با خطوط ساده و متریال اصیل؛ برای آن‌هایی که کیفیت را
              در جزئیات می‌بینند.
            </p>
          </div>
        </ScrollReveal>

        <ItemsCarousel>
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
        </ItemsCarousel>
      </section>

      {/* ─── EDITORIAL VIDEO ──────────────────────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-0 pb-36">
        <ScrollReveal direction="bottom" distance={70} duration={1.2}>
          <div
            data-navbar="dark"
            className="relative h-[60vh] min-h-[460px] rounded-lg overflow-hidden"
          >
            <ScrollParallax
              axis="y"
              strength={35}
              speed={0.04}
              className="absolute inset-0 w-full h-full"
            >
              <video
                src="/videos/compressed/video-f.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover scale-110"
              />
            </ScrollParallax>

            <div className="absolute inset-0 flex items-end p-8 sm:p-12 md:p-16">
              <div className="max-w-2xl text-background">
                <ScrollReveal direction="right" distance={55} delay={0.3}>
                  <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium leading-[1.1]">
                    هر تکه از چرم،
                    <br />
                    داستانی برای گفتن دارد.
                  </h2>
                </ScrollReveal>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── WOMEN ────────────────────────────────────────────────────────── */}
      <section
        id="women"
        className="w-full max-w-7xl mx-auto px-6 lg:px-0 scroll-mt-24"
      >
        <ScrollReveal direction="left" distance={55}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div>
              <p className="text-sm text-muted-foreground mb-4">مجموعه زنانه</p>
              <h2 className="text-4xl md:text-5xl font-medium tracking-tight">
                زنانه
              </h2>
            </div>
            <p className="max-w-md text-lg leading-[1.5] text-muted-foreground">
              ظرافتی آرام و بی‌تکلف، شکل‌گرفته از چرم اصیل و توجه به کوچک‌ترین
              جزئیات.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="bottom" distance={50} duration={1} delay={0.15}>
            <ItemsCarousel>
            <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
            <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
            <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
            <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
            <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
            <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
            <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
            <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
            </ItemsCarousel>
        </ScrollReveal>
      </section>

      {/* ─── BRAND STATEMENT ─────────────────────────────────────────────── */}
      <section className="w-full max-w-7xl mx-auto px-6 lg:px-0 py-10">
        <ScrollReveal direction="bottom" distance={35} duration={1.3}>
          <div className="border-t pt-16">
            <h2 className="max-w-4xl text-4xl md:text-6xl font-medium leading-[1.12] tracking-tight">
              اصالت را نمی‌توان ساخت؛
              <br />
              باید سال‌ها آن را زندگی کرد.
            </h2>
          </div>
        </ScrollReveal>
      </section>

    </main>
  );
}