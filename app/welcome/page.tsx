"use client";

import React from "react";
import { Hero } from "@/components/landing/Hero";
import { FeatureCard } from "@/components/landing/FeatureCard";
import { Footer } from "@/components/landing/Footer";
import { Cpu, Zap, ShieldCheck } from "lucide-react";

export default function WelcomePage() {
  return (
    <>
      <Hero
        title="Welcome to Team Shogun"
        subtitle="Real‑time command center for your Fiverr agency. Track, manage, and scale with confidence."
        primaryCta={{ label: "Get Started", href: "/login" }}
        secondaryCta={{ label: "Learn More", href: "/#process" }}
      />
      <section className="max-w-6xl mx-auto px-4 py-12 grid gap-8 md:grid-cols-3">
        <FeatureCard
          icon={Zap}
          title="Instant Real‑Time Sync"
          description="Live updates via Socket.io keep every dashboard in perfect sync."
        />
        <FeatureCard
          icon={Cpu}
          title="Tiered Deadline Alerts"
          description="Automatic email and in‑app alerts keep your team on schedule."
        />
        <FeatureCard
          icon={ShieldCheck}
          title="Robust RBAC Security"
          description="Granular role‑based permissions protect your data."
        />
      </section>
      <Footer />
    </>
  );
}
