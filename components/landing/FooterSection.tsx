import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function FooterSection() {
  return (
    <footer data-gsap="footer" className="border-t border-white/[0.05] bg-background py-16 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-10">
        <div data-gsap="footer-col" className="flex flex-col space-y-3 max-w-[32ch]">
          <div className="flex items-center space-x-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-black shadow-lg shadow-emerald-500/25 shrink-0">
              <Image src="/shogun-logo.png" alt="Shogun" fill className="object-cover" />
            </div>
            <span className="text-base font-black tracking-wider text-white">
              SHOGUN<span className="text-emerald-500">.</span>
            </span>
          </div>
          <p className="text-white/40 text-xs leading-relaxed font-medium">
            Premium websites & web applications built with mathematical precision, clean layout and high motion standard.
          </p>
        </div>

        <div data-gsap="footer-col" className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[9px] font-black uppercase tracking-widest text-white/30">
          <a href="#services" className="hover:text-emerald-400 transition-colors">Services</a>
          <a href="#process" className="hover:text-emerald-400 transition-colors">Process</a>
          <a href="#work" className="hover:text-emerald-400 transition-colors">Work</a>
          <a href="#platforms" className="hover:text-emerald-400 transition-colors">Platforms</a>
          <Link href="/login" className="hover:text-emerald-400 transition-colors">Client Area</Link>
        </div>

        <div data-gsap="footer-col" className="flex flex-col space-y-2 text-left md:text-right">
          <p className="text-[10px] font-mono text-white/30 tracking-tight">
            © 2025 Team Shogun Agency · Managed by Tanveer Ahmed
          </p>
          <div className="flex items-center md:justify-end gap-1.5 text-[9px] uppercase tracking-widest font-black text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-dot" />
            Websockets Live · V3.0
          </div>
        </div>
      </div>
    </footer>
  );
}
