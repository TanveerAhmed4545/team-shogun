"use client";

import React, { useRef } from "react";
import {
  useReducedMotion,
  useSpring,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { Database } from "lucide-react";
import Image from "next/image";
import RevealOnScroll from "@/components/landing/RevealOnScroll";
import { bentoServices } from "@/lib/landing-data";

function Badge({ title }: { title: string }) {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
      {title}
    </div>
  );
}

type ServiceCardProps = {
  service: typeof bentoServices[0];
};

function ServiceCard({ service }: ServiceCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const rotateX = (((top + height / 2) - clientY) / (height / 2)) * 8;
    const rotateY = ((clientX - (left + width / 2)) / (width / 2)) * 8;
    ref.current.style.setProperty("--rx", `${rotateX}deg`);
    ref.current.style.setProperty("--ry", `${rotateY}deg`);
  };

  const handleMouseLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty("--rx", "0deg");
    ref.current.style.setProperty("--ry", "0deg");
  };

  return (
    <RevealOnScroll className="h-full">
      <div
        data-gsap="service-card"
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: shouldReduceMotion
            ? undefined
            : "perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
          transition: "transform 350ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          transformStyle: "preserve-3d",
        }}
        className={`group relative h-full rounded-[2.5rem] border border-white/10 bg-card/60 backdrop-blur-xl overflow-hidden p-8 sm:p-10 flex flex-col justify-between hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/[0.05] cursor-default`}
      >
        <div className={`absolute inset-0 bg-gradient-to-br ${service.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -z-10`} />

        {service.image && (
          <div className="absolute inset-0 -z-20 opacity-0 group-hover:opacity-[0.25] transition-opacity duration-700 overflow-hidden mix-blend-screen">
            <Image
              src={service.image}
              alt={service.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover scale-110 group-hover:scale-100 transition-transform duration-[2000ms] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
          </div>
        )}

        <div className="space-y-6 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-emerald-400 shadow-inner group-hover:bg-emerald-500/10 group-hover:border-emerald-500/25 transition-all duration-300">
            <service.icon className="w-6 h-6 stroke-[1.5]" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white drop-shadow-md">
            {service.title}
          </h3>
        </div>

        <p className="text-white/60 text-xs sm:text-sm leading-relaxed mt-6 relative z-10 font-medium">
          {service.description}
        </p>

        <div className="flex flex-wrap items-center gap-1.5 mt-8 relative z-10">
          {service.tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest bg-white/[0.04] border border-white/[0.07] text-white/30 group-hover:border-emerald-500/20 group-hover:text-emerald-400/70 transition-colors duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </RevealOnScroll>
  );
}

export default function BentoGridSection() {
  const shouldReduceMotion = useReducedMotion();
  
  const mouseX = useTransform(useSpring(useMotionValue(0)), [-300, 300], [-10, 10]);
  const mouseY = useTransform(useSpring(useMotionValue(0)), [-300, 300], [-10, 10]);

  const handleMouseMoveBento = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const xVal = clientX - (left + width / 2);
    const yVal = clientY - (top + height / 2);
    mouseX.set(xVal);
    mouseY.set(yVal);
  };

  const handleMouseLeaveBento = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <section data-gsap="services-section" id="services" className="py-24 sm:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div data-gsap="section-heading" className="text-left mb-16 sm:mb-20 max-w-3xl">
          <Badge title="Precision Engineering" />
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.04em] text-white leading-none mt-4">
            Digital Solutions Designed With <span className="text-emerald-400">Precision</span>
          </h2>
          <p className="text-white/40 text-sm sm:text-base font-medium mt-4">
            Six specialisations. One agency. All built to an ultra-premium visual and technical standard.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <ServiceCard service={bentoServices[0]} />
          </div>
          <div className="lg:col-span-5">
            <ServiceCard service={bentoServices[1]} />
          </div>

          <div className="lg:col-span-4">
            <ServiceCard service={bentoServices[2]} />
          </div>
          <div className="lg:col-span-4">
            <ServiceCard service={bentoServices[3]} />
          </div>
          <div className="lg:col-span-4">
            <ServiceCard service={bentoServices[4]} />
          </div>

          <div className="lg:col-span-12">
            <RevealOnScroll className="h-full">
              <div
                onMouseMove={handleMouseMoveBento}
                onMouseLeave={handleMouseLeaveBento}
                className="group relative h-full rounded-[2rem] border border-white/10 bg-card/40 backdrop-blur-md overflow-hidden p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8 transition-all duration-300 hover:border-amber-500/20"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-amber-500/[0.04] to-transparent pointer-events-none" />
                
                <div className="flex-1 space-y-4 max-w-[50ch]">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 shadow-md">
                    <Database className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-4">
                    MongoDB Database Systems
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed">
                    Database structure, dynamic content feeds, administrative panels, user accounts, security parameters, and custom web application data storage.
                  </p>
                </div>

                <div
                  style={{
                    transform: shouldReduceMotion ? "none" : `perspective(1000px) rotateX(${mouseY.get()}deg) rotateY(${mouseX.get()}deg)`,
                  }}
                  className="w-full md:w-[360px] rounded-2xl border border-white/[0.07] bg-background/90 p-5 font-mono text-[10px] text-white/60 space-y-3 shadow-2xl relative select-none"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-white/[0.05]">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-white/30 font-bold">mongodb-schema.ts</span>
                  </div>
                  <div className="space-y-1 text-white/80">
                    <p><span className="text-purple-400">const</span> <span className="text-blue-400">projectSchema</span> = <span className="text-purple-400">new</span> <span className="text-cyan-400">Schema</span>(&#123;</p>
                    <p className="pl-4"><span className="text-white/50">name:</span> &#123; <span className="text-blue-300">type:</span> String, <span className="text-blue-300">required:</span> <span className="text-amber-400">true</span> &#125;,</p>
                    <p className="pl-4"><span className="text-white/50">platform:</span> &#123; <span className="text-blue-300">type:</span> String, <span className="text-blue-300">enum:</span> [<span className="text-emerald-300">&apos;Shopify&apos;</span>] &#125;,</p>
                    <p className="pl-4"><span className="text-white/50">metric:</span> &#123; <span className="text-blue-300">conversion:</span> Number, <span className="text-blue-300">speedScore:</span> Number &#125;</p>
                    <p>&#125;);</p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
