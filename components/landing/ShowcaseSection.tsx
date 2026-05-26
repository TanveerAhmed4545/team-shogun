"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import RevealOnScroll from "@/components/landing/RevealOnScroll";
import { animationChips } from "@/lib/landing-data";
import { Zap, MousePointer2, Layers } from "lucide-react";

function Badge({ title }: { title: string }) {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
      {title}
    </div>
  );
}

// ─── Live Demo Panel ─────────────────────────────────────────────
function LiveDemoPanel() {
  const shouldReduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    if (shouldReduceMotion) return;
    setClicked(true);
    setTimeout(() => setClicked(false), 800);
  };

  return (
    <div className="relative w-full aspect-[4/3] rounded-[2.5rem] border border-white/10 bg-[#0a0a0a] overflow-hidden flex flex-col items-center justify-center gap-6 p-8 select-none">

      {/* Animated gradient border glow */}
      <motion.div
        animate={{ opacity: hovered ? 1 : 0.4, scale: hovered ? 1.05 : 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="absolute inset-0 rounded-[2.5rem] pointer-events-none"
        style={{
          background: "linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.08) 50%, rgba(139,92,246,0.1) 100%)",
        }}
      />

      {/* Corner accent lines */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-emerald-500/40 rounded-tl-xl pointer-events-none" />
      <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-emerald-500/40 rounded-tr-xl pointer-events-none" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-cyan-500/30 rounded-bl-xl pointer-events-none" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-cyan-500/30 rounded-br-xl pointer-events-none" />

      {/* Floating orbs */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            animate={{ y: [0, -14, 0], x: [0, 6, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-8 left-10 w-16 h-16 rounded-full bg-emerald-500/10 blur-xl pointer-events-none"
          />
          <motion.div
            animate={{ y: [0, 12, 0], x: [0, -8, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 right-8 w-20 h-20 rounded-full bg-cyan-500/10 blur-xl pointer-events-none"
          />
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-1/2 right-6 w-10 h-10 rounded-full bg-purple-500/10 blur-lg pointer-events-none"
          />
        </>
      )}

      {/* Label */}
      <p className="text-[9px] font-mono text-white/25 uppercase tracking-[0.3em] absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
        Live Interactive Demo
      </p>

      {/* Center: Magnetic button demo */}
      <div className="flex flex-col items-center gap-4 relative z-10">
        <motion.button
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          onClick={handleClick}
          whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
          whileTap={shouldReduceMotion ? {} : { scale: 0.94 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="relative px-8 py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest overflow-hidden cursor-pointer"
          style={{ WebkitTapHighlightColor: "transparent" }}
        >
          {/* Shimmer on hover */}
          <motion.span
            animate={hovered ? { x: ["−100%", "200%"] } : { x: "-100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/20 to-transparent -skew-x-12 pointer-events-none"
          />
          <span className="relative flex items-center gap-2">
            <MousePointer2 className="w-3.5 h-3.5" />
            Hover Me
          </span>
        </motion.button>

        {/* Ripple feedback on click */}
        <AnimatePresence>
          {clicked && (
            <motion.div
              key="ripple"
              initial={{ scale: 0.4, opacity: 0.8 }}
              animate={{ scale: 2.5, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute w-20 h-20 rounded-full bg-emerald-500/20 pointer-events-none"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Bottom row: floating UI chips */}
      <div className="flex gap-2 relative z-10">
        {[
          { icon: Zap, label: "Spring Physics", color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { icon: Layers, label: "GSAP Scroll", color: "text-cyan-400", bg: "bg-cyan-500/10" },
        ].map(({ icon: Icon, label, color, bg }) => (
          <motion.div
            key={label}
            animate={shouldReduceMotion ? {} : { y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: label.length * 0.05 }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${bg} border border-white/[0.05]`}
          >
            <Icon className={`w-3 h-3 ${color}`} />
            <span className={`text-[9px] font-bold uppercase tracking-widest ${color}`}>{label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default function ShowcaseSection() {
  return (
    <section data-gsap="showcase-section" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div data-gsap="section-heading" className="text-left mb-16 sm:mb-20 max-w-3xl">
          <Badge title="Perpetual Motion & Interaction" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.04em] text-white leading-none mt-4">
            Designed to Feel <span className="text-emerald-400">Smooth, Premium & Interactive</span>
          </h2>
          <p className="text-white/40 text-sm sm:text-base font-medium mt-4">
            We code visual narrative flow ties, bypassing standard linear CSS to achieve premium tactile click responses.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Live Demo replaces static image */}
          <div data-gsap="showcase-image" className="lg:col-span-6">
            <LiveDemoPanel />
          </div>

          <div className="lg:col-span-6 flex flex-col space-y-6">
            <RevealOnScroll animation="fadeIn" delay={0.2}>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 border-b border-white/[0.05] pb-3 mb-2">
                Core Animation Capabilities
              </p>
            </RevealOnScroll>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {animationChips.map((chip, i) => (
                <div data-gsap="showcase-chip" key={i}>
                  <div className="group flex items-center gap-3 p-4 rounded-xl border border-white/[0.05] bg-card/40 hover:bg-card/80 hover:border-emerald-500/20 transition-all duration-200 cursor-default select-none">
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50 group-hover:bg-emerald-400 group-hover:scale-110 transition-all duration-200" />
                    <span className="text-xs font-bold text-white/70 group-hover:text-emerald-400 transition-colors duration-200">
                      {chip}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
