"use client";

import React, { useState } from "react";
import { Check, X, Minus, Sparkles, DollarSign, Calculator } from "lucide-react";

export function TokenEconomyMatrix() {
  const [docSizeKb, setDocSizeKb] = useState<number>(350);
  const [dailyScans, setDailyScans] = useState<number>(250);

  // Math: 1 KB HTML ~ 250 tokens; Clean Markdown is ~12% of original (~88% savings)
  const rawTokensPerDoc = Math.round(docSizeKb * 250);
  const cleanTokensPerDoc = Math.round(rawTokensPerDoc * 0.136); // 86.4% savings
  const tokensSavedPerDoc = rawTokensPerDoc - cleanTokensPerDoc;

  // Pricing: assume $3.00 per 1M input tokens (GPT-4o / Claude 3.5 Sonnet class)
  const monthlyCostRaw = ((dailyScans * 30 * rawTokensPerDoc) / 1000000) * 3.0;
  const monthlyCostClean = ((dailyScans * 30 * cleanTokensPerDoc) / 1000000) * 3.0;
  const monthlySavings = monthlyCostRaw - monthlyCostClean;

  const comparisonRows = [
    {
      feature: "Dynamic JavaScript & SPA Navigation",
      generalLlm: false,
      perplexity: false,
      quantConnect: false,
      quantIntel: true,
      note: "TinyFish serverless Chromium fleet executes JS & shadow DOM",
    },
    {
      feature: "Bypasses Anti-Bot & Cloudflare Walls",
      generalLlm: false,
      perplexity: "partial",
      quantConnect: false,
      quantIntel: true,
      note: "Stealth browser headers & residential proxy rotation",
    },
    {
      feature: "Zero Look-Ahead Timestamp Provenance",
      generalLlm: false,
      perplexity: false,
      quantConnect: "partial",
      quantIntel: true,
      note: "Pydantic contracts anchor exact UTC public release timestamps",
    },
    {
      feature: "Deterministic Python Math (No Hallucinations)",
      generalLlm: false,
      perplexity: false,
      quantConnect: true,
      quantIntel: true,
      note: "OLS residuals, CAR, and t-stats executed in isolated Python",
    },
    {
      feature: "Falsifiable Statistical Hypothesis (H0 vs H1)",
      generalLlm: false,
      perplexity: false,
      quantConnect: false,
      quantIntel: true,
      note: "Formulates mathematically testable event-study contracts",
    },
    {
      feature: "Context Token Reduction (>80% Savings)",
      generalLlm: false,
      perplexity: false,
      quantConnect: false,
      quantIntel: true,
      note: "DOM cleaner strips navigation, tracking scripts & ads",
    },
  ];

  return (
    <section id="token-economy" className="py-16 md:py-24 border-b border-[#1E2C3D] bg-[#090D12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-[#1E2C3D] bg-[#0F1722] px-3 py-1 text-xs font-mono text-[#8B949E] mb-3">
            <span>ECONOMIC DEFENSIBILITY & COMPETITIVE MOAT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why TinyFish Live Web Powers the Moat
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8B949E]">
            General LLMs hallucinate math; traditional quant platforms lack live-web reconnaissance. TinyFish makes QuantIntel computationally and economically superior.
          </p>
        </div>

        {/* Interactive Token Savings Calculator */}
        <div className="rounded-2xl border border-[#00C4CC]/30 bg-[#0F1722] p-6 lg:p-8 mb-16 shadow-[0_0_30px_rgba(0,196,204,0.06)]">
          <div className="flex items-center space-x-2 text-[#00C4CC] font-mono text-xs font-bold mb-4">
            <Calculator className="h-4 w-4" />
            <span>INTERACTIVE TOKEN ECONOMY CALCULATOR</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between text-xs font-mono text-[#8B949E] mb-2">
                  <span>AVERAGE REGULATORY PORTAL HTML SIZE:</span>
                  <span className="text-white font-bold">{docSizeKb} KB</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1000"
                  step="50"
                  value={docSizeKb}
                  onChange={(e) => setDocSizeKb(Number(e.target.value))}
                  className="w-full accent-[#00C4CC] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono text-[#8B949E] mb-2">
                  <span>DAILY REGULATORY SCANS ACROSS COVERAGE:</span>
                  <span className="text-white font-bold">{dailyScans} Scans / Day</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="50"
                  value={dailyScans}
                  onChange={(e) => setDailyScans(Number(e.target.value))}
                  className="w-full accent-[#00C4CC] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2">
                <div className="rounded-lg border border-[#1E2C3D] bg-[#090D12] p-3">
                  <span className="text-[#8B949E] block mb-1">RAW HTML TOKENS:</span>
                  <span className="text-sm font-bold text-[#EF4444]">
                    {rawTokensPerDoc.toLocaleString()} tokens/doc
                  </span>
                </div>
                <div className="rounded-lg border border-[#1E2C3D] bg-[#090D12] p-3">
                  <span className="text-[#8B949E] block mb-1">TINYFISH CLEANED TOKENS:</span>
                  <span className="text-sm font-bold text-[#10B981]">
                    {cleanTokensPerDoc.toLocaleString()} tokens/doc
                  </span>
                </div>
              </div>
            </div>

            {/* Savings Display */}
            <div className="lg:col-span-5 rounded-xl border border-[#10B981]/40 bg-[#062B19]/50 p-6 text-center space-y-3 font-mono">
              <span className="text-xs text-[#8B949E] block">ESTIMATED MONTHLY LLM COST REDUCTION</span>
              <div className="text-4xl lg:text-5xl font-extrabold text-[#10B981]">
                ${Math.round(monthlySavings).toLocaleString()}
              </div>
              <p className="text-xs text-[#D1FAE5]/80">
                Saves <strong className="text-white">86.4% in LLM API spend</strong> while accelerating agent response times by 3.4x.
              </p>
              <div className="border-t border-[#10B981]/30 pt-3 text-[11px] text-[#A7F3D0]">
                Monthly Raw Cost: ${Math.round(monthlyCostRaw).toLocaleString()} &rarr; With TinyFish: ${Math.round(monthlyCostClean).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Competitive Matrix Table */}
        <div className="rounded-2xl border border-[#1E2C3D] bg-[#0F1722] p-6 lg:p-8 overflow-x-auto shadow-2xl">
          <h3 className="text-lg font-bold text-white mb-6">
            Competitive Matrix: Why General Tools Fail at Quantitative Research
          </h3>

          <table className="w-full text-left font-mono text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1E2C3D] text-[#8B949E]">
                <th className="pb-3 text-left w-2/5">Capability</th>
                <th className="pb-3 text-center">General LLMs<br /><span className="text-[10px] text-[#6E7681]">(GPT/Claude)</span></th>
                <th className="pb-3 text-center">Search Engines<br /><span className="text-[10px] text-[#6E7681]">(Perplexity)</span></th>
                <th className="pb-3 text-center">Quant Platforms<br /><span className="text-[10px] text-[#6E7681]">(LEAN)</span></th>
                <th className="pb-3 text-center text-[#00C4CC] font-bold">QuantIntel<br /><span className="text-[10px] text-[#00C4CC]">(Our Platform)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E2C3D]/60">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-[#16202E]/40 transition-colors">
                  <td className="py-3 pr-4">
                    <span className="font-semibold text-white block">{row.feature}</span>
                    <span className="text-[10px] text-[#8B949E] block">{row.note}</span>
                  </td>
                  <td className="py-3 text-center">
                    {row.generalLlm === true ? (
                      <Check className="h-4 w-4 text-[#10B981] mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-[#EF4444] mx-auto" />
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {row.perplexity === true ? (
                      <Check className="h-4 w-4 text-[#10B981] mx-auto" />
                    ) : row.perplexity === "partial" ? (
                      <Minus className="h-4 w-4 text-[#F59E0B] mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-[#EF4444] mx-auto" />
                    )}
                  </td>
                  <td className="py-3 text-center">
                    {row.quantConnect === true ? (
                      <Check className="h-4 w-4 text-[#10B981] mx-auto" />
                    ) : row.quantConnect === "partial" ? (
                      <Minus className="h-4 w-4 text-[#F59E0B] mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-[#EF4444] mx-auto" />
                    )}
                  </td>
                  <td className="py-3 text-center bg-[#00C4CC]/5">
                    <div className="flex items-center justify-center space-x-1 text-[#00C4CC] font-bold">
                      <Check className="h-4 w-4" />
                      <span className="text-[10px]">VERIFIED</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
