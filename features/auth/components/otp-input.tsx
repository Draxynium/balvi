"use client";

import { useEffect, useRef } from "react";
import { toEnglishDigits } from "@/features/auth/lib/validation";

type OtpInputProps = {
  value: string[];
  onChange: (value: string[]) => void;
  disabled?: boolean;
};

export function OtpInput({ value, onChange, disabled }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const length = value.length;

  useEffect(() => {
    const timeout = window.setTimeout(() => refs.current[0]?.focus(), 100);
    return () => window.clearTimeout(timeout);
  }, []);

  const handleChange = (index: number, raw: string) => {
    const digits = toEnglishDigits(raw).replace(/\D/g, "");
    if (!digits) return;

    const next = [...value];
    for (
      let offset = 0;
      offset < digits.length && index + offset < length;
      offset += 1
    ) {
      next[index + offset] = digits[offset];
    }
    onChange(next);
    refs.current[Math.min(index + digits.length, length - 1)]?.focus();
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = [...value];
      const targetIndex = next[index] ? index : Math.max(index - 1, 0);
      next[targetIndex] = "";
      onChange(next);
      refs.current[targetIndex]?.focus();
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      refs.current[Math.min(index + 1, length - 1)]?.focus();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      refs.current[Math.max(index - 1, 0)]?.focus();
    }
  };

  return (
    <div className="flex items-center justify-center gap-2" dir="ltr">
      {value.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          value={digit}
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onFocus={(event) => event.target.select()}
          aria-label={`رقم ${index + 1} کد تأیید`}
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={length}
          disabled={disabled}
          className="border-border/40 bg-background/60 focus:border-primary/40 focus:ring-primary/5 h-14 w-12 rounded-xl border text-center text-xl font-semibold transition-all outline-none focus:ring-4 disabled:opacity-50"
        />
      ))}
    </div>
  );
}
