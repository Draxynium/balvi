"use client";

import { useEffect, useState } from "react";
import { cn } from "cn";
import ScrollParallax from "../scroll-parallax";
import ScrollReveal from "../scroll-reveal";
import MoveOffset from "../move-offset";

/* ---------- MOBILE DETECTION HOOK ---------- */
/* Returns `false` during SSR and on first client render (safe — no hydration mismatch),
   then updates after mount. On mobile it stays `false` forever → no float wrapper. */
function useIsDesktop(query = "(min-width: 768px)") {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setIsDesktop(mq.matches);

    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return isDesktop;
}

const cards = [
  {
    image: "/images/طبیعی.png",
    secondImage: "/images/طبیعی.png",
    title: "تضمین اصالت چرم طبیعی",
    description: "با استفاده از باکیفیت ترین چرم های گاوی و استر گوسفاله",
    strength: 40,
    delay: 0,
    floatDelay: 0.1,
    offset: 18,
    duration: 2.4,
  },
  {
    image: "/images/دقت.png",
    secondImage: "/images/دقت.png",
    title: "دوخت دقیق و ماندگار",
    description: "ترکیبی از ظرافت دست و دقت در جزئیات",
    strength: -40,
    delay: 0.2,
    floatDelay: 0.9,
    offset: 18,
    duration: 3.1,
  },
  {
    image: "/images/راحتی.png",
    secondImage: "/images/راحتی.png",
    title: "راحتی در هر قدم",
    description: "طراحی شده برای همراهی طولانی و استفاده روزمره",
    strength: 40,
    delay: 0.4,
    floatDelay: 0.45,
    offset: 18,
    duration: 2.7,
  },
  {
    image: "/images/وسواس.png",
    secondImage: "/images/وسواس.png",
    title: "ساخته شده با وسواس",
    description: "از انتخاب متریال تا آخرین مرحله تولید",
    strength: -40,
    delay: 0.6,
    floatDelay: 1.35,
    offset: 18,
    duration: 3.5,
  },
];

type Card = (typeof cards)[number];

function FlipCard({
  item,
  flipped,
  onToggle,
}: {
  item: Card;
  flipped: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-3 text-right sm:gap-4">
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${item.title} — برای برگرداندن کارت کلیک کنید`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        className="group block w-full cursor-pointer select-none rounded-md outline-none [perspective:800px] sm:[perspective:1100px] md:[perspective:1500px] focus-visible:ring-2 focus-visible:ring-primary/40"
      >
        <div
          className={cn(
            "relative w-full transition-transform duration-[1300ms] ease-out [transform-style:preserve-3d]",
            flipped && "[transform:rotateY(180deg)]"
          )}
        >
          {/* ---------- FRONT ---------- */}
          <div className="[backface-visibility:hidden]">
            <ScrollReveal delay={item.delay}>
              <div className="w-full aspect-[3/4] sm:aspect-[1/1.3] md:aspect-[1/1.5] lg:aspect-[1/1.9] rounded-md overflow-hidden">
                <ScrollParallax
                  axis="y"
                  strength={item.strength}
                  speed={0.02}
                  className="w-full h-full"
                >
                  <img
                    data-navbar-dark
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover scale-[1.2]"
                  />
                </ScrollParallax>
              </div>
            </ScrollReveal>

            <div className="mt-3 sm:mt-4">
              <ScrollReveal direction="right" delay={0.15 + item.delay}>
                <h3 className="text-sm font-bold leading-snug sm:text-base md:text-lg lg:text-xl">
                  {item.title}
                </h3>
              </ScrollReveal>

              <ScrollReveal direction="left" delay={0.3 + item.delay}>
                <p className="mt-2 text-xs leading-6 text-muted-foreground sm:mt-3 sm:text-sm sm:leading-7 md:text-base">
                  {item.description}
                </p>
              </ScrollReveal>
            </div>
          </div>

          {/* ---------- BACK ---------- */}
          <div className="absolute inset-0 overflow-hidden rounded-md [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <img
              data-navbar-dark
              src={item.secondImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlipCards() {
  const [flippedImage, setFlippedImage] = useState<string | null>(null);
  const isDesktop = useIsDesktop();

  return (
    <section className="relative flex w-full max-w-7xl flex-col items-center justify-center px-4 py-12 sm:px-6 sm:py-16 md:py-20 lg:px-8">
      <div className="grid w-full grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">
        {cards.map((card) => {
          const cardNode = (
            <FlipCard
              item={card}
              flipped={flippedImage === card.image}
              onToggle={() =>
                setFlippedImage((prev) =>
                  prev === card.image ? null : card.image
                )
              }
            />
          );

          // Mobile & tablet: no floating wrapper, no continuous animation
          if (!isDesktop) {
            return <div key={card.image}>{cardNode}</div>;
          }

          // Desktop: floating animation as before
          return (
            <MoveOffset
              key={card.image}
              axis="y"
              offset={card.offset}
              delay={card.floatDelay}
              duration={card.duration}
              repeat
            >
              {cardNode}
            </MoveOffset>
          );
        })}
      </div>
    </section>
  );
}