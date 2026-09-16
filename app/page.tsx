"use client";

import Marquees from "@/components/marquees";
import MouseParallex from "@/components/mouse-parallax";
import ScrollReveal from "@/components/scroll-reveal";
import { Highlighter } from "@/components/ui/highlighter";
import FlipCards from "@/components/landing/flip-cards";
import ProductCategories from "@/components/landing/product-categories";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center flex-col overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section
        data-navbar-dark
        className="relative flex justify-center flex-col items-center w-full"
      >
        <ScrollReveal direction="top" className="w-full">
          <div className="relative w-full">
            <video
              src="/videos/compressed/video-hero.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-[70svh] sm:h-[80svh] md:h-[90svh] lg:h-screen object-cover"
            />

            <button
              type="button"
              aria-label="مشاهده محصولات"
              className="absolute inset-0 z-10 flex flex-col justify-end items-center w-full h-full cursor-pointer group pointer-events-none"
            >
              <span className="z-30 p-6 sm:p-8 md:p-12 text-lg sm:text-xl md:text-2xl font-light text-background whitespace-nowrap pointer-events-auto">
                مشاهده محصولات
              </span>
              <div className="absolute bottom-0 inset-x-0 mx-auto rounded-3xl z-20 transition-all duration-1000 ease-in group-hover:ease-out w-48 sm:w-60 h-12 sm:h-14 group-hover:w-full group-hover:h-full group-hover:rounded-md backdrop-blur-xl pointer-events-none bg-foreground/0 group-hover:bg-foreground/60 mb-6 sm:mb-8 md:mb-9 group-hover:mb-0" />
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* ================= Product Categories ================= */}
      <ProductCategories/>

      {/* ================= ABOUT ================= */}
      <section className="relative flex justify-center flex-col items-center w-full gap-8 sm:gap-10 md:gap-12 pb-8 sm:pb-10 md:pb-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 lg:gap-12 max-w-5xl w-full">
          {/* Text */}
          <div className="order-2 md:order-2 text-right md:flex-2 flex items-center justify-center px-2 sm:px-4 md:px-0">
            <ScrollReveal direction="left" distance={50} delay={0.25}>
              <p className="text-sm sm:text-base md:text-lg leading-7 sm:leading-8 text-foreground max-md:text-center">
                بالوی تنها یک نام تجاری نیست؛ بلکه نمایانگر دهه ها هنر,
                اصالت ایرانی و تخصص در صنعت تولید کفش است. ما با سال ها
                تجربه تخصصی و تمرکز بر کیفیت در تولیدی کفش چرم,
                مفتخریم که انتخاب اول کسانی باشیم که به دنبال راحتی,
                دوام و زیبایی بی نظیر هستند.
              </p>
            </ScrollReveal>
          </div>

          {/* Image + Heading */}
          <div className="relative order-1 md:order-1 flex justify-center items-center md:flex-1 w-full min-h-[220px] sm:min-h-[280px] md:min-h-[320px]">
            <ScrollReveal
              direction="bottom"
              distance={30}
              duration={1}
              delay={0}
              className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2"
            >
              <MouseParallex
                axis="both"
                strength={15}
                speed={0.06}
                className="h-full w-full"
              >
                <img
                  src="text-back.svg"
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain"
                />
              </MouseParallex>
            </ScrollReveal>

            <ScrollReveal direction="right" distance={60} delay={0.1}>
              <h2 className="relative z-10 max-w-md px-4 text-center text-2xl sm:text-3xl md:text-4xl font-black leading-normal whitespace-nowrap">
                چرم بالوی
                <br />
                <Highlighter action="highlight" color="#e0b069">
                  برترین تولیدی
                </Highlighter>{" "}
                کفش
                <br />
                چرم طبیعی در قلب تهران
              </h2>
            </ScrollReveal>
          </div>
        </div>

        {/* Video B */}
        <ScrollReveal
          direction="bottom"
          distance={70}
          duration={1}
          delay={0.35}
          className="w-full"
        >
          <div
            data-navbar-dark
            className="aspect-video sm:aspect-video md:aspect-16/7 w-full overflow-hidden"
          >
            <video
              src="/videos/compressed/video-b.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          </div>
        </ScrollReveal>
      </section>

      {/* ================= PRODUCTS ================= */}
        <section dir="rtl" className="w-full py-24 md:py-32">
  <div className="mx-auto grid w-full max-w-[1400px] grid-cols-1 gap-8 px-6 md:grid-cols-2 md:px-10">
    <Link
      href="/products?gender=male"
      className="group relative aspect-[4/5] overflow-hidden rounded-md bg-foreground/[0.035]"
    >
      <img
        src="/images/categories/classic.png"
        alt="مردانه"
        className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-110 group-hover:blur-xl"
      />

      {/* لایه تیره ملایم */}
      <div className="pointer-events-none absolute inset-0 bg-black/15 transition-colors duration-500 group-hover:bg-black/25" />

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="translate-y-3 text-3xl font-medium text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 md:text-5xl">
          مردانه
        </span>
      </div>
    </Link>

    <Link
      href="/products?gender=female"
      className="group relative aspect-[4/5] overflow-hidden rounded-md bg-foreground/[0.035]"
    >
      <img
        src="/images/categories/boot.png"
        alt="زنانه"
        className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-110 group-hover:blur-xl"
      />

      {/* لایه تیره ملایم */}
      <div className="pointer-events-none absolute inset-0 bg-black/15 transition-colors duration-500 group-hover:bg-black/25" />

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="translate-y-3 text-3xl font-medium text-white opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 md:text-5xl">
          زنانه
        </span>
      </div>
    </Link>
  </div>
</section>

      <FlipCards />
      <Marquees />
    </main>
  );
}