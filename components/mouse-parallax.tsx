"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
} from "react";

interface MouseParallaxProps {
  children: ReactNode;
  axis?: "x" | "y" | "both";
  strength?: number;
  speed?: number;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
}

export default function MouseParallax({
  children,
  axis = "both",
  strength = 20,
  speed = 0.08,
  className,
  style,
  disabled = false,
}: MouseParallaxProps) {
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled) return;

    const element = targetRef.current;
    if (!element) return;

    let animationFrame = 0;

    let currentX = 0;
    let currentY = 0;

    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = event.clientX / window.innerWidth - 0.5;
      const mouseY = event.clientY / window.innerHeight - 0.5;

      if (axis === "x" || axis === "both") {
        targetX = mouseX * strength;
      } else {
        targetX = 0;
      }

      if (axis === "y" || axis === "both") {
        targetY = mouseY * strength;
      } else {
        targetY = 0;
      }
    };

    const animate = () => {
      currentX += (targetX - currentX) * speed;
      currentY += (targetY - currentY) * speed;

      element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      animationFrame = requestAnimationFrame(animate);
    };

    const handleMouseLeave = () => {
      targetX = 0;
      targetY = 0;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    animationFrame = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrame);
    };
  }, [axis, strength, speed, disabled]);

  return (
    <div className={className} style={style}>
      <div
        ref={targetRef}
        className="w-full h-full"
        style={{
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}