"use client";

import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { OrbitEngineDemo } from "@/components/landing/OrbitEngineDemo";
import { MethodologyCards } from "@/components/landing/MethodologyCards";
import { FocusBlocksDemo } from "@/components/landing/FocusBlocksDemo";
import { KeyboardNav } from "@/components/landing/KeyboardNav";
import { CTASection } from "@/components/landing/CTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingLightEffects } from "@/components/landing/LandingLightEffects";
import { ScrollProgressBar } from "@/components/landing/ScrollProgressBar";
import { DecorativeArrow } from "@/components/landing/DecorativeArrow";
import { useReveal } from "@/hooks/useScrollProgress";

function SectionArrow({ color = "rgba(59,130,246,.08)" }: { color?: string }) {
  const { ref, visible } = useReveal(0.3);
  return (
    <div
      ref={ref}
      className={`l-section-arrow${visible ? " l-section-arrow-active" : ""}`}
      aria-hidden="true"
    >
      <DecorativeArrow dir="right-down" color={color} scale={0.8} />
      <DecorativeArrow dir="right-up" color={color} scale={0.6} />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="landing">
      <ScrollProgressBar />
      <LandingLightEffects />
      <LandingNav />
      <HeroSection />

      <SectionArrow />
      <OrbitEngineDemo />

      <SectionArrow color="rgba(99,102,241,.08)" />
      <MethodologyCards />

      <SectionArrow color="rgba(245,158,11,.06)" />
      <FocusBlocksDemo />

      <SectionArrow color="rgba(59,130,246,.08)" />
      <KeyboardNav />

      <SectionArrow color="rgba(99,102,241,.06)" />
      <CTASection />

      <SectionArrow color="rgba(245,158,11,.05)" />
      <LandingFooter />
    </div>
  );
}
