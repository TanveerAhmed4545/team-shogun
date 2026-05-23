"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { luxuryEase } from "@/lib/animations";

type AnimationType = "fadeUp" | "fadeIn" | "scaleIn" | "slideLeft" | "slideRight";

type RevealOnScrollProps = {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  className?: string;
  margin?: string;
};

// Pre-typed initial state per animation
const initialStates: Record<AnimationType, { opacity: number; y?: number; x?: number; scale?: number }> = {
  fadeUp:     { opacity: 0, y: 30 },
  fadeIn:     { opacity: 0 },
  scaleIn:    { opacity: 0, scale: 0.92 },
  slideLeft:  { opacity: 0, x: -60 },
  slideRight: { opacity: 0, x: 60 },
};

export default function RevealOnScroll({
  children,
  animation = "fadeUp",
  delay = 0,
  className = "",
  margin = "-80px",
}: RevealOnScrollProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: margin as `${number}px` });
  const shouldReduceMotion = useReducedMotion();

  const initial = shouldReduceMotion ? { opacity: 0 } : initialStates[animation];
  const animate = isInView
    ? {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        transition: {
          duration: shouldReduceMotion ? 0.3 : 0.65,
          ease: luxuryEase,
          delay,
        },
      }
    : initial;

  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={animate}
      className={className}
    >
      {children}
    </motion.div>
  );
}
