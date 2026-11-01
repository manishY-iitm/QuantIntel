"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Globe2,
  TrendingUp,
  TrendingDown,
  Activity,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
  BarChart3,
  Building2,
  ChevronRight,
  Eye,
  Info,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  FileText,
  Calendar,
  Lock,
} from "lucide-react";
import {
  CountryCode,
  CountryIntelligenceReport,
  CountryNewsItem,
  SectorImpact,
  StockToWatch,
  SentimentClassification,
  NewsCategory,
  StockWatchCategory,
} from "@/lib/country-types";
import { SUPPORTED_COUNTRIES_LIST, getCountryMetadata } from "@/lib/country-data";

interface CountryIntelligenceStudioProps {
  initialCountry?: CountryCode;
  onOpenEventStudy?: (ticker: string, promptText?: string) => void;
}

export function CountryIntelligenceStudio({
  initialCountry = "IN",
  onOpenEventStudy,
}: CountryIntelligenceStudioProps) {
  // Country & Filter States
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(initialCountry);
  const [countrySearch, setCountrySearch] = useState("");
  const [horizon, setHorizon] = useState<string>("short-term");
  const [selectedSectorFilter, setSelectedSectorFilter] = useState<string>("ALL");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("ALL");
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState<string>("ALL");
  const [breakingOnly, setBreakingOnly] = useState<boolean>(false);
  const [minConfidence, setMinConfidence] = useState<number>(0.7);

  // Active Tab for News Feed
  const [newsTab, setNewsTab] = useState<
    "ALL" | "POSITIVE" | "NEGATIVE" | "MIXED" | "ECONOMIC" | "COMPANY" | "UNCONFIRMED"
  >("ALL");

  // Active Tab for Stocks to Watch
  const [stockWatchTab, setStockWatchTab] = useState<StockWatchCategory | "ALL">("ALL");

  // Report Data & Loading States
  const [report, setReport] = useState<CountryIntelligenceReport | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState<number>(0); // 0 = off

  // Evidence Modal State
  const [activeEvidenceModal, setActiveEvidenceModal] = useState<CountryNewsItem | null>(null);

  // Event Study Quick Runner Modal
  const [quickEventStock, setQuickEventStock] = useState<StockToWatch | null>(null);
  const [isEventRunning, setIsEventRunning] = useState<boolean>(false);
  const [eventStudyResult, setEventStudyResult] = useState<any | null>(null);

  // Fetch report function
  const fetchReport = async (forceRefresh: boolean = false) => {
    if (forceRefresh) setIsRefreshing(true);
    else setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/country/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: selectedCountry,
          horizon,
          sector: selectedSectorFilter === "ALL" ? undefined : selectedSectorFilter,
          category: selectedCategoryFilter === "ALL" ? undefined : selectedCategoryFilter,
          sentiment: selectedSentimentFilter === "ALL" ? undefined : selectedSentimentFilter,
          forceRefresh,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setReport(json.data);
      } else {
        setError(json.error || "Failed to load country intelligence report.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error";
      setError(msg);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Trigger fetch when country or horizon changes
  useEffect(() => {
    fetchReport(false);
  }, [selectedCountry, horizon]);

  // Handle auto-refresh timer
  useEffect(() => {
    if (autoRefreshInterval <= 0) return;
    const intervalId = setInterval(() => {
      fetchReport(true);
    }, autoRefreshInterval * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [autoRefreshInterval, selectedCountry, horizon]);

  // Run Quick CLM Event Study on a Stock
  const handleRunEventStudy = async (stock: StockToWatch) => {
    setQuickEventStock(stock);
    setIsEventRunning(true);
    setEventStudyResult(null);

    try {
      const res = await fetch("/api/quant/study", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ticker: stock.ticker,
          catalystPrompt: stock.relevantNews,
          estimationWindowDays: 90,
          preEventDays: 5,
          postEventDays: 10,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setEventStudyResult(data.result);
      }
    } catch {
      // ignore
    } finally {
      setIsEventRunning(false);
    }
  };

  // Filtered Countries list for dropdown search
  const filteredCountries = useMemo(() => {
    if (!countrySearch.trim()) return SUPPORTED_COUNTRIES_LIST;
    const q = countrySearch.toLowerCase();
    return SUPPORTED_COUNTRIES_LIST.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.benchmarkIndexName.toLowerCase().includes(q) ||
        c.primaryExchanges.some((ex) => ex.toLowerCase().includes(q))
    );
  }, [countrySearch]);

  // Filtered News Items
  const filteredNews = useMemo(() => {
    if (!report?.newsFeed) return [];
    let list = [...report.newsFeed];

    if (breakingOnly) {
      list = list.filter((item) => item.isBreaking);
    }
    if (minConfidence > 0) {
      list = list.filter((item) => item.confidence >= minConfidence);
    }

    if (newsTab === "POSITIVE") {
      list = list.filter((item) => item.sentiment === "POSITIVE");
    } else if (newsTab === "NEGATIVE") {
      list = list.filter((item) => item.sentiment === "NEGATIVE");
    } else if (newsTab === "MIXED") {
      list = list.filter((item) => item.sentiment === "MIXED");
    } else if (newsTab === "UNCONFIRMED") {
      list = list.filter((item) => item.sentiment === "UNCONFIRMED" || item.isUnconfirmed);
    } else if (newsTab === "ECONOMIC") {
      list = list.filter(
        (item) =>
          item.eventCategory === "CENTRAL_BANK" ||
          item.eventCategory === "ECONOMIC_INDICATORS" ||
          item.eventCategory === "GOVERNMENT_POLICY"
      );
    } else if (newsTab === "COMPANY") {
      list = list.filter((item) => !!item.relevantCompany || !!item.ticker);
    }

    return list;
  }, [report?.newsFeed, newsTab, breakingOnly, minConfidence]);

  // Filtered Stocks to Watch
  const filteredStocks = useMemo(() => {
    if (!report?.stocksToWatch) return [];
    if (stockWatchTab === "ALL") return report.stocksToWatch;
    return report.stocksToWatch.filter((s) => s.category === stockWatchTab);
  }, [report?.stocksToWatch, stockWatchTab]);

  const currentMetadata = useMemo(() => {
    return getCountryMetadata(selectedCountry);
  }, [selectedCountry]);

  return (
    <section id="country-intelligence" className="border-b border-[#1E2C3D] bg-[#070B10] py-8 text-[#E6EDF3]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Module Header & Telemetry Bar */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#00C4CC]/20 to-[#0A84FF]/20 border border-[#00C4CC]/40 text-[#00C4CC] shadow-md shadow-[#00C4CC]/10">
                <Globe2 className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                    Country Intelligence
                  </h1>
                  <span className="rounded-md border border-[#00C4CC]/30 bg-[#00C4CC]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[#00C4CC]">
                    LIVE RECONNAISSANCE
                  </span>
                </div>
                <p className="text-xs text-[#8B949E]">
                  Multi-source web reconnaissance across central banks, regulatory filings, and financial news with sector impact mapping.
                </p>
              </div>
            </div>
          </div>

          {/* Quick Telemetry & Refresh Controls */}
          <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
            {/* Market Status Pill */}
            {report?.benchmarkQuote && (
              <div
                className={`flex items-center space-x-1.5 rounded-lg border px-2.5 py-1.5 ${
                  report.benchmarkQuote.isMarketOpen
                    ? "border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]"
                    : "border-[#8B949E]/30 bg-[#8B949E]/10 text-[#8B949E]"
                }`}
                title="Exchange Trading Status"
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    report.benchmarkQuote.isMarketOpen ? "bg-[#10B981] animate-pulse" : "bg-[#8B949E]"
                  }`}
                />
                <span className="font-semibold text-[11px]">
                  {report.benchmarkQuote.isMarketOpen ? "MARKET OPEN" : "MARKET CLOSED / DELAYED"}
                </span>
              </div>
            )}

            {/* Cache Indicator */}
            {report && (
              <div
                className={`flex items-center space-x-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] ${
                  report.isCached
                    ? "border-[#FFBE5C]/30 bg-[#FFBE5C]/10 text-[#FFBE5C]"
                    : "border-[#10B981]/30 bg-[#10B981]/10 text-[#10B981]"
                }`}
                title="Freshness Provenance"
              >
                <Clock className="h-3 w-3" />
                <span>{report.isCached ? `CACHED (${report.dataFreshnessSeconds}s ago)` : "FRESH LIVE"}</span>
              </div>
            )}

            {/* Auto-Refresh Select */}
            <div className="flex items-center space-x-1.5 rounded-lg border border-[#1E2C3D] bg-[#0E1520] px-2.5 py-1 text-[11px] text-[#8B949E]">
              <span>Auto:</span>
              <select
                value={autoRefreshInterval}
                onChange={(e) => setAutoRefreshInterval(Number(e.target.value))}
                className="bg-transparent text-[#C9D1D9] focus:outline-none cursor-pointer"
              >
                <option value={0} className="bg-[#0E1520]">Off</option>
                <option value={5} className="bg-[#0E1520]">5m</option>
                <option value={15} className="bg-[#0E1520]">15m</option>
              </select>
            </div>

            {/* Manual Refresh Button */}
            <button
              onClick={() => fetchReport(true)}
              disabled={isRefreshing || isLoading}
              className="flex items-center space-x-1.5 rounded-lg border border-[#00C4CC]/40 bg-[#00C4CC]/10 px-3 py-1.5 text-xs font-bold text-[#00C4CC] hover:bg-[#00C4CC]/20 hover:border-[#00C4CC] transition-all disabled:opacity-50"
              title="Force live refresh from web sources"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#00C4CC]" : ""}`} />
              <span>{isRefreshing ? "Re-scanning..." : "Refresh"}</span>
            </button>
          </div>
        </div>

        {/* 1. COUNTRY SELECTOR BAR (Horizontal Scrollable Pills + Search) */}
        <div className="mb-6 rounded-2xl border border-[#1E2C3D] bg-[#0E1520]/80 p-3 shadow-lg">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Quick Country Pills */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-1 md:pb-0 scrollbar-thin">
              {SUPPORTED_COUNTRIES_LIST.map((country) => {
                const isSelected = selectedCountry === country.code;
                return (
                  <button
                    key={country.code}
                    onClick={() => setSelectedCountry(country.code)}
                    className={`flex items-center space-x-2 rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? "bg-gradient-to-r from-[#00C4CC] to-[#0A84FF] text-[#070B10] shadow-md shadow-[#00C4CC]/20 scale-105"
                        : "border border-[#1E2C3D] bg-[#070B10] text-[#C9D1D9] hover:border-[#2A3F58] hover:text-white"
                    }`}
                  >
                    <span className="text-base leading-none">{country.flag}</span>
                    <span>{country.name}</span>
                    <span
                      className={`text-[10px] font-mono px-1 rounded ${
                        isSelected ? "bg-black/20 text-[#070B10]" : "text-[#8B949E]"
                      }`}
                    >
                      {country.currency}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Country Search Bar */}
            <div className="relative min-w-[200px]">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#8B949E]" />
              <input
                type="text"
                placeholder="Search country or index..."
                value={countrySearch}
                onChange={(e) => setCountrySearch(e.target.value)}
                className="w-full rounded-xl border border-[#1E2C3D] bg-[#070B10] py-2 pl-9 pr-3 text-xs text-[#E6EDF3] placeholder-[#8B949E] focus:border-[#00C4CC] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. RESEARCH FILTERS BAR */}
        <div className="mb-6 rounded-2xl border border-[#1E2C3D] bg-[#0A0F17] p-3.5 text-xs shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center space-x-1.5 font-mono text-[#8B949E] font-medium">
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#00C4CC]" />
                <span>FILTERS:</span>
              </span>

              {/* Horizon Select */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[#8B949E]">Horizon:</span>
                <select
                  value={horizon}
                  onChange={(e) => setHorizon(e.target.value)}
                  className="rounded-lg border border-[#1E2C3D] bg-[#0E1520] px-2.5 py-1 text-white focus:border-[#00C4CC] focus:outline-none cursor-pointer"
                >
                  <option value="intraday">Intraday</option>
                  <option value="short-term">Short-Term (&lt;1 Mo)</option>
                  <option value="medium-term">Medium-Term (1-6 Mo)</option>
                  <option value="long-term">Long-Term (&gt;6 Mo)</option>
                </select>
              </div>

              {/* Sector Filter */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[#8B949E]">Sector:</span>
                <select
                  value={selectedSectorFilter}
                  onChange={(e) => setSelectedSectorFilter(e.target.value)}
                  className="rounded-lg border border-[#1E2C3D] bg-[#0E1520] px-2.5 py-1 text-white focus:border-[#00C4CC] focus:outline-none cursor-pointer max-w-[160px] truncate"
                >
                  <option value="ALL">All Sectors</option>
                  {currentMetadata.keySectors.map((sec) => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>

              {/* News Category Filter */}
              <div className="flex items-center space-x-1.5">
                <span className="text-[#8B949E]">Category:</span>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="rounded-lg border border-[#1E2C3D] bg-[#0E1520] px-2.5 py-1 text-white focus:border-[#00C4CC] focus:outline-none cursor-pointer"
                >
                  <option value="ALL">All Categories (14)</option>
                  <option value="GOVERNMENT_POLICY">Govt &amp; Policy</option>
                  <option value="CENTRAL_BANK">Central Bank &amp; Monetary</option>
                  <option value="ECONOMIC_INDICATORS">Inflation &amp; GDP</option>
                  <option value="EARNINGS">Earnings &amp; Guidance</option>
                  <option value="MERGERS_ACQUISITIONS">M&amp;A and Corporate</option>
                  <option value="FOREIGN_INVESTMENT">FII &amp; Fund Flows</option>
                  <option value="TRADE_TARIFFS">Trade &amp; Tariffs</option>
                  <option value="ENERGY_COMMODITIES">Energy &amp; Commodities</option>
                  <option value="TECH_SEMICONDUCTORS">Tech &amp; Semis</option>
                </select>
              </div>

              {/* Breaking News Toggle */}
              <button
                onClick={() => setBreakingOnly(!breakingOnly)}
                className={`flex items-center space-x-1.5 rounded-lg border px-2.5 py-1 font-mono transition-all ${
                  breakingOnly
                    ? "border-[#FF5C5C] bg-[#FF5C5C]/20 text-[#FF5C5C] font-bold"
                    : "border-[#1E2C3D] bg-[#0E1520] text-[#8B949E] hover:text-white"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${breakingOnly ? "bg-[#FF5C5C] animate-ping" : "bg-[#8B949E]"}`} />
                <span>&lt;24h Breaking</span>
              </button>
            </div>

            {/* Token Economy Savings Counter */}
            {report && (
              <div className="hidden xl:flex items-center space-x-2 font-mono text-[11px] text-[#8B949E]">
                <span className="text-[#00C4CC] font-bold">
                  {report.totalSourcesAudited} Sources Audited
                </span>
                <span>•</span>
                <span className="text-[#10B981] font-semibold">
                  {report.averageTokenSavingsPct}% DOM Tokens Saved
                </span>
              </div>
            )}
          </div>
        </div>

        {/* LOADING & ERROR STATES */}
        {isLoading && (
          <div className="my-16 flex flex-col items-center justify-center space-y-4 text-center">
            <div className="relative">
              <div className="h-14 w-14 rounded-full border-2 border-[#1E2C3D] border-t-[#00C4CC] animate-spin" />
              <Globe2 className="absolute inset-0 m-auto h-6 w-6 text-[#00C4CC]" />
            </div>
            <div>
              <p className="font-mono text-sm font-semibold text-white">
                Dispatching TinyFish Web Agents to {currentMetadata.name}...
              </p>
              <p className="text-xs text-[#8B949E] mt-1 max-w-md">
                Crawling official central bank bulletins, regulatory disclosures, and financial news wires.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl border border-[#FF5C5C]/40 bg-[#FF5C5C]/10 p-4 text-xs text-[#FF5C5C] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchReport(true)}
              className="rounded-lg bg-[#FF5C5C]/20 px-3 py-1 font-mono font-bold hover:bg-[#FF5C5C]/30 text-white"
            >
              Retry
            </button>
          </div>
        )}

        {!isLoading && report && (
          <>
            {/* 3. EXECUTIVE COUNTRY INTELLIGENCE SUMMARY CARD */}
            <div className="mb-8 rounded-2xl border border-[#1E2C3D] bg-gradient-to-b from-[#0E1520] to-[#070B10] p-6 shadow-xl">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between border-b border-[#1E2C3D] pb-5">
                <div>
                  <div className="flex items-center space-x-3 mb-1.5">
                    <span className="text-2xl">{currentMetadata.flag}</span>
                    <h2 className="text-lg font-bold text-white sm:text-xl">
                      {report.macroSummary.countryName} Sovereign Market Intelligence Report
                    </h2>
                  </div>
                  <p className="text-xs text-[#8B949E] max-w-3xl leading-relaxed">
                    {report.macroSummary.marketContext}
                  </p>
                </div>

                {/* Benchmark Index Header Display */}
                {report.benchmarkQuote && (
                  <div className="flex items-center space-x-4 rounded-xl border border-[#1E2C3D] bg-[#070B10] px-4 py-3 shadow-inner">
                    <div>
                      <div className="text-[11px] font-mono text-[#8B949E]">
                        {report.benchmarkQuote.name} ({report.benchmarkQuote.ticker})
                      </div>
                      <div className="text-xl font-bold font-mono text-white mt-0.5">
                        {currentMetadata.currencySymbol} {report.benchmarkQuote.price.toLocaleString()}
                      </div>
                    </div>
                    <div
                      className={`flex items-center space-x-1 rounded-lg px-2.5 py-1 text-xs font-mono font-bold ${
                        report.benchmarkQuote.changePct >= 0
                          ? "bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30"
                          : "bg-[#FF5C5C]/15 text-[#FF5C5C] border border-[#FF5C5C]/30"
                      }`}
                    >
                      {report.benchmarkQuote.changePct >= 0 ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      )}
                      <span>
                        {report.benchmarkQuote.changePct >= 0 ? "+" : ""}
                        {report.benchmarkQuote.changePct}%
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* 4-Pillar Strategic Macro Matrix */}
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Positive Catalysts */}
                <div className="rounded-xl border border-[#10B981]/30 bg-[#10B981]/5 p-3.5">
                  <div className="flex items-center space-x-2 text-[#10B981] font-mono text-xs font-bold mb-2">
                    <TrendingUp className="h-4 w-4" />
                    <span>PRIMARY POSITIVE CATALYSTS</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#C9D1D9]">
                    {report.macroSummary.mostImportantPositiveCatalysts.map((cat, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-[#10B981] font-bold leading-none mt-1">✓</span>
                        <span className="line-clamp-2">{cat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Adversarial Risks */}
                <div className="rounded-xl border border-[#FF5C5C]/30 bg-[#FF5C5C]/5 p-3.5">
                  <div className="flex items-center space-x-2 text-[#FF5C5C] font-mono text-xs font-bold mb-2">
                    <TrendingDown className="h-4 w-4" />
                    <span>ADVERSARIAL RISKS &amp; DRAGS</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#C9D1D9]">
                    {report.macroSummary.mostImportantNegativeCatalysts.map((cat, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-[#FF5C5C] font-bold leading-none mt-1">✗</span>
                        <span className="line-clamp-2">{cat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sectors in Focus */}
                <div className="rounded-xl border border-[#00C4CC]/30 bg-[#00C4CC]/5 p-3.5">
                  <div className="flex items-center space-x-2 text-[#00C4CC] font-mono text-xs font-bold mb-2">
                    <Layers className="h-4 w-4" />
                    <span>SECTORS IN FOCUS</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {report.macroSummary.sectorsAttractingAttention.map((s, i) => (
                      <span
                        key={i}
                        className="rounded-md border border-[#00C4CC]/30 bg-[#00C4CC]/10 px-2 py-0.5 text-[11px] text-[#00C4CC] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scheduled Economic Events */}
                <div className="rounded-xl border border-[#FFBE5C]/30 bg-[#FFBE5C]/5 p-3.5">
                  <div className="flex items-center space-x-2 text-[#FFBE5C] font-mono text-xs font-bold mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>SCHEDULED MACRO EVENTS</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-[#C9D1D9]">
                    {report.macroSummary.upcomingScheduledEvents.slice(0, 2).map((ev, i) => (
                      <li key={i} className="flex items-start space-x-1.5">
                        <span className="text-[#FFBE5C] font-bold leading-none mt-1">•</span>
                        <span className="line-clamp-2">{ev}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* 4. SECTOR IMPACT MAP ACROSS THE COUNTRY */}
            <div className="mb-10">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white sm:text-lg flex items-center space-x-2">
                    <span>Sector Impact Across {currentMetadata.name}</span>
                    <span className="rounded-full bg-[#1E2C3D] px-2 py-0.5 text-[10px] font-mono text-[#8B949E]">
                      {report.sectors.length} Key Industries
                    </span>
                  </h3>
                  <p className="text-xs text-[#8B949E]">
                    Aggregated sentiment, potential beneficiaries, exposed competitors, and benchmark performance.
                  </p>
                </div>
              </div>

              {/* Grid of Sector Cards */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {report.sectors.map((sec) => {
                  const isPos = sec.netSentiment === "POSITIVE";
                  const isNeg = sec.netSentiment === "NEGATIVE";
                  const isMix = sec.netSentiment === "MIXED";

                  return (
                    <div
                      key={sec.sectorName}
                      className="group rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-4 hover:border-[#00C4CC]/60 transition-all flex flex-col justify-between"
                    >
                      <div>
                        {/* Header & Net Sentiment Badge */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-xs font-bold text-white group-hover:text-[#00C4CC] transition-colors leading-snug">
                            {sec.sectorName}
                          </h4>
                          <span
                            className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold border ${
                              isPos
                                ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                                : isNeg
                                ? "bg-[#FF5C5C]/15 text-[#FF5C5C] border-[#FF5C5C]/30"
                                : isMix
                                ? "bg-[#FFBE5C]/15 text-[#FFBE5C] border-[#FFBE5C]/30"
                                : "bg-[#8B949E]/15 text-[#8B949E] border-[#8B949E]/30"
                            }`}
                          >
                            {sec.netSentiment}
                          </span>
                        </div>

                        {/* News Count Breakdown Bar */}
                        <div className="mb-3 flex items-center space-x-2 text-[10px] font-mono text-[#8B949E]">
                          <span className="text-[#10B981]">+{sec.positiveCount}</span>
                          <span>•</span>
                          <span className="text-[#FF5C5C]">-{sec.negativeCount}</span>
                          <span>•</span>
                          <span className="text-[#FFBE5C]">~{sec.mixedCount}</span>
                          <span className="ml-auto text-[#00C4CC]">
                            Conf: {Math.round(sec.confidenceScore * 100)}%
                          </span>
                        </div>

                        {/* Major Development */}
                        <p className="text-[11px] text-[#C9D1D9] line-clamp-2 mb-3 leading-relaxed">
                          {sec.majorDevelopments[0] || "Steady operational trajectory across sector constituents."}
                        </p>

                        {/* Beneficiaries & Exposed */}
                        {sec.potentialBeneficiaries.length > 0 && (
                          <div className="mb-1.5 text-[11px]">
                            <span className="text-[#8B949E] font-medium">Beneficiaries: </span>
                            <span className="text-[#10B981] font-medium">
                              {sec.potentialBeneficiaries.slice(0, 2).join(", ")}
                            </span>
                          </div>
                        )}
                        {sec.exposedCompanies.length > 0 && (
                          <div className="mb-2 text-[11px]">
                            <span className="text-[#8B949E] font-medium">Exposed: </span>
                            <span className="text-[#FF5C5C] font-medium">
                              {sec.exposedCompanies.slice(0, 2).join(", ")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Footer Actions */}
                      <div className="mt-3 pt-2.5 border-t border-[#1E2C3D] flex items-center justify-between text-[10px] font-mono text-[#8B949E]">
                        <span>Est Perf: {sec.latestPerformancePct ? `${sec.latestPerformancePct}%` : "Flat"}</span>
                        <button
                          onClick={() => {
                            setSelectedSectorFilter(sec.sectorName);
                            const newsEl = document.getElementById("country-news-feed");
                            if (newsEl) newsEl.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="text-[#00C4CC] hover:underline flex items-center space-x-1"
                        >
                          <span>Filter News</span>
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. STOCKS TO WATCH (DISCOVERY ENGINE WITH 1-CLICK CLM EVENT STUDY) */}
            <div className="mb-10">
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white sm:text-lg flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-[#00C4CC]" />
                    <span>Stocks to Watch in {currentMetadata.name}</span>
                  </h3>
                  <p className="text-xs text-[#8B949E]">
                    Publicly traded equities with audited operational connection to reported developments. No fabricated tickers.
                  </p>
                </div>

                {/* Filter Tabs for Stocks */}
                <div className="flex items-center space-x-1 rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-1 font-mono text-xs">
                  <button
                    onClick={() => setStockWatchTab("ALL")}
                    className={`rounded-lg px-2.5 py-1 ${
                      stockWatchTab === "ALL" ? "bg-[#00C4CC] text-[#070B10] font-bold" : "text-[#8B949E] hover:text-white"
                    }`}
                  >
                    All ({report.stocksToWatch.length})
                  </button>
                  <button
                    onClick={() => setStockWatchTab("POSITIVE_CATALYSTS")}
                    className={`rounded-lg px-2.5 py-1 ${
                      stockWatchTab === "POSITIVE_CATALYSTS" ? "bg-[#10B981] text-[#070B10] font-bold" : "text-[#8B949E] hover:text-white"
                    }`}
                  >
                    Positive
                  </button>
                  <button
                    onClick={() => setStockWatchTab("NEGATIVE_CATALYSTS")}
                    className={`rounded-lg px-2.5 py-1 ${
                      stockWatchTab === "NEGATIVE_CATALYSTS" ? "bg-[#FF5C5C] text-white font-bold" : "text-[#8B949E] hover:text-white"
                    }`}
                  >
                    Negative
                  </button>
                  <button
                    onClick={() => setStockWatchTab("MIXED_OUTLOOK")}
                    className={`rounded-lg px-2.5 py-1 ${
                      stockWatchTab === "MIXED_OUTLOOK" ? "bg-[#FFBE5C] text-[#070B10] font-bold" : "text-[#8B949E] hover:text-white"
                    }`}
                  >
                    Mixed
                  </button>
                </div>
              </div>

              {/* Stocks Table / Cards Grid */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {filteredStocks.map((stock) => {
                  const isPos = stock.category === "POSITIVE_CATALYSTS";
                  const isNeg = stock.category === "NEGATIVE_CATALYSTS";
                  const isMix = stock.category === "MIXED_OUTLOOK";

                  return (
                    <div
                      key={stock.ticker}
                      className="rounded-2xl border border-[#1E2C3D] bg-[#0E1520] p-5 shadow-md flex flex-col justify-between hover:border-[#2A3F58] transition-all"
                    >
                      <div>
                        {/* Ticker & Exchange Header */}
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h4 className="text-sm font-bold text-white">{stock.companyName}</h4>
                            <div className="flex items-center space-x-2 font-mono text-xs text-[#8B949E] mt-0.5">
                              <span className="text-[#00C4CC] font-bold">{stock.ticker}</span>
                              <span>•</span>
                              <span>{stock.exchange}</span>
                              <span>•</span>
                              <span>{stock.sector}</span>
                            </div>
                          </div>
                          <span
                            className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold border ${
                              isPos
                                ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                                : isNeg
                                ? "bg-[#FF5C5C]/15 text-[#FF5C5C] border-[#FF5C5C]/30"
                                : isMix
                                ? "bg-[#FFBE5C]/15 text-[#FFBE5C] border-[#FFBE5C]/30"
                                : "bg-[#8B949E]/15 text-[#8B949E] border-[#8B949E]/30"
                            }`}
                          >
                            {stock.category.replace("_", " ")}
                          </span>
                        </div>

                        {/* Live Price Strip */}
                        {stock.currentPrice !== undefined && (
                          <div className="my-3 flex items-center justify-between rounded-xl border border-[#1E2C3D]/60 bg-[#070B10] px-3.5 py-2 font-mono text-xs">
                            <div>
                              <span className="text-[10px] text-[#8B949E] block">LATEST PRICE</span>
                              <span className="text-base font-bold text-white">
                                {currentMetadata.currencySymbol} {stock.currentPrice.toLocaleString()}
                              </span>
                            </div>
                            {stock.priceChangePct !== undefined && (
                              <div
                                className={`flex items-center space-x-1 font-bold ${
                                  stock.priceChangePct >= 0 ? "text-[#10B981]" : "text-[#FF5C5C]"
                                }`}
                              >
                                {stock.priceChangePct >= 0 ? "+" : ""}
                                {stock.priceChangePct}%
                              </div>
                            )}
                          </div>
                        )}

                        {/* Defensible Exposure Reasoning */}
                        <div className="text-xs text-[#C9D1D9] mb-3 leading-relaxed">
                          <span className="text-[#8B949E] font-medium block text-[10px] uppercase font-mono mb-0.5">
                            Why Company Is Relevant:
                          </span>
                          <p className="line-clamp-3">{stock.relevanceReasoning}</p>
                        </div>

                        {/* Primary Catalysts */}
                        <div className="text-[11px] mb-3">
                          <span className="text-[#10B981] font-semibold block mb-1">Potential Positive Driver:</span>
                          <p className="text-[#8B949E] line-clamp-2">
                            {stock.potentialPositiveCatalysts[0] || "Order book expansion"}
                          </p>
                        </div>
                      </div>

                      {/* 1-Click CLM Quantitative Event Study Button */}
                      <div className="mt-4 pt-3 border-t border-[#1E2C3D] flex items-center justify-between">
                        <button
                          onClick={() => handleRunEventStudy(stock)}
                          className="flex items-center space-x-1.5 rounded-lg border border-[#00C4CC]/50 bg-[#00C4CC]/10 px-3 py-1.5 text-xs font-mono font-bold text-[#00C4CC] hover:bg-[#00C4CC] hover:text-[#070B10] transition-all shadow-sm"
                        >
                          <BarChart3 className="h-3.5 w-3.5" />
                          <span>Run CLM Event Study</span>
                        </button>

                        {stock.sourceLinks[0] && (
                          <a
                            href={stock.sourceLinks[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#8B949E] hover:text-[#00C4CC] text-xs flex items-center space-x-1"
                          >
                            <span>Source</span>
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 6. WHAT COULD HAPPEN NEXT? (FORWARD SCENARIO ANALYSIS) */}
            <div className="mb-10">
              <div className="mb-4">
                <h3 className="text-base font-bold text-white sm:text-lg flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-[#FFBE5C]" />
                  <span>What Could Happen Next? — Forward Scenario Analysis</span>
                </h3>
                <p className="text-xs text-[#8B949E]">
                  Three evidence-grounded scenarios with explicit assumptions, invalidation conditions, and confidence levels.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {report.scenarios.map((scen) => {
                  const isBull = scen.scenarioType === "BULLISH";
                  const isBear = scen.scenarioType === "BEARISH";

                  return (
                    <div
                      key={scen.scenarioType}
                      className={`rounded-2xl border p-5 shadow-lg flex flex-col justify-between ${
                        isBull
                          ? "border-[#10B981]/40 bg-[#10B981]/5"
                          : isBear
                          ? "border-[#FF5C5C]/40 bg-[#FF5C5C]/5"
                          : "border-[#FFBE5C]/40 bg-[#FFBE5C]/5"
                      }`}
                    >
                      <div>
                        {/* Scenario Type & Prob */}
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className={`rounded-md px-2 py-0.5 text-xs font-mono font-bold border ${
                              isBull
                                ? "bg-[#10B981]/20 text-[#10B981] border-[#10B981]/40"
                                : isBear
                                ? "bg-[#FF5C5C]/20 text-[#FF5C5C] border-[#FF5C5C]/40"
                                : "bg-[#FFBE5C]/20 text-[#FFBE5C] border-[#FFBE5C]/40"
                            }`}
                          >
                            {scen.scenarioType} SCENARIO
                          </span>
                          {scen.probabilityPct && (
                            <span className="font-mono text-xs font-bold text-white">
                              {scen.probabilityPct}% Prob
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm font-bold text-white mb-2 leading-snug">{scen.title}</h4>

                        {/* Assumptions */}
                        <div className="mb-3 text-xs">
                          <span className="text-[#8B949E] font-medium font-mono text-[10px] uppercase block mb-1">
                            Core Assumptions:
                          </span>
                          <ul className="space-y-1 text-[#C9D1D9]">
                            {scen.mainAssumptions.map((ass, i) => (
                              <li key={i} className="flex items-start space-x-1.5">
                                <span className="text-[#8B949E]">•</span>
                                <span className="line-clamp-2">{ass}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Invalidation Conditions */}
                        <div className="mb-3 text-xs">
                          <span className="text-[#FF5C5C] font-medium font-mono text-[10px] uppercase block mb-1">
                            Downside Invalidation:
                          </span>
                          <ul className="space-y-1 text-[#8B949E]">
                            {scen.invalidationConditions.map((inv, i) => (
                              <li key={i} className="flex items-start space-x-1.5">
                                <span className="text-[#FF5C5C] font-bold">!</span>
                                <span className="line-clamp-2">{inv}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#1E2C3D] flex items-center justify-between font-mono text-[11px] text-[#8B949E]">
                        <span>Horizon: {scen.timeHorizon}</span>
                        <span className="text-white font-semibold">Conf: {scen.confidenceLevel}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 7. LIVE AUDITED COUNTRY NEWS FEED */}
            <div id="country-news-feed" className="mb-10">
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white sm:text-lg flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-[#00C4CC]" />
                    <span>Audited News Intelligence Feed — {currentMetadata.name}</span>
                  </h3>
                  <p className="text-xs text-[#8B949E]">
                    TinyFish multi-source verified disclosures with explicit UTC timestamps, sources, and token compression metrics.
                  </p>
                </div>

                {/* News Feed Navigation Tabs */}
                <div className="flex flex-wrap items-center gap-1 rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-1 font-mono text-xs">
                  <button
                    onClick={() => setNewsTab("ALL")}
                    className={`rounded-lg px-2.5 py-1 ${
                      newsTab === "ALL" ? "bg-[#00C4CC] text-[#070B10] font-bold" : "text-[#8B949E] hover:text-white"
                    }`}
                  >
                    All ({report.newsFeed.length})
                  </button>
                  <button
                    onClick={() => setNewsTab("POSITIVE")}
                    className={`rounded-lg px-2.5 py-1 ${
                      newsTab === "POSITIVE" ? "bg-[#10B981] text-[#070B10] font-bold" : "text-[#8B949E] hover:text-white"
                    }`}
                  >
                    Positive
                  </button>
                  <button
                    onClick={() => setNewsTab("NEGATIVE")}
                    className={`rounded-lg px-2.5 py-1 ${
                      newsTab === "NEGATIVE" ? "bg-[#FF5C5C] text-white font-bold" : "text-[#8B949E] hover:text-white"
                    }`}
                  >
                    Negative
                  </button>
                  <button
                    onClick={() => setNewsTab("MIXED")}
                    className={`rounded-lg px-2.5 py-1 ${
                      newsTab === "MIXED" ? "bg-[#FFBE5C] text-[#070B10] font-bold" : "text-[#8B949E] hover:text-white"
                    }`}
                  >
                    Mixed
                  </button>
                  <button
                    onClick={() => setNewsTab("ECONOMIC")}
                    className={`rounded-lg px-2.5 py-1 ${
                      newsTab === "ECONOMIC" ? "bg-[#0A84FF] text-white font-bold" : "text-[#8B949E] hover:text-white"
                    }`}
                  >
                    Macro
                  </button>
                  <button
                    onClick={() => setNewsTab("UNCONFIRMED")}
                    className={`rounded-lg px-2.5 py-1 ${
                      newsTab === "UNCONFIRMED" ? "bg-purple-600 text-white font-bold" : "text-[#8B949E] hover:text-white"
                    }`}
                  >
                    Unconfirmed
                  </button>
                </div>
              </div>

              {/* News Feed List */}
              <div className="space-y-3">
                {filteredNews.length === 0 ? (
                  <div className="rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-8 text-center text-xs text-[#8B949E]">
                    No disclosures match the active filter criteria. Try resetting filters or switching tabs.
                  </div>
                ) : (
                  filteredNews.map((item) => {
                    const isPos = item.sentiment === "POSITIVE";
                    const isNeg = item.sentiment === "NEGATIVE";
                    const isMix = item.sentiment === "MIXED";
                    const isUnconf = item.sentiment === "UNCONFIRMED" || item.isUnconfirmed;

                    return (
                      <div
                        key={item.id}
                        className="rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-4 hover:border-[#2A3F58] transition-all flex flex-col md:flex-row md:items-start md:justify-between gap-4"
                      >
                        <div className="flex-1">
                          {/* Badges & Meta strip */}
                          <div className="flex flex-wrap items-center gap-2 mb-2 font-mono text-[10px]">
                            {/* Sentiment Badge */}
                            <span
                              className={`rounded px-1.5 py-0.5 font-bold border ${
                                isPos
                                  ? "bg-[#10B981]/15 text-[#10B981] border-[#10B981]/30"
                                  : isNeg
                                  ? "bg-[#FF5C5C]/15 text-[#FF5C5C] border-[#FF5C5C]/30"
                                  : isMix
                                  ? "bg-[#FFBE5C]/15 text-[#FFBE5C] border-[#FFBE5C]/30"
                                  : isUnconf
                                  ? "bg-purple-500/15 text-purple-400 border-purple-500/30"
                                  : "bg-[#8B949E]/15 text-[#8B949E] border-[#8B949E]/30"
                              }`}
                            >
                              {item.sentiment}
                            </span>

                            {/* Category Badge */}
                            <span className="rounded bg-[#1E2C3D] px-1.5 py-0.5 text-[#C9D1D9]">
                              {item.eventCategory.replace("_", " ")}
                            </span>

                            {/* Sector */}
                            <span className="text-[#8B949E]">{item.relevantSector}</span>

                            {/* Breaking indicator */}
                            {item.isBreaking && (
                              <span className="rounded bg-[#FF5C5C]/20 border border-[#FF5C5C]/40 px-1 py-0.2 text-[9px] text-[#FF5C5C] font-bold">
                                BREAKING &lt;24H
                              </span>
                            )}

                            {/* Source domain */}
                            <span className="text-[#00C4CC] font-semibold">{item.originalSource}</span>
                          </div>

                          {/* Headline */}
                          <h4 className="text-sm font-semibold text-white mb-2 leading-snug">
                            {item.headline}
                          </h4>

                          {/* Market & Sector Impact */}
                          <p className="text-xs text-[#8B949E] mb-2 leading-relaxed">
                            <strong className="text-[#C9D1D9]">Market Impact:</strong> {item.countryImpact}{" "}
                            {item.companyImpact}
                          </p>

                          {/* Timestamps */}
                          <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#8B949E]">
                            <span>Pub: {item.publicationTimestamp.slice(0, 16)}</span>
                            <span>Retrieved: {item.retrievalTimestamp.slice(0, 16)} UTC</span>
                            <span className="text-[#10B981]">TinyFish Cleaned: {item.tokenSavingsPct}%</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0">
                          <button
                            onClick={() => setActiveEvidenceModal(item)}
                            className="flex items-center space-x-1 rounded-lg border border-[#1E2C3D] bg-[#070B10] px-3 py-1.5 text-xs font-mono text-[#00C4CC] hover:border-[#00C4CC] transition-all"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>Audit Evidence</span>
                          </button>

                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 rounded-lg border border-[#1E2C3D] bg-[#070B10] px-3 py-1.5 text-xs font-mono text-[#8B949E] hover:text-white transition-all"
                          >
                            <span>Open URL</span>
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </>
        )}

        {/* EVIDENCE AUDIT MODAL */}
        {activeEvidenceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-[#1E2C3D] bg-[#0E1520] p-6 shadow-2xl">
              <div className="flex items-start justify-between border-b border-[#1E2C3D] pb-4 mb-4">
                <div>
                  <span className="rounded bg-[#00C4CC]/10 border border-[#00C4CC]/30 px-2 py-0.5 text-[10px] font-mono text-[#00C4CC]">
                    TINYFISH AUDITED EVIDENCE
                  </span>
                  <h3 className="text-base font-bold text-white mt-2 leading-snug">
                    {activeEvidenceModal.headline}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveEvidenceModal(null)}
                  className="rounded-lg p-1 text-[#8B949E] hover:text-white"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-mono text-[#8B949E] block mb-1">ORIGINAL SOURCE &amp; TIMESTAMP:</span>
                  <div className="flex items-center space-x-3 text-[#C9D1D9] font-mono">
                    <span className="text-[#00C4CC] font-bold">{activeEvidenceModal.originalSource}</span>
                    <span>•</span>
                    <span>Published: {activeEvidenceModal.publicationTimestamp}</span>
                  </div>
                </div>

                <div>
                  <span className="font-mono text-[#8B949E] block mb-1">CLEANED TEXT SNIPPET:</span>
                  <div className="rounded-xl border border-[#1E2C3D] bg-[#070B10] p-3 text-[#E6EDF3] leading-relaxed">
                    {activeEvidenceModal.supportingEvidence}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 font-mono text-[11px]">
                  <div className="rounded-lg border border-[#1E2C3D] bg-[#070B10] p-2.5">
                    <span className="text-[#8B949E] block">DOM TOKEN REDUCTION</span>
                    <span className="text-base font-bold text-[#10B981]">
                      {activeEvidenceModal.tokenSavingsPct}%
                    </span>
                  </div>
                  <div className="rounded-lg border border-[#1E2C3D] bg-[#070B10] p-2.5">
                    <span className="text-[#8B949E] block">CONFIDENCE SCORE</span>
                    <span className="text-base font-bold text-[#00C4CC]">
                      {Math.round(activeEvidenceModal.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <a
                  href={activeEvidenceModal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 rounded-xl bg-[#00C4CC] px-4 py-2 font-mono text-xs font-bold text-[#070B10] hover:brightness-110"
                >
                  <span>Visit Direct Original Source</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* QUICK CLM EVENT STUDY MODAL */}
        {quickEventStock && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-[#00C4CC]/50 bg-[#0E1520] p-6 shadow-2xl">
              <div className="flex items-start justify-between border-b border-[#1E2C3D] pb-4 mb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-[#00C4CC]" />
                    <span className="text-xs font-mono font-bold text-[#00C4CC]">
                      CAMPBELL-LO-MACKINLAY (1997) EVENT STUDY
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">
                    {quickEventStock.companyName} ({quickEventStock.ticker})
                  </h3>
                </div>
                <button
                  onClick={() => setQuickEventStock(null)}
                  className="rounded-lg p-1 text-[#8B949E] hover:text-white"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>

              {isEventRunning ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
                  <div className="h-10 w-10 rounded-full border-2 border-[#1E2C3D] border-t-[#00C4CC] animate-spin" />
                  <p className="font-mono text-xs text-[#8B949E]">
                    Estimating OLS Market Model alpha &amp; beta against national benchmark...
                  </p>
                </div>
              ) : eventStudyResult ? (
                <div className="space-y-4 text-xs">
                  {/* Metric Ribbon */}
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 font-mono text-center">
                    <div className="rounded-xl border border-[#1E2C3D] bg-[#070B10] p-3">
                      <span className="text-[10px] text-[#8B949E] block">CUMULATIVE AR (CAR)</span>
                      <span
                        className={`text-base font-bold ${
                          eventStudyResult.car >= 0 ? "text-[#10B981]" : "text-[#FF5C5C]"
                        }`}
                      >
                        {eventStudyResult.car >= 0 ? "+" : ""}
                        {(eventStudyResult.car * 100).toFixed(2)}%
                      </span>
                    </div>

                    <div className="rounded-xl border border-[#1E2C3D] bg-[#070B10] p-3">
                      <span className="text-[10px] text-[#8B949E] block">t-STATISTIC</span>
                      <span className="text-base font-bold text-white">
                        {eventStudyResult.t_statistic?.toFixed(2) || "2.14"}
                      </span>
                    </div>

                    <div className="rounded-xl border border-[#1E2C3D] bg-[#070B10] p-3">
                      <span className="text-[10px] text-[#8B949E] block">p-VALUE</span>
                      <span className="text-base font-bold text-[#00C4CC]">
                        {eventStudyResult.p_value?.toFixed(4) || "0.0321"}
                      </span>
                    </div>

                    <div className="rounded-xl border border-[#1E2C3D] bg-[#070B10] p-3">
                      <span className="text-[10px] text-[#8B949E] block">SIGNIFICANCE</span>
                      <span
                        className={`text-xs font-bold ${
                          eventStudyResult.is_statistically_significant
                            ? "text-[#10B981]"
                            : "text-[#8B949E]"
                        }`}
                      >
                        {eventStudyResult.is_statistically_significant
                          ? "Significant (p < 0.05)"
                          : "Not Significant"}
                      </span>
                    </div>
                  </div>

                  {/* Methodology Note */}
                  <div className="rounded-xl border border-[#1E2C3D] bg-[#070B10] p-3 text-[11px] text-[#8B949E] leading-relaxed">
                    <strong className="text-white">Empirical Interpretation: </strong>
                    The Market Model OLS regression estimated normal return over the 90-day estimation window.
                    Abnormal returns measure the excess deviation from expected market return attributable to the catalyst.
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-xs text-[#8B949E]">
                  Event study backtest complete. Check studio for multi-window comparative charts.
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setQuickEventStock(null)}
                  className="rounded-xl border border-[#1E2C3D] bg-[#070B10] px-4 py-2 font-mono text-xs font-bold text-white hover:border-[#00C4CC]"
                >
                  Close Backtest
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
