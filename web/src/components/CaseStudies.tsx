"use client";

import React, { useState } from "react";
import { ArrowUpRight, ShieldAlert, Cpu, FileSpreadsheet, ExternalLink, Zap } from "lucide-react";
import { PRESET_CASES } from "../lib/presets";

interface CaseStudiesProps {
  onLoadCase: (presetId: string) => void;
}

export function CaseStudies({ onLoadCase }: CaseStudiesProps) {
  const [activeCaseId, setActiveCaseId] = useState<string>("biogen_fda");
  const activeCase = PRESET_CASES.find((c) => c.id === activeCaseId) || PRESET_CASES[0];

  return (
    <section id="case-studies" className="py-16 md:py-24 border-b border-[#1E2C3D] bg-[#090D12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-[#1E2C3D] bg-[#0F1722] px-3 py-1 text-xs font-mono text-[#8B949E] mb-3">
            <span>BENCHMARK DATASETS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Historical Catalyst Case Studies
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8B949E]">
            Empirical validation across high-impact regulatory decisions, systemic IT outages, and SEC filings.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {PRESET_CASES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCaseId(c.id)}
              className={`rounded-xl px-4 py-2 text-xs font-mono font-medium transition-all ${
                activeCaseId === c.id
                  ? "border border-[#00C4CC] bg-[#00C4CC]/10 text-[#00C4CC] font-bold shadow-md shadow-[#00C4CC]/10"
                  : "border border-[#1E2C3D] bg-[#0F1722] text-[#8B949E] hover:border-[#2A3F58] hover:text-white"
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {/* Active Case Deep Dive Card */}
        <div className="rounded-2xl border border-[#1E2C3D] bg-[#0F1722] p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center space-x-2">
                <span className="rounded bg-[#00C4CC]/20 text-[#00C4CC] px-2.5 py-0.5 text-xs font-mono font-bold">
                  ${activeCase.ticker} vs {activeCase.benchmarkTicker}
                </span>
                <span className="text-xs text-[#8B949E] font-mono">
                  DISCLOSURE DATE: {activeCase.eventDate}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white leading-snug">
                {activeCase.headline}
              </h3>

              <div className="rounded-lg border-l-4 border-[#00C4CC] bg-[#090D12] p-4 text-xs italic text-[#C9D1D9]">
                &ldquo;{activeCase.verbatimExcerpt}&rdquo;
              </div>

              <div className="space-y-2 text-xs text-[#8B949E]">
                <p>
                  <strong className="text-white">Audited Source Link: </strong>
                  <a
                    href={activeCase.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#38BDF8] hover:underline break-all inline-flex items-center space-x-1"
                  >
                    <span>{activeCase.sourceUrl}</span>
                    <ExternalLink className="h-3 w-3 inline" />
                  </a>
                </p>
                <p>
                  <strong className="text-white">Zero Look-Ahead Proof: </strong>
                  Official release timestamp locked at {activeCase.eventDateUtc}. Backtest event horizon is locked to market trading sessions immediately following release.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onLoadCase(activeCase.id)}
                  className="inline-flex items-center space-x-2 rounded-lg bg-[#00C4CC] px-4 py-2 text-xs font-bold text-[#090D12] hover:brightness-110 transition-all shadow-md shadow-[#00C4CC]/20"
                >
                  <Zap className="h-3.5 w-3.5 fill-current" />
                  <span>Load Into Quant Studio</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between rounded-xl border border-[#1E2C3D] bg-[#090D12] p-5 font-mono text-xs space-y-4">
              <div className="border-b border-[#1E2C3D] pb-3">
                <span className="text-[#8B949E] text-[10px] block">TINYFISH TOKEN EFFICIENCY</span>
                <span className="text-xl font-bold text-[#10B981]">
                  {activeCase.tokenSavingsPct}% TOKENS SAVED
                </span>
                <span className="text-[11px] text-[#6E7681] block mt-0.5">
                  {(activeCase.rawHtmlBytes / 1000).toFixed(0)} KB HTML &rarr; {(activeCase.cleanMarkdownBytes / 1000).toFixed(1)} KB Markdown
                </span>
              </div>

              <div>
                <span className="text-[#8B949E] text-[10px] block mb-1">EMPIRICAL HYPOTHESIS H0:</span>
                <p className="text-[#C9D1D9] text-[11px] leading-relaxed">
                  {activeCase.nullHypothesisH0}
                </p>
              </div>

              <div className="border-t border-[#1E2C3D] pt-3">
                <span className="text-[#8B949E] text-[10px] block mb-1">ALTERNATIVE HYPOTHESIS H1:</span>
                <p className="text-[#10B981] text-[11px] leading-relaxed">
                  {activeCase.alternativeHypothesisH1}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
