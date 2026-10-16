"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { productCategoryLabels } from "@/features/catalog/model/categories";
import { useEffect, useState } from "react";

export default function ProductsCategoryNav() {
  const searchParams = useSearchParams();

  const gender = searchParams.get("gender");
  const activeCategory = searchParams.get("category");

  const [scrolled, setScrolled] = useState(false);
  const [darkBackground, setDarkBackground] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    const navbarSections = document.querySelectorAll("[data-navbar-dark]");

    if (!navbarSections.length) {
      const frame = requestAnimationFrame(() => setDarkBackground(false));
      return () => cancelAnimationFrame(frame);
    }

    const createObserver = () => {
      const navbarHeight = 128;

      const observer = new IntersectionObserver(
        (entries) => {
          const activeDarkSection = entries.some(
            (entry) => entry.isIntersecting,
          );

          setDarkBackground(activeDarkSection);
        },
        {
          rootMargin: `0px 0px -${window.innerHeight - navbarHeight}px 0px`,
          threshold: 0,
        },
      );

      navbarSections.forEach((section) => {
        observer.observe(section);
      });

      return observer;
    };

    let observer = createObserver();

    const handleResize = () => {
      observer.disconnect();
      observer = createObserver();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const textColor = darkBackground ? "text-primary" : "text-muted-foreground";

  const hoverColor = darkBackground
    ? "hover:text-accent"
    : "hover:text-foreground";

  const categories = [
    {
      label: "همه محصولات",
      value: null,
    },
    ...productCategoryLabels.map((category) => ({
      label: category,
      value: category,
    })),
  ];

  return (
    <nav
      dir="rtl"
      className="fixed top-0 left-1/2 z-198 flex w-full -translate-x-1/2 items-center justify-center transition-all duration-500"
    >
      <div
        className={`flex w-full items-center justify-center overflow-hidden border px-4 py-1 pt-14 backdrop-blur-2xl transition-all duration-500 ease-out ${
          darkBackground
            ? "divide-primary/20 border-primary/20 bg-secondary/50"
            : "divide-border/40 border-border/20 bg-background/20"
        } ${
          scrolled && darkBackground
            ? "border-primary/30 bg-secondary/60"
            : scrolled
              ? "border-border/40 bg-background/30"
              : "border-border/0!"
        }`}
      >
        <div className="scrollbar-hide flex h-10 max-w-full items-center justify-start gap-8 overflow-x-auto sm:h-12 md:h-14">
          {categories.map((category) => {
            const params = new URLSearchParams();

            if (gender) {
              params.set("gender", gender);
            }

            if (category.value) {
              params.set("category", category.value);
            }

            const query = params.toString();

            const href = query ? `/products?${query}` : "/products";

            const isActive =
              category.value === activeCategory ||
              (!category.value && !activeCategory);

            return (
              <Link
                key={category.label}
                href={href}
                className={`relative flex h-full shrink-0 items-center text-sm font-medium whitespace-nowrap transition-colors ${textColor} ${hoverColor} ${category.label === "همه محصولات" && "font-bold!"}`}
              >
                {category.label}

                <span
                  className={`absolute right-2 bottom-0 left-2 h-px origin-center bg-current transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
