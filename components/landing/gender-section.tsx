"use client";

import { useState } from "react";
import Link from "next/link";
import ScrollReveal from "@/components/scroll-reveal";

const GENDER_CATEGORIES = [
  {
    href: "/products?gender=male",
    label: "مردانه",
    image: "/images/genders/male.png",
  },
  {
    href: "/products?gender=female",
    label: "زنانه",
    image: "/images/genders/female.png",
  },
] as const;

type GenderCategory = (typeof GENDER_CATEGORIES)[number];
type CardState = "idle" | "active" | "dimmed";
type ActiveIndex = 0 | 1;

const GRID_COLUMNS = {
  idle: "md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]",
  0: "md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]",
  1: "md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]",
} as const;

function ArrowIcon() {
  // Points left: "forward" in an RTL layout.
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-5 w-5"
    >
      <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
    </svg>
  );
}

function GenderCard({
  category,
  state,
  onActivate,
  onDeactivate,
}: {
  category: GenderCategory;
  state: CardState;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  const { href, label, image } = category;

  return (
    <Link
      href={href}
      aria-label={`مشاهده محصولات ${label}`}
      data-state={state}
      onPointerEnter={(e) => e.pointerType === "mouse" && onActivate()}
      onPointerLeave={(e) => e.pointerType === "mouse" && onDeactivate()}
      onFocus={onActivate}
      onBlur={onDeactivate}
      className="group relative block h-[26rem] overflow-hidden rounded-2xl bg-foreground/[0.06] outline-none ring-offset-4 ring-offset-background focus-visible:ring-2 focus-visible:ring-foreground/60 sm:h-[30rem] md:h-[min(40rem,80vh)]"
    >
      <img
        data-navbar-dark
        src={image}
        alt=""
        aria-hidden="true"
        sizes="(min-width: 768px) 58vw, 100vw"
        className="h-full w-full object-cover object-center"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

      <div className="pointer-events-none absolute inset-0 bg-black/10 transition-colors duration-700 group-data-[state=dimmed]:bg-black/35" />

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-white md:p-8">
        <div>
          <span className="block text-4xl font-semibold leading-[1.35] md:text-5xl">
            {label}
          </span>
          <span className="mt-1 block text-sm text-white/80 md:text-base">
            مشاهده محصولات
          </span>
        </div>

        <span
          aria-hidden="true"
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md transition-colors duration-300 group-data-[state=active]:border-white group-data-[state=active]:bg-white group-data-[state=active]:text-black"
        >
          <ArrowIcon />
        </span>
      </div>
    </Link>
  );
}

export default function GenderSection() {
  const [active, setActive] = useState<ActiveIndex | null>(null);

  return (
    <section
      dir="rtl"
      aria-labelledby="gender-section-title"
      className="w-full py-16 sm:py-20 md:py-24"
    >
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-10">
        <div
          className={`grid grid-cols-1 gap-4 md:gap-5 motion-safe:transition-[grid-template-columns] motion-safe:duration-700 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] ${
            GRID_COLUMNS[active ?? "idle"]
          }`}
        >
          {GENDER_CATEGORIES.map((category, index) => (
            <ScrollReveal
              key={category.href}
              direction="bottom"
              distance={70}
              duration={1}
              delay={0.15 + index * 0.2}
            >
              <GenderCard
                category={category}
                state={
                  active === null
                    ? "idle"
                    : active === index
                      ? "active"
                      : "dimmed"
                }
                onActivate={() => setActive(index as ActiveIndex)}
                onDeactivate={() =>
                  setActive((current) => (current === index ? null : current))
                }
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}