import MouseParallex from "@/components/mouse-parallax"
import ProductCarousel from "@/components/items-carousel";
import BlogCard from "@/components/blog-card";
import ScrollReveal from "@/components/scroll-reveal";
import ScrollParallax from "@/components/scroll-parallax";

export default function AboutUs() {
  return (
    <main className="flex items-center justify-center flex-col gap-12">
      <section className="relative flex justify-center flex-col items-center w-full pt-18 hp max-w-7xl">
        <ScrollReveal
          direction="bottom"
          distance={80}
          duration={1.2}
          className="w-full"
        >
          <div
            data-navbar="dark"
            className="relative w-full h-[70vh] rounded-lg overflow-hidden bg-white flex items-end"
          >
            <video
              src="/videos/compressed/video-c.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full object-cover absolute inset-0 z-1"
            />

            <div className="relative w-full px-8 sm:px-10 md:px-12 pb-10 sm:pb-12 md:pb-14 z-2">
              <ScrollReveal
                direction="right"
                distance={60}
                duration={1}
                delay={0.35}
              >
                <h2 className="text-background text-4xl sm:text-5xl font-bold tracking-tight">
                  قصه‌ی بالوی
                </h2>
              </ScrollReveal>

              <ScrollReveal
                direction="left"
                distance={50}
                duration={1}
                delay={0.55}
              >
                <p className="mt-2 text-background/90 text-2xl sm:text-3xl leading-[1.15] font-medium">
                  جایی که اصالت چرم با هنر دست و نگاه امروز در هم می‌آمیزد.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </ScrollReveal>
      </section>
      <section dir="rtl" className="w-full max-w-7xl flex flex-col hp relative">
        <img src="/border.svg" className="absolute h-full object-contain top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 opacity-20"/>
        <div className="flex">
          <div className="w-1/2 p-8 md:p-10 lg:p-12">
            <ScrollReveal direction="right" distance={60} delay={0.15}>
              <h2
                className="
                  max-w-md
                  text-4xl md:text-5xl
                  leading-[1.15]
                  tracking-tight
                  bg-[radial-gradient(ellipse_at_center,var(--color-background)_0%,transparent_70%)]
                "
              >
                <MouseParallex
                  axis="both"
                  strength={25}
                  speed={0.02}
                  className="h-full"
                >
                  اصالتی که از دل چرم می‌آید و در هنر دست جان می‌گیرد.
                </MouseParallex>
              </h2>
            </ScrollReveal>
          </div>

          <ScrollReveal
            direction="top"
            distance={70}
            duration={1}
            delay={0}
            className="w-1/2"
          >
            <div
              className="w-full h-[325px] bg-muted/60 rounded-tr-[200px] rounded-l-md overflow-hidden"
            >
              <ScrollParallax
                axis="y"
                strength={30}
                speed={0.04}
                className="w-full h-full"
              >
                <video
                  src="/videos/compressed/video-d.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover scale-110"
                />
              </ScrollParallax>
            </div>
          </ScrollReveal>
        </div>

        <div className="flex">
          <ScrollReveal
            direction="bottom"
            distance={70}
            duration={1}
            delay={0.2}
            className="w-1/2"
          >
            <div
              className="w-full h-[325px] bg-muted/60 rounded-bl-[200px] rounded-r-md overflow-hidden"
            >
              <ScrollParallax
                axis="y"
                strength={30}
                speed={0.04}
                className="w-full h-full"
              >
                <video
                  src="/videos/compressed/video-e.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover scale-110"
                />
              </ScrollParallax>
            </div>
          </ScrollReveal>

          <div className="w-1/2 p-8 md:p-10 lg:p-12 flex items-end">
            <ScrollReveal direction="left" distance={60} delay={0.4}>
              <p className="max-w-lg text-xl md:text-3xl leading-[1.2] pb-8">
                <MouseParallex
                  axis="both"
                  strength={-25}
                  speed={0.02}
                  className="h-full"
                >
                  هر محصول بالوی، روایتِ سال‌ها تجربه، انتخاب دقیق و عشقی‌ست که در جزئیات ماندگار شده است.
                </MouseParallex>
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>
      <section dir="rtl" className="w-full max-w-7xl py-16 flex justify-center relative">
        <img src="/text-back.svg" className=" h-full absolute object-contain top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"/>
        <ScrollReveal
          direction="bottom"
          distance={30}
          duration={1.4}
        >
          <h2 className="max-w-2xl text-center text-4xl  font-black leading-[1.5]">
            اصالت را نمی‌توان ساخت؛<br/>باید آن را سال‌ها زندگی کرد.
          </h2>
        </ScrollReveal>
      </section>
      {/* ssssssss */}
      <section dir="rtl" className="w-full max-w-7xl flex items-stretch gap-8 relative">
        {/* <img src="/border-b.svg" className="absolute h-[110%] object-contain top-1/2 -translate-y-1/2 right-[30%] opacity-25"/> */}
        <ScrollReveal
          direction="left"
          distance={70}
          duration={1}
          className="w-1/3"
        >
          <div
            className="w-full min-h-[340px] rounded-md overflow-hidden bg-muted"
          >
            <ScrollParallax
              axis="y"
              strength={30}
              speed={0.04}
              className="w-full h-full"
            >
              <img
                src="/images/about-a.png"
                alt=""
                className="w-full h-140 object-cover scale-110"
              />
            </ScrollParallax>
          </div>
        </ScrollReveal>

        <div className="flex-1 flex flex-col justify-center">
          <ScrollReveal direction="right" distance={50}>
            <h2 className="text-4xl md:text-5xl font-medium mb-6">
              بالوی چیست؟
            </h2>
          </ScrollReveal>

          <ul className="space-y-5 text-lg md:text-xl leading-[1.35] list-disc pr-6">
            <ScrollReveal direction="right" distance={40} delay={0.15}>
              <li>
                بالوی روایتِ سال‌ها تجربه در صنعت چرم است؛ جایی که اصالت، کیفیت و هنر دست در کنار هم معنا پیدا می‌کنند.
              </li>
            </ScrollReveal>

            <ScrollReveal direction="right" distance={40} delay={0.3}>
              <li>
                از انتخاب چرم‌های مرغوب تا ظریف‌ترین مراحل تولید، هر محصول با وسواس و دقت ساخته می‌شود تا زیبایی و ماندگاری را هم‌زمان به همراه داشته باشد.
              </li>
            </ScrollReveal>

            <ScrollReveal direction="right" distance={40} delay={0.45}>
              <li>
                سال‌ها تجربه و دقت در تولید، به ما آموخته که ماندگاری واقعی در جزئیات شکل می‌گیرد.
              </li>
            </ScrollReveal>
          </ul>
        </div>
      </section>

      <section
        dir="rtl"
        className="w-full max-w-7xl flex flex-row-reverse items-stretch gap-8 relative"
      >
        {/* <img src="/border-b.svg" className="absolute h-[110%] object-contain top-1/2 -translate-y-1/2 left-[30%] opacity-25 rotate-180"/> */}
        <ScrollReveal
          direction="right"
          distance={70}
          duration={1}
          delay={0.15}
          className="w-1/3"
        >
          <div
            className="w-full min-h-[340px] rounded-md overflow-hidden bg-muted"
          >
            <ScrollParallax
              axis="y"
              strength={30}
              speed={0.04}
              className="w-full h-full"
            >
              <img
                src="/images/about-b.png"
                alt=""
                className="w-full h-140 object-cover scale-110"
              />
            </ScrollParallax>
          </div>
        </ScrollReveal>

        <div className="flex-1 flex flex-col justify-center">
          <ScrollReveal direction="left" distance={50} delay={0.2}>
            <h2 className="text-4xl md:text-5xl font-medium mb-6">
              چرا بالوی؟
            </h2>
          </ScrollReveal>

          <ul className="space-y-5 text-lg md:text-xl leading-[1.35] list-disc pr-6">
            <ScrollReveal direction="left" distance={40} delay={0.35}>
              <li>
                انتخاب چرم مرغوب، نخستین قدم ما برای ساخت محصولی باکیفیت و ماندگار است.
              </li>
            </ScrollReveal>

            <ScrollReveal direction="left" distance={40} delay={0.5}>
              <li>
                هر برش و هر دوخت با دقت انجام می‌شود تا ظرافت، دوام و زیبایی در کنار هم قرار بگیرند.
              </li>
            </ScrollReveal>

            <ScrollReveal direction="left" distance={40} delay={0.65}>
              <li>
                تجربه‌ی سال‌ها کار با چرم، در جزئیاتی دیده می‌شود که شاید در نگاه اول به چشم نیایند.
              </li>
            </ScrollReveal>

            <ScrollReveal direction="left" distance={40} delay={0.8}>
              <li>
                در بالوی، هنر سنتی چرم‌دوزی را با نگاه امروزی همراه کرده‌ایم تا اصالت، شکل تازه‌ای پیدا کند.
              </li>
            </ScrollReveal>
          </ul>
        </div>
      </section>
      <section className="relative flex justify-center flex-col items-center w-full pt-12 hp max-w-7xl">
        <ScrollReveal direction="right" distance={40} className="w-full">
          <h2 className="text-3xl font-bold text-right w-full pr-4 pb-4">مقاله ها</h2>
        </ScrollReveal>
        <ProductCarousel>
          <BlogCard item={{ name: "مقاله اول", description: "لورم ایپسوم متن ساختگی.", image: "/images/blog.png" }} />
          <BlogCard item={{ name: "مقاله دوم", description: "لورم ایپسوم متن ساختگی.", image: "/images/blog.png" }} />
          <BlogCard item={{ name: "مقاله سوم", description: "لورم ایپسوم متن ساختگی.", image: "/images/blog.png" }} />
          <BlogCard item={{ name: "مقاله چهارم", description: "لورم ایپسوم متن ساختگی.", image: "/images/blog.png" }} />
          <BlogCard item={{ name: "مقاله پنجم", description: "لورم ایپسوم متن ساختگی.", image: "/images/blog.png" }} />
          <BlogCard item={{ name: "مقاله ششم", description: "لورم ایپسوم متن ساختگی.", image: "/images/blog.png" }} />
          <BlogCard item={{ name: "مقاله هفتم", description: "لورم ایپسوم متن ساختگی.", image: "/images/blog.png" }} />
          <BlogCard item={{ name: "مقاله هشتم", description: "لورم ایپسوم متن ساختگی.", image: "/images/blog.png" }} />
        </ProductCarousel>
      </section>
    </main>
  );
}