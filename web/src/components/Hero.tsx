"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Database, Cpu, CheckCircle2 } from "lucide-react";

interface HeroProps {
  onSelectPrompt: (promptText: string, presetId?: string) => void;
}

export function Hero({ onSelectPrompt }: HeroProps) {
  const [customInput, setCustomInput] = useState(
    "Investigate FDA advisory committee unanimous vote on Biogen ($BIIB) Leqembi approval on June 9, 2023 vs XBI"
  );

  const sampleTriggers = [
    { label: "Biogen FDA Approval ($BIIB)", id: "biogen_fda" },
    { label: "CrowdStrike Global Outage ($CRWD)", id: "crowdstrike_outage" },
    { label: "Tesla SEC 8-K Restructure ($TSLA)", id: "tesla_8k" },
    { label: "NVIDIA Blackwell GPU Keynote ($NVDA)", id: "nvidia_blackwell" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSelectPrompt(customInput);
    const studioEl = document.getElementById("studio");
    if (studioEl) {
      studioEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-[#1E2C3D]">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-[#00C4CC]/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-[#0A84FF]/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
        {/* Track Badge */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-[#00C4CC]/30 bg-[#00C4CC]/10 px-3.5 py-1 text-xs text-[#00C4CC] font-mono mb-6">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Swim With TinyFish Hackathon &bull; $2M Pre-Accelerator Golden Ticket Entry</span>
        </div>

        {/* Primary Heading */}
        <h1 className="mx-auto max-w-5xl text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
          Turn Unstructured Live Web Disclosures Into{" "}
          <span className="bg-gradient-to-r from-[#00C4CC] via-[#38BDF8] to-[#818CF8] bg-clip-text text-transparent">
            Statistically Validated
          </span>{" "}
          Quantitative Hypotheses
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-6 max-w-3xl text-base sm:text-lg text-[#8B949E] leading-relaxed">
          The AI web agent discovers regulatory evidence and frames falsifiable statistical hypotheses;{" "}
          <strong className="text-white font-medium">deterministic Python executes the math</strong>. Zero look-ahead bias.
          Zero mathematical hallucination. 100% source-grounded provenance.
        </p>

        {/* Interactive Prompt Dispatcher */}
        <div className="mx-auto mt-9 max-w-3xl">
          <form
            onSubmit={handleSubmit}
            className="group relative flex flex-col sm:flex-row items-center gap-2 rounded-xl border border-[#1E2C3D] bg-[#0F1722]/90 p-2 shadow-2xl backdrop-blur-xl focus-within:border-[#00C4CC] focus-within:shadow-[0_0_30px_rgba(0,196,204,0.15)] transition-all"
          >
            <div className="flex w-full items-center pl-3">
              <span className="text-[#00C4CC] font-mono text-sm mr-2 font-bold">&gt;</span>
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Enter corporate disclosure, SEC 8-K, or FDA docket inquiry..."
                className="w-full bg-transparent text-sm text-white placeholder-[#484F58] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto whitespace-nowrap flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-[#00C4CC] to-[#00A3AA] px-5 py-2.5 text-xs font-bold text-[#090D12] hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-[#00C4CC]/20"
            >
              <span>Dispatch Agent</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Quick Triggers */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#6E7681]">Or try preset catalyst:</span>
            {sampleTriggers.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectPrompt(t.label, t.id)}
                className="rounded-md border border-[#1E2C3D] bg-[#16202E]/60 px-2.5 py-1 font-mono text-[11px] text-[#C9D1D9] hover:border-[#00C4CC]/50 hover:text-[#00C4CC] hover:bg-[#16202E] transition-all"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Value Proposition Highlights */}
        <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722]/60 p-4 text-left">
            <div className="flex items-center space-x-2 text-[#00C4CC] mb-2">
              <Cpu className="h-4 w-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">TinyFish Live Web Fleet</span>
            </div>
            <p className="text-xs text-[#8B949E] leading-normal">
              Serverless Chromium browsers render dynamic JavaScript, traverse pagination, and bypass anti-bot walls on regulatory portals.
            </p>
          </div>

          <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722]/60 p-4 text-left">
            <div className="flex items-center space-x-2 text-[#10B981] mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Zero Look-Ahead Drift</span>
            </div>
            <p className="text-xs text-[#8B949E] leading-normal">
              Strict Pydantic data contracts lock exact public release UTC timestamps, preventing forward-looking bias in historical backtests.
            </p>
          </div>

          <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722]/60 p-4 text-left">
            <div className="flex items-center space-x-2 text-[#F59E0B] mb-2">
              <Database className="h-4 w-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Campbell-Lo-MacKinlay Math</span>
            </div>
            <p className="text-xs text-[#8B949E] leading-normal">
              Empirical market model OLS regression yields deterministic Cumulative Abnormal Returns (CAR), t-statistics, and p-values.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
