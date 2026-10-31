"use client";

import React, { useState } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { ArchitectureVisualizer } from "../components/ArchitectureVisualizer";
import { FutureStockStudio } from "../components/FutureStockStudio";
import { QuantStudio } from "../components/QuantStudio";
import { CaseStudies } from "../components/CaseStudies";
import { TokenEconomyMatrix } from "../components/TokenEconomyMatrix";
import { ApiDocsExplorer } from "../components/ApiDocsExplorer";
import { PreAcceleratorRoadmap } from "../components/PreAcceleratorRoadmap";
import { CommandPalette } from "../components/CommandPalette";
import { Footer } from "../components/Footer";

export default function Home() {
  const [activeModule, setActiveModule] = useState<"FUTURESTOCK" | "CATALYST">("FUTURESTOCK");
  const [activePrompt, setActivePrompt] = useState<string>("");
  const [activePresetId, setActivePresetId] = useState<string>("biogen_fda");
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  const handleHeroSelect = (promptText: string, presetId?: string) => {
    setActivePrompt(promptText);
    if (presetId) {
      setActivePresetId(presetId);
    }
    setActiveModule("CATALYST");
    const studioEl = document.getElementById("studio");
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFutureStockHeroTicker = (ticker: string) => {
    setActiveModule("FUTURESTOCK");
    const futureEl = document.getElementById("futurestock");
    if (futureEl) {
      futureEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLoadCase = (presetId: string) => {
    setActivePresetId(presetId);
    setActiveModule("CATALYST");
    const studioEl = document.getElementById("studio");
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleModuleChange = (mod: "FUTURESTOCK" | "CATALYST") => {
    setActiveModule(mod);
    const targetId = mod === "FUTURESTOCK" ? "futurestock" : "studio";
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleNavigateSection = (sectionId: string) => {
    if (sectionId === "futurestock") {
      setActiveModule("FUTURESTOCK");
    } else if (sectionId === "studio") {
      setActiveModule("CATALYST");
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#090D12] text-[#E6EDF3]">
      <Header
        activeModule={activeModule}
        onSelectModule={handleModuleChange}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      <Hero
        onSelectPrompt={handleHeroSelect}
        onSelectFutureStockTicker={handleFutureStockHeroTicker}
      />

      {/* Module Selector Banner */}
      <section className="border-b border-[#1E2C3D] bg-[#0A1017] py-4 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-xs font-mono text-[#8B949E]">
            <span className="text-white font-bold">PLATFORM RESEARCH SUITE:</span>
            <span>Switch active execution environment below</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleModuleChange("FUTURESTOCK")}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-mono font-bold transition-all ${
                activeModule === "FUTURESTOCK"
                  ? "bg-[#00C4CC] text-[#070B10] shadow-md shadow-[#00C4CC]/20"
                  : "border border-[#1E2C3D] bg-[#0F1722] text-[#8B949E] hover:text-white"
              }`}
            >
              <span>🔮</span>
              <span>FutureStock Terminal</span>
              <span className="rounded bg-black/20 px-1 py-0.2 text-[9px]">NEW</span>
            </button>
            <button
              onClick={() => handleModuleChange("CATALYST")}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-mono font-bold transition-all ${
                activeModule === "CATALYST"
                  ? "bg-[#00C4CC] text-[#070B10] shadow-md shadow-[#00C4CC]/20"
                  : "border border-[#1E2C3D] bg-[#0F1722] text-[#8B949E] hover:text-white"
              }`}
            >
              <span>📈</span>
              <span>Catalyst Event Studies</span>
            </button>
          </div>
        </div>
      </section>

      {/* Primary FutureStock Terminal */}
      <FutureStockStudio />

      {/* Architecture Visualizer */}
      <ArchitectureVisualizer />

      {/* Catalyst Quant Studio */}
      <QuantStudio initialPrompt={activePrompt} initialPresetId={activePresetId} />

      {/* Benchmark Case Studies */}
      <CaseStudies onLoadCase={handleLoadCase} />

      {/* Token Economy ROI Matrix */}
      <TokenEconomyMatrix />

      {/* Interactive Developer API & SDK Explorer */}
      <ApiDocsExplorer />

      {/* Pre-Accelerator Roadmap */}
      <PreAcceleratorRoadmap />

      {/* Footer */}
      <Footer />

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTicker={(ticker) => {
          handleFutureStockHeroTicker(ticker);
        }}
        onSelectCase={(caseId) => {
          handleLoadCase(caseId);
        }}
        onNavigateSection={handleNavigateSection}
      />
    </main>
  );
}
