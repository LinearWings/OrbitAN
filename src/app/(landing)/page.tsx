"use client";

import { useEffect, useState } from "react";
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

function SectionTransition() {
  return <div className="l-section-transition" aria-hidden="true" />;
}

function useActiveSection(ids: string[]) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const idx = ids.indexOf(entry.target.id);
            if (idx >= 0) setIndex(idx);
          }
        }
      },
      { threshold: [0.3] }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [ids]);
  return index;
}

const SECTION_IDS = ["hero", "features", "methods", "focus", "keyboard", "cta"];

export default function LandingPage() {
  const sectionIndex = useActiveSection(SECTION_IDS);

  return (
    <div className="landing">
      <ScrollProgressBar />
      <LandingLightEffects sectionIndex={sectionIndex} />
      {/* Tyndall light beams */}
      <div className="l-tyndall" style={{ left: "15%", animationDelay: "0s" }} />
      <div className="l-tyndall" style={{ left: "45%", animationDelay: "7s", background: "linear-gradient(180deg,transparent,rgba(245,158,11,.03),rgba(99,102,241,.02),transparent)" }} />
      <div className="l-tyndall" style={{ left: "78%", animationDelay: "13s" }} />
      <LandingNav />

      <div id="hero" className="l-section-wrap"><HeroSection /></div>

      <SectionTransition />
      <div id="features" className="l-section-wrap"><OrbitEngineDemo /></div>

      <SectionTransition />
      <div id="methods" className="l-section-wrap"><MethodologyCards /></div>

      <SectionTransition />
      <div id="focus" className="l-section-wrap"><FocusBlocksDemo /></div>

      <SectionTransition />
      <div id="keyboard" className="l-section-wrap"><KeyboardNav /></div>

      <SectionTransition />
      <div id="cta" className="l-section-wrap"><CTASection /></div>

      <SectionTransition />
      <LandingFooter />
    </div>
  );
}
