"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    q: "What is your typical project delivery timeline?",
    a: "Standard brand & CMS builds (Shopify, Squarespace, Wix) typically deliver within 5 to 10 business days. Custom React/Next.js web applications and complex 3D WebGL scenes range from 2 to 4 weeks depending on scope and custom feature requirements.",
  },
  {
    q: "How do revisions and feedback cycles work?",
    a: "Every project includes dedicated revision rounds. We review deliverables collaboratively with pinpointed visual feedback, test responsiveness across all devices, and refine until you are 100% satisfied before final code handover.",
  },
  {
    q: "Do I get full ownership and source code access?",
    a: "Yes, 100%. Upon completion, full source code, GitHub repository rights, custom assets, and theme licenses are transferred directly to your team or account with zero vendor lock-in.",
  },
  {
    q: "Can you build on my existing site or do you only start from scratch?",
    a: "We do both! We frequently audit, redesign, and refactor existing Shopify stores, Wix Velo scripts, and React apps, as well as architecting fresh custom solutions from blank canvas to production launch.",
  },
  {
    q: "What technologies and platforms does Team Shogun specialize in?",
    a: "We are expert practitioners in Shopify (Liquid, Storefront API), Squarespace, Wix Studio (Velo), React, Next.js (App Router), Three.js/WebGL shaders, Tailwind CSS, TypeScript, Node.js, and MongoDB.",
  },
  {
    q: "Do you provide post-launch support and maintenance?",
    a: "Yes. Every completed order includes 30 days of complimentary post-launch bug fixing and warranty support. We also provide ongoing monthly maintenance and feature expansion plans upon request.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 md:py-28 relative">
      <div className="max-w-4xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
            <HelpCircle className="w-3 h-3 mr-1.5" /> Frequently Asked Questions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.04em] text-white leading-tight">
            Everything You Need <span className="text-emerald-400">To Know</span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base font-medium mt-4">
            Clear answers on how we plan, code, and deliver high-impact digital products.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl overflow-hidden transition-all duration-200 hover:border-emerald-500/30"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm md:text-base font-black text-white/90">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-emerald-400 border-emerald-500/30" : "text-white/40"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 text-sm text-white/60 font-medium leading-relaxed border-t border-white/5 pt-4">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
