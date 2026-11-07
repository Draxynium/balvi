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
        className="bg-secondary text-primary relative flex w-full min-w-0 flex-col gap-8 overflow-hidden px-5 py-9 sm:gap-10 sm:px-8 sm:py-10 md:px-10 md:py-12 lg:px-12"
      >
        {/* ---------- TOP: CONTENT + MASCOT ---------- */}
        <div className="flex w-full min-w-0 flex-col gap-8 sm:gap-10 md:flex-row md:items-center md:justify-center md:gap-14 lg:gap-20">
          <div className="flex w-full max-w-3xl min-w-0 flex-col gap-6 sm:gap-7 md:items-start md:gap-8">
            {/* ---------- HEADING ---------- */}
            <h2 className="text-center text-2xl leading-snug font-black sm:text-3xl md:text-left md:text-4xl">
              آنچه می‌ماند
              <br className="md:hidden" />{" "}
              <span className="md:inline">اصالت است و هنر</span>
            </h2>

            {/* ---------- NAV ---------- */}
            <nav className="grid w-full min-w-0 grid-cols-2 items-start gap-x-6 gap-y-4 sm:gap-x-10 md:flex md:justify-start md:gap-12 lg:gap-16">
              {columns.map((col) => (
                <div
                  key={col.title}
                  className="flex min-w-0 flex-col items-center gap-2.5 sm:gap-3 md:items-start"
                >
                  <h3 className="text-[11px] font-bold tracking-wide uppercase opacity-60 sm:text-xs md:text-sm md:opacity-100">
                    {col.title}
                  </h3>

                  <div className="flex flex-col items-center gap-2 text-[11px] sm:text-xs md:items-start md:text-sm">
                    {col.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center justify-center gap-0.5 text-center transition-opacity hover:opacity-70 md:justify-start md:text-right md:whitespace-nowrap"
                      >
                        <span>{link.label}</span>
                        <ArrowUpLeft className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>

            <div className="bg-primary/25 h-px w-full" />

            {/* ---------- BOTTOM BAR ---------- */}
            <div className="flex w-full flex-col items-center gap-4 text-[11px] sm:text-xs md:flex-row md:items-center md:justify-between md:gap-6">
              <span className="text-center opacity-70 md:opacity-100">
                تمامی حقوق محفوظ است - ۱۴۰۳
              </span>

              <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-6">
                <Link href="/" className="transition-opacity hover:opacity-70">
                  حریم خصوصی
                </Link>
                <Link href="/" className="transition-opacity hover:opacity-70">
                  قوانین و مقررات
                </Link>
              </div>

              <Link
                href="/"
                className="shrink-0 transition-opacity hover:opacity-70"
              >
                <img
                  src="/text-logo.svg"
                  alt="Logo"
                  className="h-5 w-auto sm:h-6"
                />
              </Link>
            </div>
          </div>

          {/* ---------- MASCOT ---------- */}
          <div className="flex shrink-0 flex-col items-center justify-center gap-5">
            <img
              src="/mascot.svg"
              alt="Mascot"
              className="h-28 w-auto sm:h-36 md:h-56 lg:h-64"
            />

            <a
              referrerPolicy="origin"
              target="_blank"
              rel="noopener noreferrer"
              href="https://trustseal.enamad.ir/?id=8481757&Code=VO8kjeqNgpfEJcuH508gNj1O3xu5QoOL"
              aria-label="مشاهده نماد اعتماد الکترونیکی فروشگاه بالوی"
              className="flex h-28 w-28 items-center justify-center rounded-xl bg-white p-2 shadow-sm transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary sm:h-32 sm:w-32"
            >
              <img
                referrerPolicy="origin"
                src="https://trustseal.enamad.ir/logo.aspx?id=8481757&Code=VO8kjeqNgpfEJcuH508gNj1O3xu5QoOL"
                alt="نماد اعتماد الکترونیکی فروشگاه بالوی"
                className="h-full w-full cursor-pointer object-contain"
                {...{ code: "VO8kjeqNgpfEJcuH508gNj1O3xu5QoOL" }}
              />
            </a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
