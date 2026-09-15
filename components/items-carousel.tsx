"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollReveal from "./scroll-reveal";

export default function ItemsCarousel({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  // Drag state
  const [isDown, setIsDown] = useState(false);
  const drag = useRef({
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

  // Track text direction so the arrows point the right way and
  // scroll the right way, no matter where this is mounted.
  const [isRTL, setIsRTL] = useState(true); // site is RTL by default

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    setIsRTL(getComputedStyle(el).direction === "rtl");
  }, []);

  /* ---------- ARROW BUTTON SCROLL ---------- */
  const scrollBy = (direction: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;

    const amount = el.clientWidth * 0.8;
    const rtl = getComputedStyle(el).direction === "rtl";

    // In LTR, "next" moves scrollLeft positive (content shifts left).
    // In spec-compliant RTL (Chrome/Firefox/Safari), scrollLeft is
    // 0 (or negative) at the start and goes MORE negative as you
    // move forward through the content, so the sign has to flip.
    const sign = direction === "next" ? 1 : -1;
    const effectiveSign = rtl ? -sign : sign;

    el.scrollBy({
      left: effectiveSign * amount,
      behavior: "smooth",
    });
  };

  /* ---------- MOUSE DRAG ---------- */
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Only handle mouse. Touch is handled natively by overflow-x-auto.
    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;

    setIsDown(true);
    drag.current = {
      startX: e.clientX,
      startScrollLeft: el.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDown) return;
    const el = scrollerRef.current;
    if (!el) return;

    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 5) drag.current.moved = true;

    el.scrollLeft = drag.current.startScrollLeft - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    setIsDown(false);
  };

  // If the user actually dragged (not a click), swallow the click so links/buttons inside don't fire
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.moved = false;
    }
  };

  return (
    <div className="relative flex w-full flex-col gap-5 sm:gap-6 md:gap-8 py-2">
      {/* ---------- SCROLLER ---------- */}
      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className={`
          flex w-full items-stretch gap-3 sm:gap-4
          overflow-x-auto overscroll-x-contain
           pb-2
          scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
          select-none
          ${isDown ? "cursor-grabbing" : "cursor-grab"}
          ${isDown ? "" : "snap-x snap-mandatory scroll-smooth"}
        `}
      >
        {children}
      </div>

      {/* ---------- CONTROLS ---------- */}
      <div className="flex w-full items-center justify-center gap-3 px-4 sm:px-6 md:justify-start md:px-8">
        <ScrollReveal direction="right" distance={40} duration={0.8} delay={0.25}>
          <button
            type="button"
            aria-label="قبلی"
            onClick={() => scrollBy("prev")}
            className="flex h-10 w-14 sm:h-11 sm:w-20 md:h-12 md:w-24 items-center justify-center rounded-full bg-accent/30 cursor-pointer transition-colors hover:bg-accent/50 active:scale-95"
          >
            {isRTL ? (
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </ScrollReveal>

        <ScrollReveal direction="left" distance={40} duration={0.8} delay={0.15}>
          <button
            type="button"
            aria-label="بعدی"
            onClick={() => scrollBy("next")}
            className="flex h-10 w-14 sm:h-11 sm:w-20 md:h-12 md:w-24 items-center justify-center rounded-full bg-accent/30 cursor-pointer transition-colors hover:bg-accent/50 active:scale-95"
          >
            {isRTL ? (
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        </ScrollReveal>
      </div>
    </div>
  );
}