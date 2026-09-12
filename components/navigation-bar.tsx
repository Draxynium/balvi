"use client";

import { useEffect, useRef, useState } from "react";
import { Info, Phone, Search, ShoppingBag, ShoppingCart, User, X } from "lucide-react";

export default function NavigationBar() {
  const [scrolled, setScrolled] = useState(false);
  const [darkBackground, setDarkBackground] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (!searchOpen) return;

    const timeout = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timeout);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [searchOpen]);

  const textColor = darkBackground ? "text-primary" : "text-muted-foreground";
  const hoverColor = darkBackground ? "hover:text-accent" : "hover:text-foreground";

  return (
    <>
      <div className={`fixed inset-0 z-9999 flex items-center justify-center bg-background/40 backdrop-blur-xl transition-all duration-500 ${searchOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`} onMouseDown={(e) => { if (e.target === e.currentTarget) { setSearchOpen(false); } }}>
        <div className={`w-full max-w-2xl px-6 transition-all duration-500 ease-out ${searchOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"}`}>
          <div className="relative">
            <Search size={24} strokeWidth={1.8} className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input ref={searchInputRef} type="text" placeholder="جستجوی محصولات..." className="h-16 w-full rounded-2xl border border-border/40 bg-background/80 px-16 text-right text-lg outline-none backdrop-blur-xl transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/5" dir="rtl" />
            <button onClick={() => setSearchOpen(false)} className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <X size={20} />
            </button>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">برای بستن جستجو کلید Esc را فشار دهید</p>
        </div>
      </div>

      <nav className="fixed z-200 flex h-16 w-full items-center justify-center py-2">
        <div className={`px-4 py-2 h-full flex items-center justify-center divide-x rounded-full backdrop-blur-2xl backdrop-saturate-150 border transition-all duration-500 ease-out w-3xl max-w-full ${darkBackground ? "bg-secondary/50 border-primary/20 divide-primary/20" : "bg-background/20 border-border/20 divide-border/40"} ${scrolled ? "w-4xl!" : "border-border/0!"} ${scrolled && darkBackground ? "bg-secondary/60 border-primary/30" : scrolled ? "bg-background/30 border-border/40" : ""}`}>
          <button onClick={() => setSearchOpen(true)} className={`text-sm font-medium transition-colors w-28 h-full flex items-center justify-center gap-2 ${textColor} ${hoverColor}`}>
            <Search size={18} />
            <p>جستجو</p>
          </button>
          <a href="/" className={`text-sm font-medium transition-colors w-28 h-full flex items-center justify-center gap-2 ${textColor} ${hoverColor}`}>
            <ShoppingBag size={18} />
            <p>محصولات</p>
          </a>
          <a href="/about" className={`text-sm font-medium transition-colors w-28 h-full flex items-center justify-center gap-2 ${textColor} ${hoverColor}`}>
            <Info size={18} />
            <p>درباره ما</p>
          </a>
          <a href="/" className={`text-sm font-medium transition-colors w-28 h-full flex items-center justify-center gap-2 flex-1 ${textColor} ${hoverColor}`}>
            <div className="relative h-8 w-32 overflow-hidden">
              <img src="/logo.svg" className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-auto transition-transform duration-500 ease-in-out ${scrolled ? "translate-y-[-150%]" : "translate-y-[-50%]"}`} />
              <img src="/text-logo.svg" alt="Logo" className={`absolute left-1/2 top-1/2 -translate-x-1/2 h-8 w-auto transition-transform duration-500 ease-in-out py-1 ${scrolled ? "-translate-y-1/2" : "translate-y-[150%]"}`} />
            </div>
          </a>
          <a href="/" className={`text-sm font-medium transition-colors w-28 h-full flex items-center justify-center gap-2 ${textColor} ${hoverColor}`}>
            <Phone size={18} />
            <p>تماس با ما</p>
          </a>
          <a href="/" className={`text-sm font-medium transition-colors w-28 h-full flex items-center justify-center gap-2 ${textColor} ${hoverColor}`}>
            <User size={18} />
            <p>ثبت نام</p>
          </a>
          <a href="/" className={`text-sm font-medium transition-colors w-28 h-full flex items-center justify-center gap-2 ${textColor} ${hoverColor}`}>
            <ShoppingCart size={18} />
            <p>سبد خرید</p>
          </a>
        </div>
      </nav>
    </>
  );
}