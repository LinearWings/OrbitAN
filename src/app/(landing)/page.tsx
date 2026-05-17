"use client";

import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { OrbitEngineDemo } from "@/components/landing/OrbitEngineDemo";
import { MethodologyCards } from "@/components/landing/MethodologyCards";
import { FocusBlocksDemo } from "@/components/landing/FocusBlocksDemo";
import { KeyboardNav } from "@/components/landing/KeyboardNav";
import { CTASection } from "@/components/landing/CTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { DecorativeArrow } from "@/components/landing/DecorativeArrow";

function SectionArrow({ color = "rgba(59,130,246,.08)" }: { color?: string }) {
  return (
    <div className="l-section-arrow" aria-hidden="true">
      <DecorativeArrow dir="right-down" color={color} scale={0.8} />
      <DecorativeArrow dir="right-up" color={color} scale={0.6} />
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="landing">
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
