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

// ─── Ember Particle Canvas (hero section) ───
const EmberCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf: number;
    let running = true;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    resize();

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 25 : 60;

    const COLORS = ["#10b981", "#06b6d4", "#34d399", "#22d3ee"];
    const createP = () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + Math.random() * 80,
      size: Math.random() * 3 + 0.8,
      vy: -(Math.random() * 1.6 + 0.4),
      vx: (Math.random() - 0.5) * 1.4,
      life: 0,
      maxLife: Math.random() * 120 + 60,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    });

    const particles = Array.from({ length: COUNT }, createP);

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const alpha = Math.max(0, 1 - p.life / p.maxLife);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.floor(alpha * 220).toString(16).padStart(2, "0")}`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy; p.life++;
        if (p.life >= p.maxLife || p.y < -10) particles[i] = createP();
      }
      raf = requestAnimationFrame(draw);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          running = true;
          draw();
        } else {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    observer.observe(canvas);
    draw();

    return () => {
      running = false;
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-[1] pointer-events-none" />;
};

export default function HeroSection() {
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
    const timer = setTimeout(() => setHasLoaded(true), 3500);
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
                <MagneticButton strength={0.25}>
                  <Link
                    href="#contact"
                    className="btn-shimmer bg-foreground/5 hover:bg-foreground/10 text-foreground border border-foreground/10 px-3 py-2 md:px-5 md:py-2.5 rounded-lg md:rounded-xl text-[9px] md:text-xs font-black uppercase tracking-wider transition-colors duration-200 inline-flex items-center gap-1 md:gap-1.5 whitespace-nowrap"
                  >
                    Start Project <ChevronRight className="w-3 h-3 md:w-3.5 md:h-3.5" />
                  </Link>
                </MagneticButton>
              </>
            )}
          </div>
        </div>
      </motion.header>

      <section className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-center">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/samurai-bg.png"
            alt="Samurai Hero Background"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_center,transparent_30%,rgba(0,0,0,0.25)_65%,rgba(0,0,0,0.80)_100%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent via-60% to-black/50" />
          {/* Dedicated bottom blend for Light/Dark mode transitions */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </motion.div>

        <EmberCanvas />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="flex flex-col items-center mb-8"
          >
            <p className="text-xs md:text-sm tracking-[0.22em] text-white/85 uppercase font-light drop-shadow-md">
              Carve your own clever path to greatness
            </p>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.85, filter: "blur(12px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.3, delay: 0.2 }}
            className="text-[5rem] sm:text-[8rem] md:text-[11rem] lg:text-[13rem] text-white leading-none tracking-wide"
            style={{
              fontFamily: "var(--font-permanent-marker), cursive",
              textShadow: "4px 4px 0px rgba(0,0,0,0.9), 0 0 80px rgba(16, 185, 129, 0.7)",
            }}
          >
            SHOGUN
          </motion.h1>
        </div>

        <motion.a
          href="#services"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 1.4 }}
          className="absolute bottom-10 z-10 flex items-center gap-5 text-white/70 tracking-[0.35em] text-[11px] uppercase hover:text-white transition-colors cursor-pointer group"
        >
          <span className="w-14 h-[1px] bg-white/25 group-hover:bg-white/70 transition-all duration-300 group-hover:w-20" />
          Continue
          <span className="w-14 h-[1px] bg-white/25 group-hover:bg-white/70 transition-all duration-300 group-hover:w-20" />
        </motion.a>
      </section>
    </>
  );
}
