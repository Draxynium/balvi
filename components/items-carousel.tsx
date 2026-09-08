"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ScrollReveal from "./scroll-reveal";

export default function ItemsCarousel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full overflow-hidden px-4 py-2 flex flex-col gap-8 relative">
      {/* <div className="pointer-events-none bg-linear-to-r from-background to-background/0 absolute left-0 w-[20%] h-full z-150"/> */}
        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 550 }}
          dragElastic={0.4}
          className="w-full"
        >
          <ScrollReveal
            direction="bottom"
            distance={70}
            duration={1}
            delay={0}
            className="flex w-max flex-nowrap items-center gap-4 cursor-grab active:cursor-grabbing select-none"
          >
            {children}
          </ScrollReveal>
        </motion.div>
        <div className="w-full flex items-center gap-4">
          <ScrollReveal
            direction="left"
            distance={70}
            duration={1}
            delay={0.35}
            className="flex w-max flex-nowrap items-center gap-4 cursor-grab active:cursor-grabbing select-none"
          >
          <button className="w-24 h-12 rounded-full bg-accent/30 cursor-pointer flex items-center justify-center"><ArrowRight/></button>
          </ScrollReveal>
          <ScrollReveal
            direction="right"
            distance={70}
            duration={1}
            delay={0.6}>
            <button className="w-24 h-12 rounded-full bg-accent/30 cursor-pointer flex items-center justify-center"><ArrowLeft/></button>
          </ScrollReveal>
        </div>
      
    </div>
  );
}