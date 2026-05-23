"use client";

import React from "react";
import { motion } from "framer-motion";
import { Permanent_Marker } from "next/font/google";
import { EmberParticles } from "./EmberParticles";
import Image from "next/image";

const permanentMarker = Permanent_Marker({ 
  weight: "400",
  subsets: ["latin"],
});

interface HeroProps {
  title: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export const Hero: React.FC<HeroProps> = ({ title, subtitle, primaryCta }) => {
  // Title reveal animation
  const titleVariants = {
    hidden: { opacity: 0, scale: 0.8, filter: "blur(10px)" },
    visible: { 
      opacity: 1, 
      scale: 1, 
      filter: "blur(0px)",
      transition: { duration: 1.2, delay: 0.3 }
    }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8 } }
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-center">
      
      {/* Background Image with Ken Burns effect */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        <Image 
          src="/samurai-bg.png"
          alt="Samurai Background"
          fill
          className="object-cover object-center opacity-85"
          priority
        />
        {/* Emerald-cyan color tint overlay — blends image to match site palette without SSR issues */}
        <div className="absolute inset-0 bg-emerald-900/30" style={{ mixBlendMode: "color" }} />
        {/* Radial dark gradient overlay to focus on center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.9)_100%)]" />
      </motion.div>

      {/* Ember Particles Overlay */}
      <EmberParticles />




      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 mt-20">
        
        {/* Shield Logo & Subtitle */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="flex flex-col items-center mb-6">
          <div className="w-10 h-12 border-2 border-white/80 rounded-sm flex items-center justify-center mb-4 bg-black/20 backdrop-blur-sm">
             {/* Simple geometric logo placeholder */}
             <div className="w-4 h-4 border-t-2 border-l-2 border-white/80 transform rotate-45 translate-y-1" />
          </div>
          <p className="text-xs md:text-sm tracking-[0.2em] text-white/90 uppercase font-light drop-shadow-md">
            {subtitle || "Carve your own clever path to vengeance"}
          </p>
        </motion.div>

        {/* Massive Brush Title */}
        <motion.h1 
          variants={titleVariants} 
          initial="hidden" 
          animate="visible"
          className={`${permanentMarker.className} text-7xl md:text-9xl lg:text-[12rem] text-white tracking-wider z-10 leading-none`}
          style={{ textShadow: "4px 4px 0px rgba(0,0,0,0.8), 0 0 60px rgba(16, 185, 129, 0.7)" }}
        >
          {title || "UNGRATEFUL"}
        </motion.h1>
      </div>

      {/* Bottom CTA */}
      <motion.div 
        variants={fadeUp} 
        initial="hidden" 
        animate="visible"
        className="absolute bottom-12 z-10 flex items-center gap-6 text-white/80 tracking-[0.3em] text-xs uppercase hover:text-white transition-colors cursor-pointer group"
      >
        <span className="w-16 h-[1px] bg-white/30 group-hover:bg-white/80 transition-colors" />
        {primaryCta?.label || "CONTINUE"}
        <span className="w-16 h-[1px] bg-white/30 group-hover:bg-white/80 transition-colors" />
      </motion.div>

    </section>
  );
};
