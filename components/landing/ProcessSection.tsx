"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

function Badge({ title }: { title: string }) {
  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
      {title}
    </div>
  );
}

const processSteps = [
  {
    num: "01",
    title: "Discovery",
    desc: "We understand your business, platform needs, target audience, and project goals.",
    deliverables: [
      "Requirements brief & scope document",
      "Platform selection recommendation",
      "Target audience analysis",
      "Project timeline & milestone plan",
      "Competitor visual audit",
    ],
  },
  {
    num: "02",
    title: "UI/UX Design",
    desc: "We create clean, premium, user-friendly layouts with strong visual hierarchy and conversion intent.",
    deliverables: [
      "Moodboard & color palette",
      "Wireframes for all key pages",
      "Mobile-first responsive layouts",
      "Micro-interaction specifications",
      "Typography & spacing system",
    ],
  },
  {
    num: "03",
    title: "Development",
    desc: "We build using the right platform: Squarespace, Shopify, Wix, or custom React/NestJS/MongoDB.",
    deliverables: [
      "Platform setup & configuration",
      "Custom CSS/JS or Liquid code",
      "Animation & scroll effects",
      "API integrations & backend logic",
      "CMS structure & content entry",
    ],
  },
  {
    num: "04",
    title: "Testing & Launch",
    desc: "We test responsiveness, speed, functionality, browser compatibility, forms, animations, and final polish.",
    deliverables: [
      "Cross-browser & device testing",
      "Page speed optimisation",
      "Form & checkout flow QA",
      "Final client review & revisions",
      "Domain connection & go-live",
    ],
  },
];

export default function ProcessSection() {
  const [openStep, setOpenStep] = useState<number | null>(null);

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

        <div className="space-y-3">
          {processSteps.map((step, i) => {
            const isOpen = openStep === i;
            return (
              <div data-gsap="process-step" key={i}>
                <button
                  onClick={() => setOpenStep(isOpen ? null : i)}
                  className="w-full group relative flex items-center gap-6 p-6 rounded-2xl bg-card/40 border border-white/[0.05] hover:border-emerald-500/20 transition-all duration-300 text-left"
                  aria-expanded={isOpen}
                >
                  {/* Step number */}
                  <div className="shrink-0 w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center font-mono font-black text-emerald-400 text-sm group-hover:scale-105 transition-transform duration-200">
                    {step.num}
                  </div>

                  {/* Title + desc */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors duration-200">
                      {step.title}
                    </h3>
                    <p className="text-white/40 text-xs sm:text-sm leading-relaxed mt-1 font-medium line-clamp-1">
                      {step.desc}
                    </p>
                  </div>

                  {/* Chevron */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    className="shrink-0 text-white/30 group-hover:text-emerald-400 transition-colors duration-200"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>

                  {/* Active indicator line */}
                  {isOpen && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-[60%] bg-emerald-500 rounded-full" />
                  )}
                </button>

                {/* Expandable deliverables */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pt-2 pb-5 ml-18">
                        <div className="ml-[72px] grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 border-t border-white/[0.04]">
                          {step.deliverables.map((item, j) => (
                            <motion.div
                              key={j}
                              initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: j * 0.06, duration: 0.3 }}
                              className="flex items-center gap-2.5"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 shrink-0" />
                              <span className="text-xs text-white/55 font-medium">{item}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
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
