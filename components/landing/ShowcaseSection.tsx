"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import RevealOnScroll from "@/components/landing/RevealOnScroll";
import { animationChips } from "@/lib/landing-data";

function Badge({ title }: { title: string }) {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
      {title}
    </div>
  );
}

export default function ShowcaseSection() {
  const { scrollY } = useScroll();
  const imageParallaxY = useTransform(scrollY, [200, 1200], [0, 80]);

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
          <div data-gsap="showcase-image" className="lg:col-span-6">
            <motion.div
              style={{ y: imageParallaxY }}
              className="relative w-full aspect-[4/3] rounded-[2.5rem] border border-white/10 bg-card/60 shadow-2xl overflow-hidden p-1.5"
            >
              <div className="absolute inset-1.5 rounded-[2.3rem] overflow-hidden">
                <Image
                  src="/animation_showcase.png"
                  alt="Interaction & UI Micro-motion Visualization Showcase"
                  fill
                  sizes="(max-w-1024px) 100vw, 600px"
                  loading="lazy"
                  className="object-cover object-center select-none opacity-80"
                />
              </div>
            </motion.div>
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
