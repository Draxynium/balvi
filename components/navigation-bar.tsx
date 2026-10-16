"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronDown,
  Info,
  Phone,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
  X,
} from "lucide-react";
import { cn } from "cn";
import { useAuth } from "@/features/auth/hooks/use-auth";

/* ------------------------------ sidebar data ----------------------------- */

const buildProductsHref = (gender: string, category: string) =>
  `/products?gender=${gender}&category=${encodeURIComponent(category)}`;

type SidebarGroup = {
  id: string;
  label: string;
  links: { label: string; href: string }[];
};

const sidebarGroups: SidebarGroup[] = [
  {
    id: "men",
    label: "کفش چرم مردانه",
    links: [
      {
        label: "بوت و نیم بوت چرم مردانه",
        href: buildProductsHref("male", "بوت و نیم بوت"),
      },
      {
        label: "کفش چرم مجلسی مردانه",
        href: buildProductsHref("male", "کلاسیک"),
      },
      {
        label: "کفش اسپرت و کتونی چرم مردانه",
        href: buildProductsHref("male", "اسپورت"),
      },
      {
        label: "کفش راحتی (روزمره) چرم مردانه",
        href: buildProductsHref("male", "راحتی"),
      },
      {
        label: "کفش چرم اداری و رسمی مردانه",
        href: buildProductsHref("male", "اداری"),
      },
      {
        label: "کفش چرم طبی مردانه",
        href: buildProductsHref("male", "روزمره"),
      },
    ],
  },
  {
    id: "women",
    label: "کفش چرم زنانه",
    links: [
      {
        label: "بوت و نیم بوت چرم زنانه",
        href: buildProductsHref("female", "بوت و نیم بوت"),
      },
      {
        label: "کفش اسپرت (اسنیکر) چرم زنانه",
        href: buildProductsHref("female", "اسپورت"),
      },
      {
        label: "کفش راحتی (روزمره) چرم زنانه",
        href: buildProductsHref("female", "راحتی"),
      },
      {
        label: "کفش اداری چرم زنانه",
        href: buildProductsHref("female", "اداری"),
      },
    ],
  },
];

const sidebarSimpleLinks = [
  { label: "ثبت سفارش عمده", href: "/wholesale" },
  { label: "مقالات", href: "/blogs" },
  { label: "راهنمای سایز کفش", href: "/size-guide" },
];

const sidebarFooterLinks = [
  { label: "درباره بالوی", href: "/about" },
  { label: "تماس با ما", href: "/contact" },
];

/* ------------------------------- Navigation ------------------------------ */

export default function NavigationBar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [darkBackground, setDarkBackground] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("men");
  const { user, status: authStatus, openDialog } = useAuth();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;
    setSearchOpen(false);
    router.push(`/products?search=${encodeURIComponent(query)}`);
  };

  /* ------------------------------- scroll fx ------------------------------ */

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

    if (!navbarSections.length) return;

    const createObserver = () => {
      const navbarHeight = 64;

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

  /* ------------------------------ search fx ------------------------------- */

  useEffect(() => {
    if (!searchOpen) return;

    const timeout = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);

    return () => clearTimeout(timeout);
  }, [searchOpen]);

  /* --------------------------- escape + scroll lock ----------------------- */

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

  /* --------------------------------- theme -------------------------------- */

  const textColor = darkBackground ? "text-primary" : "text-muted-foreground";
  const hoverColor = darkBackground
    ? "hover:text-accent"
    : "hover:text-foreground";

  return (
    <>
      {/* ------------------------------- search ------------------------------ */}
      <div
        className={`bg-background/40 fixed inset-0 z-9999 flex items-center justify-center backdrop-blur-xl transition-all duration-500 ${
          searchOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            setSearchOpen(false);
          }
        }}
      >
        <div
          className={`w-full max-w-2xl px-6 transition-all duration-500 ease-out ${
            searchOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-4 scale-95 opacity-0"
          }`}
        >
          <form className="relative" onSubmit={handleSearch}>
            <Search
              size={24}
              strokeWidth={1.8}
              className="text-muted-foreground absolute top-1/2 right-5 -translate-y-1/2"
            />
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="جستجوی محصولات..."
              className="border-border/40 bg-background/80 focus:border-primary/40 focus:ring-primary/5 h-16 w-full rounded-2xl border px-16 text-right text-lg backdrop-blur-xl transition-all outline-none focus:ring-4"
              dir="rtl"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-1/2 left-5 -translate-y-1/2 rounded-md p-2 transition-colors"
            >
              <X size={20} />
            </button>
          </form>
          <p className="text-muted-foreground mt-4 text-center text-sm">
            برای بستن جستجو کلید Esc را فشار دهید
          </p>
        </div>
      </div>

      {/* ------------------------------ side menu ----------------------------- */}
      <div
        className={cn(
          "fixed inset-0 z-201 h-full w-full p-4",
          sideMenuOpen ? "pointer-events-auto" : "pointer-events-none",
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "bg-background/50 absolute inset-0 h-full w-full backdrop-blur-2xl transition-opacity duration-300",
            sideMenuOpen ? "opacity-100" : "opacity-0",
          )}
          onClick={() => setSideMenuOpen(false)}
        />

        {/* Slider */}
        <div
          className={cn(
            "relative left-116 h-full w-full transition-all duration-500 ease-out",
            sideMenuOpen && "left-0",
          )}
        >
          <div
            dir="rtl"
            data-lenis-prevent
            className="border-foreground/15 bg-background scrollbar-hide relative top-0 right-0 z-2 flex h-full w-md max-w-full flex-col overflow-y-auto overscroll-contain rounded-md border px-6 py-6"
          >
            {/* Chapters (men / women) */}
            <div className="flex flex-col">
              {sidebarGroups.map((group) => {
                const isOpen = openSection === group.id;

                return (
                  <div key={group.id} className="border-border/30 border-b">
                    <button
                      type="button"
                      onClick={() => setOpenSection(isOpen ? null : group.id)}
                      className="group flex w-full items-center gap-3 py-4 text-right"
                    >
                      <span className="text-foreground group-hover:text-primary flex-1 text-xl leading-tight font-black tracking-tight transition-colors">
                        {group.label}
                      </span>
                      <ChevronDown
                        size={18}
                        className={cn(
                          "text-muted-foreground group-hover:text-foreground shrink-0 transition-all duration-300",
                          isOpen && "text-primary rotate-180",
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        "grid overflow-hidden transition-all duration-300 ease-out",
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0",
                      )}
                    >
                      <div className="min-h-0">
                        <ul className="border-primary/40 mr-5 mb-4 flex flex-col gap-1 border-r-2 pr-4">
                          {group.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                onClick={() => setSideMenuOpen(false)}
                                className="text-muted-foreground hover:text-foreground block py-1.5 text-sm leading-6 transition-colors"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 5 heading links — no borders, no shadows, big bold type */}
            <div className="mt-5 flex flex-col">
              {[...sidebarSimpleLinks, ...sidebarFooterLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSideMenuOpen(false)}
                  className="group flex items-center justify-between py-2.5"
                >
                  <span className="text-foreground group-hover:text-primary text-xl leading-tight font-black tracking-tight transition-colors">
                    {link.label}
                  </span>
                  <ArrowLeft
                    size={18}
                    className="text-primary -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------- burger ------------------------------- */}
      <button
        className={cn(
          "fixed top-2 right-2 z-203 aspect-square h-12 gap-1 rounded-md border p-4 backdrop-blur-2xl transition-all duration-300 max-md:scale-80",
          darkBackground
            ? "border-primary/20 bg-secondary/50"
            : "border-border/20 bg-background/20",
          sideMenuOpen &&
            "top-4 right-4 border-transparent! bg-transparent! backdrop-blur-none!",
        )}
        onClick={() => setSideMenuOpen((prev) => !prev)}
      >
        <div className="absolute h-full w-full" />
        <div
          className={cn(
            "absolute top-[calc(42%-1px)] right-3 h-0.5 w-[calc(100%-1.5rem)] rounded-md transition-all duration-300",
            darkBackground ? "bg-background" : "bg-foreground",
            sideMenuOpen &&
              "bg-foreground! top-1/2 right-0 left-1/2 w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 rotate-45",
          )}
        />
        <div
          className={cn(
            "absolute top-[calc(58%-1px)] right-3 h-0.5 w-[calc(100%-2rem)] rounded-md transition-all duration-300",
            darkBackground ? "bg-background" : "bg-foreground",
            sideMenuOpen &&
              "bg-foreground! top-1/2 right-0 left-1/2 w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 -rotate-45",
          )}
        />
      </button>

      {/* ------------------------------ navbar -------------------------------- */}
      <nav className="fixed z-199 flex h-16 w-full items-center justify-center px-4 py-2">
        <div
          className={`main-navbar flex h-full max-w-full items-center justify-center divide-x rounded-md border px-4 py-2 backdrop-blur-2xl transition-all duration-500 ease-out max-md:scale-80 md:w-md lg:w-3xl ${
            darkBackground
              ? "divide-primary/20 border-primary/20 bg-secondary/50"
              : "divide-border/40 border-border/20 bg-background/20"
          } ${scrolled ? "md:w-xl! lg:w-4xl!" : "border-border/0!"} ${
            scrolled && darkBackground
              ? "border-primary/30 bg-secondary/60"
              : scrolled
                ? "border-border/40 bg-background/30"
                : ""
          }`}
        >
          <button
            onClick={() => setSearchOpen(true)}
            className={`flex h-full w-12 items-center justify-center gap-2 text-sm font-medium transition-colors lg:w-28 ${textColor} ${hoverColor}`}
          >
            <Search size={18} />
            <p className="hidden lg:block">جستجو</p>
          </button>

          <Link
            href="/products"
            className={`flex h-full w-12 items-center justify-center gap-2 text-sm font-medium transition-colors lg:w-28 ${textColor} ${hoverColor}`}
          >
            <ShoppingBag size={18} />
            <p className="hidden lg:block">محصولات</p>
          </Link>

          <Link
            href="/about"
            className={`flex h-full w-12 items-center justify-center gap-2 text-sm font-medium transition-colors lg:w-28 ${textColor} ${hoverColor}`}
          >
            <Info size={18} />
            <p className="hidden lg:block">درباره ما</p>
          </Link>

          <Link
            href="/"
            className={`flex h-full w-12 flex-1 items-center justify-center gap-2 text-sm font-medium transition-colors lg:w-28 ${textColor} ${hoverColor} `}
          >
            <div className="relative h-8 w-32 overflow-hidden">
              <img
                src="/logo.svg"
                alt=""
                className={`absolute top-1/2 left-1/2 h-8 w-auto -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-in-out ${
                  scrolled ? "md:translate-y-[-150%]" : "translate-y-[-50%]"
                }`}
              />
              <img
                src="/text-logo.svg"
                alt="Logo"
                className={`absolute top-1/2 left-1/2 h-8 w-auto -translate-x-1/2 py-1 transition-transform duration-500 ease-in-out ${
                  scrolled
                    ? "translate-y-[150%] md:-translate-y-1/2!"
                    : "translate-y-[150%]"
                }`}
              />
            </div>
          </Link>

          <Link
            href="/contact"
            className={`flex h-full w-12 items-center justify-center gap-2 text-sm font-medium transition-colors lg:w-28 ${textColor} ${hoverColor}`}
          >
            <Phone size={18} />
            <p className="hidden lg:block">تماس با ما</p>
          </Link>

          <button
            type="button"
            onClick={openDialog}
            className={`flex h-full w-12 items-center justify-center gap-2 text-sm font-medium transition-colors lg:w-28 ${textColor} ${hoverColor}`}
          >
            <User size={18} />
            <p className="hidden lg:block">
              {authStatus === "loading"
                ? "در حال بررسی"
                : user
                  ? "حساب من"
                  : "ورود / ثبت‌نام"}
            </p>
          </button>

          <Link
            href="/cart"
            className={`flex h-full w-12 items-center justify-center gap-2 text-sm font-medium transition-colors lg:w-28 ${textColor} ${hoverColor}`}
          >
            <ShoppingCart size={18} />
            <p className="hidden lg:block">سبد خرید</p>
          </Link>
        </div>
      </nav>
    </>
  );
}
