import React from "react";
import Image from "next/image";
import { Trophy, Users } from "lucide-react";
import RevealOnScroll from "@/components/landing/RevealOnScroll";
import ProgressBar from "@/components/landing/ProgressBar";

function Badge({ title }: { title: string }) {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
      {title}
    </div>
  );
}

export default function MetricsSection() {
  return (
    <section data-gsap="metrics-section" className="py-24 sm:py-32 relative bg-white/[0.005]">
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[30%] left-[10%] w-[500px] h-[500px] bg-cyan-500/[0.02] blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div data-gsap="section-heading" className="text-left mb-16 sm:mb-20 max-w-3xl">
          <Badge title="Performance Metrics" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.04em] text-white leading-none mt-4">
            Ranked by Output. <span className="text-emerald-400">Driven by Results.</span>
          </h2>
          <p className="text-white/40 text-sm sm:text-base font-medium mt-4">
            Tanveer Ahmed guides our team of engineers, operating systematically under real-time metrics tracking.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-8">
            <RevealOnScroll>
              <div className="p-8 rounded-[2rem] border border-white/10 bg-card/40 backdrop-blur-md space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
                  <h3 className="text-lg font-black tracking-tight text-white">
                    Platform Volume Distribution
                  </h3>
                  <span className="text-[9px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded">
                    2024-2025
                  </span>
                </div>

                <div className="space-y-4">
                  <ProgressBar label="Squarespace Design" percentage={38} color="bg-emerald-500" />
                  <ProgressBar label="Shopify Stores" percentage={32} color="bg-cyan-500" />
                  <ProgressBar label="Custom React & Backend Application" percentage={18} color="bg-purple-500" />
                  <ProgressBar label="Wix & Velo Development" percentage={12} color="bg-amber-500" />
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll>
              <div className="relative w-full aspect-[21/9] rounded-[2rem] border border-white/10 bg-card/60 shadow-2xl overflow-hidden p-1">
                <div className="absolute inset-1 rounded-[1.8rem] overflow-hidden">
                  <Image
                    src="/shogun_team_performance_banner.png"
                    alt="Team Collaborative Code Performance Showcase"
                    fill
                    sizes="(max-w-1024px) 100vw, 700px"
                    loading="lazy"
                    className="object-cover object-center opacity-70"
                  />
                </div>
              </div>
            </RevealOnScroll>
          </div>

          <div data-gsap="metrics-card" className="lg:col-span-5 space-y-6">
            <RevealOnScroll delay={0.1}>
              <div className="p-8 rounded-[2rem] border border-white/10 bg-card/60 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/[0.04] to-transparent pointer-events-none" />
                
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6">
                  <Trophy className="w-5 h-5 stroke-[1.5]" />
                </div>

                <h4 className="text-base font-black uppercase tracking-wider text-white">
                  The Shogun Promise
                </h4>
                <p className="text-white/50 text-xs sm:text-sm leading-relaxed mt-3">
                  We never outsource. Every project is planned, structured, and visually engineered directly in-house by our platform experts.
                </p>
              </div>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <div className="p-8 rounded-[2rem] border border-white/10 bg-card/60 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/[0.04] to-transparent pointer-events-none" />
                
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6">
                  <Users className="w-5 h-5 stroke-[1.5]" />
                </div>

                <h4 className="text-base font-black uppercase tracking-wider text-white">
                  Real-time Command Hub
                </h4>
                <p className="text-white/50 text-xs sm:text-sm leading-relaxed mt-3">
                  Clients matching invite criteria gain full access to the Command Center to trace development sprints, leaderboard tasks, and build logs.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
