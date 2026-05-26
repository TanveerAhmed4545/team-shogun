import React from "react";
import { ArrowUpRight, ShieldCheck, CheckCircle } from "lucide-react";
import MagneticButton from "@/components/landing/MagneticButton";

export default function InteractiveCTA() {
  return (
    <section data-gsap="cta-section" id="contact" className="py-24 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="animate-aurora absolute bottom-[-20%] left-1/2 -translate-x-1/2 w-[90%] h-[500px] bg-gradient-to-t from-emerald-500/[0.06] via-cyan-500/[0.02] to-transparent blur-[120px] rounded-full" />
      </div>

      <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center relative z-10 space-y-8">
        <div data-gsap="cta-badge" className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto">
          🚀 Start Your Digital Shift
        </div>

        <h2 data-gsap="cta-title" className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-[-0.04em] text-white leading-[1.1] max-w-[20ch] mx-auto">
          Ready to Build a Website That Feels <span className="text-emerald-400">Premium?</span>
        </h2>

        <p data-gsap="cta-sub" className="text-white/60 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-[65ch] mx-auto">
          Whether you need a Squarespace website, Shopify store, Wix Velo system, custom React frontend, or a full-stack application with Node.js, NestJS, and MongoDB — we can help you plan, design, and build it properly.
        </p>

        <div data-gsap="cta-buttons" className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-4">

            <MagneticButton strength={0.25}>
              <a
                href="https://calendly.com"
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-wider text-white hover:text-emerald-400 hover:bg-white/[0.02] border border-white/10 transition-all duration-200 inline-flex items-center justify-center"
              >
                Book a Consultation
              </a>
            </MagneticButton>
        </div>

        <div className="flex items-center justify-center gap-6 pt-10 text-[10px] font-bold text-white/30 uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/60" /> In-House Engineers
            </span>
            <span className="w-1.5 h-1.5 bg-white/10 rounded-full" />
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-500/60" /> Standard Guarantee
            </span>
        </div>
      </div>
    </section>
  );
}
