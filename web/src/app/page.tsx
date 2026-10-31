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
    <main className="flex min-h-screen flex-col bg-[#070B10] text-[#E6EDF3]">
      <Header
        activeModule={activeModule}
        onSelectModule={handleModuleChange}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      <Hero
        onSelectPrompt={handleHeroSelect}
        onSelectFutureStockTicker={handleFutureStockHeroTicker}
      />

      {/* Sleek Active Workspace Segmented Bar */}
      <section className="sticky top-[75px] z-30 border-b border-[#1E2C3D] bg-[#070B10]/95 backdrop-blur-md py-2.5 px-4 sm:px-6 shadow-lg shadow-black/40">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5 text-xs font-mono text-[#8B949E]">
            <span className="flex h-2 w-2 rounded-full bg-[#00C4CC] animate-pulse"></span>
            <span className="text-white font-bold tracking-wide">ACTIVE ENGINE:</span>
            <span className="text-[#C9D1D9]">
              {activeModule === "FUTURESTOCK"
                ? "Autonomous Multi-Agent Forecasting & Monte Carlo Simulation"
                : "Event-Study Abnormal Returns (CAR) & OLS Backtesting"}
            </span>
          </div>

          <div className="flex items-center rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-1 shadow-sm">
            <button
              onClick={() => handleModuleChange("FUTURESTOCK")}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-mono font-bold transition-all ${
                activeModule === "FUTURESTOCK"
                  ? "bg-[#00C4CC] text-[#070B10] shadow-sm shadow-[#00C4CC]/30"
                  : "text-[#8B949E] hover:text-white"
              }`}
            >
              <span>🔮</span>
              <span>FutureStock Terminal</span>
              <span className="rounded bg-black/25 px-1.5 py-0.2 text-[9px] font-sans font-semibold">
                8 AGENTS
              </span>
            </button>
            <button
              onClick={() => handleModuleChange("CATALYST")}
              className={`flex items-center space-x-2 rounded-lg px-3.5 py-1.5 text-xs font-mono font-bold transition-all ${
                activeModule === "CATALYST"
                  ? "bg-[#00C4CC] text-[#070B10] shadow-sm shadow-[#00C4CC]/30"
                  : "text-[#8B949E] hover:text-white"
              }`}
            >
              <span>📈</span>
              <span>Catalyst Event Studies</span>
              <span className="rounded bg-black/25 px-1.5 py-0.2 text-[9px] font-sans font-semibold">
                CAR / OLS
              </span>
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
