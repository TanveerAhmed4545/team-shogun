import React from "react";
import LoadingScreen from "@/components/landing/LoadingScreen";
import ScrollProgress from "@/components/landing/ScrollProgress";
import GSAPScrollAnimations from "@/components/landing/GSAPScrollAnimations";
import PageWrapper from "@/components/landing/PageWrapper";
import HeroSection3D from "@/components/landing/HeroSection3D";
import PlatformSection, { PlatformMarquee } from "@/components/landing/PlatformSection";
import BentoGridSection from "@/components/landing/BentoGridSection";
import ProcessSection from "@/components/landing/ProcessSection";
import ProjectsSection from "@/components/landing/ProjectsSection";
import ShowcaseSection from "@/components/landing/ShowcaseSection";
import MetricsSection from "@/components/landing/MetricsSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import FAQSection from "@/components/landing/FAQSection";
import InteractiveCTA from "@/components/landing/InteractiveCTA";
import FooterSection from "@/components/landing/FooterSection";
import ThreeBackground from "@/components/landing/ThreeBackground";

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

      {/* THREE.JS BACKGROUND FIXED BEHIND EVERYTHING */}
      <ThreeBackground />

      {/* CONTENT WITH TRANSPARENT BACKGROUNDS TO SHOW 3D */}
      <div className="min-h-[100dvh] text-foreground selection:bg-emerald-500/30 overflow-x-hidden relative font-sans">

        <HeroSection3D />

        <div className="relative z-10 w-full mt-12 md:mt-20">
          <PlatformMarquee />
        </div>

        <div className="relative z-10 w-full mt-16 md:mt-24 bg-gradient-to-b from-transparent via-black/75 to-transparent py-16 md:py-24">
          <BentoGridSection />
        </div>

        <div className="relative z-10 w-full mt-16 md:mt-24 bg-gradient-to-b from-transparent via-black/75 to-transparent py-16 md:py-24">
          <ProcessSection />
        </div>

        <div className="relative z-10 w-full mt-16 md:mt-24 bg-gradient-to-b from-transparent via-black/75 to-transparent py-16 md:py-24">
          <PlatformSection />
        </div>

        <div className="relative z-10 w-full mt-16 md:mt-24 bg-gradient-to-b from-transparent via-black/75 to-transparent py-16 md:py-24">
          <ProjectsSection />
        </div>

        <div className="relative z-10 w-full mt-16 md:mt-24 bg-gradient-to-b from-transparent via-black/75 to-transparent py-16 md:py-24">
          <ShowcaseSection />
        </div>

        <div className="relative z-10 w-full mt-16 md:mt-24 bg-gradient-to-b from-transparent via-black/75 to-transparent py-16 md:py-24">
          <MetricsSection />
        </div>

        <div className="relative z-10 w-full mt-16 md:mt-24 bg-gradient-to-b from-transparent via-black/75 to-transparent py-16 md:py-24">
          <TestimonialsSection />
        </div>

        <div className="relative z-10 w-full mt-16 md:mt-24 bg-gradient-to-b from-transparent via-black/75 to-transparent py-16 md:py-24">
          <FAQSection />
        </div>

        <div className="relative z-10 w-full mt-16 md:mt-24 border-t border-white/5 bg-black/95 backdrop-blur-3xl pt-16 md:pt-20">
          <InteractiveCTA />
          <FooterSection />
        </div>
      </div>
    </PageWrapper>
  );
}
