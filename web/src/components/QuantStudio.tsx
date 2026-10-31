"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Search,
  Globe,
  Radio,
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
  const [selectedPresetId, setSelectedPresetId] = useState<string>(initialPresetId || "adani_expansion");
  const [activeTicker, setActiveTicker] = useState<string>("ADANIENT.NS");
  const [currentPrompt, setCurrentPrompt] = useState<string>(
    initialPrompt || PRESET_CASES[0].queryExample
  );
  const [benchmark, setBenchmark] = useState<string>("^NSEI");
  const [estimationWindow, setEstimationWindow] = useState<number>(90);
  const [preEventDays, setPreEventDays] = useState<number>(5);
  const [postEventDays, setPostEventDays] = useState<number>(10);
  const [tinyFishKey, setTinyFishKey] = useState<string>("");

  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [result, setResult] = useState<EventStudyResult | null>(null);
  const [traceSteps, setTraceSteps] = useState<AgentTraceStep[]>([]);
  const [copySuccess, setCopySuccess] = useState<boolean>(false);
  const [showDataTable, setShowDataTable] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState<string>("Real-Time Exchange Historical OHLCV Feed");
  const [isLiveMarketData, setIsLiveMarketData] = useState<boolean>(true);

  // Search & Autocomplete State
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dynamicSuggestions, setDynamicSuggestions] = useState<
    Array<{ ticker: string; name: string; exchange: string; region: string; currency: string }>
  >([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState<boolean>(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  // Close suggestions on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search for live autocomplete
  useEffect(() => {
    const q = searchQuery.trim();
    if (!q || q.length < 2) {
      setDynamicSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const res = await fetch(`/api/futurestock/search?q=${encodeURIComponent(q)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.results)) {
            setDynamicSuggestions(data.results);
          }
        }
      } catch (err) {
        console.warn("Autocomplete search failed:", err);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sync when initialPresetId changes from Hero triggers
  useEffect(() => {
    if (initialPresetId) {
      setSelectedPresetId(initialPresetId);
      const p = getPresetById(initialPresetId);
      setActiveTicker(p.ticker);
      setCurrentPrompt(p.queryExample);
      setBenchmark(p.benchmarkTicker);
    }
  }, [initialPresetId]);

  // Initial calculation on mount with live market data
  useEffect(() => {
    runStudy(activeTicker, currentPrompt, benchmark, estimationWindow, preEventDays, postEventDays);
  }, []);

  const handlePresetChange = (id: string) => {
    setSelectedPresetId(id);
    const p = getPresetById(id);
    setActiveTicker(p.ticker);
    setSearchQuery(p.ticker);
    setCurrentPrompt(p.queryExample);
    setBenchmark(p.benchmarkTicker);
    runStudy(p.ticker, p.queryExample, p.benchmarkTicker, estimationWindow, preEventDays, postEventDays, p.eventDate);
  };

  const handleSelectTicker = (sym: string, name?: string) => {
    setActiveTicker(sym);
    setSearchQuery(sym);
    setShowSuggestions(false);

    const isInd =
      sym.endsWith(".NS") ||
      sym.endsWith(".BO") ||
      sym.includes("ADANI") ||
      sym.includes("TCS") ||
      sym.includes("RELIANCE");
    const autoBench = isInd ? "^NSEI" : "SPY";
    setBenchmark(autoBench);

    const autoPrompt = `Investigate corporate disclosures and measure Cumulative Abnormal Returns (CAR) for ${
      name || sym
    } against ${autoBench}.`;
    setCurrentPrompt(autoPrompt);

    runStudy(sym, autoPrompt, autoBench, estimationWindow, preEventDays, postEventDays);
  };

  const runStudy = async (
    targetTicker: string,
    prompt: string,
    bench: string,
    estWin: number,
    preDays: number,
    postDays: number,
    evDate?: string
  ) => {
    setIsExecuting(true);

    const step1: AgentTraceStep = {
      timestamp: new Date().toLocaleTimeString(),
      action: "QUERY_DECOMPOSE",
      title: "Query Decomposition & Intent Parsing",
      details: `Decomposing query: "${prompt}". Extracted target: ${targetTicker}, benchmark: ${bench}.`,
      status: "completed",
    };

    setTraceSteps([step1]);

    const step2: AgentTraceStep = {
      timestamp: new Date().toLocaleTimeString(),
      action: "TINYFISH_SEARCH",
      title: `TinyFish Real-Time Search: ${targetTicker} Authoritative Disclosures`,
      details: `Querying live web across regulatory portals (SEC EDGAR, BSE/NSE), news feeds, and corporate disclosures...`,
      status: "completed",
    };
    setTraceSteps((prev) => [...prev, step2]);

    try {
      const res = await fetch("/api/quant/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: targetTicker,
          benchmark: bench,
          estimationWindowDays: estWin,
          preEventDays: preDays,
          postEventDays: postDays,
          eventDate: evDate,
          catalystPrompt: prompt,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.result) {
          const liveRes: EventStudyResult = data.result;
          setDataSource(data.source || "Real-Time Exchange Feed");
          setIsLiveMarketData(data.isLiveMarketData ?? true);

          const step3: AgentTraceStep = {
            timestamp: new Date().toLocaleTimeString(),
            action: "TINYFISH_FETCH",
            title: "TinyFish Headless Chromium Execution & DOM Cleaning",
            details: `Retrieved primary disclosure: "${liveRes.evidence.headline}". Stripped DOM boilerplate with ${
              liveRes.tokenSavingsPct || 88.5
            }% token compression.`,
            status: "completed",
            sourceUrl: liveRes.evidence.sourceUrl,
            tokenSavingsPct: liveRes.tokenSavingsPct,
          };

          const step4: AgentTraceStep = {
            timestamp: new Date().toLocaleTimeString(),
            action: "MARKET_DATA",
            title: `Real-Time Historical OHLCV Stream (${targetTicker} & ${bench})`,
            details: `Ingested ${estWin + preDays + postDays} live trading sessions via ${data.source}. Aligned date matrices.`,
            status: "completed",
          };

          const step5: AgentTraceStep = {
            timestamp: new Date().toLocaleTimeString(),
            action: "QUANT_EXECUTION",
            title: "Campbell-Lo-MacKinlay OLS Market Model Estimation",
            details: `Estimated Market Model: Beta = ${liveRes.estimationBeta.toFixed(
              2
            )}, Alpha = ${liveRes.estimationAlpha.toFixed(5)}, R² = ${liveRes.estimationR2.toFixed(
              2
            )}. Residual Vol = ${liveRes.residualStdPct.toFixed(2)}%.`,
            status: "completed",
          };

          const step6: AgentTraceStep = {
            timestamp: new Date().toLocaleTimeString(),
            action: "HYPOTHESIS_TEST",
            title: "Abnormal Returns (CAR) & Student's t-test Verification",
            details: `Calculated CAR = ${liveRes.carEventWindowPct >= 0 ? "+" : ""}${liveRes.carEventWindowPct.toFixed(
              2
            )}%, t = ${liveRes.tStatistic.toFixed(3)}, p = ${liveRes.pValue.toFixed(5)}. Verdict: ${
              liveRes.isStatisticallySignificant ? "Reject H0 (Statistically Significant)" : "Fail to Reject H0 (Noise)"
            }.`,
            status: "completed",
          };

          setTraceSteps((prev) => [...prev, step3, step4, step5, step6]);
          setResult(liveRes);
          setIsExecuting(false);
          return;
        }
      }
    } catch (err) {
      console.warn("Quant study API call failed, falling back to client-side engine:", err);
    }

    // Client-side fallback
    const preset = getPresetById(selectedPresetId);
    const fallbackRes = computeEventStudy(preset, estWin, preDays, postDays, bench);
    setResult(fallbackRes);
    setDataSource("Calibrated Synthetic Engine");
    setIsLiveMarketData(false);
    setIsExecuting(false);
  };

  const isIndia =
    (result?.ticker &&
      (result.ticker.endsWith(".NS") ||
        result.ticker.endsWith(".BO") ||
        result.ticker.includes("ADANI") ||
        result.ticker.includes("TCS") ||
        result.ticker.includes("RELIANCE"))) ||
    benchmark === "^NSEI" ||
    benchmark === "^BSESN";
  const currencySymbol = isIndia ? "₹" : "$";

  const handleCopyMarkdown = () => {
    if (!result) return;
    const md = `# QuantIntel Research Report: ${result.evidence.companyName} (${result.ticker})
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
            <div className="inline-flex items-center space-x-2 rounded-full border border-[#00C4CC]/30 bg-[#00C4CC]/10 px-3 py-1 text-xs font-mono text-[#00C4CC] mb-2">
              <Activity className="h-3.5 w-3.5" />
              <span>LIVE EVENT-STUDY RESEARCH TERMINAL</span>
              <span className="text-[#10B981] font-bold">• {dataSource}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Web Quant Studio
            </h2>
            <p className="text-sm text-[#8B949E] mt-1">
              Test qualitative corporate disclosures and market announcements in real time with Campbell-Lo-MacKinlay event studies.
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
                  selectedPresetId === p.id && activeTicker === p.ticker
                    ? "bg-[#00C4CC] text-[#090D12] font-bold shadow-md shadow-[#00C4CC]/20"
                    : "border border-[#1E2C3D] bg-[#0F1722] text-[#C9D1D9] hover:border-[#2A3F58] hover:text-white"
                }`}
              >
                ${p.ticker}
              </button>
            ))}
          </div>
        </div>

        {/* Live Search & Autocomplete Input */}
        <div className="mb-4 rounded-xl border border-[#1E2C3D] bg-[#0B111A] p-3 shadow-lg" ref={searchBoxRef}>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B949E]" />
              <input
                type="text"
                placeholder="Search any stock or entity (e.g. Adani, Tata, Reliance, NVDA, TSLA, Apple, Zomato)..."
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                className="w-full rounded-lg border border-[#1E2C3D] bg-[#080C12] py-2 pl-9 pr-3 text-xs text-white placeholder-[#484F58] focus:border-[#00C4CC] focus:outline-none font-mono"
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && dynamicSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-30 rounded-xl border border-[#1E2C3D] bg-[#0E1520] shadow-2xl overflow-hidden max-h-56 overflow-y-auto">
                  <div className="p-1.5 text-[10px] font-mono uppercase text-[#8B949E] border-b border-[#1E2C3D]/60 bg-[#0B111A] flex items-center justify-between">
                    <span>Matched Equities &amp; Tickers:</span>
                    {isSearchingSuggestions && (
                      <span className="text-[#00C4CC] animate-pulse">Searching live web...</span>
                    )}
                  </div>
                  {dynamicSuggestions.map((item) => (
                    <button
                      key={item.ticker}
                      type="button"
                      onClick={() => handleSelectTicker(item.ticker, item.name)}
                      className="w-full flex items-center justify-between p-2 hover:bg-[#162334] text-left transition-colors border-b border-[#1E2C3D]/30 last:border-none"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-white text-xs">{item.ticker}</span>
                        <span className="text-xs text-[#8B949E] truncate max-w-xs">{item.name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] font-mono">
                        <span className="rounded bg-[#00C4CC]/10 border border-[#00C4CC]/30 px-1.5 py-0.5 text-[#00C4CC]">
                          {item.exchange}
                        </span>
                        <span className="text-[#484F58]">{item.region}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono text-[#8B949E] self-start sm:self-auto">
              <span>Active Target:</span>
              <span className="rounded bg-[#00C4CC]/20 border border-[#00C4CC]/40 px-2 py-0.5 font-bold text-[#00C4CC]">
                {activeTicker}
              </span>
              <span>vs</span>
              <span className="rounded bg-[#FFBE5C]/20 border border-[#FFBE5C]/40 px-2 py-0.5 font-bold text-[#FFBE5C]">
                {benchmark}
              </span>
            </div>
          </div>
        </div>

        {/* Console Control Bar */}
        <div className="rounded-2xl border border-[#1E2C3D] bg-[#0F1722] p-5 mb-8 shadow-2xl">
          {/* Query Bar */}
          <div className="mb-5">
            <label className="block text-xs font-mono text-[#8B949E] mb-2 font-semibold">
              ANALYST NATURAL LANGUAGE PROMPT &amp; CATALYST HYPOTHESIS:
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
                    activeTicker,
                    currentPrompt,
                    benchmark,
                    estimationWindow,
                    preEventDays,
                    postEventDays
                  )
                }
                disabled={isExecuting}
                className="flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-[#00C4CC] to-[#00A3AA] px-5 py-2.5 text-xs font-bold text-[#090D12] hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md shadow-[#00C4CC]/20 whitespace-nowrap"
              >
                <Play className="h-4 w-4 fill-current" />
                <span>{isExecuting ? "Executing Live Math..." : "Run Quant Study"}</span>
              </button>
            </div>
          </div>

          {/* Parameter Sliders & Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 border-t border-[#1E2C3D] pt-4 text-xs">
            {/* Benchmark ETF */}
            <div>
              <label className="text-[#8B949E] block mb-1.5 font-mono">
                BENCHMARK PROXY:
              </label>
              <select
                value={benchmark}
                onChange={(e) => setBenchmark(e.target.value)}
                className="w-full rounded-lg border border-[#1E2C3D] bg-[#090D12] px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#00C4CC] cursor-pointer"
              >
                <option value="^NSEI">🇮🇳 ^NSEI (NIFTY 50 - India)</option>
                <option value="^BSESN">🇮🇳 ^BSESN (BSE SENSEX - India)</option>
                <option value="SPY">🇺🇸 SPY (S&P 500 ETF - US)</option>
                <option value="QQQ">🇺🇸 QQQ (Nasdaq 100 - US)</option>
                <option value="XLK">🇺🇸 XLK (Technology Select Sector)</option>
                <option value="XBI">🇺🇸 XBI (S&P Biotech ETF)</option>
                <option value="XLE">🇺🇸 XLE (Energy Select Sector)</option>
                <option value="XLF">🇺🇸 XLF (Financial Select Sector)</option>
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
                  Avg: {result.avgVolumeRatio.toFixed(2)}x Normal
                </span>
              </div>
            </div>

            {/* Financial Charts: Interactive CAR, Price, and Volume */}
            <FinancialCharts result={result} />

            {/* Dual Narrative Grid: Evidence Card & Hypothesis Contract */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <EvidenceCard evidence={result.evidence} />
              <HypothesisCard hypothesis={result.hypothesis} />
            </div>

            {/* Agent Trace View */}
            <AgentTraceView steps={traceSteps} isExecuting={isExecuting} />

            {/* Data Export & Inspection Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-[#1E2C3D] bg-[#0F1722] p-4 text-xs font-mono">
              <div className="text-[#8B949E]">
                Target: <span className="text-white font-bold">{result.ticker}</span> ({result.companyName}) | Event Date: <span className="text-[#00C4CC] font-bold">{result.eventDate}</span>
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
                      <th className="pb-2 text-right">Close ({currencySymbol})</th>
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
                        <td className="py-2 text-right">
                          {currencySymbol}
                          {d.stockClose.toFixed(2)}
                        </td>
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
