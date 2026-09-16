"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { productCategories } from "@/lib/products/categories";
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
    const navbarSections =
      document.querySelectorAll("[data-navbar-dark]");

    if (!navbarSections.length) {
      setDarkBackground(false);
      return;
    }

    const createObserver = () => {
      const navbarHeight = 128;

      const observer = new IntersectionObserver(
        (entries) => {
          const activeDarkSection = entries.some(
            (entry) => entry.isIntersecting
          );

          setDarkBackground(activeDarkSection);
        },
        {
          rootMargin: `0px 0px -${
            window.innerHeight - navbarHeight
          }px 0px`,
          threshold: 0,
        }
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

  const textColor = darkBackground
    ? "text-primary"
    : "text-muted-foreground";

  const hoverColor = darkBackground
    ? "hover:text-accent"
    : "hover:text-foreground";

  const categories = [
    {
      label: "همه محصولات",
      value: null,
    },
    ...productCategories.map((category) => ({
      label: category,
      value: category,
    })),
  ];

  return (
    <nav
      dir="rtl"
      className="fixed left-1/2 -translate-x-1/2 top-0 z-198 flex w-full items-center justify-center transition-all duration-500"
    >
      <div
        className={`flex pt-14 w-full items-center justify-center overflow-hidden border  py-1 backdrop-blur-2xl px-4 transition-all duration-500 ease-out ${
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
        <div className="flex max-w-full items-center justify-start gap-8 overflow-x-auto scrollbar-hide md:h-14 sm:h-12 h-10">
          {categories.map((category) => {
            const params = new URLSearchParams();

            if (gender) {
              params.set("gender", gender);
            }

            if (category.value) {
              params.set("category", category.value);
            }

            const query = params.toString();

            const href = query
              ? `/products?${query}`
              : "/products";

            const isActive =
              category.value === activeCategory ||
              (!category.value && !activeCategory);

            return (
              <Link
                key={category.label}
                href={href}
                className={`relative flex h-full shrink-0 items-center whitespace-nowrap text-sm font-medium transition-colors ${textColor} ${hoverColor} ${category.label === "همه محصولات" && "font-bold!"}`}
              >
                {category.label}

                <span
                  className={`absolute bottom-0 left-2 right-2 h-px origin-center bg-current transition-transform duration-300 ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0"
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