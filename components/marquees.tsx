"use client";

import Star from "@/public/star.svg";
import React from "react";
import { Marquee } from "./ui/marquee";
import { motion } from "framer-motion";
import ScrollReveal from "./scroll-reveal";

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

  return (
    <section dir="ltr" className="relative w-full h-68 overflow-hidden">
      <div className="absolute inset-0 h-16 text-primary rotate-5 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[calc(100%+2rem)]" >
        <motion.div  
          className="h-full relative bg-secondary"
          initial={{ x: "90%", opacity: "0%", filter: "blur(20px)" }}
          whileInView={{ x: 0, opacity: "100%", filter: "blur(0)" }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{
            duration: 2,
            delay: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Marquee className="h-full flex items-center" >
            {texts.map((text, index) => (
                <p key={index} className="shrink-0 whitespace-nowrap text-4xl font-medium px-8 border-l">
                  {text}
                </p>
            ))}
          </Marquee>
        </motion.div>
      </div>
      <div className="absolute inset-0 h-16  text-secondary -rotate-5 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-[calc(100%+2rem)]">
        <motion.div  
          className="h-full relative bg-primary"
          initial={{ x: "-90%", opacity: "0%", filter: "blur(10px)" }}
          whileInView={{ x: 0, opacity: "100%", filter: "blur(0)" }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{
            duration: 2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <Marquee className="h-full flex items-center" reverse>
            {textsb.map((text, index) => (
                <p key={index} className="shrink-0 whitespace-nowrap text-4xl font-medium px-8 border-l ">
                  {text}
                </p>
            ))}
          </Marquee>
        </motion.div>
      </div>
    </section>
  );
}