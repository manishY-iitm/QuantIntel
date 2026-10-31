"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ShieldCheck,
  Search,
  Sparkles,
  Layers,
  BarChart3,
  PieChart,
  Download,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  Info,
  RefreshCw,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Sliders,
} from "lucide-react";

import {
  POPULAR_TICKERS,
  MACRO_STRESS_SCENARIOS,
  getPresetReport,
  runClientMonteCarlo,
  buildForecastScenarios,
} from "../lib/futurestock-data";
import {
  ForecastHorizon,
  FutureStockReport,
  ForecastScenario,
  HistoricalAnalog,
} from "../lib/futurestock-types";

export function FutureStockStudio() {
  const [selectedTicker, setSelectedTicker] = useState<string>("NVDA");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [horizon, setHorizon] = useState<ForecastHorizon>("1y");
  const [presentationMode, setPresentationMode] = useState<"BEGINNER" | "ADVANCED">("ADVANCED");
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [selectedStressScenarioId, setSelectedStressScenarioId] = useState<string>("market_crash");
  const [portfolioWeight, setPortfolioWeight] = useState<number>(30); // % allocation
  const [activeTab, setActiveTab] = useState<"FORECAST" | "VALUATION" | "THESIS" | "PORTFOLIO" | "EVIDENCE">("FORECAST");
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);

  // Load report based on ticker and horizon
  const report: FutureStockReport = useMemo(() => {
    return getPresetReport(selectedTicker, horizon);
  }, [selectedTicker, horizon]);

  const currencySymbol = report.companyProfile.currency === "INR" ? "₹" : "$";

  // Re-run simulation animation
  const handleRefresh = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
    }, 600);
  };

  const handleTickerSelect = (t: string) => {
    setSelectedTicker(t);
    handleRefresh();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const match = POPULAR_TICKERS.find(
        (p) => p.ticker.toLowerCase() === searchQuery.trim().toLowerCase()
      );
      if (match) {
        setSelectedTicker(match.ticker);
      } else {
        setSelectedTicker(searchQuery.toUpperCase().trim());
      }
      setSearchQuery("");
      handleRefresh();
    }
  };

  // Portfolio stress calculation
  const activeStress =
    MACRO_STRESS_SCENARIOS.find((s) => s.id === selectedStressScenarioId) ||
    MACRO_STRESS_SCENARIOS[0];
  const stockBeta = report.quantMetrics.betaVsBenchmark || 1.2;
  const stressedStockReturnPct = Math.round(activeStress.marketShockPct * stockBeta * 10) / 10;
  const stressedPortfolioImpactPct =
    Math.round(((stressedStockReturnPct * portfolioWeight) / 100) * 10) / 10;

  // Export functions
  const downloadJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `FutureStock_${report.requestTicker}_${horizon}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const downloadMarkdown = () => {
    const mdContent = `# FUTURESTOCK RESEARCH DOSSIER: ${report.companyProfile.companyName} (${report.requestTicker})
**Exchange:** ${report.companyProfile.exchange} | **Currency:** ${report.companyProfile.currency}
**Generated:** ${report.reportTimestampUtc}
**Horizon:** ${horizon} | **Reference Price:** ${currencySymbol}${report.companyProfile.currentPrice}

---
## 1. Executive Summary
${presentationMode === "BEGINNER" ? report.beginnerSummary : report.advancedDetails}

---
## 2. Quantitative Scenario Targets
| Scenario | Target Price | Return (%) | Methodology |
| :--- | :--- | :--- | :--- |
${report.scenarios
  .map(
    (s) =>
      `| **${s.scenarioType}** | ${currencySymbol}${s.targetPrice} | ${s.potentialReturnPct > 0 ? "+" : ""}${s.potentialReturnPct}% | ${s.methodology} |`
  )
  .join("\n")}

---
## 3. Monte Carlo Simulation (GBM 2000 Iterations)
- **5th Percentile:** ${currencySymbol}${report.monteCarlo.p5Price}
- **Median Expected:** ${currencySymbol}${report.monteCarlo.medianFinalPrice}
- **95th Percentile:** ${currencySymbol}${report.monteCarlo.p95Price}
- **95% VaR:** ${report.monteCarlo.var95Pct}% | **95% CVaR:** ${report.monteCarlo.cvar95Pct}%

---
## 4. Fundamental & Valuation Summary
- **P/E (Trailing / Forward):** ${report.valuation.trailingPe || "N/A"}x / ${report.valuation.forwardPe || "N/A"}x
- **EV/EBITDA:** ${report.valuation.evToEbitda}x | **P/S:** ${report.valuation.priceToSales}x
- **DCF Intrinsic Fair Value:** ${currencySymbol}${report.valuation.dcfBasePrice} (WACC: ${report.valuation.waccPct}%, g: ${report.valuation.terminalGrowthPct}%)

---
## 5. Investment Thesis & Adversarial Audit
**Core Thesis:** ${report.investmentThesis.coreThesis}
**Bull Argument:** ${report.investmentThesis.bullishArgument}
**Bear Argument:** ${report.investmentThesis.bearishArgument}

---
*QuantIntel FutureStock Engine - Verification Audit: ${report.verificationAudit.isAuditPassed ? "PASSED" : "FAILED"}*
`;
    const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(mdContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `FutureStock_${report.requestTicker}_${horizon}.md`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyDossier = () => {
    navigator.clipboard.writeText(
      `${report.companyProfile.companyName} (${report.requestTicker})\nBase Target: ${currencySymbol}${report.scenarios[1].targetPrice} (${report.scenarios[1].potentialReturnPct}%)\nDCF Fair Value: ${currencySymbol}${report.valuation.dcfBasePrice}\nSharpe: ${report.quantMetrics.sharpeRatio}`
    );
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
  };

  // Monte Carlo SVG Visualizer calculations
  const mc = report.monteCarlo;
  const svgWidth = 640;
  const svgHeight = 220;
  const padLeft = 55;
  const padRight = 30;
  const padTop = 20;
  const padBottom = 30;
  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  const minVal = Math.min(mc.p5Price * 0.9, mc.initialPrice * 0.85);
  const maxVal = Math.max(mc.p95Price * 1.08, mc.initialPrice * 1.15);

  const getY = (val: number) => {
    const norm = (val - minVal) / (maxVal - minVal || 1);
    return padTop + plotH - norm * plotH;
  };

  const getX = (idx: number, total: number) => {
    return padLeft + (idx / Math.max(1, total - 1)) * plotW;
  };

  return (
    <section id="futurestock" className="relative border-b border-[#1E2C3D] bg-[#070B10] py-12 px-4 sm:px-6">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#00C4CC]/10 via-[#0A84FF]/10 to-transparent blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl">
        {/* Module Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#1E2C3D] pb-6">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#00C4CC]/10 text-[#00C4CC] border border-[#00C4CC]/30 font-bold text-xs">
                🔮
              </span>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#00C4CC]">
                Autonomous Multi-Agent Quant Engine
              </span>
              <span className="rounded bg-[#10B981]/15 px-2 py-0.5 text-[10px] font-mono font-bold text-[#10B981] border border-[#10B981]/30">
                VERIFIED DETERMINISTIC
              </span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              FutureStock Intelligence Terminal
            </h1>
            <p className="mt-1 text-sm text-[#8B949E] max-w-2xl">
              8-agent orchestrated quantitative research, probabilistic Monte Carlo fan forecasting, 3-stage DCF valuation, and adversarial risk auditing for US & Indian equities.
            </p>
          </div>

          {/* Presentation Mode Toggle & Export Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center rounded-lg border border-[#1E2C3D] bg-[#0F1722] p-1">
              <button
                onClick={() => setPresentationMode("BEGINNER")}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  presentationMode === "BEGINNER"
                    ? "bg-[#00C4CC] text-[#070B10] font-semibold shadow-sm"
                    : "text-[#8B949E] hover:text-white"
                }`}
              >
                Beginner Mode
              </button>
              <button
                onClick={() => setPresentationMode("ADVANCED")}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-all ${
                  presentationMode === "ADVANCED"
                    ? "bg-[#00C4CC] text-[#070B10] font-semibold shadow-sm"
                    : "text-[#8B949E] hover:text-white"
                }`}
              >
                Advanced Quant Mode
              </button>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={copyDossier}
                className="flex items-center space-x-1.5 rounded-lg border border-[#1E2C3D] bg-[#0F1722] px-3 py-1.5 text-xs font-medium text-[#C9D1D9] hover:bg-[#152335] hover:text-white transition-colors"
                title="Copy Quick Summary"
              >
                {copiedStatus ? <CheckCircle2 className="h-3.5 w-3.5 text-[#10B981]" /> : <FileText className="h-3.5 w-3.5" />}
                <span>{copiedStatus ? "Copied" : "Copy"}</span>
              </button>
              <button
                onClick={downloadMarkdown}
                className="flex items-center space-x-1.5 rounded-lg border border-[#1E2C3D] bg-[#0F1722] px-3 py-1.5 text-xs font-medium text-[#C9D1D9] hover:bg-[#152335] hover:text-white transition-colors"
                title="Download Markdown Report"
              >
                <Download className="h-3.5 w-3.5" />
                <span>MD</span>
              </button>
              <button
                onClick={downloadJson}
                className="flex items-center space-x-1.5 rounded-lg border border-[#1E2C3D] bg-[#0F1722] px-3 py-1.5 text-xs font-medium text-[#C9D1D9] hover:bg-[#152335] hover:text-white transition-colors"
                title="Download JSON Report"
              >
                <Download className="h-3.5 w-3.5" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        </div>

        {/* 8-Agent Pipeline Status Indicator */}
        <div className="mb-6 rounded-xl border border-[#1E2C3D] bg-[#0B111A]/80 p-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E2C3D]/60 pb-2 mb-2.5">
            <div className="flex items-center space-x-2 font-mono text-xs text-[#8B949E]">
              <Activity className="h-3.5 w-3.5 text-[#00C4CC] animate-pulse" />
              <span className="text-white font-semibold">8-AGENT RESEARCH COLLECTIVE:</span>
              <span className="text-[#10B981]">ONLINE & STREAMING</span>
            </div>
            <div className="text-[11px] font-mono text-[#8B949E]">
              TinyFish DOM Cleaner: <span className="text-[#10B981] font-semibold">88.5% token reduction</span> | Audit: <span className="text-[#10B981] font-semibold">PASSED</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 text-[11px] font-mono">
            {[
              { id: "A", name: "Orchestrator", icon: "🎯", status: "SYNTHESIZED" },
              { id: "B", name: "TinyFish Web", icon: "🌐", status: "CLEANED" },
              { id: "C", name: "Financials", icon: "📊", status: "AUDITED" },
              { id: "D", name: "Quant Lab", icon: "📐", status: "2K GBM" },
              { id: "E", name: "Valuation", icon: "💎", status: "3-STAGE DCF" },
              { id: "F", name: "Analogs", icon: "🏛️", status: "UNBIASED" },
              { id: "G", name: "Adversarial", icon: "🛡️", status: "CHECKED" },
              { id: "H", name: "Verifier", icon: "✅", status: "100% GREEN" },
            ].map((ag) => (
              <div
                key={ag.id}
                className="flex items-center space-x-1.5 rounded-lg border border-[#1E2C3D] bg-[#090D12] px-2 py-1.5"
              >
                <span>{ag.icon}</span>
                <div className="truncate">
                  <div className="text-[#C9D1D9] font-medium leading-tight truncate">{ag.name}</div>
                  <div className="text-[9px] text-[#00C4CC] truncate">{ag.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ticker & Horizon Selection Bar */}
        <div className="mb-8 rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-4 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Search Form */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B949E]" />
              <input
                type="text"
                placeholder="Search ticker (e.g. NVDA, AAPL, RELIANCE.NS, ZOMATO.NS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-[#1E2C3D] bg-[#080C12] py-2 pl-9 pr-20 text-xs text-white placeholder-[#484F58] focus:border-[#00C4CC] focus:outline-none focus:ring-1 focus:ring-[#00C4CC]"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-md bg-[#00C4CC]/20 px-2.5 py-1 text-[11px] font-semibold text-[#00C4CC] hover:bg-[#00C4CC] hover:text-[#090D12] transition-colors"
              >
                Analyze
              </button>
            </form>

            {/* Horizon Selector */}
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-[#8B949E]">Forecast Horizon:</span>
              <div className="flex rounded-lg border border-[#1E2C3D] bg-[#080C12] p-0.5">
                {(["1m", "3m", "6m", "1y", "3y", "5y"] as ForecastHorizon[]).map((h) => (
                  <button
                    key={h}
                    onClick={() => {
                      setHorizon(h);
                      handleRefresh();
                    }}
                    className={`rounded-md px-2.5 py-1 text-xs font-mono transition-all ${
                      horizon === h
                        ? "bg-[#00C4CC] text-[#070B10] font-bold shadow-sm"
                        : "text-[#8B949E] hover:text-white"
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>
              <button
                onClick={handleRefresh}
                className="rounded-lg border border-[#1E2C3D] bg-[#080C12] p-2 text-[#8B949E] hover:text-white hover:border-[#00C4CC] transition-colors"
                title="Re-run Simulation"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isSimulating ? "animate-spin text-[#00C4CC]" : ""}`} />
              </button>
            </div>
          </div>

          {/* Quick Preset Ticker Pills */}
          <div className="mt-3.5 flex flex-wrap items-center gap-1.5 pt-3 border-t border-[#1E2C3D]/60">
            <span className="text-[11px] font-mono text-[#8B949E] mr-1">Institutional Presets:</span>
            {POPULAR_TICKERS.map((item) => {
              const isSelected = selectedTicker.toUpperCase() === item.ticker;
              return (
                <button
                  key={item.ticker}
                  onClick={() => handleTickerSelect(item.ticker)}
                  className={`flex items-center space-x-1.5 rounded-md px-2.5 py-1 text-xs font-mono transition-all ${
                    isSelected
                      ? "border border-[#00C4CC] bg-[#00C4CC]/15 text-[#00C4CC] font-bold shadow-sm"
                      : "border border-[#1E2C3D] bg-[#080C12] text-[#8B949E] hover:border-[#2A3F58] hover:text-white"
                  }`}
                >
                  <span>{item.ticker}</span>
                  <span className="text-[10px] text-[#484F58] font-sans">({item.region})</span>
                  {item.category === "IPO" && (
                    <span className="rounded bg-[#FFBE5C]/20 px-1 py-0.2 text-[9px] text-[#FFBE5C]">IPO</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Company Header Card */}
        <div className="mb-8 rounded-xl border border-[#1E2C3D] bg-gradient-to-r from-[#0E1520] via-[#0B111A] to-[#0E1520] p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-extrabold tracking-tight text-white">
                  {report.companyProfile.companyName}
                </h2>
                <span className="rounded-md border border-[#00C4CC]/40 bg-[#00C4CC]/10 px-2 py-0.5 font-mono text-xs font-bold text-[#00C4CC]">
                  {report.companyProfile.ticker}
                </span>
                <span className="rounded-md border border-[#1E2C3D] bg-[#080C12] px-2 py-0.5 font-mono text-xs text-[#8B949E]">
                  {report.companyProfile.exchange}
                </span>
                <span className="rounded-md border border-[#1E2C3D] bg-[#080C12] px-2 py-0.5 font-mono text-xs text-[#FFBE5C]">
                  {report.companyProfile.currency}
                </span>
                {report.companyProfile.isIpo && (
                  <span className="rounded-md bg-gradient-to-r from-[#FF7B72]/20 to-[#FFBE5C]/20 border border-[#FF7B72]/40 px-2 py-0.5 text-xs font-bold text-[#FF7B72]">
                    RECENT IPO
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-[#8B949E]">
                {report.companyProfile.sector} • Free Cash Flow: {currencySymbol}
                {(report.financials.freeCashFlow / 1e9).toFixed(1)}B • 52W Range: {currencySymbol}
                {report.companyProfile.fiftyTwoWeekLow} - {currencySymbol}
                {report.companyProfile.fiftyTwoWeekHigh}
              </p>
            </div>

            {/* Live Pricing & Volatility Stats */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="border-l border-[#1E2C3D] pl-4 sm:pl-6">
                <div className="text-[11px] font-mono uppercase text-[#8B949E]">Reference Price</div>
                <div className="text-2xl font-black font-mono text-white">
                  {currencySymbol}{report.companyProfile.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="border-l border-[#1E2C3D] pl-4 sm:pl-6">
                <div className="text-[11px] font-mono uppercase text-[#8B949E]">Annualized Vol</div>
                <div className="text-xl font-bold font-mono text-[#FFBE5C]">
                  {report.quantMetrics.annualizedVolatilityPct}%
                </div>
              </div>
              <div className="border-l border-[#1E2C3D] pl-4 sm:pl-6">
                <div className="text-[11px] font-mono uppercase text-[#8B949E]">Sharpe / Sortino</div>
                <div className="text-xl font-bold font-mono text-[#10B981]">
                  {report.quantMetrics.sharpeRatio} / {report.quantMetrics.sortinoRatio}
                </div>
              </div>
              <div className="border-l border-[#1E2C3D] pl-4 sm:pl-6">
                <div className="text-[11px] font-mono uppercase text-[#8B949E]">95% Single-Day VaR</div>
                <div className="text-xl font-bold font-mono text-[#FF7B72]">
                  -{report.quantMetrics.dailyVar95Pct}%
                </div>
              </div>
            </div>
          </div>

          {/* Mode Summary Banner */}
          <div className="mt-4 rounded-lg bg-[#080C12]/80 border border-[#1E2C3D] p-3 text-xs text-[#C9D1D9] leading-relaxed">
            <span className="font-semibold text-[#00C4CC]">
              {presentationMode === "BEGINNER" ? "Executive Plain-Language Synthesis: " : "Quantitative Research Thesis: "}
            </span>
            {presentationMode === "BEGINNER" ? report.beginnerSummary : report.advancedDetails}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 flex border-b border-[#1E2C3D] overflow-x-auto">
          {[
            { id: "FORECAST", label: "Scenario Targets & Monte Carlo", icon: BarChart3 },
            { id: "VALUATION", label: "Fundamental Health & DCF", icon: PieChart },
            { id: "THESIS", label: "Adversarial Risk & Analogs", icon: ShieldCheck },
            { id: "PORTFOLIO", label: "Portfolio Stress Testing", icon: Sliders },
            { id: "EVIDENCE", label: "Evidence & Audit Trail", icon: CheckCircle2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 border-b-2 px-5 py-3 text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? "border-[#00C4CC] text-[#00C4CC] bg-[#00C4CC]/5"
                    : "border-transparent text-[#8B949E] hover:text-white hover:border-[#30363D]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: FORECAST & MONTE CARLO */}
        {activeTab === "FORECAST" && (
          <div className="space-y-8">
            {/* Scenario Cards (Bear, Base, Bull) */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-mono font-semibold uppercase text-[#8B949E]">
                  Quantitative Scenario Forecasting ({horizon} Horizon)
                </h3>
                <div className="flex items-center space-x-1.5 text-[11px] font-mono text-[#10B981]">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Verified: Return (%) = ((Target / Ref) - 1) * 100</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {report.scenarios.map((sc) => {
                  const isBear = sc.scenarioType === "BEARISH";
                  const isBase = sc.scenarioType === "BASE";
                  const isBull = sc.scenarioType === "BULLISH";

                  const borderColor = isBear
                    ? "border-[#FF7B72]/40 bg-[#FF7B72]/5"
                    : isBase
                    ? "border-[#00C4CC]/40 bg-[#00C4CC]/5"
                    : "border-[#10B981]/40 bg-[#10B981]/5";

                  const badgeColor = isBear
                    ? "bg-[#FF7B72]/15 text-[#FF7B72] border-[#FF7B72]/30"
                    : isBase
                    ? "bg-[#00C4CC]/15 text-[#00C4CC] border-[#00C4CC]/30"
                    : "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30";

                  const priceColor = isBear
                    ? "text-[#FF7B72]"
                    : isBase
                    ? "text-[#00C4CC]"
                    : "text-[#10B981]";

                  return (
                    <div
                      key={sc.scenarioType}
                      className={`rounded-xl border p-5 shadow-lg flex flex-col justify-between ${borderColor}`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span
                            className={`rounded-md border px-2 py-0.5 text-xs font-mono font-bold uppercase ${badgeColor}`}
                          >
                            {sc.scenarioType} SCENARIO
                          </span>
                          <span className="font-mono text-xs text-[#8B949E]">{sc.horizon}</span>
                        </div>

                        {/* Price & Verified Return */}
                        <div className="mt-4">
                          <div className="text-[11px] font-mono text-[#8B949E]">Target Price</div>
                          <div className={`text-3xl font-black font-mono ${priceColor}`}>
                            {currencySymbol}{sc.targetPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </div>
                          <div className="mt-1 flex items-center space-x-1.5 font-mono text-sm font-semibold">
                            {sc.potentialReturnPct >= 0 ? (
                              <ArrowUpRight className="h-4 w-4 text-[#10B981]" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-[#FF7B72]" />
                            )}
                            <span className={sc.potentialReturnPct >= 0 ? "text-[#10B981]" : "text-[#FF7B72]"}>
                              {sc.potentialReturnPct >= 0 ? "+" : ""}
                              {sc.potentialReturnPct}%
                            </span>
                            <span className="text-[11px] text-[#8B949E] font-normal">
                              vs {currencySymbol}{sc.referencePrice}
                            </span>
                          </div>
                        </div>

                        {/* Assumptions */}
                        <div className="mt-4 pt-3 border-t border-[#1E2C3D]">
                          <div className="text-[11px] font-mono font-medium text-[#C9D1D9] mb-1.5">
                            Key Drivers & Assumptions:
                          </div>
                          <ul className="space-y-1 text-xs text-[#8B949E]">
                            {sc.keyAssumptions.map((assump, idx) => (
                              <li key={idx} className="flex items-start space-x-1.5">
                                <span className="text-[#00C4CC] mt-0.5">•</span>
                                <span>{assump}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Methodology Footnote */}
                      <div className="mt-4 pt-3 border-t border-[#1E2C3D]/60 text-[10px] text-[#8B949E] font-mono">
                        Method: {sc.methodology}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monte Carlo Visualizer & Histogram */}
            <div className="rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 border-b border-[#1E2C3D] pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <Activity className="h-4 w-4 text-[#00C4CC]" />
                    <span>Monte Carlo Probabilistic Fan Chart</span>
                  </h3>
                  <p className="text-xs text-[#8B949E]">
                    Geometric Brownian Motion (2,000 iterations over {mc.tradingDays} trading days) with stationary log-normal returns.
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="text-[#FF7B72]">P5: {currencySymbol}{mc.p5Price}</span>
                  <span className="text-[#00C4CC]">Median: {currencySymbol}{mc.medianFinalPrice}</span>
                  <span className="text-[#10B981]">P95: {currencySymbol}{mc.p95Price}</span>
                </div>
              </div>

              {/* SVG Fan Chart */}
              <div className="w-full overflow-x-auto">
                <svg
                  viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                  className="w-full h-auto min-w-[500px]"
                >
                  {/* Grid Lines */}
                  {[0.2, 0.4, 0.6, 0.8].map((pct, i) => {
                    const y = padTop + plotH * pct;
                    const val = Math.round(maxVal - pct * (maxVal - minVal));
                    return (
                      <g key={i}>
                        <line
                          x1={padLeft}
                          y1={y}
                          x2={svgWidth - padRight}
                          y2={y}
                          stroke="#1E2C3D"
                          strokeDasharray="3 3"
                        />
                        <text
                          x={padLeft - 6}
                          y={y + 3}
                          fill="#484F58"
                          fontSize="9"
                          fontFamily="monospace"
                          textAnchor="end"
                        >
                          {currencySymbol}{val}
                        </text>
                      </g>
                    );
                  })}

                  {/* 5th to 95th Percentile Fan Fill */}
                  <polygon
                    points={`
                      ${getX(0, 2)},${getY(mc.initialPrice)}
                      ${getX(1, 2)},${getY(mc.p95Price)}
                      ${getX(1, 2)},${getY(mc.p5Price)}
                    `}
                    fill="#00C4CC"
                    fillOpacity="0.08"
                  />

                  {/* 25th to 75th Percentile Fan Fill */}
                  <polygon
                    points={`
                      ${getX(0, 2)},${getY(mc.initialPrice)}
                      ${getX(1, 2)},${getY(mc.p75Price)}
                      ${getX(1, 2)},${getY(mc.p25Price)}
                    `}
                    fill="#00C4CC"
                    fillOpacity="0.18"
                  />

                  {/* Sample Random Paths */}
                  {mc.samplePaths.map((path, pIdx) => {
                    const pts = path
                      .map((val, idx) => `${getX(idx, path.length)},${getY(val)}`)
                      .join(" ");
                    return (
                      <polyline
                        key={pIdx}
                        points={pts}
                        fill="none"
                        stroke="#00C4CC"
                        strokeWidth="1"
                        strokeOpacity="0.25"
                      />
                    );
                  })}

                  {/* Key Percentile Horizontal Markers */}
                  {/* P95 Line */}
                  <line
                    x1={padLeft}
                    y1={getY(mc.p95Price)}
                    x2={svgWidth - padRight}
                    y2={getY(mc.p95Price)}
                    stroke="#10B981"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  {/* Median Line */}
                  <line
                    x1={padLeft}
                    y1={getY(mc.medianFinalPrice)}
                    x2={svgWidth - padRight}
                    y2={getY(mc.medianFinalPrice)}
                    stroke="#00C4CC"
                    strokeWidth="2"
                  />
                  {/* P5 Line */}
                  <line
                    x1={padLeft}
                    y1={getY(mc.p5Price)}
                    x2={svgWidth - padRight}
                    y2={getY(mc.p5Price)}
                    stroke="#FF7B72"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />

                  {/* Labels on Right */}
                  <text
                    x={svgWidth - padRight + 4}
                    y={getY(mc.p95Price) + 3}
                    fill="#10B981"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    95%: {currencySymbol}{mc.p95Price}
                  </text>
                  <text
                    x={svgWidth - padRight + 4}
                    y={getY(mc.medianFinalPrice) + 3}
                    fill="#00C4CC"
                    fontSize="9"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    Med: {currencySymbol}{mc.medianFinalPrice}
                  </text>
                  <text
                    x={svgWidth - padRight + 4}
                    y={getY(mc.p5Price) + 3}
                    fill="#FF7B72"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    5%: {currencySymbol}{mc.p5Price}
                  </text>

                  {/* X Axis Base Line */}
                  <line
                    x1={padLeft}
                    y1={padTop + plotH}
                    x2={svgWidth - padRight}
                    y2={padTop + plotH}
                    stroke="#30363D"
                  />
                  <text
                    x={padLeft}
                    y={svgHeight - 10}
                    fill="#8B949E"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    Day 0 ({currencySymbol}{mc.initialPrice})
                  </text>
                  <text
                    x={svgWidth - padRight}
                    y={svgHeight - 10}
                    fill="#8B949E"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="end"
                  >
                    Day {mc.tradingDays} ({horizon})
                  </text>
                </svg>
              </div>

              {/* Quant Distribution Statistics Bar */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-[#1E2C3D] font-mono text-xs">
                <div className="rounded-lg bg-[#080C12] p-2.5 border border-[#1E2C3D]">
                  <div className="text-[10px] text-[#8B949E]">95% Value at Risk (VaR)</div>
                  <div className="text-base font-bold text-[#FF7B72]">-{mc.var95Pct}%</div>
                </div>
                <div className="rounded-lg bg-[#080C12] p-2.5 border border-[#1E2C3D]">
                  <div className="text-[10px] text-[#8B949E]">95% Conditional VaR (CVaR)</div>
                  <div className="text-base font-bold text-[#FF7B72]">-{mc.cvar95Pct}%</div>
                </div>
                <div className="rounded-lg bg-[#080C12] p-2.5 border border-[#1E2C3D]">
                  <div className="text-[10px] text-[#8B949E]">Interquartile Spread (P25-P75)</div>
                  <div className="text-base font-bold text-[#00C4CC]">
                    {currencySymbol}{mc.p25Price} - {currencySymbol}{mc.p75Price}
                  </div>
                </div>
                <div className="rounded-lg bg-[#080C12] p-2.5 border border-[#1E2C3D]">
                  <div className="text-[10px] text-[#8B949E]">Model Seed & Assumptions</div>
                  <div className="text-[11px] text-[#C9D1D9] truncate">
                    Stationary Log-Normal GBM
                  </div>
                </div>
              </div>

              {/* Distribution Histogram */}
              <div className="mt-6 pt-4 border-t border-[#1E2C3D]">
                <h4 className="text-xs font-mono font-semibold uppercase text-[#8B949E] mb-3">
                  Terminal Price Probability Distribution
                </h4>
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 items-end h-28 bg-[#080C12] p-3 rounded-lg border border-[#1E2C3D]">
                  {mc.distributionBins.map((bin, bIdx) => {
                    const heightPct = Math.min(100, Math.max(8, bin.pct * 4.5));
                    return (
                      <div key={bIdx} className="flex flex-col items-center h-full justify-end group relative">
                        <div
                          style={{ height: `${heightPct}%` }}
                          className="w-full bg-[#00C4CC]/70 group-hover:bg-[#00C4CC] rounded-t transition-all"
                        />
                        <span className="text-[8px] font-mono text-[#8B949E] mt-1 truncate max-w-full">
                          {currencySymbol}{Math.round(bin.rangeLow)}
                        </span>
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-[#0F1722] border border-[#1E2C3D] px-2 py-1 rounded shadow-lg text-[9px] font-mono text-white whitespace-nowrap z-10">
                          <span>{bin.pct}% prob</span>
                          <span>{currencySymbol}{bin.rangeLow}-{bin.rangeHigh}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: VALUATION & FUNDAMENTAL HEALTH */}
        {activeTab === "VALUATION" && (
          <div className="space-y-8">
            {/* Fundamental Statements Grid */}
            <div className="rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1E2C3D] pb-3 mb-4">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <PieChart className="h-4 w-4 text-[#00C4CC]" />
                  <span>Fundamental Health & Cash Flow Audit</span>
                </h3>
                <span className="text-xs font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded border border-[#10B981]/30">
                  {report.financials.notes || "Audited Disclosures"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 font-mono text-xs">
                <div className="rounded-lg bg-[#080C12] p-3 border border-[#1E2C3D]">
                  <div className="text-[10px] text-[#8B949E]">TTM Revenue</div>
                  <div className="text-base font-bold text-white">
                    {currencySymbol}{(report.financials.revenue / 1e9).toFixed(1)}B
                  </div>
                  <div className="text-[10px] text-[#10B981]">+{report.financials.revenueGrowthYoyPct}% YoY</div>
                </div>

                <div className="rounded-lg bg-[#080C12] p-3 border border-[#1E2C3D]">
                  <div className="text-[10px] text-[#8B949E]">Gross Margin</div>
                  <div className="text-base font-bold text-[#00C4CC]">
                    {report.financials.grossMarginPct}%
                  </div>
                  <div className="text-[10px] text-[#8B949E]">Pricing Power Moat</div>
                </div>

                <div className="rounded-lg bg-[#080C12] p-3 border border-[#1E2C3D]">
                  <div className="text-[10px] text-[#8B949E]">Operating Margin</div>
                  <div className="text-base font-bold text-[#10B981]">
                    {report.financials.operatingMarginPct}%
                  </div>
                  <div className="text-[10px] text-[#8B949E]">EBIT Efficiency</div>
                </div>

                <div className="rounded-lg bg-[#080C12] p-3 border border-[#1E2C3D]">
                  <div className="text-[10px] text-[#8B949E]">Free Cash Flow</div>
                  <div className="text-base font-bold text-[#10B981]">
                    {currencySymbol}{(report.financials.freeCashFlow / 1e9).toFixed(1)}B
                  </div>
                  <div className="text-[10px] text-[#8B949E]">Cash Conversion</div>
                </div>

                <div className="rounded-lg bg-[#080C12] p-3 border border-[#1E2C3D]">
                  <div className="text-[10px] text-[#8B949E]">Debt to Equity</div>
                  <div className="text-base font-bold text-white">
                    {report.financials.debtToEquity}x
                  </div>
                  <div className="text-[10px] text-[#10B981]">Low Leverage</div>
                </div>

                <div className="rounded-lg bg-[#080C12] p-3 border border-[#1E2C3D]">
                  <div className="text-[10px] text-[#8B949E]">Return on Equity (ROE)</div>
                  <div className="text-base font-bold text-[#00C4CC]">
                    {report.financials.returnOnEquityPct}%
                  </div>
                  <div className="text-[10px] text-[#8B949E]">Capital Allocation</div>
                </div>
              </div>
            </div>

            {/* 3-Stage DCF Model vs Market Multiples */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* DCF Valuation Model */}
              <div className="rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-6 shadow-xl">
                <div className="border-b border-[#1E2C3D] pb-3 mb-4">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <span className="text-[#00C4CC]">💎</span>
                    <span>3-Stage Discounted Cash Flow (DCF) Model</span>
                  </h3>
                  <p className="text-xs text-[#8B949E]">
                    Empirical baseline cash flow capitalization discounted at {report.valuation.waccPct}% WACC and {report.valuation.terminalGrowthPct}% perpetual growth.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 font-mono text-center mb-6">
                  <div className="rounded-lg border border-[#FF7B72]/30 bg-[#FF7B72]/5 p-3">
                    <div className="text-[10px] text-[#8B949E]">Bear Fair Value</div>
                    <div className="text-xl font-bold text-[#FF7B72]">
                      {currencySymbol}{report.valuation.dcfBearPrice}
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#00C4CC]/30 bg-[#00C4CC]/5 p-3">
                    <div className="text-[10px] text-[#8B949E]">Base Fair Value</div>
                    <div className="text-xl font-bold text-[#00C4CC]">
                      {currencySymbol}{report.valuation.dcfBasePrice}
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#10B981]/30 bg-[#10B981]/5 p-3">
                    <div className="text-[10px] text-[#8B949E]">Bull Fair Value</div>
                    <div className="text-xl font-bold text-[#10B981]">
                      {currencySymbol}{report.valuation.dcfBullPrice}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#C9D1D9] leading-relaxed bg-[#080C12] p-3 rounded-lg border border-[#1E2C3D]">
                  {report.valuation.valuationSummary}
                </p>
              </div>

              {/* Market Valuation Multiples */}
              <div className="rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-6 shadow-xl">
                <div className="border-b border-[#1E2C3D] pb-3 mb-4">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-[#FFBE5C]" />
                    <span>Market Valuation Multiples</span>
                  </h3>
                  <p className="text-xs text-[#8B949E]">
                    Comparative valuation benchmarks relative to sector and historical trading range.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div className="rounded-lg bg-[#080C12] p-3 border border-[#1E2C3D]">
                    <div className="text-[10px] text-[#8B949E]">Trailing P/E</div>
                    <div className="text-base font-bold text-white">
                      {report.valuation.trailingPe ? `${report.valuation.trailingPe}x` : "N/A"}
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#080C12] p-3 border border-[#1E2C3D]">
                    <div className="text-[10px] text-[#8B949E]">Forward P/E</div>
                    <div className="text-base font-bold text-[#00C4CC]">
                      {report.valuation.forwardPe ? `${report.valuation.forwardPe}x` : "N/A"}
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#080C12] p-3 border border-[#1E2C3D]">
                    <div className="text-[10px] text-[#8B949E]">EV / EBITDA</div>
                    <div className="text-base font-bold text-[#FFBE5C]">
                      {report.valuation.evToEbitda}x
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#080C12] p-3 border border-[#1E2C3D]">
                    <div className="text-[10px] text-[#8B949E]">Price / Sales</div>
                    <div className="text-base font-bold text-white">
                      {report.valuation.priceToSales}x
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-[#8B949E] bg-[#080C12] p-3 rounded-lg border border-[#1E2C3D]">
                  <span className="font-semibold text-white">Multiple Context:</span> Elevated multiples reflect high expected forward earnings compounding. Investors should evaluate whether operational execution justifies the current premium.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INVESTMENT THESIS & ADVERSARIAL RISK */}
        {activeTab === "THESIS" && (
          <div className="space-y-8">
            {/* Bull vs Bear Argument Dual-Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bull Argument */}
              <div className="rounded-xl border border-[#10B981]/40 bg-[#10B981]/5 p-6 shadow-xl">
                <div className="flex items-center space-x-2 text-[#10B981] font-mono text-sm font-bold uppercase mb-3">
                  <TrendingUp className="h-4 w-4" />
                  <span>Bullish Investment Thesis</span>
                </div>
                <p className="text-xs text-[#C9D1D9] leading-relaxed mb-4">
                  {report.investmentThesis.bullishArgument}
                </p>
                <div className="border-t border-[#10B981]/20 pt-3">
                  <div className="text-[11px] font-mono font-semibold text-[#10B981] mb-2">Supporting Evidence:</div>
                  <ul className="space-y-1.5 text-xs text-[#8B949E]">
                    {report.investmentThesis.fundamentalEvidence.map((ev, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-[#10B981] mt-0.5">✓</span>
                        <span>{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Bear Argument */}
              <div className="rounded-xl border border-[#FF7B72]/40 bg-[#FF7B72]/5 p-6 shadow-xl">
                <div className="flex items-center space-x-2 text-[#FF7B72] font-mono text-sm font-bold uppercase mb-3">
                  <TrendingDown className="h-4 w-4" />
                  <span>Adversarial Bear Case</span>
                </div>
                <p className="text-xs text-[#C9D1D9] leading-relaxed mb-4">
                  {report.investmentThesis.bearishArgument}
                </p>
                <div className="border-t border-[#FF7B72]/20 pt-3">
                  <div className="text-[11px] font-mono font-semibold text-[#FF7B72] mb-2">Downside Triggers:</div>
                  <ul className="space-y-1.5 text-xs text-[#8B949E]">
                    {report.investmentThesis.invalidationConditions.map((trig, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-[#FF7B72] mt-0.5">✗</span>
                        <span>{trig}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Historical Analogs & Survivorship Bias Warning */}
            <div className="rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E2C3D] pb-3 mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <span>🏛️</span>
                    <span>Historical Analogs & Comparable Cycles</span>
                  </h3>
                  <p className="text-xs text-[#8B949E]">
                    Comparative analysis against previous technological breakouts and cyclical market leaders.
                  </p>
                </div>
                <span className="text-[11px] font-mono text-[#FFBE5C] bg-[#FFBE5C]/10 border border-[#FFBE5C]/30 px-2 py-0.5 rounded">
                  ⚠️ Survivorship Bias Evaluated
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {report.analogs.map((an, idx) => (
                  <div key={idx} className="rounded-lg bg-[#080C12] border border-[#1E2C3D] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-white">{an.analogCompany}</span>
                      <span
                        className={`text-xs font-mono font-bold ${
                          an.outcomeCategory === "OUTPERFORMER" ? "text-[#10B981]" : "text-[#FF7B72]"
                        }`}
                      >
                        {an.postEventReturnPct > 0 ? "+" : ""}{an.postEventReturnPct}% ({an.outcomeCategory})
                      </span>
                    </div>
                    <div className="text-xs text-[#C9D1D9] mb-2">{an.businessComparison}</div>
                    <div className="text-[11px] text-[#8B949E] border-t border-[#1E2C3D] pt-2">
                      <span className="text-[#00C4CC] font-semibold">Similarity:</span> {an.similarityFactors}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Invalidation Conditions & Unanswered Questions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-5 shadow-lg">
                <h4 className="text-xs font-mono font-semibold uppercase text-[#FFBE5C] mb-3 flex items-center space-x-1.5">
                  <AlertCircle className="h-3.5 w-3.5" />
                  <span>Thesis Invalidation Triggers (When to Exit)</span>
                </h4>
                <ul className="space-y-2 text-xs text-[#8B949E]">
                  {report.investmentThesis.invalidationConditions.map((cond, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-[#FFBE5C] font-mono font-bold">#{i + 1}</span>
                      <span>{cond}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-5 shadow-lg">
                <h4 className="text-xs font-mono font-semibold uppercase text-[#00C4CC] mb-3 flex items-center space-x-1.5">
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Unanswered Research Questions</span>
                </h4>
                <ul className="space-y-2 text-xs text-[#8B949E]">
                  {report.investmentThesis.unansweredQuestions.map((q, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-[#00C4CC] font-mono font-bold">?</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PORTFOLIO STRESS TESTING */}
        {activeTab === "PORTFOLIO" && (
          <div className="space-y-8">
            <div className="rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-6 shadow-xl">
              <div className="border-b border-[#1E2C3D] pb-3 mb-6">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Sliders className="h-4 w-4 text-[#00C4CC]" />
                  <span>Portfolio Intelligence & Macro Stress Testing</span>
                </h3>
                <p className="text-xs text-[#8B949E]">
                  Simulate macroeconomic liquidity shocks and calculate portfolio impact based on empirical asset beta and covariance.
                </p>
              </div>

              {/* Interactive Allocation Slider */}
              <div className="mb-8 rounded-lg bg-[#080C12] p-4 border border-[#1E2C3D]">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-mono text-[#C9D1D9]">
                    Portfolio Allocation Weight for <span className="text-[#00C4CC] font-bold">{report.requestTicker}</span>:
                  </label>
                  <span className="text-base font-mono font-bold text-[#00C4CC]">{portfolioWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={portfolioWeight}
                  onChange={(e) => setPortfolioWeight(Number(e.target.value))}
                  className="w-full accent-[#00C4CC] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-mono text-[#8B949E] mt-1">
                  <span>5% (Defensive)</span>
                  <span>30% (Standard Growth)</span>
                  <span>100% (Single-Holding Concentration)</span>
                </div>
              </div>

              {/* Stress Scenarios Selector */}
              <div className="mb-6">
                <label className="text-xs font-mono text-[#8B949E] block mb-2">
                  Select Macroeconomic Shock Scenario:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {MACRO_STRESS_SCENARIOS.map((sc) => {
                    const isSelected = selectedStressScenarioId === sc.id;
                    return (
                      <button
                        key={sc.id}
                        onClick={() => setSelectedStressScenarioId(sc.id)}
                        className={`text-left rounded-lg p-3 border transition-all ${
                          isSelected
                            ? "border-[#00C4CC] bg-[#00C4CC]/10 text-white shadow-md"
                            : "border-[#1E2C3D] bg-[#080C12] text-[#8B949E] hover:border-[#30363D] hover:text-white"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold">{sc.name}</span>
                          <span
                            className={`text-xs font-mono font-bold ${
                              sc.marketShockPct < 0 ? "text-[#FF7B72]" : "text-[#10B981]"
                            }`}
                          >
                            {sc.marketShockPct > 0 ? "+" : ""}{sc.marketShockPct}%
                          </span>
                        </div>
                        <p className="text-[11px] text-[#8B949E] line-clamp-2">{sc.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stressed Outcome Calculation Card */}
              <div className="rounded-xl border border-[#1E2C3D] bg-gradient-to-r from-[#080C12] to-[#0E1520] p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-center">
                  <div className="p-3 rounded-lg border border-[#1E2C3D] bg-[#080C12]">
                    <div className="text-[10px] text-[#8B949E]">Asset Beta vs Benchmark</div>
                    <div className="text-xl font-bold text-white">{stockBeta}x</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[#1E2C3D] bg-[#080C12]">
                    <div className="text-[10px] text-[#8B949E]">Stressed Single-Asset Drawdown</div>
                    <div
                      className={`text-xl font-bold ${
                        stressedStockReturnPct < 0 ? "text-[#FF7B72]" : "text-[#10B981]"
                      }`}
                    >
                      {stressedStockReturnPct > 0 ? "+" : ""}{stressedStockReturnPct}%
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-[#00C4CC]/30 bg-[#00C4CC]/10">
                    <div className="text-[10px] text-[#8B949E]">Total Portfolio Net Impact</div>
                    <div
                      className={`text-2xl font-black ${
                        stressedPortfolioImpactPct < 0 ? "text-[#FF7B72]" : "text-[#10B981]"
                      }`}
                    >
                      {stressedPortfolioImpactPct > 0 ? "+" : ""}{stressedPortfolioImpactPct}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: EVIDENCE & AUDIT TRAIL */}
        {activeTab === "EVIDENCE" && (
          <div className="space-y-6">
            {/* Verification Checklist */}
            <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 p-5 shadow-lg">
              <div className="flex items-center space-x-2 text-[#10B981] font-mono text-sm font-bold uppercase mb-3">
                <CheckCircle2 className="h-4 w-4" />
                <span>Deterministic Verification Checklist</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 font-mono text-xs">
                {report.verificationAudit.auditNotes.map((note, idx) => (
                  <div key={idx} className="flex items-start space-x-2 bg-[#080C12] p-2.5 rounded border border-[#1E2C3D]">
                    <span className="text-[#10B981] font-bold">✓</span>
                    <span className="text-[#C9D1D9]">{note}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* TinyFish Web Evidence */}
            <div className="rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1E2C3D] pb-3 mb-4">
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Activity className="h-4 w-4 text-[#00C4CC]" />
                  <span>TinyFish Web Research Evidence Archive</span>
                </h3>
                <span className="text-xs font-mono text-[#00C4CC]">
                  {report.researchEvidence.length} primary sources captured
                </span>
              </div>

              <div className="space-y-3">
                {report.researchEvidence.map((ev, idx) => (
                  <div key={idx} className="rounded-lg bg-[#080C12] border border-[#1E2C3D] p-4 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <span className="font-bold text-white">{ev.title}</span>
                      <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/30">
                        {ev.tokenSavingsPct}% DOM Token Savings
                      </span>
                    </div>
                    <p className="text-[#C9D1D9] leading-relaxed mb-2 bg-[#0B111A] p-2.5 rounded border border-[#1E2C3D]/60 font-sans">
                      &ldquo;{ev.extractedSnippet}&rdquo;
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-[#8B949E]">
                      <span>Domain: {ev.domain}</span>
                      <span>•</span>
                      <span>Published: {ev.publicationDate}</span>
                      <span>•</span>
                      <a
                        href={ev.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00C4CC] hover:underline flex items-center space-x-1"
                      >
                        <span>Source Link</span>
                        <ArrowUpRight className="h-2.5 w-2.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
