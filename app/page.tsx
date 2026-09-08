"use client";

import { motion } from "framer-motion";

import ProductCarousel from "@/components/items-carousel";
import ItemCard from "@/components/item-card";
import Marquees from "@/components/marquees";
import MouseParallex from "@/components/mouse-parallax"
import ScrollParallax from "@/components/scroll-parallax";
import ScrollReveal from "@/components/scroll-reveal";
import { Highlighter } from "@/components/ui/highlighter";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center flex-col">
      <section className="relative flex justify-center flex-col items-center w-full pt-36 sm:pt-40 md:pt-44 hp max-w-7xl">
        <MouseParallex
          axis="both"
          strength={50}
          speed={0.02}
          className="w-full h-full"
        >
          <ScrollReveal delay={0.2} direction="bottom" className="w-full h-full flex justify-center items-center">
            <img src="/text-logo.svg" alt="Logo "
              className=" max-w-5xl px-12"
            />
          </ScrollReveal>
        </MouseParallex>
        <ScrollReveal direction="top">
          <div data-navbar="dark" className="relative w-[calc(100%-2rem)] h-screen rounded-lg -mt-5 sm:-mt-8.5 md:-mt-10 lg:-mt-11 max-w-7xl overflow-hidden">
            <button className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-2xl text-background  whitespace-nowrap flex justify-center items-center cursor-pointer group w-full h-full pointer-events-none">
            <span className="z-3 p-12 pointer-events-auto font-light">
               مشاهده محصولات 
            </span>
            <div className="absolute rounded-3xl z-2 transition-all duration-1000 group-hover:ease-out ease-in w-60 h-14 group-hover:w-full group-hover:h-full group-hover:rounded-md backdrop-blur-xl pointer-events-none group-hover:bg-foreground/60 bg-foreground/0"/>
            </button>
            <video
              src="/videos/compressed/video-a.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />
          </div>
        </ScrollReveal>
      </section>
      <section className="relative flex justify-center flex-col items-center w-full vp hp max-w-7xl">
        <motion.img
          src="/poet.svg"
          alt="poet"
          className="px-12 max-w-5xl"
          initial={{
            opacity: 0,
            filter: "blur(20px)",
            scale: 1.2,
          }}
          whileInView={{
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
          }}
          viewport={{
            once: true,
            amount: 0.4,
          }}
          transition={{
            duration: 2,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </section>
      <section className="relative flex justify-center flex-col items-center w-full vp hp max-w-7xl">
        <ProductCarousel>
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
        </ProductCarousel>
      </section>
      <section className="relative flex justify-center flex-col items-center w-full vp hp max-w-7xl gap-8 pt-0 pb-8">
        <div className="flex gap-8 max-w-5xl max-md:flex-col">
          <div className="order-2 text-right md:flex-2 flex items-center justify-center">
            <ScrollReveal direction="left" distance={50} delay={0.25}>
                <p className="text-base leading-8 text-foreground md:text-lg max-md:text-center">
                  بالوی تنها یک نام تجاری نیست؛ بلکه نمایانگر دهه ها هنر，
                  اصالت ایرانی و تخصص در صنعت تولید کفش است. ما با سال ها
                  تجربه تخصصی و تمرکز بر کیفیت در تولیدی کفش چرم،
                  مفتخریم که انتخاب اول کسانی باشیم که به دنبال راحتی،
                  دوام و زیبایی بی نظیر هستند.
                </p>
            </ScrollReveal>
          </div>

          <div className="relative order-1 flex justify-center md:flex-1">
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
                  alt="back"
                  className="h-full w-full object-contain"
                />
              </MouseParallex>
            </ScrollReveal>

            <ScrollReveal direction="right" distance={60} delay={0.1}>
              <h2 className="relative z-10 max-w-md text-center text-3xl font-black leading-normal md:text-4xl">
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

        <ScrollReveal
          direction="bottom"
          distance={70}
          duration={1}
          delay={0.35}
          className="w-full"
        >
          <div data-navbar="dark" className="aspect-16/7 w-full overflow-hidden rounded-lg">
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
      <section className="relative flex justify-center flex-col items-center w-full vp hp max-w-7xl">
        <ProductCarousel>
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
          <ItemCard item={{name: "بوت مشکی", colors: ["#1f1f1f", "#301b1b"], beforePrice: 2500000, price: 2000000, image: "/images/boot.png"}} />
        </ProductCarousel>
      </section>
      <section className="relative flex justify-center flex-col items-center w-full vp hp max-w-7xl">
        <div className="flex w-full justify-center items-start gap-6">
          <div className="flex flex-1 min-w-0 flex-col gap-4 text-right">
            <ScrollReveal delay={0}>
              <div className="w-full aspect-[1/1.9] rounded-md overflow-hidden">
                <ScrollParallax
                  axis="y"
                  strength={40}
                  speed={0.02}
                  className="w-full h-full"
                >
                  <img
                    data-navbar="dark"
                    src="/images/طبیعی.png"
                    alt=""
                    className="w-full h-full object-cover scale-120"
                  />
                </ScrollParallax>
              </div>
            </ScrollReveal>

            <div>
              <ScrollReveal direction="right" delay={0.15}>
                <h3 className="font-bold text-xl">
                  تضمین اصالت چرم طبیعی
                </h3>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={0.3}>
                <p className="mt-2 text-base leading-7 text-muted-foreground">
                  با استفاده از باکیفیت ترین چرم های گاوی و استر گوسفاله
                </p>
              </ScrollReveal>
            </div>
          </div>

          <div className="mt-16 flex flex-1 min-w-0 flex-col gap-4 text-right">
            <ScrollReveal delay={0.2}>
              <div className="w-full aspect-[1/1.9] rounded-md overflow-hidden">
                <ScrollParallax
                  axis="y"
                  strength={-40}
                  speed={0.02}
                  className="w-full h-full"
                >
                  <img
                    data-navbar="dark"
                    src="/images/دقت.png"
                    alt=""
                    className="w-full h-full object-cover scale-120"
                  />
                </ScrollParallax>
              </div>
            </ScrollReveal>

            <div>
              <ScrollReveal direction="right" delay={0.35}>
                <h3 className="font-bold text-xl">
                  دوخت دقیق و ماندگار
                </h3>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={0.5}>
                <p className="mt-2 text-base leading-7 text-muted-foreground">
                  ترکیبی از ظرافت دست و دقت در جزئیات
                </p>
              </ScrollReveal>
            </div>
          </div>

          <div className="mt-8 flex flex-1 min-w-0 flex-col gap-4 text-right">
            <ScrollReveal delay={0.4}>
              <div className="w-full aspect-[1/1.9] rounded-md overflow-hidden">
                <ScrollParallax
                  axis="y"
                  strength={40}
                  speed={0.02}
                  className="w-full h-full"
                >
                  <img
                    data-navbar="dark"
                    src="/images/راحتی.png"
                    alt=""
                    className="w-full h-full object-cover scale-120"
                  />
                </ScrollParallax>
              </div>
            </ScrollReveal>

            <div>
              <ScrollReveal direction="right" delay={0.55}>
                <h3 className="font-bold text-xl">
                  راحتی در هر قدم
                </h3>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={0.7}>
                <p className="mt-2 text-base leading-7 text-muted-foreground">
                  طراحی شده برای همراهی طولانی و استفاده روزمره
                </p>
              </ScrollReveal>
            </div>
          </div>

          <div className="flex flex-1 min-w-0 flex-col gap-4 text-right">
            <ScrollReveal delay={0.6}>
              <div className="w-full aspect-[1/1.9] rounded-md overflow-hidden">
                <ScrollParallax
                  axis="y"
                  strength={-40}
                  speed={0.02}
                  className="w-full h-full"
                >
                  <img
                    data-navbar="dark"
                    src="/images/وسواس.png"
                    alt=""
                    className="w-full h-full object-cover scale-120"
                  />
                </ScrollParallax>
              </div>
            </ScrollReveal>

            <div>
              <ScrollReveal direction="right" delay={0.75}>
                <h3 className="font-bold text-xl">
                  ساخته شده با وسواس
                </h3>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={0.9}>
                <p className="mt-2 text-base leading-7 text-muted-foreground">
                  از انتخاب متریال تا آخرین مرحله تولید
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
      <Marquees/>
    </main>
  );
}
