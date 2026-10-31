"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, ShieldCheck, Database, Cpu, CheckCircle2, TrendingUp, Activity, Terminal } from "lucide-react";
import { POPULAR_TICKERS } from "../lib/futurestock-data";

interface HeroProps {
  onSelectPrompt: (promptText: string, presetId?: string) => void;
  onSelectFutureStockTicker?: (ticker: string) => void;
}

export function Hero({ onSelectPrompt, onSelectFutureStockTicker }: HeroProps) {
  const [customInput, setCustomInput] = useState(
    "Analyze NVIDIA (NVDA) Blackwell demand, Monte Carlo price targets & 3-stage DCF intrinsic fair value"
  );

  const sampleTriggers = [
    { label: "🔮 NVDA Blackwell Quant Target", type: "FUTURESTOCK", ticker: "NVDA" },
    { label: "🔮 ZOMATO.NS Quick Commerce Turnaround", type: "FUTURESTOCK", ticker: "ZOMATO.NS" },
    { label: "📈 Biogen FDA AdCom CAR ($BIIB)", type: "CATALYST", id: "biogen_fda" },
    { label: "📈 CrowdStrike IT Outage Shock ($CRWD)", type: "CATALYST", id: "crowdstrike_outage" },
    { label: "📈 Tesla SEC 8-K Restructure ($TSLA)", type: "CATALYST", id: "tesla_8k" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customInput.toUpperCase().includes("NVDA") || customInput.toUpperCase().includes("ZOMATO") || customInput.toUpperCase().includes("AAPL")) {
      const match = POPULAR_TICKERS.find((t) => customInput.toUpperCase().includes(t.ticker));
      if (match && onSelectFutureStockTicker) {
        onSelectFutureStockTicker(match.ticker);
      }
      const el = document.getElementById("futurestock");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      onSelectPrompt(customInput);
      const el = document.getElementById("studio");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-14 md:pt-16 md:pb-20 border-b border-[#1E2C3D]">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#00C4CC]/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[250px] bg-[#0A84FF]/10 blur-[110px] pointer-events-none rounded-full" />

      {/* Live Market Ticker Ribbon */}
      <div className="mb-6 overflow-hidden border-y border-[#1E2C3D]/60 bg-[#070B10]/80 py-2">
        <div className="flex items-center space-x-6 text-xs font-mono animate-none overflow-x-auto px-4 justify-start sm:justify-center">
          <span className="text-[#8B949E] uppercase font-bold text-[10px] tracking-wider whitespace-nowrap">
            LIVE BENCHMARKS:
          </span>
          {POPULAR_TICKERS.slice(0, 6).map((item) => (
            <div key={item.ticker} className="flex items-center space-x-1.5 whitespace-nowrap">
              <span className="font-bold text-white">{item.ticker}</span>
              <span className="text-[#8B949E]">({item.currency})</span>
              <span className="text-[#00C4CC] font-semibold">{item.price}</span>
              <span className="text-[10px] text-[#10B981]">Vol: {(item.volatility * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 text-center">
        {/* Track Badge */}
        <div className="inline-flex items-center space-x-2 rounded-full border border-[#00C4CC]/30 bg-[#00C4CC]/10 px-3.5 py-1 text-xs text-[#00C4CC] font-mono mb-5 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" />
          <span>Swim With TinyFish Hackathon &bull; $2M Pre-Accelerator Track &bull; Dual-Engine Quant Lab</span>
        </div>

        {/* Primary Heading */}
        <h1 className="mx-auto max-w-5xl text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.12]">
          Autonomous AI Stock Intelligence &amp;{" "}
          <span className="bg-gradient-to-r from-[#00C4CC] via-[#38BDF8] to-[#818CF8] bg-clip-text text-transparent">
            Deterministic Quantitative
          </span>{" "}
          Research Engine
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-5 max-w-3xl text-sm sm:text-base md:text-lg text-[#8B949E] leading-relaxed">
          TinyFish serverless web agents scrape primary investor filings with <strong className="text-white font-semibold">85%+ token compression</strong>;
          deterministic Python &amp; WebAssembly execute <strong className="text-white font-semibold">2,000-path Monte Carlo simulations, 3-stage DCF, and statistical event studies</strong>.
          Zero look-ahead drift. Zero mathematical hallucinations.
        </p>

        {/* Interactive Prompt Dispatcher */}
        <div className="mx-auto mt-8 max-w-3xl">
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
                placeholder="Enter company ticker or catalyst inquiry (e.g. NVDA, ZOMATO.NS, BIIB, CRWD)..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-[#484F58] focus:outline-none font-mono"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto whitespace-nowrap flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-[#00C4CC] to-[#00A3AA] px-5 py-2.5 text-xs font-bold text-[#090D12] hover:brightness-110 active:scale-[0.98] transition-all shadow-md shadow-[#00C4CC]/20"
            >
              <span>Dispatch Research</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>

          {/* Quick Triggers */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-[#6E7681]">Presets:</span>
            {sampleTriggers.map((t, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (t.type === "FUTURESTOCK" && t.ticker && onSelectFutureStockTicker) {
                    onSelectFutureStockTicker(t.ticker);
                    const el = document.getElementById("futurestock");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  } else if (t.id) {
                    onSelectPrompt(t.label, t.id);
                    const el = document.getElementById("studio");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="rounded-md border border-[#1E2C3D] bg-[#16202E]/60 px-2.5 py-1 font-mono text-[11px] text-[#C9D1D9] hover:border-[#00C4CC]/50 hover:text-[#00C4CC] hover:bg-[#16202E] transition-all"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dual Engine CTA Buttons */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#futurestock"
            className="flex items-center space-x-2 rounded-lg bg-[#00C4CC] px-4 py-2 text-xs font-bold text-[#090D12] hover:brightness-110 transition-all shadow-md shadow-[#00C4CC]/20"
          >
            <span>🔮 Launch FutureStock Terminal</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
          <a
            href="#studio"
            className="flex items-center space-x-2 rounded-lg border border-[#1E2C3D] bg-[#0E1520] px-4 py-2 text-xs font-bold text-[#C9D1D9] hover:border-[#2A3F58] hover:text-white transition-all"
          >
            <span>📈 Launch Catalyst Event Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* 3 Core Architectures Bar */}
        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722]/70 p-4 text-left">
            <div className="flex items-center space-x-2 text-[#00C4CC] mb-2">
              <Cpu className="h-4 w-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">TinyFish DOM Scraper</span>
            </div>
            <p className="text-xs text-[#8B949E] leading-normal">
              Serverless Chromium browsers render dynamic JavaScript, extract audited filing text, and save 85%+ LLM context tokens.
            </p>
          </div>

          <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722]/70 p-4 text-left">
            <div className="flex items-center space-x-2 text-[#10B981] mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">8-Agent Quant Collective</span>
            </div>
            <p className="text-xs text-[#8B949E] leading-normal">
              Orchestrator, Financial Analyst, 2,000-path Monte Carlo GBM, 3-stage DCF, Analog review, Adversarial risk, and Verifier.
            </p>
          </div>

          <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722]/70 p-4 text-left">
            <div className="flex items-center space-x-2 text-[#FFBE5C] mb-2">
              <Database className="h-4 w-4" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider">Verified Return Formula</span>
            </div>
            <p className="text-xs text-[#8B949E] leading-normal">
              Strict mathematical target validation (<code>Return = ((Target/Ref) - 1)*100</code>) with zero look-ahead timestamp drift.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
