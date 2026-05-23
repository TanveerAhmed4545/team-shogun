import React from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { featuredProjects } from "@/lib/landing-data";

function Badge({ title }: { title: string }) {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
      {title}
    </div>
  );
}

export default function ProjectsSection() {
  return (
    <section data-gsap="work-section" id="work" className="py-24 sm:py-32 relative bg-white/[0.005]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div data-gsap="section-heading" className="text-left mb-16 sm:mb-20 max-w-3xl">
          <Badge title="Agency Case Studies" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.04em] text-white leading-none mt-4">
            Selected Projects Built With <span className="text-emerald-400">Detail, Motion & Performance</span>
          </h2>
          <p className="text-white/40 text-sm sm:text-base font-medium mt-4">
            View real portfolio metrics demonstrating high fidelity visual presentation and dynamic code architectures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map((project, i) => (
            <div data-gsap="project-card" key={i} className="h-full">
              <div className="group card-3d-hover relative rounded-[2rem] border border-white/10 bg-card/40 hover:border-emerald-500/25 overflow-hidden flex flex-col h-full transition-all duration-300">
                
                <div className="relative w-full aspect-[16/10] overflow-hidden p-2 bg-background/60 border-b border-white/[0.05]">
                  <div className="absolute inset-2 rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(max-w-768px) 100vw, 540px"
                      loading="lazy"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {project.platform}
                    </span>
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                  </div>

                  <h3 className="text-xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-200">
                    {project.title}
                  </h3>

                  <div className="space-y-2 pt-2 text-xs sm:text-sm text-white/50 flex-1">
                    <p className="flex gap-2">
                      <span className="text-white/30 font-bold shrink-0">Focus:</span>
                      <span>{project.focus}</span>
                    </p>
                    <p className="flex gap-2">
                      <span className="text-white/30 font-bold shrink-0">Value:</span>
                      <span>{project.value}</span>
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.05] flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30 group-hover:text-emerald-400 transition-colors duration-200">
                      View Project Mockup
                    </span>
                    <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-emerald-500/30 flex items-center justify-center text-white/40 group-hover:text-emerald-400 transition-colors duration-200">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
