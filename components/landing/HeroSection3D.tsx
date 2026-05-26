"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import MagneticButton from "@/components/landing/MagneticButton";
import { cinematic, hoverSpring } from "@/lib/animations";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function HeroSection3D() {
  const { data: session } = useSession();
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  const navBlur = useTransform(scrollY, [0, 80], [0, 20]);
  const navBorderOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const navBgOpacity = useTransform(scrollY, [0, 80], [0, 0.9]);

  const navBackdrop = useMotionTemplate`blur(${navBlur}px)`;

  const [showHeader, setShowHeader] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const timer = setTimeout(() => setHasLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasLoaded) return;
    return scrollY.on("change", (latest) => {
      if (latest < 50) {
        setShowHeader(true);
      } else {
        const diff = latest - lastScrollY.current;
        if (diff > 15) {
          setShowHeader(false);
        } else if (diff < -15) {
          setShowHeader(true);
        }
      }
      lastScrollY.current = latest;
    });
  }, [scrollY, hasLoaded]);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={
          !hasLoaded
            ? { y: 0, opacity: 1 }
            : showHeader
            ? { y: 0, opacity: 1 }
            : { y: -100, opacity: 0 }
        }
        transition={
          !hasLoaded
            ? { ...cinematic, delay: 0.05 }
            : { duration: 0.3, ease: "easeInOut" }
        }
        style={{
          backdropFilter: navBackdrop,
        }}
        className="fixed top-0 z-50 w-full"
      >
        <motion.div
          style={{ opacity: navBgOpacity }}
          className="absolute inset-0 bg-background pointer-events-none -z-10"
        />
        <motion.div
          style={{ opacity: navBorderOpacity }}
          className="absolute bottom-0 left-0 right-0 h-[1px] bg-border pointer-events-none -z-10"
        />
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between relative z-10">
          <Link href="/" className="flex items-center space-x-2 md:space-x-3 group">
            <motion.div
              whileHover={{ scale: shouldReduceMotion ? 1 : 1.05 }}
              whileTap={{ scale: shouldReduceMotion ? 1 : 0.96 }}
              transition={hoverSpring}
              className="relative w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl overflow-hidden shadow-lg shadow-emerald-500/25 shrink-0"
            >
              <Image src="/shogun-logo.png" alt="Shogun Logo" fill className="object-cover" />
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </motion.div>
            <span className="text-base md:text-lg font-black tracking-wider text-foreground font-sans">
              SHOGUN<span className="text-emerald-500">.</span>
            </span>
            <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              AGENCY
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 lg:space-x-10 text-[10px] font-black uppercase tracking-[0.18em] text-foreground/50">
            {["Services", "Process", "Work", "Platforms", "Contact"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                className="nav-link-underline hover:text-emerald-400 transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3 md:space-x-4 shrink-0">
            {session ? (
              <>
                <ThemeToggle />
                <MagneticButton strength={0.25}>
                  <Link
                    href="/dashboard"
                    className="btn-shimmer bg-emerald-500 hover:bg-emerald-400 text-black px-4 py-2 md:px-6 md:py-2.5 rounded-lg md:rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider transition-colors duration-200 inline-flex items-center gap-1 md:gap-1.5 whitespace-nowrap"
                  >
                    Dashboard <ArrowUpRight className="w-3 h-3 md:w-3.5 md:h-3.5 stroke-[2.5]" />
                  </Link>
                </MagneticButton>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link
                  href="/login"
                  className="text-[10px] md:text-xs font-black uppercase tracking-wider text-foreground/60 hover:text-foreground transition-colors duration-200 whitespace-nowrap"
                >
                  Login
                </Link>

              </>
            )}
          </div>
        </div>
      </motion.header>

      {/* Hero section with no background or particles, so ThreeBackground can show through */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center pointer-events-none">
        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="flex flex-col items-center mb-8"
          >
            <p className="text-xs md:text-sm tracking-[0.22em] text-white/85 uppercase font-light drop-shadow-md">
              A New Dimension of Quality
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.3, delay: 0.1 }}
            className="text-[16vw] font-sans font-black text-white leading-[0.8] tracking-tighter uppercase mix-blend-overlay"
            style={{
              textShadow: "0 20px 60px rgba(16, 185, 129, 0.2)",
            }}
          >
            SHOGUN
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.0 }}
            className="mt-6 text-white/60 text-sm md:text-base font-medium tracking-wide max-w-[46ch] text-center leading-relaxed"
          >
            Premium digital products — Shopify, Squarespace, React &amp; more.
          </motion.p>

          {/* Social Proof Strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-6"
          >
            {[
              { value: "547+", label: "Projects Delivered" },
              { value: "5.0★", label: "Fiverr Rating" },
              { value: "6", label: "Specialisations" },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-emerald-400 font-black text-sm md:text-base tabular-nums">
                  {stat.value}
                </span>
                <span className="text-white/40 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="absolute bottom-10 z-10 flex items-center gap-5 text-white/70 tracking-[0.35em] text-[11px] uppercase"
        >
          <span className="w-14 h-[1px] bg-white/25" />
          Scroll to Explore 3D
          <span className="w-14 h-[1px] bg-white/25" />
        </motion.div>
      </section>
    </>
  );
}
