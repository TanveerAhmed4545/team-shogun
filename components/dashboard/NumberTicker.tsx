"use client";

import { useEffect, useRef } from "react";
import { useSpring, useTransform, useMotionValueEvent } from "framer-motion";

interface NumberTickerProps {
  value: number;
  delay?: number;
  className?: string;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
}

export function NumberTicker({
  value,
  delay = 0,
  className,
  decimalPlaces = 0,
  prefix = "",
  suffix = "",
}: NumberTickerProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const spring = useSpring(0, {
    mass: 1,
    stiffness: 100,
    damping: 30,
  });

  const display = useTransform(spring, (current) => 
    `${prefix}${current.toLocaleString(undefined, {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces,
    })}${suffix}`
  );

  useMotionValueEvent(display, "change", (latest) => {
    if (spanRef.current) {
      spanRef.current.textContent = latest;
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      spring.set(value);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [spring, value, delay]);

  return (
    <span ref={spanRef} className={className}>
      {prefix}0{suffix}
    </span>
  );
}

