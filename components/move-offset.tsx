"use client";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

type MoveOffsetProps = {
  children: ReactNode;
  axis?: "x" | "y";
  offset?: number;
  delay?: number;
  duration?: number;
  repeat?: boolean;
  easing?: string;
  className?: string;
  style?: CSSProperties;
};

export default function MoveOffset({
  children,
  axis = "x",
  offset = 20,
  delay = 0,
  duration = 0.3,
  repeat = false,
  easing = "ease-in-out",
  className,
  style,
}: MoveOffsetProps) {
  const [moved, setMoved] = useState(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);
  const intervals = useRef<ReturnType<typeof setInterval>[]>([]);
  useEffect(() => {
    const run = () => {
      setMoved(true);
      timeouts.current.push(setTimeout(() => setMoved(false), duration * 1000));
    };
    timeouts.current.push(
      setTimeout(() => {
        run();
        if (repeat) intervals.current.push(setInterval(run, duration * 2000 + 100));
      }, delay * 1000)
    );
    return () => {
      timeouts.current.forEach(clearTimeout);
      intervals.current.forEach(clearInterval);
      timeouts.current = [];
      intervals.current = [];
    };
  }, [delay, duration, repeat]);
  const translate = `translate${axis.toUpperCase()}(${moved ? offset : 0}px)`;
  return (
    <div
      className={className}
      style={{
        display: "inline-block",
        willChange: "transform",
        transform: translate,
        transition: `transform ${duration}s ${easing}`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}