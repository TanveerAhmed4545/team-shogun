"use client";

import { motion, useReducedMotion } from "framer-motion";

type FloatingElementProps = {
  children: React.ReactNode;
  amplitude?: number;   // px to float up/down
  duration?: number;    // seconds per full cycle
  delay?: number;       // start delay in seconds
  className?: string;
};

export default function FloatingElement({
  children,
  amplitude = 10,
  duration = 6,
  delay = 0,
  className = "",
}: FloatingElementProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={`gpu-layer ${className}`}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
