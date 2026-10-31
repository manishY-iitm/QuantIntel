"use client";

import React, { useState } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { ArchitectureVisualizer } from "../components/ArchitectureVisualizer";
import { QuantStudio } from "../components/QuantStudio";
import { CaseStudies } from "../components/CaseStudies";
import { TokenEconomyMatrix } from "../components/TokenEconomyMatrix";
import { PreAcceleratorRoadmap } from "../components/PreAcceleratorRoadmap";
import { Footer } from "../components/Footer";

export default function Home() {
  const [activePrompt, setActivePrompt] = useState<string>("");
  const [activePresetId, setActivePresetId] = useState<string>("biogen_fda");

  const handleHeroSelect = (promptText: string, presetId?: string) => {
    setActivePrompt(promptText);
    if (presetId) {
      setActivePresetId(presetId);
    }
    const studioEl = document.getElementById("studio");
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLoadCase = (presetId: string) => {
    setActivePresetId(presetId);
    const studioEl = document.getElementById("studio");
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#090D12] text-[#E6EDF3]">
      <Header />
      <Hero onSelectPrompt={handleHeroSelect} />
      <ArchitectureVisualizer />
      <QuantStudio initialPrompt={activePrompt} initialPresetId={activePresetId} />
      <CaseStudies onLoadCase={handleLoadCase} />
      <TokenEconomyMatrix />
      <PreAcceleratorRoadmap />
      <Footer />
    </main>
  );
}
