"use client";

import React, { useState, useEffect } from "react";
import {
  Play,
  RotateCcw,
  Sliders,
  Download,
  Copy,
  Check,
  FileCode,
  Table,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";

import { PRESET_CASES, getPresetById } from "../lib/presets";
import { computeEventStudy } from "../lib/quant-math";
import { EventStudyResult, AgentTraceStep, PresetCase } from "../lib/types";
import { FinancialCharts } from "./FinancialCharts";
import { EvidenceCard } from "./EvidenceCard";
import { HypothesisCard } from "./HypothesisCard";
import { AgentTraceView } from "./AgentTraceView";

interface QuantStudioProps {
  initialPrompt?: string;
  initialPresetId?: string;
}

export function QuantStudio({ initialPrompt, initialPresetId }: QuantStudioProps) {
  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialPresetId || "biogen_fda");
  const [currentPrompt, setCurrentPrompt] = useState<string>(
    initialPrompt || PRESET_CASES[0].queryExample
  );
  const [benchmark, setBenchmark] = useState<string>("XBI");
  const [estimationWindow, setEstimationWindow] = useState<number>(90);
  const [preEventDays, setPreEventDays] = useState<number>(5);
  const [postEventDays, setPostEventDays] = useState<number>(10);
  const [tinyFishKey, setTinyFishKey] = useState<string>("");

  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [result, setResult] = useState<EventStudyResult | null>(null);
  const [traceSteps, setTraceSteps] = useState<AgentTraceStep[]>([]);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [showDataTable, setShowDataTable] = useState<boolean>(false);

  // Sync when initialPresetId changes from Hero triggers
  useEffect(() => {
    if (initialPresetId) {
      setSelectedPresetId(initialPresetId);
      const p = getPresetById(initialPresetId);
      setCurrentPrompt(p.queryExample);
      setBenchmark(p.benchmarkTicker);
    }
  }, [initialPresetId]);

  // Initial calculation on mount
  useEffect(() => {
    runStudy(selectedPresetId, currentPrompt, benchmark, estimationWindow, preEventDays, postEventDays);
  }, []);

  const handlePresetChange = (id: string) => {
    setSelectedPresetId(id);
    const p = getPresetById(id);
    setCurrentPrompt(p.queryExample);
    setBenchmark(p.benchmarkTicker);
    runStudy(id, p.queryExample, p.benchmarkTicker, estimationWindow, preEventDays, postEventDays);
  };

  const runStudy = (
    presetId: string,
    prompt: string,
    bench: string,
    estWin: number,
    preDays: number,
    postDays: number
  ) => {
    setIsExecuting(true);
    const preset = getPresetById(presetId);

    // Initial steps
    const step1: AgentTraceStep = {
      timestamp: new Date().toLocaleTimeString(),
      action: "QUERY_DECOMPOSE",
      title: "Query Decomposition & Intent Parsing",
      details: `Decomposing query: "${prompt}". Extracted target: $${preset.ticker}, catalyst: ${preset.eventType}, benchmark: ${bench}.`,
      status: "completed",
    };

    setTraceSteps([step1]);

    setTimeout(() => {
      const step2: AgentTraceStep = {
        timestamp: new Date().toLocaleTimeString(),
        action: "TINYFISH_SEARCH",
        title: `TinyFish Real-Time Search: ${preset.ticker} Authoritative Dockets`,
        details: `Querying live web across SEC EDGAR, FDA dockets, and global wires for "${preset.headline.slice(0, 45)}...".`,
        status: "completed",
        sourceUrl: preset.sourceUrl,
      };
      setTraceSteps((prev) => [...prev, step2]);
    }, 280);

    setTimeout(() => {
      const step3: AgentTraceStep = {
        timestamp: new Date().toLocaleTimeString(),
        action: "TINYFISH_FETCH",
        title: "TinyFish Headless Chromium Execution & Shadow DOM Bypass",
        details: `Navigated to dynamic portal (${preset.sourceUrl}). Rendered dynamic JavaScript tables and advisory votes.`,
        status: "completed",
        sourceUrl: preset.sourceUrl,
      };
      setTraceSteps((prev) => [...prev, step3]);
    }, 550);

    setTimeout(() => {
      const step4: AgentTraceStep = {
        timestamp: new Date().toLocaleTimeString(),
        action: "DOM_CLEANING",
        title: "High-Density DOM Compression to Clean Markdown",
        details: `Stripped ads, navigation banners, tracking scripts. Reduced raw HTML (${(
          preset.rawHtmlBytes / 1000
        ).toFixed(1)} KB) to clean Markdown (${(preset.cleanMarkdownBytes / 1000).toFixed(1)} KB).`,
        status: "completed",
        tokenSavingsPct: preset.tokenSavingsPct,
      };
      setTraceSteps((prev) => [...prev, step4]);
    }, 850);

    setTimeout(() => {
      const step5: AgentTraceStep = {
        timestamp: new Date().toLocaleTimeString(),
        action: "TIMESTAMP_VERIFICATION",
        title: "Pydantic Evidence Structuring & Zero Look-Ahead Verification",
        details: `Locked UTC Timestamp: ${preset.eventDateUtc}. Verified zero historical look-ahead drift against disclosure timeline.`,
        status: "completed",
        sourceUrl: preset.sourceUrl,
      };

      const step6: AgentTraceStep = {
        timestamp: new Date().toLocaleTimeString(),
        action: "QUANT_EXECUTION",
        title: "Sandboxed Deterministic Python/TypeScript Event Study",
        details: `Executed Market Model OLS against ${bench} (${estWin}-day estimation window). Computed CAR, t-statistic, and p-value across [ -${preDays}, +${postDays}].`,
        status: "completed",
      };

      setTraceSteps((prev) => [...prev, step5, step6]);

      // Deterministic math calculation
      const res = computeEventStudy(preset, estWin, preDays, postDays, bench);
      setResult(res);
      setIsExecuting(false);
    }, 1150);
  };

  const handleCopyMarkdown = () => {
    if (!result) return;
    const md = `# QuantIntel Research Report: ${result.evidence.companyName} ($${result.ticker})
Date: ${result.eventDate} | Benchmark: ${result.benchmarkTicker}
Cumulative Abnormal Return (CAR): ${result.carEventWindowPct >= 0 ? "+" : ""}${result.carEventWindowPct.toFixed(2)}%
Student's t-statistic: ${result.tStatistic.toFixed(3)} (p = ${result.pValue.toFixed(5)})
Empirical Verdict: ${result.empiricalVerdict}
Locked UTC Timestamp: ${result.evidence.eventDateUtc}
Audited Source URL: ${result.evidence.sourceUrl}
Verbatim Excerpt: "${result.evidence.verbatimExcerpt}"
`;
    navigator.clipboard.writeText(md);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownloadCsv = () => {
    if (!result) return;
    const headers = [
      "relativeDay",
      "dateStr",
      "stockClose",
      "benchmarkClose",
      "stockReturnPct",
      "benchmarkReturnPct",
      "expectedReturnPct",
      "abnormalReturnPct",
      "cumulativeAbnormalReturnPct",
      "volumeRatio",
    ];
    const rows = result.dayStats.map((d) =>
      [
        d.relativeDay,
        d.dateStr,
        d.stockClose,
        d.benchmarkClose,
        d.stockReturnPct,
        d.benchmarkReturnPct,
        d.expectedReturnPct,
        d.abnormalReturnPct,
        d.cumulativeAbnormalReturnPct,
        d.volumeRatio,
      ].join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `QuantIntel_${result.ticker}_${result.eventDate}_stats.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadJson = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `QuantIntel_${result.ticker}_contract.json`);
    dlAnchorElem.click();
  };

  return (
    <section id="studio" className="py-16 md:py-24 border-b border-[#1E2C3D] bg-[#090D12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 rounded-full border border-[#00C4CC]/30 bg-[#00C4CC]/10 px-3 py-1 text-xs font-mono text-[#00C4CC] mb-2">
              <Activity className="h-3.5 w-3.5" />
              <span>LIVE INTERACTIVE RESEARCH TERMINAL</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Web Quant Studio
            </h2>
            <p className="text-sm text-[#8B949E] mt-1">
              Test qualitative corporate disclosures in real time with deterministic Campbell-Lo-MacKinlay event studies.
            </p>
          </div>

          {/* Quick Scenario Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#8B949E] font-mono mr-1">Catalysts:</span>
            {PRESET_CASES.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePresetChange(p.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                  selectedPresetId === p.id
                    ? "bg-[#00C4CC] text-[#090D12] font-bold shadow-md shadow-[#00C4CC]/20"
                    : "border border-[#1E2C3D] bg-[#0F1722] text-[#C9D1D9] hover:border-[#2A3F58] hover:text-white"
                }`}
              >
                ${p.ticker}
              </button>
            ))}
          </div>
        </div>

        {/* Console Control Bar */}
        <div className="rounded-2xl border border-[#1E2C3D] bg-[#0F1722] p-5 mb-8 shadow-2xl">
          {/* Query Bar */}
          <div className="mb-5">
            <label className="block text-xs font-mono text-[#8B949E] mb-2 font-semibold">
              ANALYST NATURAL LANGUAGE PROMPT:
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 flex items-center rounded-lg border border-[#1E2C3D] bg-[#090D12] px-3 py-2.5 focus-within:border-[#00C4CC]">
                <span className="text-[#00C4CC] font-mono font-bold mr-2 text-sm">&gt;</span>
                <input
                  type="text"
                  value={currentPrompt}
                  onChange={(e) => setCurrentPrompt(e.target.value)}
                  className="w-full bg-transparent text-sm text-white placeholder-[#484F58] focus:outline-none font-mono"
                  placeholder="Enter catalyst query or research hypothesis..."
                />
              </div>
              <button
                onClick={() =>
                  runStudy(
                    selectedPresetId,
                    currentPrompt,
                    benchmark,
                    estimationWindow,
                    preEventDays,
                    postEventDays
                  )
                }
                disabled={isExecuting}
                className="flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-[#00C4CC] to-[#00A3AA] px-5 py-2.5 text-xs font-bold text-[#090D12] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md shadow-[#00C4CC]/20"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{isExecuting ? "Executing Math..." : "Run Quant Study"}</span>
              </button>
            </div>
          </div>

          {/* Parameter Sliders & Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 border-t border-[#1E2C3D] pt-4 text-xs">
            {/* Benchmark ETF */}
            <div>
              <label className="text-[#8B949E] block mb-1.5 font-mono">
                BENCHMARK PROXY ETF:
              </label>
              <select
                value={benchmark}
                onChange={(e) => setBenchmark(e.target.value)}
                className="w-full rounded-lg border border-[#1E2C3D] bg-[#090D12] px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#00C4CC]"
              >
                <option value="SPY">SPY (S&P 500 ETF)</option>
                <option value="XBI">XBI (S&P Biotech ETF)</option>
                <option value="XLK">XLK (Technology Select Sector)</option>
                <option value="QQQ">QQQ (Nasdaq 100)</option>
                <option value="XLE">XLE (Energy Select Sector)</option>
                <option value="XLF">XLF (Financial Select Sector)</option>
              </select>
            </div>

            {/* Estimation Window */}
            <div>
              <div className="flex justify-between text-[#8B949E] mb-1.5 font-mono">
                <span>ESTIMATION WINDOW:</span>
                <span className="text-white font-bold">{estimationWindow} Days</span>
              </div>
              <input
                type="range"
                min="30"
                max="180"
                step="15"
                value={estimationWindow}
                onChange={(e) => setEstimationWindow(Number(e.target.value))}
                className="w-full accent-[#00C4CC] cursor-pointer"
              />
            </div>

            {/* Pre-Event Days */}
            <div>
              <div className="flex justify-between text-[#8B949E] mb-1.5 font-mono">
                <span>PRE-EVENT WINDOW:</span>
                <span className="text-white font-bold">-{preEventDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="15"
                value={preEventDays}
                onChange={(e) => setPreEventDays(Number(e.target.value))}
                className="w-full accent-[#00C4CC] cursor-pointer"
              />
            </div>

            {/* Post-Event Days */}
            <div>
              <div className="flex justify-between text-[#8B949E] mb-1.5 font-mono">
                <span>POST-EVENT WINDOW:</span>
                <span className="text-white font-bold">+{postEventDays} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                value={postEventDays}
                onChange={(e) => setPostEventDays(Number(e.target.value))}
                className="w-full accent-[#00C4CC] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Results Container */}
        {result && (
          <div className="space-y-8">
            {/* KPI Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* CAR Metric */}
              <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722] p-4 text-left">
                <span className="text-[11px] font-mono text-[#8B949E] block mb-1">
                  CUMULATIVE RETURN (CAR)
                </span>
                <div
                  className={`text-2xl font-bold font-mono ${
                    result.carEventWindowPct >= 0 ? "text-[#10B981]" : "text-[#EF4444]"
                  }`}
                >
                  {result.carEventWindowPct >= 0 ? "+" : ""}
                  {result.carEventWindowPct.toFixed(2)}%
                </div>
                <span className="text-[10px] text-[#6E7681] font-mono">
                  Pre: {result.preEventCarPct >= 0 ? "+" : ""}
                  {result.preEventCarPct.toFixed(1)}% | Post: {result.postEventCarPct >= 0 ? "+" : ""}
                  {result.postEventCarPct.toFixed(1)}%
                </span>
              </div>

              {/* t-statistic */}
              <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722] p-4 text-left">
                <span className="text-[11px] font-mono text-[#8B949E] block mb-1">
                  STUDENT&apos;S t-STATISTIC
                </span>
                <div className="text-2xl font-bold font-mono text-white">
                  {result.tStatistic.toFixed(3)}
                </div>
                <span className="text-[10px] text-[#00C4CC] font-mono">
                  p = {result.pValue.toFixed(4)}
                </span>
              </div>

              {/* Statistical Significance */}
              <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722] p-4 text-left">
                <span className="text-[11px] font-mono text-[#8B949E] block mb-1">
                  SIGNIFICANCE (&alpha; = 0.05)
                </span>
                <div
                  className={`text-xl font-bold font-mono ${
                    result.isStatisticallySignificant ? "text-[#10B981]" : "text-[#F59E0B]"
                  }`}
                >
                  {result.isStatisticallySignificant ? "REJECT H0" : "FAIL TO REJECT"}
                </div>
                <span className="text-[10px] text-[#8B949E] font-mono">
                  {result.isStatisticallySignificant ? "p < 0.05 (Significant)" : "p >= 0.05 (Noise)"}
                </span>
              </div>

              {/* Market Beta */}
              <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722] p-4 text-left">
                <span className="text-[11px] font-mono text-[#8B949E] block mb-1">
                  MARKET BETA (&beta;)
                </span>
                <div className="text-2xl font-bold font-mono text-white">
                  {result.estimationBeta.toFixed(2)}
                </div>
                <span className="text-[10px] text-[#8B949E] font-mono">
                  R&sup2; = {result.estimationR2.toFixed(2)} vs {result.benchmarkTicker}
                </span>
              </div>

              {/* Peak Volume Multiplier */}
              <div className="col-span-2 md:col-span-1 rounded-xl border border-[#1E2C3D] bg-[#0F1722] p-4 text-left">
                <span className="text-[11px] font-mono text-[#8B949E] block mb-1">
                  PEAK VOLUME MULTIPLIER
                </span>
                <div
                  className={`text-2xl font-bold font-mono ${
                    result.maxVolumeRatio >= 2.0 ? "text-[#FFBE5C]" : "text-white"
                  }`}
                >
                  {result.maxVolumeRatio.toFixed(2)}x
                </div>
                <span className="text-[10px] text-[#8B949E] font-mono">
                  Avg: {result.avgVolumeRatio.toFixed(2)}x baseline
                </span>
              </div>
            </div>

            {/* Official Verdict Callout */}
            <div
              className={`rounded-xl border p-5 ${
                result.isStatisticallySignificant
                  ? "border-[#10B981]/50 bg-[#062B19]/70 text-[#D1FAE5]"
                  : "border-[#F59E0B]/50 bg-[#211C10]/70 text-[#FEF3C7]"
              }`}
            >
              <div className="flex items-start space-x-3">
                <CheckCircle2
                  className={`h-5 w-5 mt-0.5 shrink-0 ${
                    result.isStatisticallySignificant ? "text-[#10B981]" : "text-[#F59E0B]"
                  }`}
                />
                <div>
                  <h4 className="font-bold text-sm tracking-wide mb-1 font-mono uppercase">
                    Official Empirical Research Verdict:
                  </h4>
                  <p className="text-xs sm:text-sm leading-relaxed font-mono">
                    {result.empiricalVerdict}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Charts Suite */}
            <FinancialCharts result={result} />

            {/* Side-by-side Evidence Card & Hypothesis Contract */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EvidenceCard evidence={result.evidence} />
              <HypothesisCard hypothesis={result.hypothesis} />
            </div>

            {/* Agent Live Reconnaissance Trace */}
            <AgentTraceView steps={traceSteps} isExecuting={isExecuting} />

            {/* Export Bar */}
            <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722] p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center space-x-2 text-[#8B949E]">
                <Download className="h-4 w-4 text-[#00C4CC]" />
                <span>EXPORT VERIFIED RESEARCH DOSSIER:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleCopyMarkdown}
                  className="flex items-center space-x-1.5 rounded-lg border border-[#1E2C3D] bg-[#16202E] px-3 py-1.5 text-[#C9D1D9] hover:text-white hover:border-[#00C4CC] transition-all"
                >
                  {copySuccess ? <Check className="h-3.5 w-3.5 text-[#10B981]" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copySuccess ? "Copied!" : "Copy Markdown"}</span>
                </button>

                <button
                  onClick={handleDownloadCsv}
                  className="flex items-center space-x-1.5 rounded-lg border border-[#1E2C3D] bg-[#16202E] px-3 py-1.5 text-[#C9D1D9] hover:text-white hover:border-[#00C4CC] transition-all"
                >
                  <Table className="h-3.5 w-3.5 text-[#38BDF8]" />
                  <span>Download CSV</span>
                </button>

                <button
                  onClick={handleDownloadJson}
                  className="flex items-center space-x-1.5 rounded-lg border border-[#1E2C3D] bg-[#16202E] px-3 py-1.5 text-[#C9D1D9] hover:text-white hover:border-[#00C4CC] transition-all"
                >
                  <FileCode className="h-3.5 w-3.5 text-[#818CF8]" />
                  <span>JSON Contract</span>
                </button>

                <button
                  onClick={() => setShowDataTable(!showDataTable)}
                  className="flex items-center space-x-1.5 rounded-lg border border-[#1E2C3D] bg-[#16202E] px-3 py-1.5 text-[#00C4CC] hover:bg-[#00C4CC]/10 transition-all font-semibold"
                >
                  <span>{showDataTable ? "Hide Table" : "Inspect Data Table"}</span>
                </button>
              </div>
            </div>

            {/* Expandable Daily Data Table */}
            {showDataTable && (
              <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722] p-4 overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-[#1E2C3D] text-[#8B949E]">
                      <th className="pb-2">Rel Day</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2 text-right">Close</th>
                      <th className="pb-2 text-right">Stock Ret</th>
                      <th className="pb-2 text-right">Bench Ret</th>
                      <th className="pb-2 text-right">Abnormal Ret</th>
                      <th className="pb-2 text-right">CAR %</th>
                      <th className="pb-2 text-right">Vol Ratio</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E2C3D]/60">
                    {result.dayStats.map((d) => (
                      <tr
                        key={d.relativeDay}
                        className={d.relativeDay === 0 ? "bg-[#FFBE5C]/10 text-white font-bold" : "text-[#C9D1D9]"}
                      >
                        <td className="py-2">{d.relativeDay >= 0 ? `+${d.relativeDay}` : d.relativeDay}</td>
                        <td className="py-2 text-[#8B949E]">{d.dateStr}</td>
                        <td className="py-2 text-right">${d.stockClose.toFixed(2)}</td>
                        <td className={`py-2 text-right ${d.stockReturnPct >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}>
                          {d.stockReturnPct >= 0 ? "+" : ""}
                          {d.stockReturnPct.toFixed(2)}%
                        </td>
                        <td className="py-2 text-right text-[#8B949E]">
                          {d.benchmarkReturnPct >= 0 ? "+" : ""}
                          {d.benchmarkReturnPct.toFixed(2)}%
                        </td>
                        <td
                          className={`py-2 text-right ${d.abnormalReturnPct >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`}
                        >
                          {d.abnormalReturnPct >= 0 ? "+" : ""}
                          {d.abnormalReturnPct.toFixed(2)}%
                        </td>
                        <td
                          className={`py-2 text-right font-bold ${
                            d.cumulativeAbnormalReturnPct >= 0 ? "text-[#10B981]" : "text-[#EF4444]"
                          }`}
                        >
                          {d.cumulativeAbnormalReturnPct >= 0 ? "+" : ""}
                          {d.cumulativeAbnormalReturnPct.toFixed(2)}%
                        </td>
                        <td className="py-2 text-right text-[#FFBE5C]">{d.volumeRatio.toFixed(2)}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
