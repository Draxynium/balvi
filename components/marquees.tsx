"use client";

import React, { useRef } from "react";
import { Marquee } from "./ui/marquee";
import { motion, useInView } from "framer-motion";

export default function Marquees() {
  const texts = [
    "از دل چرم",
    "با دست هنر",
    "برای هر قدم",
    "با عشق دوخته",
    "با اصالت ساخته",
    "برای سال‌ها",
    "تا همیشه ماندگار",
  ];

  const textsb = [
    "قصه‌ای از چرم",
    "ردی از هنر",
    "لمسی از اصالت",
    "ظرافت در جزئیات",
    "آرام در هر قدم",
    "زیبا در گذر زمان",
    "امضایی برای ماندن",
  ];

  const textClass =
    "shrink-0 whitespace-nowrap font-medium px-4 sm:px-6 md:px-8 text-base sm:text-xl md:text-2xl lg:text-4xl border-l";

  const tiltA = "rotate-[8deg] sm:rotate-[6deg] md:rotate-[5deg]";
  const tiltB = "-rotate-[8deg] sm:-rotate-[6deg] md:-rotate-[5deg]";

  const barBase =
    "absolute top-1/2 left-1/2 h-12 sm:h-14 md:h-16 -translate-y-1/2 -translate-x-1/2 w-[calc(100%+3rem)]";

  /* ---------- STABLE OBSERVER (not on the transformed element) ---------- */
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      dir="ltr"
      className="relative w-full h-44 sm:h-52 md:h-60 lg:h-68 overflow-hidden"
    >
      {/* ---------- BAR 1 ---------- */}
      <div className={`${barBase} ${tiltA} text-primary`}>
        <motion.div
          className="relative h-full bg-secondary shadow-md"
          initial={{ x: "90%", opacity: 0, filter: "blur(20px)" }}
          animate={
            inView
              ? { x: 0, opacity: 1, filter: "blur(0px)" }
              : undefined
          }
          transition={{
            duration: 2,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Marquee className="h-full flex items-center">
            {texts.map((text, index) => (
              <p key={index} className={textClass}>
                {text}
              </p>
            ))}
          </Marquee>
        </motion.div>
      </div>

      {/* ---------- BAR 2 ---------- */}
      <div className={`${barBase} ${tiltB} text-secondary`}>
        <motion.div
          className="relative h-full bg-primary shadow-md"
          initial={{ x: "-90%", opacity: 0, filter: "blur(10px)" }}
          animate={
            inView
              ? { x: 0, opacity: 1, filter: "blur(0px)" }
              : undefined
          }
          transition={{
            duration: 2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Marquee className="h-full flex items-center" reverse>
            {textsb.map((text, index) => (
              <p key={index} className={textClass}>
                {text}
              </p>
            ))}
          </Marquee>
        </motion.div>
      </div>
    </section>
  );
}