"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";

const categories = [
  {
    title: "روزمره",
    href: "/products?gender=male&category=روزمره",
    image: "/images/categories/sandal.png",
  },
  {
    title: "اداری",
    href: "/products?gender=male&category=اداری",
    image: "/images/categories/edari.png",
  },
  {
    title: "اسپرت",
    href: "/products?gender=male&category=اسپرت",
    image: "/images/categories/sport.png",
  },
  {
    title: "کلاسیک",
    href: "/products?gender=male&category=کلاسیک",
    image: "/images/categories/classic.png",
  },
  {
    title: "راحتی",
    href: "/products?gender=male&category=راحتی",
    image: "/images/categories/rahati.png",
  },
  {
    title: "بوت و نیم بوت",
    href: "/products?gender=male&category=بوت و نیم بوت",
    image: "/images/categories/boot.png",
  },
];

export default function ProductCategories() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;

    const amount = carouselRef.current.clientWidth * 0.75;

    carouselRef.current.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section
      dir="rtl"
      className="flex w-full justify-center px-6 py-24 md:px-10 md:py-18 pt-24"
    >
      <div className="flex w-full max-w-[1700px] items-center gap-4">
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="دسته بندی قبلی"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background"
        >
          <ArrowRight size={19} />
        </button>

        <div
          ref={carouselRef}
          className="flex min-w-0 flex-1 gap-4 overflow-x-auto scroll-smooth scrollbar-hide"
        >
          {categories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group relative min-w-[78%] overflow-hidden rounded-md sm:min-w-[52%] lg:min-w-[35%] xl:min-w-[27%]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 52vw, (max-width: 1280px) 35vw, 27vw"
                  className="rounded-md object-cover object-bottom transition-all duration-700 ease-out group-hover:scale-110 group-hover:blur-xl"
                />
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <span className="translate-y-3 text-2xl font-bold text-black opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 md:text-4xl">
                  {category.title}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="دسته بندی بعدی"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-colors duration-300 hover:bg-foreground hover:text-background"
        >
          <ArrowLeft size={19} />
        </button>
      </div>
    </section>
  );
}