import React from "react";
import LoadingScreen from "@/components/landing/LoadingScreen";
import ScrollProgress from "@/components/landing/ScrollProgress";
import GSAPScrollAnimations from "@/components/landing/GSAPScrollAnimations";
import PageWrapper from "@/components/landing/PageWrapper";
import HeroSection from "@/components/landing/HeroSection";
import PlatformSection, { PlatformMarquee } from "@/components/landing/PlatformSection";
import BentoGridSection from "@/components/landing/BentoGridSection";
import ProcessSection from "@/components/landing/ProcessSection";
import ProjectsSection from "@/components/landing/ProjectsSection";
import ShowcaseSection from "@/components/landing/ShowcaseSection";
import MetricsSection from "@/components/landing/MetricsSection";
import InteractiveCTA from "@/components/landing/InteractiveCTA";
import FooterSection from "@/components/landing/FooterSection";

export const metadata = {
  title: "Team Shogun | Premium Digital Solutions",
  description: "Six specialisations. One agency. Built to an ultra-premium visual and technical standard.",
};

export default function Home() {
  return (
    <PageWrapper>
      {/* ─── Cinematic Loader, Scroll Progress & GSAP Controller ─── */}
      <LoadingScreen />
      <ScrollProgress />
      <GSAPScrollAnimations />

      <div className="min-h-[100dvh] bg-background text-foreground selection:bg-emerald-500/30 overflow-x-hidden relative font-sans">
        {/* Ambient atmospheric gradients + hero particles */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] pointer-events-none -z-10 overflow-hidden">
          <div data-gsap="glow-orb" className="animate-aurora animate-glow-emerald absolute top-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-[700px] bg-gradient-to-b from-emerald-500/[0.08] via-cyan-500/[0.03] to-transparent blur-[140px] rounded-full" />
          <div data-gsap="glow-orb" className="animate-glow-cyan absolute top-[25%] -right-[15%] w-[600px] h-[600px] bg-emerald-500/[0.03] blur-[180px] rounded-full" />
          <div className="animate-particle-a absolute top-[15%] left-[8%] w-[320px] h-[320px] bg-emerald-500/[0.06] blur-[100px] rounded-full" />
          <div className="animate-particle-b absolute top-[40%] right-[5%] w-[240px] h-[240px] bg-cyan-500/[0.05] blur-[80px] rounded-full" />
          <div className="animate-particle-c absolute bottom-[10%] left-[30%] w-[200px] h-[200px] bg-purple-500/[0.04] blur-[90px] rounded-full" />
        </div>

        <HeroSection />
        <PlatformMarquee />
        <BentoGridSection />
        <ProcessSection />
        <PlatformSection />
        <ProjectsSection />
        <ShowcaseSection />
        <MetricsSection />
        <InteractiveCTA />
        <FooterSection />
      </div>
    </PageWrapper>
  );
}
