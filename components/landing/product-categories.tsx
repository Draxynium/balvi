"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

type Category = {
  title: string;
  href: string;
  image: string;
};

const CATEGORIES = [
  {
    title: "روزمره",
    href: "/products?gender=male&category=روزمره",
    image: "/images/categories/sandal.png",
  },
  {
    title: "اداری",
    href: "/products?gender=male&category=اداری",
    image: "/images/categories/edari.png",
  },
  {
    title: "اسپرت",
    href: "/products?gender=male&category=اسپرت",
    image: "/images/categories/sport.png",
  },
  {
    title: "کلاسیک",
    href: "/products?gender=male&category=کلاسیک",
    image: "/images/categories/classic.png",
  },
  {
    title: "راحتی",
    href: "/products?gender=male&category=راحتی",
    image: "/images/categories/rahati.png",
  },
  {
    title: "بوت و نیم بوت",
    href: "/products?gender=male&category=بوت و نیم بوت",
    image: "/images/categories/boot.png",
  },
] satisfies readonly Category[];

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

/** Pixels the pointer must travel before a click turns into a drag. */
const DRAG_THRESHOLD = 6;

/** How much of the visible track a single arrow click advances. */
const SCROLL_STEP_RATIO = 0.85;

const getIsRTL = (el: HTMLElement) =>
  getComputedStyle(el).direction === "rtl";

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CONTROL_CLASSES =
  "hidden h-12 w-12 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-all duration-300 hover:bg-foreground hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-25 sm:flex";

/* -------------------------------------------------------------------------- */
/*                                   Icons                                    */
/* -------------------------------------------------------------------------- */

/**
 * Points left by default ("forward" in an RTL layout).
 * Matches the GenderSection arrow: inline SVG, no fill, round joins.
 */
function ArrowIcon({ direction = "left" }: { direction?: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={`h-5 w-5 ${direction === "right" ? "rotate-180" : ""}`}
    >
      <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 Component                                  */
/* -------------------------------------------------------------------------- */

export default function ProductCategories() {
  const trackRef = useRef<HTMLDivElement>(null);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const dragState = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
    rtl: true,
  });

  /* ------------------------------ scroll state ----------------------------- */

  // Normalised so it works in both LTR and RTL scroll models.
  const syncScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const position = Math.abs(el.scrollLeft);

    setCanScrollPrev(position > 1);
    setCanScrollNext(position < maxScroll - 1);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    syncScrollState();

    el.addEventListener("scroll", syncScrollState, { passive: true });

    const resizeObserver = new ResizeObserver(syncScrollState);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", syncScrollState);
      resizeObserver.disconnect();
    };
  }, [syncScrollState]);

  /* -------------------------------- controls ------------------------------- */

  /** direction: 1 = next item, -1 = previous item. */
  const scrollToDirection = useCallback((direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;

    const step = Math.max(el.clientWidth * SCROLL_STEP_RATIO, 260);
    const rtl = getIsRTL(el);

    el.scrollBy({
      left: direction * step * (rtl ? -1 : 1),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
  }, []);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el) return;

    const rtl = getIsRTL(el);

    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault();
        scrollToDirection(rtl ? 1 : -1);
        break;
      case "ArrowRight":
        event.preventDefault();
        scrollToDirection(rtl ? -1 : 1);
        break;
      case "Home":
        event.preventDefault();
        el.scrollTo({ left: 0, behavior: "smooth" });
        break;
      case "End":
        event.preventDefault();
        el.scrollTo({
          left: rtl ? -el.scrollWidth : el.scrollWidth,
          behavior: "smooth",
        });
        break;
      default:
        break;
    }
  };

  /* --------------------------- pointer drag (mouse) ------------------------- */

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    // Touch devices already have great native momentum scrolling — don't fight it.
    if (event.pointerType !== "mouse" || event.button !== 0) return;

    const el = trackRef.current;
    if (!el) return;

    dragState.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: el.scrollLeft,
      rtl: getIsRTL(el),
    };
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    const state = dragState.current;

    if (!el || !state.active || event.pointerId !== state.pointerId) return;

    const deltaX = event.clientX - state.startX;

    if (!state.moved) {
      if (Math.abs(deltaX) < DRAG_THRESHOLD) return;
      state.moved = true;
      el.setPointerCapture(event.pointerId);
    }

    el.scrollLeft = state.startScrollLeft + (state.rtl ? deltaX : -deltaX);
  };

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    const state = dragState.current;

    if (!state.active || event.pointerId !== state.pointerId) return;

    state.active = false;

    if (el?.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }
  };

  // Swallow the click that follows a drag so we don't navigate accidentally.
  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!dragState.current.moved) return;

    event.preventDefault();
    event.stopPropagation();
    dragState.current.moved = false;
  };

  /* --------------------------------- render -------------------------------- */

  return (
    <section
      dir="rtl"
      aria-labelledby="product-categories-heading"
      className="w-full px-6 pt-24 pb-16 md:px-10 md:pb-24"
    >
      <div className="mx-auto w-full max-w-[1700px]">
        {/* Header ---------------------------------------------------------- */}
        <header className="mb-8 flex items-end justify-between gap-6 md:mb-10">
          <h2
            id="product-categories-heading"
            className="text-2xl font-bold md:text-3xl"
          >
            دسته‌بندی‌ها
          </h2>

          <Link
            href="/products?gender=male"
            className="group inline-flex items-center gap-2 rounded-full text-sm font-medium text-foreground/60 transition-colors duration-300 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
          >
            مشاهده همه
            <span className="transition-transform duration-300 group-hover:-translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
              <ArrowIcon />
            </span>
          </Link>
        </header>

        {/* Carousel -------------------------------------------------------- */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            type="button"
            onClick={() => scrollToDirection(-1)}
            disabled={!canScrollPrev}
            aria-label="دسته‌بندی قبلی"
            className={CONTROL_CLASSES}
          >
            <ArrowIcon direction="right" />
          </button>

          <div className="relative min-w-0 flex-1">
            <div
              ref={trackRef}
              role="region"
              aria-label="دسته‌بندی محصولات"
              tabIndex={0}
              onKeyDown={handleKeyDown}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              onClickCapture={handleClickCapture}
              onDragStart={(event) => event.preventDefault()}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-2 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:cursor-grab sm:active:cursor-grabbing"
            >
              {CATEGORIES.map((category) => (
                <Link
                  key={category.title}
                  href={category.href}
                  className="group relative w-[88%] flex-none snap-start overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white sm:w-[58%] lg:w-[40%] xl:w-[30%]"
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-foreground/[0.06]">
                    <img
                      src={category.image}
                      alt={category.title}
                      draggable={false}
                      sizes="(max-width: 640px) 88vw, (max-width: 1024px) 58vw, (max-width: 1280px) 40vw, 30vw"
                      className="object-cover object-bottom transition-transform duration-700 ease-out group-hover:scale-[1.08] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />

                    {/* Scrim keeps the label legible on any photo */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-5">
                      <span className="text-lg font-bold text-white md:text-xl">
                        {category.title}
                      </span>

                      <span
                        aria-hidden="true"
                        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/40 bg-white/10 text-white opacity-0 backdrop-blur-md transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
                      >
                        <ArrowIcon />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Edge fades — hint that there is more content to scroll */}
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent transition-opacity duration-300 md:w-12 ${
                canScrollPrev ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent transition-opacity duration-300 md:w-12 ${
                canScrollNext ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>

          <button
            type="button"
            onClick={() => scrollToDirection(1)}
            disabled={!canScrollNext}
            aria-label="دسته‌بندی بعدی"
            className={CONTROL_CLASSES}
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
    </section>
  );
}