import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function FooterSection() {
  return (
    <footer data-gsap="footer" className="relative w-full bg-transparent pt-32 overflow-hidden flex flex-col justify-end min-h-screen">
      
      {/* Top Section - Minimalist Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full flex flex-col md:flex-row justify-between items-start gap-16 mb-24 relative z-10">
        
        {/* Left Col - Vision */}
        <div data-gsap="footer-col" className="flex flex-col space-y-6 max-w-sm">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-emerald-400 uppercase">Status: Online</span>
          </div>
          <p className="text-xl md:text-2xl font-light text-white/90 leading-relaxed tracking-tight">
            Building digital experiences with mathematical precision and a high standard of motion.
          </p>
        </div>

        {/* Right Cols - Navigation & Details */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-24">
          <div data-gsap="footer-col" className="flex flex-col space-y-4">
            <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Navigation</h4>
            <a href="#services" className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">Services</a>
            <a href="#process" className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">Process</a>
            <a href="#work" className="text-sm font-medium text-white hover:text-emerald-400 transition-colors">Work</a>
          </div>

          <div data-gsap="footer-col" className="flex flex-col space-y-4">
            <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Socials</h4>
            <a href="#" className="text-sm font-medium text-white hover:text-emerald-400 transition-colors inline-flex items-center gap-1">Twitter <ArrowUpRight className="w-3 h-3 text-emerald-500" /></a>
            <a href="#" className="text-sm font-medium text-white hover:text-emerald-400 transition-colors inline-flex items-center gap-1">LinkedIn <ArrowUpRight className="w-3 h-3 text-emerald-500" /></a>
            <a href="#" className="text-sm font-medium text-white hover:text-emerald-400 transition-colors inline-flex items-center gap-1">GitHub <ArrowUpRight className="w-3 h-3 text-emerald-500" /></a>
          </div>

          <div data-gsap="footer-col" className="flex flex-col space-y-4 col-span-2 md:col-span-1">
            <h4 className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-2">Portal</h4>
            <Link href="/login" className="text-sm font-medium text-emerald-400 hover:text-white transition-colors border border-emerald-500/30 px-4 py-2 rounded-lg text-center bg-emerald-500/5">
              Client Login
            </Link>
          </div>
        </div>
      </div>

      {/* Massive Typography Footer */}
      <div className="w-full relative z-0 flex flex-col items-center justify-end overflow-hidden pb-4">
        {/* Subtle gradient to anchor the text */}
        <div className="absolute bottom-0 w-full h-[50vh] bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none -z-10" />
        
        <h1 
          className="text-[22vw] leading-[0.75] font-black font-sans tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white/90 to-white/10 select-none mix-blend-overlay"
        >
          SHOGUN
        </h1>
        
        <div className="w-full flex justify-between items-center px-6 lg:px-8 mt-4 text-[10px] font-mono text-white/30 uppercase tracking-widest">
          <span>© 2025 Team Shogun</span>
          <span>Managed by Tanveer Ahmed</span>
        </div>
      </div>
    </footer>
  );
}
