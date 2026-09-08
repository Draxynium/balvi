"use client";


import { useEffect, useState } from "react";
import { Info, Search, ShoppingBag, ShoppingCart } from "lucide-react";

export default function NavigationBar() {
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
    const navbarSections = document.querySelectorAll("[data-navbar]");

    if (!navbarSections.length) return;

    const createObserver = () => {
      const navbarHeight = 64;

      const observer = new IntersectionObserver(
        (entries) => {
          const activeDarkSection = entries.some(
            (entry) =>
              entry.isIntersecting &&
              entry.target.getAttribute("data-navbar") === "dark"
          );

          setDarkBackground(activeDarkSection);
        },
        {
          rootMargin: `0px 0px -${window.innerHeight - navbarHeight}px 0px`,
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

  return (
    <nav className="fixed z-200 flex h-16 w-full items-center justify-center py-2">
      <div
        className={`
          px-4 py-2 h-full flex items-center justify-center
          divide-x
          rounded-full
          backdrop-blur-2xl backdrop-saturate-150
          border
          transition-all duration-500 ease-out
          w-xl max-w-full

          ${
            darkBackground
              ? "bg-secondary/50 border-primary/20 divide-primary/20"
              : "bg-background/20 border-border/20 divide-border/40"
          }

          ${scrolled ? "w-2xl!" : "border-border/0!"}

          ${
            scrolled && darkBackground
              ? "bg-secondary/60 border-primary/30"
              : scrolled
                ? "bg-background/30 border-border/40"
                : ""
          }
        `}
      >
        <a
          href="/"
          className={`
            text-sm font-medium
            transition-colors
            w-28 h-full
            flex items-center justify-center gap-2
            ${textColor}
            ${hoverColor}
          `}
        >
          <ShoppingCart size={18} />
          <p>سبد خرید</p>
        </a>

        <a
          href="/"
          className={`
            text-sm font-medium
            transition-colors
            w-28 h-full
            flex items-center justify-center gap-2
            ${textColor}
            ${hoverColor}
          `}
        >
          <Search size={18} />
          <p>جستجو</p>
        </a>

        <a
          href="/"
          className={`
            text-sm font-medium
            transition-colors
            w-28 h-full
            flex items-center justify-center
            gap-2 flex-1
            ${textColor}
            ${hoverColor}
          `}
        >
          <div className="relative h-8 w-32 overflow-hidden">
            <img
              src="/logo.svg"
              className={`
                absolute left-1/2 top-1/2
                -translate-x-1/2 -translate-y-1/2
                h-8 w-auto
                transition-transform duration-500 ease-in-out text-primary
                ${scrolled ? "translate-y-[-150%]" : "translate-y-[-50%]"}
              `}
            />

            <img
              src="/text-logo.svg"
              alt="Logo"
              className={`
                absolute left-1/2 top-1/2
                -translate-x-1/2
                h-8 w-auto
                transition-transform duration-500 ease-in-out py-1
                ${
                  scrolled
                    ? "-translate-y-1/2"
                    : "translate-y-[150%]"
                }
              `}
            />
          </div>
        </a>

        <a
          href="/"
          className={`
            text-sm font-medium
            transition-colors
            w-28 h-full
            flex items-center justify-center gap-2
            ${textColor}
            ${hoverColor}
          `}
        >
          <ShoppingBag size={18} />
          <p>محصولات</p>
        </a>

        <a
          href="/"
          className={`
            text-sm font-medium
            transition-colors
            w-28 h-full
            flex items-center justify-center gap-2
            ${textColor}
            ${hoverColor}
          `}
        >
          <Info size={18} />
          <p>درباره ما</p>
        </a>
      </div>
    </nav>
  );
}