"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Mail, MapPin, Phone } from "lucide-react";

import ScrollReveal from "@/components/scroll-reveal";
import ScrollParallax from "@/components/scroll-parallax";
import MouseParallex from "@/components/mouse-parallax";
import ProductCarousel from "@/components/items-carousel";
import ItemCard from "@/components/item-card";
import Marquees from "@/components/marquees";
import { Highlighter } from "@/components/ui/highlighter";

import {
Accordion,
AccordionContent,
AccordionItem,
AccordionTrigger,
} from "@/components/ui/accordion";

/* ---------------- data ---------------- */

const stats = [
  { value: "۱۰+", label: "سال تجربه در صنعت چرم" },
  { value: "۵۰۰+", label: "بوتیک و فروشگاه همکار" },
  { value: "۵۰", label: "حداقل تعداد سفارش" },
  { value: "۴۸ ساعت", label: "آماده‌سازی سفارش" },
];

const persianNumbers = ["۰۱", "۰۲", "۰۳", "۰۴"];

const features = [
  {
    title: "کیفیت تضمین‌شده",
    desc: "هر قطعه پیش از ارسال با دقت بازرسی می‌شود. اگر ایرادی داشت، بدون بحث جایگزین می‌کنیم.",
  },
  {
    title: "تولید سفارشی",
    desc: "امکان سفارش در رنگ، اندازه و مدل دلخواه. از ۱۰۰ عدد به بالا لوگوی برند شما درج می‌شود.",
  },
  {
    title: "قیمت‌گذاری پله‌ای",
    desc: "هرچه حجم سفارش بالاتر باشد، قیمت واحد بهتر می‌شود. شفاف، بدون هزینه پنهان.",
  },
  {
    title: "ارسال سراسری",
    desc: "ارسال به تمام نقاط کشور با پست پیشتاز و تیپاکس، بسته‌بندی ضد ضربه و حرفه‌ای.",
  },
];

const steps = [
  { n: "۰۱", title: "ثبت درخواست", desc: "فرم پایین را پر کنید یا مستقیم تماس بگیرید." },
  { n: "۰۲", title: "بررسی و مشاوره", desc: "تیم ما در کمتر از ۲۴ ساعت کاری با شما تماس می‌گیرد." },
  { n: "۰۳", title: "نمونه و توافق", desc: "نمونه ارسال می‌شود و شرایط نهایی می‌شود." },
  { n: "۰۴", title: "تولید و تحویل", desc: "پس از تأیید، تولید آغاز و سفارش ارسال می‌شود." },
];

const conditions = [
  "حداقل سفارش اولیه ۵۰ عدد",
  "امکان درج لوگو از ۱۰۰ عدد به بالا",
  "پرداخت ۵۰٪ پیش‌پرداخت، مانده هنگام تحویل",
  "زمان تولید بین ۷ تا ۱۴ روز کاری",
  "امکان مرجوعی در صورت وجود ایراد تولیدی",
  "تخفیف پله‌ای بر اساس حجم سفارش",
];

const faqs = [
  {
    q: "حداقل مقدار سفارش چقدر است؟",
    a: "حداقل سفارش اولیه ۵۰ عدد است. برای سفارش‌های بالای ۲۰۰ عدد، تخفیف پله‌ای قابل‌توجهی اعمال می‌شود.",
  },
  {
    q: "امکان تولید سفارشی وجود دارد؟",
    a: "بله. رنگ، اندازه، نوع چرم و درج لوگو از ۱۰۰ عدد به بالا قابل سفارشی‌سازی است.",
  },
  {
    q: "زمان تولید و ارسال چقدر است؟",
    a: "بسته به حجم سفارش، بین ۷ تا ۱۴ روز کاری تولید و ۲ تا ۴ روز ارسال به سراسر کشور.",
  },
  {
    q: "امکان دریافت نمونه قبل از سفارش اصلی هست؟",
    a: "بله، برای سفارش‌های عمده، ارسال نمونه اولیه امکان‌پذیر است تا کیفیت را از نزدیک ببینید.",
  },
];

/* ---------------- page ---------------- */

export default function WholesalePage() {
  const [form, setForm] = useState({
    name: "",
    business: "",
    phone: "",
    product: "",
    quantity: "",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: wire to API / server action
    console.log(form);
    setSent(true);
  };

  return (
    <main
      dir="rtl"
      className="flex flex-col items-center justify-center w-full overflow-x-hidden"
    >
      {/* ================= HERO ================= */}
      <section className="relative flex flex-col items-center justify-center w-full">
        <ScrollReveal
            direction="bottom"
            distance={80}
            duration={1.2}
            className="w-full"
        >
            <div
            data-navbar-dark
            className="relative flex items-end w-full h-[80svh] sm:h-[88svh] md:h-screen overflow-hidden bg-white"
            >
            <video
                src="/videos/compressed/video-c.mp4"
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 z-[1] object-cover w-full h-full"
            />

            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

            <div className="relative z-[2] w-full max-w-7xl mx-auto px-5 pb-8 sm:px-8 md:px-12 sm:pb-10 md:pb-14">
                <ScrollReveal
                direction="right"
                distance={60}
                duration={1}
                delay={0.35}
                >
                <p className="mb-3 text-sm font-medium tracking-wider text-background/70">
                    همکاری در فروش عمده
                </p>
                </ScrollReveal>

                <ScrollReveal
                direction="right"
                distance={60}
                duration={1}
                delay={0.45}
                >
                <h1 className="text-3xl font-bold tracking-tight text-background sm:text-4xl md:text-6xl leading-[1.15] max-w-3xl">
                    با بالوی، چرم را{" "}
                    <Highlighter action="underline" color="#e0b069">
                    عمده
                    </Highlighter>{" "}
                    بفروشید
                </h1>
                </ScrollReveal>

                <ScrollReveal
                direction="left"
                distance={50}
                duration={1}
                delay={0.6}
                >
                <p className="max-w-2xl mt-4 text-base font-medium leading-[1.5] text-background/90 sm:text-lg md:text-2xl">
                    از بوتیک‌های کوچک تا فروشگاه‌های زنجیره‌ای، شرایط همکاری
                    انعطاف‌پذیر و کیفیت تضمین‌شده.
                </p>
                </ScrollReveal>

                <ScrollReveal
                direction="bottom"
                distance={40}
                duration={1}
                delay={0.8}
                >
                <div className="flex flex-col gap-3 mt-7 sm:flex-row">
                    <a
                    href="#contact"
                    className="inline-flex items-center justify-center h-14 gap-2 px-8 text-sm font-medium transition-opacity rounded-md bg-background text-foreground hover:opacity-90"
                    >
                    درخواست همکاری
                    <ArrowLeft size={16} />
                    </a>

                    <Link
                    href="/contact"
                    className="inline-flex items-center justify-center h-14 px-8 text-sm font-medium transition-colors border rounded-md border-background/30 text-background hover:border-background/60"
                    >
                    گفت‌وگو با تیم فروش
                    </Link>
                </div>
                </ScrollReveal>
            </div>
            </div>
        </ScrollReveal>
        </section>

      {/* ================= STATS ================= */}
      <section
        dir="rtl"
        className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-16"
      >
        <ScrollReveal direction="bottom" distance={40}>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-0 md:divide-x md:divide-foreground/10 md:divide-x-reverse">
            {stats.map((s) => (
                <div
                    key={s.label}
                    className="flex flex-col items-center px-4 text-center"
                >
                    <div className="text-3xl font-black tracking-tight md:text-5xl">
                    {s.value}
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground md:text-sm">
                    {s.label}
                    </div>
                </div>
                ))}
          </div>
        </ScrollReveal>
      </section>

      {/* ================= WHY ================= */}
        <section
        dir="rtl"
        className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24"
        >
        <img
            src="/border.svg"
            alt=""
            aria-hidden="true"
            className="absolute object-contain -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.08] top-1/2 left-1/2 h-[70%]"
        />

        <div className="relative mb-14 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <ScrollReveal direction="right" distance={50}>
            <div className="max-w-xl">
                <p className="mb-4 text-sm md:text-base text-muted-foreground">
                چرا بالوی
                </p>
                <h2 className="text-3xl font-medium leading-[1.15] tracking-tight md:text-5xl">
                چیزی که به شما می‌دهیم
                </h2>
            </div>
            </ScrollReveal>

            <ScrollReveal direction="left" distance={50} delay={0.2}>
            <p className="max-w-sm text-base leading-[1.6] text-muted-foreground md:text-lg">
                ما فقط محصول نمی‌فروشیم؛ کنار شما می‌مانیم تا فروش‌تان بچرخد و
                مشتری‌ها برگردند.
            </p>
            </ScrollReveal>
        </div>

        <ul className="relative border-t border-foreground/10">
            {features.map((f, i) => (
            <ScrollReveal
                key={f.title}
                direction="bottom"
                distance={30}
                delay={i * 0.07}
            >
                <li className="grid grid-cols-[auto_1fr] items-start gap-6 border-b border-foreground/10 py-8 sm:gap-10 sm:py-10 md:gap-16">
                <span className="pt-1 text-3xl font-black leading-none text-secondary/25 sm:text-4xl md:text-6xl">
                    {persianNumbers[i]}
                </span>

                <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-10">
                    <h3 className="text-lg font-medium tracking-tight sm:text-xl md:w-64 md:shrink-0 md:text-2xl">
                    {f.title}
                    </h3>
                    <p className="max-w-2xl text-sm leading-[1.75] text-muted-foreground sm:text-base md:text-lg">
                    {f.desc}
                    </p>
                </div>
                </li>
            </ScrollReveal>
            ))}
        </ul>
        </section>

      {/* ================= PROCESS ================= */}
      <section
        dir="rtl"
        className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24"
      >
        <ScrollReveal direction="right" distance={50}>
          <div className="mb-12 max-w-2xl">
            <p className="mb-4 text-sm md:text-base text-muted-foreground">
              مسیر همکاری
            </p>
            <h2 className="text-3xl font-medium leading-[1.15] tracking-tight md:text-5xl">
              از درخواست تا تحویل، در چهار قدم
            </h2>
          </div>
        </ScrollReveal>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
          {steps.map((s, i) => (
            <ScrollReveal
              key={s.n}
              direction="bottom"
              distance={40}
              delay={i * 0.1}
            >
              <div className="relative h-full p-6 border rounded-md border-foreground/10 bg-muted/40">
                <div className="mb-5 text-3xl font-black text-secondary/30 md:text-4xl">
                  {s.n}
                </div>
                <h3 className="mb-2 text-base font-medium md:text-lg">
                  {s.title}
                </h3>
                <p className="text-sm leading-[1.6] text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ================= QUOTE ================= */}
      <section
        dir="rtl"
        className="relative flex justify-center w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16"
      >
        <img
          src="/text-back.svg"
          alt=""
          aria-hidden="true"
          className="absolute object-contain -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2"
        />
        <ScrollReveal direction="bottom" distance={30} duration={1.4}>
          <h2 className="relative max-w-2xl text-2xl font-black text-center sm:text-3xl md:text-4xl leading-[1.5]">
            <MouseParallex
              axis="both"
              strength={12}
              speed={0.02}
              className="inline-block"
            >
              <span>
                اعتماد شما، سرمایه‌ی ماست؛
                <br />
                کیفیت، ضمانت آن.
              </span>
            </MouseParallex>
          </h2>
        </ScrollReveal>
      </section>

      {/* ================= PRODUCTS ================= */}
      <section className="relative flex flex-col items-center justify-center w-full max-w-7xl px-2 py-10 sm:px-4 md:px-6 lg:px-8 sm:py-14 md:py-20">
        <ScrollReveal direction="right" distance={40} className="w-full">
          <h2 className="w-full pb-6 pr-1 text-2xl font-bold text-right sm:text-3xl sm:pr-2">
            نمونه محصولات عمده
          </h2>
        </ScrollReveal>

        <ProductCarousel>
          {Array.from({ length: 8 }).map((_, i) => (
            <ItemCard
              key={i}
              item={{
                name: "بوت مشکی",
                colors: ["#1f1f1f", "#301b1b"],
                beforePrice: 2500000,
                price: 2000000,
                image: "/images/boot.png",
              }}
            />
          ))}
        </ProductCarousel>
      </section>

      {/* ================= CONDITIONS ================= */}
      <section
        dir="rtl"
        className="relative w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 md:pb-24"
      >
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <ScrollReveal direction="right" distance={50}>
            <div>
              <p className="mb-4 text-sm md:text-base text-muted-foreground">
                شرایط همکاری
              </p>
              <h2 className="text-3xl font-medium leading-[1.15] tracking-tight md:text-5xl">
                شفاف، ساده، بدون هزینه پنهان
              </h2>
              <p className="mt-6 text-base leading-[1.7] text-muted-foreground md:text-lg">
                شرایط ما روشن است تا بتوانید با خیال راحت برنامه‌ریزی کنید. اگر
                نیاز به ترتیب خاصی دارید، با ما صحبت کنید — انعطاف‌پذیر هستیم.
              </p>
            </div>
          </ScrollReveal>

          <ul className="space-y-3">
            {conditions.map((c, i) => (
              <ScrollReveal
                key={c}
                direction="left"
                distance={40}
                delay={i * 0.06}
              >
                <li className="flex items-start gap-3 px-5 py-4 text-sm leading-[1.6] border rounded-md border-foreground/10 bg-muted/40 text-muted-foreground md:text-base">
                  <span className="flex items-center justify-center rounded-md shrink-0 mt-0.5 w-5 h-5 bg-primary/15 text-primary">
                    <Check size={12} strokeWidth={2.5} />
                  </span>
                  {c}
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </div>
      </section>

    {/* ================= CONTACT CTA ================= */}
    <section
    dir="rtl"
    className="w-full max-w-7xl px-6 sm:px-8 pb-20 sm:pb-24"
    >
    <div className="grid gap-16 md:grid-cols-2 md:gap-24 md:items-start">
        {/* ---------- left: heading + cta ---------- */}
        <ScrollReveal direction="right" distance={60}>
        <div>
            <p className="mb-4 text-sm md:text-base text-muted-foreground">
            شروع همکاری
            </p>

            <h2 className="text-3xl font-medium leading-[1.15] tracking-tight md:text-5xl">
            گفت‌وگو را از همین‌جا شروع کنیم
            </h2>

            <p className="mt-6 max-w-md text-base leading-[1.7] text-muted-foreground md:text-lg">
            برای دریافت قیمت عمده، شرایط همکاری یا هماهنگی بازدید از کارگاه،
            از طریق صفحه تماس با ما در ارتباط باشید. در کمتر از ۲۴ ساعت کاری
            پاسخ می‌دهیم.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
                href="/contact"
                className="inline-flex h-14 items-center justify-center gap-2 rounded-md bg-secondary px-8 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
                رفتن به صفحه تماس
                <ArrowLeft size={16} />
            </Link>

            <a
                href="tel:+982112345678"
                className="inline-flex h-14 items-center justify-center rounded-md border border-foreground/20 px-8 text-sm font-medium text-foreground/80 transition-colors hover:border-foreground/40 hover:text-foreground"
                dir="ltr"
            >
                ۰۲۱-۱۲۳۴۵۶۷۸
            </a>
            </div>
        </div>
        </ScrollReveal>

        {/* ---------- right: info list ---------- */}
        <ScrollReveal direction="left" distance={60} delay={0.15}>
        <dl className="divide-y divide-foreground/10 border-y border-foreground/10">
            <div className="flex items-baseline justify-between gap-6 py-5">
            <dt className="text-sm text-muted-foreground">
                شماره تماس فروش عمده
            </dt>
            <dd className="text-base font-medium tracking-tight" dir="ltr">
                ۰۲۱-۱۲۳۴۵۶۷۸
            </dd>
            </div>

            <div className="flex items-baseline justify-between gap-6 py-5">
            <dt className="text-sm text-muted-foreground">ایمیل</dt>
            <dd className="text-base font-medium tracking-tight" dir="ltr">
                wholesale@balvi.ir
            </dd>
            </div>

            <div className="flex items-baseline justify-between gap-6 py-5">
            <dt className="text-sm text-muted-foreground">آدرس کارگاه</dt>
            <dd className="max-w-[60%] text-left text-base leading-[1.6]">
                تهران، خیابان نمونه، پلاک ۱۲۳
            </dd>
            </div>

            <div className="flex items-baseline justify-between gap-6 py-5">
            <dt className="text-sm text-muted-foreground">ساعات پاسخگویی</dt>
            <dd className="text-base">شنبه تا پنجشنبه، ۹ تا ۱۸</dd>
            </div>
        </dl>
        </ScrollReveal>
    </div>
    </section>

    {/* ================= FAQ ================= */}
    <section
    dir="rtl"
    className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 sm:pb-24"
    >
    <ScrollReveal direction="right" distance={50}>
        <div className="mb-12 max-w-2xl">
        <p className="mb-4 text-sm md:text-base text-muted-foreground">
            سوالات متداول
        </p>
        <h2 className="text-3xl font-medium leading-[1.15] tracking-tight md:text-5xl">
            چیزهایی که ممکن است بپرسید
        </h2>
        </div>
    </ScrollReveal>

    <ScrollReveal direction="bottom" distance={30}>
        <div className="mx-auto max-w-3xl border-y border-foreground/10">
        <Accordion className="w-full">
            {faqs.map((f, i) => (
            <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="border-b border-foreground/10 last:border-b-0"
            >
                <AccordionTrigger className="py-5 text-right text-base font-medium hover:no-underline md:text-lg">
                {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-[1.7] text-muted-foreground md:text-base">
                {f.a}
                </AccordionContent>
            </AccordionItem>
            ))}
        </Accordion>
        </div>
    </ScrollReveal>
    </section>
    </main>
  );
}