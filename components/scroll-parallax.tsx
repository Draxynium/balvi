"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

interface ScrollParallaxProps {
  children: ReactNode;
  axis?: "x" | "y" | "both";
  strength?: number;
  speed?: number;
  range?: number;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
}

export default function ScrollParallax({
  children,
  axis = "y",
  strength = 30,
  speed = 0.08,
  range = 1,
  className,
  style,
  disabled = false,
}: ScrollParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const element = ref.current;
    if (!element) return;

    let animationFrame = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const update = () => {
      const rect = element.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;

      const offset =
        ((elementCenter - viewportCenter) / window.innerHeight) * range;

      targetX = axis === "x" || axis === "both" ? offset * strength : 0;
      targetY = axis === "y" || axis === "both" ? offset * strength : 0;
    };

    const animate = () => {
      currentX += (targetX - currentX) * speed;
      currentY += (targetY - currentY) * speed;

      element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      animationFrame = requestAnimationFrame(animate);
    };

    const handleScroll = () => {
      update();
    };

    update();
    animate();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrame);
    };
  }, [axis, strength, speed, range, disabled]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        willChange: "transform",
        ...style,
      }}
    >
      {children}
    </div>
  );
}