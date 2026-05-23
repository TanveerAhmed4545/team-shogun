"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    const hasLoaded = sessionStorage.getItem("shogun_has_loaded");
    if (!hasLoaded) {
      setVisible(true);
      sessionStorage.setItem("shogun_has_loaded", "true");
    }
  }, []);

  useEffect(() => {
    if (!visible) return;

    if (shouldReduceMotion) {
      const timer = setTimeout(() => setVisible(false), 400);
      return () => clearTimeout(timer);
    }

    // Sequence timing logic completely decoupled from rendering engine:
    // 0.0s - 1.4s: Path Trace
    // 1.4s - 1.9s: Bloom & Fill
    // 1.5s - 2.3s: Brand Text Reveal
    // 2.7s: Trigger exit animation
    // 3.2s: Unmount component
    const exitTimer = setTimeout(() => setIsExiting(true), 2700);
    const unmountTimer = setTimeout(() => setVisible(false), 3200);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVisible(false);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
      window.removeEventListener("keydown", onKey);
    };
  }, [visible, shouldReduceMotion]);

  if (!mounted) return null;

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          animate={isExiting ? { opacity: 0, scale: 1.2, filter: "blur(12px)" } : { opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.2, filter: "blur(12px)" }}
          transition={{ duration: 0.5, ease: [0.32, 0, 0.67, 0] }}
          onClick={() => setVisible(false)}
          className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
          role="dialog"
          aria-label="Loading Team Shogun"
        >
          {/* Ambient Background Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08)_0%,transparent_60%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center justify-center">
            {/* SVG Logo Container */}
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ delay: 1.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center"
            >
              <motion.div
                initial={{ filter: "drop-shadow(0 0 15px rgba(16,185,129,0.5)) opacity-0", opacity: 0 }}
                animate={{ filter: "drop-shadow(0 0 30px rgba(16,185,129,0.8)) opacity-100", opacity: 1 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="relative w-full h-full rounded-3xl overflow-hidden"
              >
                <Image src="/shogun-logo.png" alt="Shogun Logo" fill className="object-cover" priority />
              </motion.div>
            </motion.div>

            {/* Brand Reveal Text */}
            <div className="h-12 mt-6 flex items-center justify-center overflow-hidden">
              <motion.div
                initial={{ opacity: 0, letterSpacing: "0em" }}
                animate={{ opacity: 1, letterSpacing: "0.25em" }}
                transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
                className="text-2xl md:text-3xl font-black text-white font-sans uppercase whitespace-nowrap pl-2"
              >
                TEAM SHOGUN<span className="text-emerald-500">.</span>
              </motion.div>
            </div>

            {/* Skip Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              transition={{ delay: 1.5, duration: 0.6 }}
              className="absolute bottom-10 text-[9px] md:text-[10px] font-mono text-white/30 uppercase tracking-widest"
            >
              Press ESC to skip
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
