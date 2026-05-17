"use client";

import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { OrbitEngineDemo } from "@/components/landing/OrbitEngineDemo";
import { MethodologyCards } from "@/components/landing/MethodologyCards";
import { FocusBlocksDemo } from "@/components/landing/FocusBlocksDemo";
import { KeyboardNav } from "@/components/landing/KeyboardNav";
import { CTASection } from "@/components/landing/CTASection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="landing">
      <LandingNav />
      <HeroSection />
      <OrbitEngineDemo />
      <MethodologyCards />
      <FocusBlocksDemo />
      <KeyboardNav />
      <CTASection />
      <LandingFooter />
    </div>
  );
}
