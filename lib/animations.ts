import { Variants } from "framer-motion";

// ─── Spring Transitions ───────────────────────────────────────────────────────

export const cinematic = {
  type: "spring",
  stiffness: 70,
  damping: 18,
} as const;

export const snappy = {
  type: "spring",
  stiffness: 400,
  damping: 28,
} as const;

export const hoverSpring = {
  type: "spring",
  stiffness: 300,
  damping: 20,
} as const;

export const luxuryEase = [0.22, 1, 0.36, 1] as const;

// ─── Fade Up ─────────────────────────────────────────────────────────────────

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: luxuryEase },
  },
};

// ─── Fade In ─────────────────────────────────────────────────────────────────

export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

// ─── Scale In ────────────────────────────────────────────────────────────────

export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: luxuryEase },
  },
};

// ─── Slide from Left ─────────────────────────────────────────────────────────

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: luxuryEase },
  },
};

// ─── Slide from Right ────────────────────────────────────────────────────────

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: luxuryEase },
  },
};

// ─── Stagger Container ───────────────────────────────────────────────────────

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

// ─── Word Reveal (masked clip-path reveal) ───────────────────────────────────

export const wordRevealContainer: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
};

export const wordRevealItem: Variants = {
  hidden: { y: "110%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.55, ease: luxuryEase },
  },
};

// ─── Hover States ────────────────────────────────────────────────────────────

export const liftHover = {
  y: -8,
  scale: 1.01,
  transition: hoverSpring,
};

export const glowHoverEmerald = {
  boxShadow: "0 32px 64px -16px rgba(16,185,129,0.2)",
  borderColor: "rgba(16,185,129,0.3)",
};

export const glowHoverCyan = {
  boxShadow: "0 32px 64px -16px rgba(6,182,212,0.2)",
  borderColor: "rgba(6,182,212,0.3)",
};

export const glowHoverPurple = {
  boxShadow: "0 32px 64px -16px rgba(139,92,246,0.2)",
  borderColor: "rgba(139,92,246,0.3)",
};
