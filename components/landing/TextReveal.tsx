"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { wordRevealContainer, wordRevealItem, luxuryEase } from "@/lib/animations";

type TextRevealProps = {
  text: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  stagger?: number;
  once?: boolean;
  immediate?: boolean; // skip inView and trigger instantly
};

export default function TextReveal({
  text,
  as: Tag = "h2",
  className = "",
  delay = 0,
  stagger = 0.04,
  once = true,
  immediate = false,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref as React.RefObject<Element>, {
    once,
    margin: "-80px",
  });
  const shouldReduceMotion = useReducedMotion();

  const words = text.split(" ");

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : stagger,
        delayChildren: delay,
      },
    },
  };

  const itemVariants = {
    hidden: shouldReduceMotion ? { opacity: 0 } : { y: "110%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration: shouldReduceMotion ? 0.3 : 0.55,
        ease: luxuryEase,
      },
    },
  };

  const shouldAnimate = immediate || isInView;

  return (
    // @ts-expect-error dynamic tag
    <Tag ref={ref} className={className}>
      <motion.span
        variants={containerVariants}
        initial="hidden"
        animate={shouldAnimate ? "visible" : "hidden"}
        className="inline"
        aria-label={text}
      >
        {words.map((word, i) => (
          <span key={i} className="clip-overflow" aria-hidden="true">
            <motion.span
              variants={itemVariants}
              className="inline-block"
              style={{ marginRight: "0.28em" }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
