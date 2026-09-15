import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ScrollReveal from "@/components/scroll-reveal";

export default function NotFound() {
  return (
    <main
      dir="rtl"
      className="relative flex h-screen w-full flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* ---------- background ---------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <span className="select-none text-[42vw] font-black leading-none tracking-tighter text-foreground/[0.04] sm:text-[38vw] md:text-[32vw]">
          ۴۰۴
        </span>
      </div>

      {/* ---------- content ---------- */}
      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <ScrollReveal direction="bottom" distance={40} duration={1}>
          <p className="mb-5 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground md:text-sm">
            خطای ۴۰۴
          </p>
        </ScrollReveal>

        <ScrollReveal direction="bottom" distance={40} duration={1} delay={0.15}>
          <h1 className="text-4xl font-medium leading-[1.1] tracking-tight text-secondary sm:text-5xl md:text-6xl">
            این صفحه پیدا نشد
          </h1>
        </ScrollReveal>

        <ScrollReveal direction="bottom" distance={40} duration={1} delay={0.3}>
          <p className="mt-6 max-w-md text-base leading-[1.7] text-muted-foreground md:text-lg">
            آدرسی که وارد کردید وجود ندارد، یا ممکن است حذف شده باشد. می‌توانید
            از لینک‌های زیر ادامه دهید.
          </p>
        </ScrollReveal>

        <ScrollReveal direction="bottom" distance={40} duration={1} delay={0.45}>
          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-secondary px-8 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              بازگشت به خانه
              <ArrowLeft size={16} />
            </Link>

            <Link
              href="/contact"
              className="inline-flex h-14 items-center justify-center rounded-md border border-foreground/20 px-8 text-sm font-medium text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground"
            >
              تماس با ما
            </Link>
          </div>
        </ScrollReveal>

        <ScrollReveal direction="bottom" distance={30} duration={1} delay={0.6}>
          <nav className="mt-14 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <Link
              href="/shop"
              className="transition-colors hover:text-foreground"
            >
              فروشگاه
            </Link>
            <span className="h-1 w-1 rounded-md bg-foreground/20" />
            <Link
              href="/about"
              className="transition-colors hover:text-foreground"
            >
              درباره بالوی
            </Link>
            <span className="h-1 w-1 rounded-md bg-foreground/20" />
            <Link
              href="/blog"
              className="transition-colors hover:text-foreground"
            >
              مقاله‌ها
            </Link>
            <span className="h-1 w-1 rounded-md bg-foreground/20" />
            <Link
              href="/wholesale"
              className="transition-colors hover:text-foreground"
            >
              فروش عمده
            </Link>
          </nav>
        </ScrollReveal>
      </div>
    </main>
  );
}