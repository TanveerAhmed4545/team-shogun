import React from "react";
import Image from "next/image";
import { processSteps } from "@/lib/landing-data";

function Badge({ title }: { title: string }) {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
      {title}
    </div>
  );
}

export default function ProcessSection() {
  return (
    <section data-gsap="process-section" id="process" className="py-24 sm:py-32 relative bg-white/[0.005]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div data-gsap="section-heading" className="text-left mb-16 sm:mb-20 max-w-3xl">
          <Badge title="Execution Roadmap" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.04em] text-white leading-none mt-4">
            From Idea to <span className="text-emerald-400">Premium Digital Experience</span>
          </h2>
          <p className="text-white/40 text-sm sm:text-base font-medium mt-4">
            A structured, transparent engineering process focused on clarity, standard and timely launch.
          </p>
        </div>

        <div className="relative">
          <div data-gsap="process-line" className="absolute top-12 left-0 right-0 h-px bg-gradient-to-r from-emerald-500/50 via-cyan-500/30 to-transparent hidden md:block" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {processSteps.map((step, i) => (
              <div data-gsap="process-step" key={i}>
                <div className="group relative flex flex-col p-6 rounded-2xl bg-card/40 border border-white/[0.05] hover:border-emerald-500/20 transition-all duration-300 h-full">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center font-mono font-black text-emerald-400 text-sm z-10 group-hover:scale-105 transition-transform duration-200">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-black tracking-tight text-white mt-6 group-hover:text-emerald-400 transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="text-white/50 text-xs sm:text-sm leading-relaxed mt-2.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div data-gsap="process-image" className="mt-20 flex justify-center">
          <div className="relative w-full max-w-[900px] aspect-[16/9] rounded-[2.5rem] border border-white/10 bg-card/60 shadow-2xl overflow-hidden p-1.5">
            <div className="absolute inset-1.5 rounded-[2.3rem] overflow-hidden">
              <Image
                src="/shogun_project_hub_banner.png"
                alt="Process Coordination Hub Interface Mockup"
                fill
                sizes="(max-w-1024px) 100vw, 900px"
                className="object-cover object-top select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
