import React from "react";
import { Sparkles } from "lucide-react";
import { platformExpertise, platformBadges } from "@/lib/landing-data";

function Badge({ title }: { title: string }) {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
      {title}
    </div>
  );
}

export function PlatformMarquee() {
  return (
    <section data-gsap="marquee-section" className="py-16 relative bg-white/[0.015] border-y border-white/[0.06] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-8 flex items-center gap-6">
        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40 whitespace-nowrap">
          Supported Platforms & Technologies
        </span>
        <div className="h-px bg-gradient-to-r from-white/10 via-emerald-500/20 to-transparent flex-1" />
      </div>

      <div
        className="flex w-full overflow-hidden"
        style={{
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div data-gsap="marquee-track" className="animate-marquee flex items-center whitespace-nowrap gap-0">
          {[...platformBadges, ...platformBadges].map((platform, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-8 text-[13px] font-black uppercase tracking-[0.18em] text-white/50 hover:text-emerald-400 transition-colors duration-300 cursor-default"
            >
              <Sparkles className="w-4 h-4 text-emerald-500/60 flex-shrink-0" />
              <span>{platform}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function PlatformSection() {
  return (
    <section data-gsap="platforms-section" id="platforms" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div data-gsap="section-heading" className="text-left mb-16 sm:mb-20 max-w-3xl">
          <Badge title="Technology Ecosystem" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.04em] text-white leading-none mt-4">
            Built on the <span className="text-emerald-400">Right Platform</span> for Your Business
          </h2>
          <p className="text-white/40 text-sm sm:text-base font-medium mt-4">
            We possess expert specialization in each platform, enabling custom liquid/JS code bypass of platform limitations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {platformExpertise.map((platform, i) => (
            <div data-gsap="platform-card" key={i} className="h-full">
              <div className={`group platform-card-magnetic flex flex-col p-5 rounded-2xl border border-white/[0.05] bg-card/40 hover:bg-card/80 ${platform.border} transition-all duration-300 h-full relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-16 h-16 rounded-full -mr-6 -mt-6 opacity-[0.03] ${platform.color.replace('text', 'bg')} blur-md pointer-events-none`} />

                <div className={`w-9 h-9 rounded-xl ${platform.bg} flex items-center justify-center ${platform.color} group-hover:scale-105 transition-transform duration-200`}>
                  <platform.icon className="w-5 h-5 stroke-[1.5]" />
                </div>

                <h3 className="text-xs sm:text-sm font-black tracking-tight text-white mt-5 group-hover:text-emerald-400 transition-colors duration-200">
                  {platform.name}
                </h3>
                <p className="text-white/40 text-[10px] sm:text-xs leading-relaxed mt-2.5 font-medium">
                  {platform.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
