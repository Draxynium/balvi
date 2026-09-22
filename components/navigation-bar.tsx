"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
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

type AuthView =
  | "login"
  | "signup-phone"
  | "signup-otp"
  | "signup-password"
  | "forgot-otp"
  | "forgot-reset"
  | "success";

const OTP_LENGTH = 6;

const toFa = (value: string | number) =>
  String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);

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
      { label: "بوت و نیم بوت چرم مردانه", href: buildProductsHref("male", "بوت و نیم بوت") },
      { label: "کفش چرم مجلسی مردانه", href: buildProductsHref("male", "کلاسیک") },
      { label: "کفش اسپرت و کتونی چرم مردانه", href: buildProductsHref("male", "اسپورت") },
      { label: "کفش راحتی (روزمره) چرم مردانه", href: buildProductsHref("male", "راحتی") },
      { label: "کفش چرم اداری و رسمی مردانه", href: buildProductsHref("male", "اداری") },
      { label: "کفش چرم طبی مردانه", href: buildProductsHref("male", "روزمره") },
    ],
  },
  {
    id: "women",
    label: "کفش چرم زنانه",
    links: [
      { label: "بوت و نیم بوت چرم زنانه", href: buildProductsHref("female", "بوت و نیم بوت") },
      { label: "کفش اسپرت (اسنیکر) چرم زنانه", href: buildProductsHref("female", "اسپورت") },
      { label: "کفش راحتی (روزمره) چرم زنانه", href: buildProductsHref("female", "راحتی") },
      { label: "کفش اداری چرم زنانه", href: buildProductsHref("female", "اداری") },
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

/* ---------------------------------- OTP ---------------------------------- */

function OtpInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const length = value.length;

  useEffect(() => {
    const timeout = setTimeout(() => refs.current[0]?.focus(), 120);
    return () => clearTimeout(timeout);
  }, []);

  const handleChange = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return;

    const next = [...value];
    for (let i = 0; i < digits.length && index + i < length; i += 1) {
      next[index + i] = digits[i];
    }
    onChange(next);

    refs.current[Math.min(index + digits.length, length - 1)]?.focus();
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = [...value];

      if (next[index]) {
        next[index] = "";
        onChange(next);
      } else if (index > 0) {
        next[index - 1] = "";
        onChange(next);
        refs.current[index - 1]?.focus();
      }
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      refs.current[Math.min(index + 1, length - 1)]?.focus();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      refs.current[Math.max(index - 1, 0)]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2" dir="ltr">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el;
          }}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={(event) => event.target.select()}
          inputMode="numeric"
          autoComplete="one-time-code"
          className="h-14 w-12 rounded-xl border border-border/40 bg-background/60 text-center text-xl font-semibold outline-none transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/5"
        />
      ))}
    </div>
  );
}

/* ------------------------------- Navigation ------------------------------ */

export default function NavigationBar() {
  const [scrolled, setScrolled] = useState(false);
  const [darkBackground, setDarkBackground] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>("men");

  const searchInputRef = useRef<HTMLInputElement>(null);

  /* --------------------------------- auth --------------------------------- */

  const [authOpen, setAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>("login");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState<string[]>(() => Array(OTP_LENGTH).fill(""));
  const [authError, setAuthError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const phoneInputRef = useRef<HTMLInputElement>(null);

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
            (entry) => entry.isIntersecting
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
    if (!searchOpen && !authOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setAuthOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [searchOpen, authOpen]);

  useEffect(() => {
    if (!searchOpen && !authOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [searchOpen, authOpen]);

  /* ------------------------------ auth effects ---------------------------- */

  useEffect(() => {
    if (!authOpen) return;

    const timeout = setTimeout(() => phoneInputRef.current?.focus(), 350);
    return () => clearTimeout(timeout);
  }, [authOpen, authView]);

  useEffect(() => {
    if (resendTimer <= 0) return;

    const timeout = setTimeout(() => setResendTimer((t) => t - 1), 1000);
    return () => clearTimeout(timeout);
  }, [resendTimer]);

  /* ------------------------------ auth actions ---------------------------- */

  const openAuth = (view: AuthView = "login") => {
    setAuthView(view);
    setPhone("");
    setPassword("");
    setConfirmPassword("");
    setOtp(Array(OTP_LENGTH).fill(""));
    setAuthError("");
    setResendTimer(0);
    setAuthOpen(true);
  };

  const closeAuth = () => {
    setAuthOpen(false);
    setAuthError("");
  };

  const goTo = (view: AuthView) => {
    setAuthError("");
    setAuthView(view);
  };

  const goToOtp = (view: "signup-otp" | "forgot-otp") => {
    setAuthError("");
    setOtp(Array(OTP_LENGTH).fill(""));
    setResendTimer(59);
    setAuthView(view);
  };

  const handleLogin = (event: React.FormEvent) => {
    event.preventDefault();

    if (phone.replace(/\D/g, "").length < 11) {
      setAuthError("شماره تماس معتبر وارد کنید.");
      return;
    }

    if (password.length < 6) {
      setAuthError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    setAuthError("");
    setAuthView("success");
  };

  const handleSignupPhone = (event: React.FormEvent) => {
    event.preventDefault();

    if (phone.replace(/\D/g, "").length < 11) {
      setAuthError("شماره تماس معتبر وارد کنید.");
      return;
    }

    goToOtp("signup-otp");
  };

  const handleOtp = (event: React.FormEvent) => {
    event.preventDefault();

    if (otp.join("").length < OTP_LENGTH) {
      setAuthError("کد ۶ رقمی را کامل وارد کنید.");
      return;
    }

    setAuthError("");
    setAuthView(authView === "signup-otp" ? "signup-password" : "forgot-reset");
  };

  const handlePassword = (event: React.FormEvent) => {
    event.preventDefault();

    if (password.length < 6) {
      setAuthError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    if (password !== confirmPassword) {
      setAuthError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    setAuthError("");
    setAuthView("success");
  };

  const authCopy: Record<
    Exclude<AuthView, "success">,
    { title: string; subtitle: string }
  > = {
    login: {
      title: "ورود به حساب کاربری",
      subtitle: "شماره تماس و رمز عبور خود را وارد کنید.",
    },
    "signup-phone": {
      title: "ساخت حساب کاربری",
      subtitle: "شماره تماس خود را وارد کنید تا کد تایید برایتان ارسال شود.",
    },
    "signup-otp": {
      title: "کد تایید",
      subtitle: `کد ۶ رقمی ارسال شده به ${toFa(phone || "شماره شما")} را وارد کنید.`,
    },
    "signup-password": {
      title: "انتخاب رمز عبور",
      subtitle: "یک رمز عبور امن برای حساب خود تعیین کنید.",
    },
    "forgot-otp": {
      title: "بازیابی رمز عبور",
      subtitle: `کد ۶ رقمی ارسال شده به ${toFa(phone || "شماره شما")} را وارد کنید.`,
    },
    "forgot-reset": {
      title: "رمز عبور جدید",
      subtitle: "رمز عبور جدید خود را وارد و تایید کنید.",
    },
  };

  const fieldClass =
    "h-14 w-full rounded-2xl border border-border/40 bg-background/60 px-4 text-base outline-none transition-all placeholder:text-muted-foreground focus:border-primary/40 focus:ring-4 focus:ring-primary/5";

  const submitClass =
    "h-14 w-full rounded-2xl bg-primary text-base font-medium text-primary-foreground transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40";

  /* --------------------------------- theme -------------------------------- */

  const textColor = darkBackground ? "text-primary" : "text-muted-foreground";
  const hoverColor = darkBackground
    ? "hover:text-accent"
    : "hover:text-foreground";

  const isOtpView = authView === "signup-otp" || authView === "forgot-otp";

  return (
    <>
      {/* ------------------------------- search ------------------------------ */}
      <div
        className={`fixed inset-0 z-9999 flex items-center justify-center bg-background/40 backdrop-blur-xl transition-all duration-500 ${
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
          <div className="relative">
            <Search
              size={24}
              strokeWidth={1.8}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="جستجوی محصولات..."
              className="h-16 w-full rounded-2xl border border-border/40 bg-background/80 px-16 text-right text-lg outline-none backdrop-blur-xl transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/5"
              dir="rtl"
            />
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute left-5 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X size={20} />
            </button>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            برای بستن جستجو کلید Esc را فشار دهید
          </p>
        </div>
      </div>

      {/* -------------------------------- auth ------------------------------- */}
      <div
        className={`fixed inset-0 z-9999 flex items-center justify-center overflow-y-auto bg-background/40 p-4 backdrop-blur-xl transition-all duration-500 ${
          authOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            closeAuth();
          }
        }}
      >
        <div
          className={`w-full max-w-md transition-all duration-500 ease-out ${
            authOpen
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-4 scale-95 opacity-0"
          }`}
        >
          <div
            className="relative rounded-3xl border border-border/40 bg-background/80 p-7 backdrop-blur-xl"
            dir="rtl"
          >
            <button
              onClick={closeAuth}
              className="absolute left-4 top-4 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X size={20} />
            </button>

            {authView === "success" ? (
              <div className="flex flex-col items-center py-6 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Check size={32} strokeWidth={2.2} />
                </div>
                <h2 className="text-xl font-semibold">خوش آمدید!</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  عملیات با موفقیت انجام شد.
                </p>
                <button onClick={closeAuth} className={`mt-7 ${submitClass}`}>
                  بستن
                </button>
              </div>
            ) : (
              <>
                <header className="mb-6 pl-10">
                  <h2 className="text-xl font-semibold">
                    {authCopy[authView].title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    {authCopy[authView].subtitle}
                  </p>
                </header>

                {authView === "login" && (
                  <form onSubmit={handleLogin} className="space-y-3">
                    <input
                      ref={phoneInputRef}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
                      inputMode="tel"
                      dir="ltr"
                      className={cn(fieldClass, "text-left")}
                    />

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="رمز عبور"
                      autoComplete="current-password"
                      className={cn(fieldClass, "text-right")}
                    />

                    <div className="flex justify-end pt-1">
                      <button
                        type="button"
                        onClick={() => goToOtp("forgot-otp")}
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        فراموشی رمز عبور
                      </button>
                    </div>

                    {authError && (
                      <p className="text-xs text-destructive">{authError}</p>
                    )}

                    <button type="submit" className={submitClass}>
                      ورود
                    </button>

                    <p className="pt-2 text-center text-xs text-muted-foreground">
                      حساب کاربری ندارید؟{" "}
                      <button
                        type="button"
                        onClick={() => goTo("signup-phone")}
                        className="font-medium text-foreground transition-colors hover:text-primary"
                      >
                        ثبت نام کنید
                      </button>
                    </p>
                  </form>
                )}

                {authView === "signup-phone" && (
                  <form onSubmit={handleSignupPhone} className="space-y-3">
                    <input
                      ref={phoneInputRef}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="۰۹۱۲ ۳۴۵ ۶۷۸۹"
                      inputMode="tel"
                      dir="ltr"
                      className={cn(fieldClass, "text-left")}
                    />

                    {authError && (
                      <p className="text-xs text-destructive">{authError}</p>
                    )}

                    <button type="submit" className={submitClass}>
                      دریافت کد تایید
                    </button>

                    <p className="pt-2 text-center text-xs text-muted-foreground">
                      قبلاً ثبت نام کرده‌اید؟{" "}
                      <button
                        type="button"
                        onClick={() => goTo("login")}
                        className="font-medium text-foreground transition-colors hover:text-primary"
                      >
                        وارد شوید
                      </button>
                    </p>
                  </form>
                )}

                {isOtpView && (
                  <form onSubmit={handleOtp} className="space-y-5">
                    <OtpInput value={otp} onChange={setOtp} />

                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        disabled={resendTimer > 0}
                        onClick={() => setResendTimer(59)}
                        className="text-xs text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {resendTimer > 0
                          ? `ارسال مجدد کد تا ${toFa(
                              Math.floor(resendTimer / 60)
                            )}:${toFa(
                              String(resendTimer % 60).padStart(2, "0")
                            )}`
                          : "ارسال مجدد کد"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          goTo(
                            authView === "signup-otp"
                              ? "signup-phone"
                              : "login"
                          )
                        }
                        className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
                      >
                        <ArrowRight size={14} />
                        ویرایش شماره
                      </button>
                    </div>

                    {authError && (
                      <p className="text-xs text-destructive">{authError}</p>
                    )}

                    <button type="submit" className={submitClass}>
                      تایید کد
                    </button>
                  </form>
                )}

                {(authView === "signup-password" ||
                  authView === "forgot-reset") && (
                  <form onSubmit={handlePassword} className="space-y-3">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="رمز عبور"
                      autoComplete="new-password"
                      className={cn(fieldClass, "text-right")}
                    />

                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="تکرار رمز عبور"
                      autoComplete="new-password"
                      className={cn(fieldClass, "text-right")}
                    />

                    {authError && (
                      <p className="text-xs text-destructive">{authError}</p>
                    )}

                    <button type="submit" className={submitClass}>
                      {authView === "signup-password"
                        ? "ثبت نام"
                        : "تغییر رمز عبور"}
                    </button>

                    <p className="pt-2 text-center text-xs text-muted-foreground">
                      <button
                        type="button"
                        onClick={() =>
                          goTo(
                            authView === "signup-password"
                              ? "signup-phone"
                              : "login"
                          )
                        }
                        className="font-medium text-foreground transition-colors hover:text-primary"
                      >
                        بازگشت
                      </button>
                    </p>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ------------------------------ side menu ----------------------------- */}
      <div
        className={cn(
          "fixed inset-0 z-201 h-full w-full p-4",
          sideMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 h-full w-full bg-background/50 backdrop-blur-2xl transition-opacity duration-300",
            sideMenuOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setSideMenuOpen(false)}
        />

        {/* Slider */}
        <div
          className={cn(
            "relative left-116 h-full w-full transition-all duration-500 ease-out",
            sideMenuOpen && "left-0"
          )}
        >
          <div
            dir="rtl"
            className="relative right-0 top-0 z-2 flex h-full w-md max-w-full flex-col overflow-y-auto rounded-md border border-foreground/15 bg-background px-6 py-6 scrollbar-hide"
          >
            {/* Chapters (men / women) */}
            <div className="flex flex-col">
              {sidebarGroups.map((group) => {
                const isOpen = openSection === group.id;

                return (
                  <div
                    key={group.id}
                    className="border-b border-border/30"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenSection(isOpen ? null : group.id)}
                      className="group flex w-full items-center gap-3 py-4 text-right"
                    >
                      <span className="flex-1 text-xl font-black leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {group.label}
                      </span>
                      <ChevronDown
                        size={18}
                        className={cn(
                          "shrink-0 text-muted-foreground transition-all duration-300 group-hover:text-foreground",
                          isOpen && "rotate-180 text-primary"
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        "grid overflow-hidden transition-all duration-300 ease-out",
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="min-h-0">
                        <ul className="mr-5 mb-4 flex flex-col gap-1 border-r-2 border-primary/40 pr-4">
                          {group.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                onClick={() => setSideMenuOpen(false)}
                                className="block py-1.5 text-sm leading-6 text-muted-foreground transition-colors hover:text-foreground"
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
                  <span className="text-xl font-black leading-tight tracking-tight text-foreground transition-colors group-hover:text-primary">
                    {link.label}
                  </span>
                  <ArrowLeft
                    size={18}
                    className="-translate-x-2 text-primary opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
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
          "fixed right-2 top-2 z-203 aspect-square h-12 gap-1 rounded-md border p-4 backdrop-blur-2xl transition-all duration-300 max-md:scale-80",
          darkBackground
            ? "border-primary/20 bg-secondary/50"
            : "border-border/20 bg-background/20",
          sideMenuOpen &&
            "right-4 top-4 border-transparent! bg-transparent! backdrop-blur-none!"
        )}
        onClick={() => setSideMenuOpen((prev) => !prev)}
      >
        <div className="absolute h-full w-full" />
        <div
          className={cn(
            "absolute right-3 top-[calc(42%-1px)] h-0.5 w-[calc(100%-1.5rem)] rounded-md transition-all duration-300",
            darkBackground ? "bg-background" : "bg-foreground",
            sideMenuOpen &&
              "left-1/2 right-0 top-1/2 w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 rotate-45 bg-foreground!"
          )}
        />
        <div
          className={cn(
            "absolute right-3 top-[calc(58%-1px)] h-0.5 w-[calc(100%-2rem)] rounded-md transition-all duration-300",
            darkBackground ? "bg-background" : "bg-foreground",
            sideMenuOpen &&
              "left-1/2 right-0 top-1/2 w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 -rotate-45 bg-foreground!"
          )}
        />
      </button>

      {/* ------------------------------ navbar -------------------------------- */}
      <nav className="fixed z-199 flex h-16 w-full items-center justify-center px-4 py-2 ">
        <div
          className={`flex h-full items-center justify-center divide-x rounded-md border px-4 py-2 backdrop-blur-2xl transition-all duration-500 ease-out max-md:scale-80 md:w-md lg:w-3xl max-w-full main-navbar ${
            darkBackground
              ? "divide-primary/20 border-primary/20 bg-secondary/50"
              : "divide-border/40 border-border/20 bg-background/20"
          } ${scrolled ? "lg:w-4xl! md:w-xl!" : "border-border/0!"} ${
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

          <a
            href="/products"
            className={`flex h-full w-12 items-center justify-center gap-2 text-sm font-medium transition-colors lg:w-28 ${textColor} ${hoverColor}`}
          >
            <ShoppingBag size={18} />
            <p className="hidden lg:block">محصولات</p>
          </a>

          <a
            href="/about"
            className={`flex h-full w-12 items-center justify-center gap-2 text-sm font-medium transition-colors lg:w-28 ${textColor} ${hoverColor}`}
          >
            <Info size={18} />
            <p className="hidden lg:block">درباره ما</p>
          </a>

          <a
            href="/"
            className={`flex h-full w-12 flex-1 items-center justify-center gap-2 text-sm font-medium transition-colors lg:w-28 ${textColor} ${hoverColor} `}
          >
            <div className="relative h-8 w-32 overflow-hidden">
              <img
                src="/logo.svg"
                className={`absolute left-1/2 top-1/2 h-8 w-auto -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-in-out ${
                  scrolled ? "md:translate-y-[-150%]" : "translate-y-[-50%]"
                }`}
              />
              <img
                src="/text-logo.svg"
                alt="Logo"
                className={`absolute left-1/2 top-1/2 h-8 w-auto -translate-x-1/2 py-1 transition-transform duration-500 ease-in-out ${
                  scrolled
                    ? "md:-translate-y-1/2! translate-y-[150%]"
                    : "translate-y-[150%]"
                }`}
              />
            </div>
          </a>

          <a
            href="/contact"
            className={`flex h-full w-12 items-center justify-center gap-2 text-sm font-medium transition-colors lg:w-28 ${textColor} ${hoverColor}`}
          >
            <Phone size={18} />
            <p className="hidden lg:block">تماس با ما</p>
          </a>

          <button
            type="button"
            onClick={() => openAuth("login")}
            className={`flex h-full w-12 items-center justify-center gap-2 text-sm font-medium transition-colors lg:w-28 ${textColor} ${hoverColor}`}
          >
            <User size={18} />
            <p className="hidden lg:block">ثبت نام</p>
          </button>

          <a
            href="/cart"
            className={`flex h-full w-12 items-center justify-center gap-2 text-sm font-medium transition-colors lg:w-28 ${textColor} ${hoverColor}`}
          >
            <ShoppingCart size={18} />
            <p className="hidden lg:block">سبد خرید</p>
          </a>
        </div>
      </nav>
    </>
  );
}