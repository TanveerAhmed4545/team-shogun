"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export type ProgressBarProps = {
  label: string;
  percentage: number;
  color: string;
};

export default function ProgressBar({ label, percentage, color }: ProgressBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWidth(percentage);
          observer.disconnect();

          // Animated count-up
          const duration = 1200;
          const steps = 60;
          const increment = percentage / steps;
          let current = 0;
          const interval = setInterval(() => {
            current += increment;
            if (current >= percentage) {
              setDisplayCount(percentage);
              clearInterval(interval);
            } else {
              setDisplayCount(Math.round(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [percentage]);

  return (
    <div ref={ref} className="space-y-2">
      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
        <span className="text-white/60">{label}</span>
        <span className="text-white/80 font-mono font-black tabular-nums">
          {displayCount}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/[0.04] overflow-hidden border border-white/[0.05] relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${color} relative`}
        >
          {/* Shimmer sweep */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 animate-[shimmer_2s_ease-in-out_1.2s_forwards]" />
        </motion.div>
      </div>
    </div>
  );
}
