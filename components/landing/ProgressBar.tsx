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

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWidth(percentage);
          observer.disconnect();
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
        <span className="text-white/80 font-mono font-black">{percentage}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-white/[0.04] overflow-hidden border border-white/[0.05]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}
