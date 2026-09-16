"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useRef } from "react";

const categories = [
  {
    title: "روزمره",
    href: "/products?gender=male&category=روزمره",
    image: "/images/categories/everyday.jpg",
  },
  {
    title: "اداری",
    href: "/products?gender=male&category=اداری",
    image: "/images/categories/formal.jpg",
  },
  {
    title: "اسپرت",
    href: "/products?gender=male&category=اسپرت",
    image: "/images/categories/sport.jpg",
  },
  {
    title: "کلاسیک",
    href: "/products?gender=male&category=کلاسیک",
    image: "/images/categories/classic.jpg",
  },
  {
    title: "راحتی",
    href: "/products?gender=male&category=راحتی",
    image: "/images/categories/comfort.jpg",
  },
  {
    title: "بوت و نیم بوت",
    href: "/products?gender=male&category=بوت و نیم بوت",
    image: "/images/categories/boots.jpg",
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
      className="flex w-full justify-center px-6 py-24 md:px-10 md:py-32"
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
              className="group relative min-w-[78%] overflow-hidden rounded-md bg-foreground/[0.035] sm:min-w-[52%] lg:min-w-[35%] xl:min-w-[27%]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 52vw, (max-width: 1280px) 35vw, 27vw"
                  className="object-contain p-6 transition-transform duration-700 ease-out group-hover:scale-110 md:p-8"
                />

                <div className="absolute inset-x-0 bottom-0 flex justify-center pb-7">
                  <span className="text-base font-medium text-foreground">
                    {category.title}
                  </span>
                </div>
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