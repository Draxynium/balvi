"use client";

import Marquees from "@/components/marquees";
import MouseParallex from "@/components/mouse-parallax";
import ScrollReveal from "@/components/scroll-reveal";
import { Highlighter } from "@/components/ui/highlighter";
import FlipCards from "@/components/landing/flip-cards";
import ProductCategories from "@/components/landing/product-categories";
import GenderSection from "@/components/landing/gender-section";
import { HomeArticles } from "@/components/articles/home-articles";

export default function Home() {
  return (
    <main className="flex w-full flex-col items-center justify-center overflow-x-hidden">
      {/* ================= HERO ================= */}
      <section
        data-navbar-dark
        className="relative flex w-full flex-col items-center justify-center"
      >
        <ScrollReveal direction="top" className="w-full">
          <div className="relative w-full">
            <video
              src="/videos/compressed/video-hero.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-[90vh] w-full object-cover"
            />

            <button
              type="button"
              aria-label="مشاهده محصولات"
              className="group pointer-events-none absolute inset-0 z-10 flex h-full w-full cursor-pointer flex-col items-center justify-end"
            >
              <span className="text-background pointer-events-auto z-30 p-6 text-lg font-light whitespace-nowrap sm:p-8 sm:text-xl md:p-12 md:text-2xl">
                مشاهده محصولات
              </span>
              <div className="bg-foreground/0 group-hover:bg-foreground/60 pointer-events-none absolute inset-x-0 bottom-0 z-20 mx-auto mb-6 h-12 w-48 rounded-3xl backdrop-blur-xl transition-all duration-1000 ease-in group-hover:mb-0 group-hover:h-full group-hover:w-full group-hover:rounded-md group-hover:ease-out sm:mb-8 sm:h-14 sm:w-60 md:mb-9" />
            </button>
          </div>
        </ScrollReveal>
      </section>

      {/* ================= Product Categories ================= */}
      <GenderSection />

      {/* ================= ABOUT ================= */}
      <section className="relative flex w-full flex-col items-center justify-center gap-8 pb-8 sm:gap-10 sm:pb-10 md:gap-12 md:pb-12">
        <div className="flex w-full max-w-5xl flex-col gap-8 md:flex-row md:gap-10 lg:gap-12">
          {/* Text */}
          <div className="order-2 flex items-center justify-center px-2 text-right sm:px-4 md:order-2 md:flex-2 md:px-0">
            <ScrollReveal direction="left" distance={50} delay={0.25}>
              <p className="text-foreground text-sm leading-7 max-md:text-center sm:text-base sm:leading-8 md:text-lg">
                بالوی تنها یک نام تجاری نیست؛ بلکه نمایانگر دهه ها هنر, اصالت
                ایرانی و تخصص در صنعت تولید کفش است. ما با سال ها تجربه تخصصی و
                تمرکز بر کیفیت در تولیدی کفش چرم, مفتخریم که انتخاب اول کسانی
                باشیم که به دنبال راحتی, دوام و زیبایی بی نظیر هستند.
              </p>
            </ScrollReveal>
          </div>

          {/* Image + Heading */}
          <div className="relative order-1 flex min-h-[220px] w-full items-center justify-center sm:min-h-[280px] md:order-1 md:min-h-[320px] md:flex-1">
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
              <h2 className="relative z-10 max-w-md px-4 text-center text-2xl leading-normal font-black whitespace-nowrap sm:text-3xl md:text-4xl">
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
            className="aspect-video w-full overflow-hidden sm:aspect-video md:aspect-16/7"
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

      <ProductCategories />

      <FlipCards />

      {/* ============ BLOG ============ */}
      <section className="relative flex w-full max-w-7xl flex-col items-center justify-center px-4 pt-8 sm:px-6 sm:pt-10 md:pt-12 lg:px-8">
        <ScrollReveal direction="right" distance={40} className="w-full">
          <p className="text-secondary mb-2 w-full pr-1 text-right text-sm font-medium tracking-wider sm:pr-2 sm:text-base">
            یادداشت‌های بالوی
          </p>
          <h2 className="w-full pr-1 pb-4 text-right text-2xl font-bold sm:pr-2 sm:text-3xl">
            مقاله ها
          </h2>
        </ScrollReveal>

        <HomeArticles />
      </section>

      <Marquees />
    </main>
  );
}
