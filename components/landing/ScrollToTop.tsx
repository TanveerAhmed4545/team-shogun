"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import MagneticButton from "@/components/landing/MagneticButton";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Check scroll position
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 600) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-8 right-8 z-[100]"
        >
          <MagneticButton strength={0.3}>
            <button
              onClick={scrollToTop}
              className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-black/50 backdrop-blur-md border border-white/10 overflow-hidden transition-all duration-300 hover:border-emerald-500/50 hover:bg-black/80 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              aria-label="Scroll to top"
            >
              {/* Inner glowing core on hover */}
              <div className="absolute inset-0 bg-emerald-500/0 group-hover:bg-emerald-500/10 transition-colors duration-300" />
              
              <ArrowUp className="w-5 h-5 text-white/70 group-hover:text-emerald-400 group-hover:-translate-y-1 transition-all duration-300 relative z-10" />
            </button>
          </MagneticButton>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
