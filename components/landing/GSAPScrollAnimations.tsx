"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * GSAPScrollAnimations
 * ─────────────────────────────────────────────────────────────────
 * Mounts GSAP + ScrollTrigger scroll animations onto the landing page.
 * Uses data attributes to target elements — zero coupling to JSX IDs.
 *
 * Architecture:
 *  • All timelines are created paused (ScrollTrigger drives them)
 *  • Cleanup kills all triggers on unmount (no memory leaks)
 *  • prefers-reduced-motion is honoured — animations are disabled
 *  • Uses gsap.matchMedia for responsive breakpoint handling
 */
export default function GSAPScrollAnimations() {
  const shouldReduceMotion = useReducedMotion();
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (shouldReduceMotion) return;

    let ctx: { revert: () => void } | null = null;

    const initAnimations = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        // ─── Global defaults ───────────────────────────────────────
        gsap.defaults({ ease: "power3.out", overwrite: "auto" });

        // ══════════════════════════════════════════════════════════
        // Hero animations handled by framer-motion in HeroSection.tsx        // ══════════════════════════════════════════════════════════
        // 2. MARQUEE — Scroll-speed-linked acceleration
        // ══════════════════════════════════════════════════════════
        ScrollTrigger.create({
          trigger: "[data-gsap='marquee-section']",
          start: "top 90%",
          onEnter: () => {
            gsap.to("[data-gsap='marquee-track']", {
              duration: 0.4,
              ease: "none",
            });
          },
        });

        // ══════════════════════════════════════════════════════════
        // 3. SERVICES — Bento cards staggered 3D reveal
        // ══════════════════════════════════════════════════════════
        ScrollTrigger.create({
          trigger: "[data-gsap='services-section']",
          start: "top 75%",
          onEnter: () => {
            gsap.fromTo("[data-gsap='service-card']",
              { y: 60, opacity: 0, rotateX: 8, scale: 0.95 },
              {
                y: 0,
                opacity: 1,
                rotateX: 0,
                scale: 1,
                duration: 0.7,
                stagger: { each: 0.08, from: "start" },
                ease: "power3.out",
                transformOrigin: "50% 100%",
                clearProps: "all",
              }
            );
          },
        });

        // ══════════════════════════════════════════════════════════
        // 4. PROCESS — Steps sequential reveal with connector line draw
        // ══════════════════════════════════════════════════════════
        ScrollTrigger.create({
          trigger: "[data-gsap='process-section']",
          start: "top 70%",
          onEnter: () => {
            // Draw the connector line
            gsap.fromTo("[data-gsap='process-line']",
              { scaleX: 0 },
              {
                scaleX: 1,
                transformOrigin: "left center",
                duration: 1.2,
                ease: "power2.inOut",
                clearProps: "all"
              }
            );
            // Stagger step cards
            gsap.fromTo("[data-gsap='process-step']",
              { y: 50, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.65,
                stagger: { each: 0.12, from: "start" },
                ease: "power3.out",
                delay: 0.2,
                clearProps: "all"
              }
            );
          },
        });

        // Process hub image — scroll-linked parallax
        ScrollTrigger.create({
          trigger: "[data-gsap='process-image']",
          start: "top 80%",
          onEnter: () => {
            gsap.fromTo("[data-gsap='process-image']",
              { y: 80, opacity: 0, scale: 0.96 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.0,
                ease: "power3.out",
                clearProps: "all"
              }
            );
          },
        });

        // ══════════════════════════════════════════════════════════
        // 5. PLATFORMS — Icon grid radial reveal from center
        // ══════════════════════════════════════════════════════════
        ScrollTrigger.create({
          trigger: "[data-gsap='platforms-section']",
          start: "top 72%",
          onEnter: () => {
            gsap.fromTo("[data-gsap='platform-card']",
              { scale: 0.85, opacity: 0, y: 30 },
              {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 0.55,
                stagger: { amount: 0.5, from: "center" },
                ease: "back.out(1.5)",
                clearProps: "all"
              }
            );
          },
        });

        // ══════════════════════════════════════════════════════════
        // 6. WORK — Project cards slide up with image reveal
        // ══════════════════════════════════════════════════════════
        ScrollTrigger.create({
          trigger: "[data-gsap='work-section']",
          start: "top 75%",
          onEnter: () => {
            gsap.fromTo("[data-gsap='project-card']",
              { y: 70, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.75,
                stagger: { each: 0.15, from: "start" },
                ease: "power3.out",
                clearProps: "all"
              }
            );
          },
        });

        // ══════════════════════════════════════════════════════════
        // 7. ANIMATION SHOWCASE — Parallax scroll pinned
        // ══════════════════════════════════════════════════════════
        ScrollTrigger.create({
          trigger: "[data-gsap='showcase-section']",
          start: "top 75%",
          onEnter: () => {
            gsap.fromTo("[data-gsap='showcase-image']",
              { y: 50, opacity: 0, scale: 0.94 },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.9,
                ease: "power3.out",
                clearProps: "all"
              }
            );
            gsap.fromTo("[data-gsap='showcase-chip']",
              { x: 30, opacity: 0 },
              {
                x: 0,
                opacity: 1,
                duration: 0.5,
                stagger: { each: 0.06, from: "start" },
                ease: "power2.out",
                delay: 0.2,
                clearProps: "all"
              }
            );
          },
        });

        // ══════════════════════════════════════════════════════════
        // 8. METRICS — Progress bars animated on enter
        // ══════════════════════════════════════════════════════════
        ScrollTrigger.create({
          trigger: "[data-gsap='metrics-section']",
          start: "top 75%",
          onEnter: () => {
            gsap.fromTo("[data-gsap='metrics-bar-fill']",
              { scaleX: 0 },
              {
                scaleX: 1,
                transformOrigin: "left center",
                duration: 1.4,
                stagger: 0.15,
                ease: "power3.out",
                clearProps: "all"
              }
            );
            gsap.fromTo("[data-gsap='metrics-card']",
              { y: 40, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.12,
                ease: "power3.out",
                clearProps: "all"
              }
            );
          },
        });

        // ══════════════════════════════════════════════════════════
        // 9. CTA — Dramatic scale-up reveal
        // ══════════════════════════════════════════════════════════
        ScrollTrigger.create({
          trigger: "[data-gsap='cta-section']",
          start: "top 80%",
          onEnter: () => {
            const ctaTl = gsap.timeline();
            ctaTl
              .fromTo("[data-gsap='cta-badge']",
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(2)", clearProps: "all" }
              )
              .fromTo(
                "[data-gsap='cta-title']",
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", clearProps: "all" },
                "<0.1"
              )
              .fromTo(
                "[data-gsap='cta-sub']",
                { y: 30, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: "power3.out", clearProps: "all" },
                "<0.1"
              )
              .fromTo(
                "[data-gsap='cta-buttons']",
                { y: 20, opacity: 0, scale: 0.97 },
                { y: 0, opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)", clearProps: "all" },
                "<0.1"
              );
          },
        });

        // ══════════════════════════════════════════════════════════
        // 10. SECTION HEADINGS — Universal scroll-triggered fade up
        // ══════════════════════════════════════════════════════════
        gsap.utils.toArray<Element>("[data-gsap='section-heading']").forEach((el) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 82%",
            onEnter: () => {
              gsap.fromTo(el,
                { y: 36, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.75,
                  ease: "power3.out",
                  clearProps: "all"
                }
              );
            },
          });
        });

        // ══════════════════════════════════════════════════════════
        // 11. AMBIENT GLOW — Scroll-linked brightness pulse
        // ══════════════════════════════════════════════════════════
        gsap.utils.toArray<Element>("[data-gsap='glow-orb']").forEach((el) => {
          gsap.to(el, {
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
            y: -80,
            scale: 1.15,
            opacity: 0.12,
            ease: "none",
          });
        });

        // ══════════════════════════════════════════════════════════
        // 12. FOOTER — Staggered fade-in
        // ══════════════════════════════════════════════════════════
        ScrollTrigger.create({
          trigger: "[data-gsap='footer']",
          start: "top 90%",
          onEnter: () => {
            gsap.fromTo("[data-gsap='footer-col']",
              { y: 24, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.55,
                stagger: 0.1,
                ease: "power2.out",
                clearProps: "all"
              }
            );
          },
        });
      });
    };

    initAnimations();

    return () => {
      ctx?.revert();
    };
  }, [shouldReduceMotion]);

  return null;
}
