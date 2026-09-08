"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  direction?: "top" | "right" | "bottom" | "left";
  distance?: number;
  duration?: number;
  delay?: number;
  blur?: number;
  className?: string;
}

export default function ScrollReveal({
  children,
  direction = "bottom",
  distance = 40,
  duration = 0.7,
  delay = 0,
  className,
}: ScrollRevealProps) {
  const offsets = {
    top: { x: 0, y: -distance },
    right: { x: distance, y: 0 },
    bottom: { x: 0, y: distance },
    left: { x: -distance, y: 0 },
  };

  const variants: Variants = {
    hidden: {
      opacity: 0,
      filter: `blur(${blur}px)`,
      ...offsets[direction],
    },
    visible: {
      opacity: 1,
      filter: "blur(0px)",
      x: 0,
      y: 0,
    },
  };

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}