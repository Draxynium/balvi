"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { ArrowUpLeft } from "lucide-react";

export default function Footer() {
  const columns = [
    {
      title: "محصولات",
      links: [
        { label: "محصولات", href: "/products" },
        { label: "درباره ما", href: "/about" },
        { label: "مقاله ها", href: "/articles" },
        { label: "تماس با ما", href: "/contact" },
      ],
    },
    {
      title: "شرکت",
      links: [
        { label: "درباره ما", href: "/about" },
        { label: "مقاله ها", href: "/articles" },
        { label: "فرصت‌های شغلی", href: "/careers" },
      ],
    },
    {
      title: "پشتیبانی",
      links: [
        { label: "تماس با ما", href: "/contact" },
        { label: "سوالات متداول", href: "/faq" },
        { label: "پیگیری سفارش", href: "/track-order" },
      ],
    },
  ];

  return (
    <footer className="relative flex w-full justify-center overflow-hidden pt-12">
<motion.div
  initial={{
    y: "40%",
    width: "80%",
    borderTopRightRadius: "4px",
    borderTopLeftRadius: "4px",
  }}
  whileInView={{
    y: 0,
    width: "100%",
    borderTopRightRadius: "0",
    borderTopLeftRadius: "0",
  }}
  viewport={{ once: true, amount: 0.05 }}
  transition={{
    y: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
    width: {
      duration: 0.8,
      delay: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
    borderTopRightRadius: {
      duration: 0.8,
      delay: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
    borderTopLeftRadius: {
      duration: 0.8,
      delay: 0.5,
      ease: [0.22, 1, 0.36, 1],
    }
  }}
  className="flex flex-col-reverse items-center justify-center gap-12 rounded-t-md bg-secondary py-10 text-primary md:flex-row md:gap-20 hp"
>
        <div className="flex max-w-3xl w-full flex-col items-center justify-center gap-6 md:items-start">
          <div className="flex w-full flex-col items-center gap-8 md:items-start">
            <h2 className="text-3xl font-black">
              آنچه میماند{" "}
               اصالت است و هنر
            </h2>

            <nav className="flex w-full flex-col items-center gap-16 md:flex-row md:items-start">
              {columns.map((col) => (
                <div
                  key={col.title}
                  className="flex flex-col items-center gap-4 md:items-start"
                >
                  <h3 className="text-sm font-semibold">{col.title}</h3>

                  <div className="flex flex-col items-start gap-3 text-sm">
                    {col.links.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center transition-opacity hover:opacity-70"
                      >
                        <span>{link.label}</span>
                        <ArrowUpLeft />
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>

          <div className="h-px w-full bg-primary" />

          <div className="flex w-full items-center justify-between gap-6 text-xs">
            <span>تمامی حقوق محفوظ است - ۱۴۰۳</span>

            <Link href="/">
              <span>حریم خصوصی</span>
            </Link>

            <Link href="/">
              <span>قوانین و مقررات</span>
            </Link>

            <img
              src="/text-logo.svg"
              alt="Logo"
              className="w-32"
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-center">
          <img src="/mascot.svg" className="h-64 w-auto text-primary md:h-72 lg:h-80" />
        </div>
      </motion.div>
    </footer>
  );
}