"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpLeft } from "lucide-react";

export default function Footer() {
  const columns = [
    {
      title: "فروشگاه",
      links: [
        { label: "محصولات", href: "/products" },
        { label: "فروش عمده", href: "/products" },
        { label: "درباره ما", href: "/about" },
        { label: "مقاله ها", href: "/blogs" },
      ],
    },
    {
      title: "پشتیبانی",
      links: [
        { label: "تماس با ما", href: "/contact" },
        { label: "سوالات متداول", href: "/" },
        { label: "پیگیری سفارش", href: "/" },
      ],
    },
  ];

  return (
    <footer
      dir="rtl"
      data-navbar-dark
      className="relative flex w-full justify-center overflow-hidden pt-6 sm:pt-8 md:pt-12"
    >
      <motion.div
        initial={{
          y: "25%",
          width: "92%",
          borderTopRightRadius: "12px",
          borderTopLeftRadius: "12px",
        }}
        whileInView={{
          y: 0,
          width: "100%",
          borderTopRightRadius: "0",
          borderTopLeftRadius: "0",
        }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{
          y: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          width: { duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] },
          borderTopRightRadius: {
            duration: 0.8,
            delay: 0.4,
            ease: [0.22, 1, 0.36, 1],
          },
          borderTopLeftRadius: {
            duration: 0.8,
            delay: 0.4,
            ease: [0.22, 1, 0.36, 1],
          },
        }}
        className="relative flex w-full flex-col gap-8 overflow-hidden bg-secondary px-5 py-9 text-primary sm:gap-10 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-12"
      >
        {/* ---------- TOP: CONTENT + MASCOT ---------- */}
        <div className="flex w-full flex-col gap-8 sm:gap-10 md:flex-row md:items-center md:justify-center md:gap-14 lg:gap-20">
          <div className="flex w-full max-w-3xl flex-col gap-6 sm:gap-7 md:items-start md:gap-8">
            {/* ---------- HEADING ---------- */}
            <h2 className="text-center text-2xl font-black leading-snug sm:text-3xl md:text-left md:text-4xl">
              آنچه می‌ماند
              <br className="md:hidden" />{" "}
              <span className="md:inline">اصالت است و هنر</span>
            </h2>

            {/* ---------- NAV ---------- */}
            <nav className="flex w-full items-start justify-between gap-3 sm:gap-6 md:justify-start md:gap-12 lg:gap-16">
              {columns.map((col) => (
                <div
                  key={col.title}
                  className="flex flex-col items-center gap-2.5 sm:gap-3 md:items-start"
                >
                  <h3 className="text-[11px] font-bold uppercase tracking-wide opacity-60 sm:text-xs md:text-sm md:opacity-100">
                    {col.title}
                  </h3>

                  <div className="flex flex-col items-center gap-2 text-[11px] sm:text-xs md:items-start md:text-sm">
                    {col.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center gap-0.5 whitespace-nowrap transition-opacity hover:opacity-70"
                      >
                        <span>{link.label}</span>
                        <ArrowUpLeft className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="h-px w-full bg-primary/25" />

            {/* ---------- BOTTOM BAR ---------- */}
            <div className="flex w-full flex-col items-center gap-4 text-[11px] sm:text-xs md:flex-row md:items-center md:justify-between md:gap-6">
              <span className="text-center opacity-70 md:opacity-100">
                تمامی حقوق محفوظ است - ۱۴۰۳
              </span>

              <div className="flex items-center gap-5 sm:gap-6">
                <Link href="/" className="transition-opacity hover:opacity-70">
                  حریم خصوصی
                </Link>
                <Link href="/" className="transition-opacity hover:opacity-70">
                  قوانین و مقررات
                </Link>
              </div>

              <Link href="/" className="shrink-0 transition-opacity hover:opacity-70">
                <img
                  src="/text-logo.svg"
                  alt="Logo"
                  className="h-5 w-auto sm:h-6"
                />
              </Link>
            </div>
          </div>

          {/* ---------- MASCOT ---------- */}
          <div className="flex shrink-0 items-center justify-center">
            <img
              src="/mascot.svg"
              alt="Mascot"
              className="h-28 w-auto sm:h-36 md:h-56 lg:h-64"
            />
          </div>
        </div>
      </motion.div>
    </footer>
  );
}