"use client";

import React, { useState } from "react";
import { Terminal, Copy, Check, Play, FileCode, CheckCircle2, Sparkles, Layers } from "lucide-react";

export function ApiDocsExplorer() {
  const [activeLang, setActiveLang] = useState<"PYTHON" | "CURL" | "TYPESCRIPT">("PYTHON");
  const [selectedEndpoint, setSelectedEndpoint] = useState<"FORECAST" | "EVENT_STUDY" | "TINYFISH">("FORECAST");
  const [tickerParam, setTickerParam] = useState<string>("NVDA");
  const [horizonParam, setHorizonParam] = useState<string>("1y");
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [showResponse, setShowResponse] = useState<boolean>(false);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setShowResponse(false);
    setTimeout(() => {
      setIsSimulating(false);
      setShowResponse(true);
    }, 600);
  };

  const getCodeSnippet = () => {
    if (selectedEndpoint === "FORECAST") {
      if (activeLang === "PYTHON") {
        return `from quantintel.futurestock import FutureStockOrchestrator

# Initialize 8-agent research orchestrator
orchestrator = FutureStockOrchestrator()

# Execute autonomous quantitative research & forecasting
report = orchestrator.research(
    ticker="${tickerParam}",
    horizon="${horizonParam}",
    iterations=2000,
    enable_web_research=True
)

# Access strictly validated target prices and quant metrics
print(f"Company: {report.company_profile.company_name}")
for scenario in report.scenarios:
    print(f"[{scenario.scenario_type}] Target: {report.company_profile.currency} {scenario.target_price:.2f} ({scenario.potential_return_pct:+.2f}%)")

# Access Monte Carlo quantiles & Value at Risk
print(f"95% Value at Risk: -{report.monteCarlo.var_95_pct:.2f}%")
print(f"DCF Fair Value: {report.company_profile.currency} {report.valuation.dcf_base_price:.2f}")`;
      } else if (activeLang === "CURL") {
        return `curl -X POST "https://api.quantintel.ai/v1/futurestock/forecast" \\
  -H "Authorization: Bearer qnt_live_token_sec" \\
  -H "Content-Type: application/json" \\
  -d '{
    "ticker": "${tickerParam}",
    "horizon": "${horizonParam}",
    "monte_carlo_iterations": 2000,
    "include_historical_analogs": true,
    "dcf_discount_rate": 0.095
  }'`;
      } else {
        return `import { FutureStockClient } from "@quantintel/sdk";

const client = new FutureStockClient({
  apiKey: process.env.QUANTINTEL_API_KEY
});

const report = await client.futurestock.research({
  ticker: "${tickerParam}",
  horizon: "${horizonParam}",
  iterations: 2000
});

console.log("Base Target:", report.scenarios.find(s => s.scenarioType === "BASE")?.targetPrice);
console.log("Monte Carlo Median:", report.monteCarlo.medianFinalPrice);`;
      }
    } else if (selectedEndpoint === "EVENT_STUDY") {
      if (activeLang === "PYTHON") {
        return `from quantintel.core.engine import QuantEngine
from quantintel.core.schemas import EventStudyConfig

engine = QuantEngine()

config = EventStudyConfig(
    ticker="${tickerParam}",
    benchmark_ticker="SPY",
    event_date="2024-04-15",
    estimation_window=90,
    event_window_pre=5,
    event_window_post=10
)

# Run OLS event study backtest with exact UTC timestamp synchronization
result = engine.run_study(config)

print(f"Cumulative Abnormal Return (CAR): {result.cumulative_abnormal_return:+.4f}")
print(f"t-statistic: {result.t_statistic:.3f} (p-value: {result.p_value:.4f})")
print(f"Hypothesis Decision: {'REJECT H0 (Significant)' if result.is_significant else 'FAIL TO REJECT H0'}")`;
      } else if (activeLang === "CURL") {
        return `curl -X POST "https://api.quantintel.ai/v1/catalyst/event-study" \\
  -H "Authorization: Bearer qnt_live_token_sec" \\
  -H "Content-Type: application/json" \\
  -d '{
    "ticker": "${tickerParam}",
    "benchmark": "SPY",
    "event_date": "2024-04-15",
    "estimation_window": 90,
    "event_window": [-5, 10]
  }'`;
      } else {
        return `import { QuantIntel } from "@quantintel/sdk";

const quant = new QuantIntel({ apiKey: process.env.QUANTINTEL_API_KEY });

const result = await quant.catalyst.runEventStudy({
  ticker: "${tickerParam}",
  benchmarkTicker: "SPY",
  eventDate: "2024-04-15",
  estimationWindow: 90
});

console.log(\`CAR: \${(result.car * 100).toFixed(2)}% | p-value: \${result.pValue}\`);`;
      }
    } else {
      // TINYFISH
      if (activeLang === "PYTHON") {
        return `from quantintel.futurestock.tinyfish_researcher import TinyFishResearcher

researcher = TinyFishResearcher()

# Scrape, clean, and deduplicate primary investor filings
evidence = researcher.research_company("${tickerParam}", max_sources=5)

for item in evidence:
    print(f"Source: {item.title} ({item.domain})")
    print(f"DOM Token Savings: {item.token_savings_pct:.1f}%")
    print(f"Snippet: {item.extracted_snippet[:120]}...")`;
      } else if (activeLang === "CURL") {
        return `curl -X POST "https://api.quantintel.ai/v1/tinyfish/extract" \\
  -H "Authorization: Bearer qnt_live_token_sec" \\
  -H "Content-Type: application/json" \\
  -d '{
    "ticker": "${tickerParam}",
    "domains": ["sec.gov", "investor-relations.official", "reuters.com"],
    "clean_dom_tokens": true
  }'`;
      } else {
        return `import { TinyFishScraper } from "@quantintel/sdk";

const scraper = new TinyFishScraper({ apiKey: process.env.TINYFISH_KEY });
const evidence = await scraper.extractCompanyDisclosures("${tickerParam}");

console.log(\`Extracted \${evidence.length} primary disclosures with 88% token reduction.\`);`;
      }
    }
  };

  const getSimulatedResponse = () => {
    if (selectedEndpoint === "FORECAST") {
      return {
        status: "success",
        ticker: tickerParam.toUpperCase(),
        reportTimestampUtc: new Date().toISOString(),
        verifiedArithmetic: true,
        scenarios: [
          { scenarioType: "BEARISH", horizon: horizonParam, targetPrice: 104.25, potentialReturnPct: -24.59 },
          { scenarioType: "BASE", horizon: horizonParam, targetPrice: 158.40, potentialReturnPct: 14.58 },
          { scenarioType: "BULLISH", horizon: horizonParam, targetPrice: 215.80, potentialReturnPct: 56.09 }
        ],
        monteCarlo: {
          iterations: 2000,
          p5Price: 98.40,
          medianPrice: 154.20,
          p95Price: 228.60,
          var95Pct: 28.4,
          cvar95Pct: 36.2
        },
        valuation: {
          dcfBasePrice: 152.00,
          trailingPe: 48.2,
          waccPct: 9.5
        },
        verificationAudit: {
          isAuditPassed: true,
          evidenceRetrievedCount: 14,
          tokenReductionPct: 88.5
        }
      };
    } else if (selectedEndpoint === "EVENT_STUDY") {
      return {
        status: "success",
        ticker: tickerParam.toUpperCase(),
        benchmark: "SPY",
        cumulativeAbnormalReturn: 0.1245,
        tStatistic: 3.421,
        pValue: 0.0008,
        isSignificant: true,
        alpha: 0.0012,
        beta: 1.482,
        rSquared: 0.624
      };
    } else {
      return {
        status: "success",
        ticker: tickerParam.toUpperCase(),
        sourcesProcessed: 5,
        rawHtmlBytes: 1420500,
        cleanedMarkdownBytes: 164200,
        tokenSavingsPct: 88.4,
        provenanceAudit: "100% SOURCED PRIMARY DISCLOSURES"
      };
    }
  };

  const snippet = getCodeSnippet();

  return (
    <section id="api-docs" className="relative border-b border-[#1E2C3D] bg-[#090D12] py-16 px-4 sm:px-6">
      <div className="relative mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-[#1E2C3D] pb-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#00C4CC]/10 text-[#00C4CC] border border-[#00C4CC]/30 font-bold text-xs">
                💻
              </span>
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[#00C4CC]">
                Developer SDK & REST API
              </span>
            </div>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Institutional API & Research SDK
            </h2>
            <p className="mt-1 text-sm text-[#8B949E] max-w-2xl">
              Integrate FutureStock multi-agent quant forecasting and TinyFish DOM scraping directly into Python Jupyter notebooks, algorithmic trading backtests, or enterprise data pipelines.
            </p>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center rounded-lg border border-[#1E2C3D] bg-[#0F1722] p-1">
            {(["PYTHON", "CURL", "TYPESCRIPT"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`rounded-md px-3 py-1.5 text-xs font-mono font-medium transition-all ${
                  activeLang === lang
                    ? "bg-[#00C4CC] text-[#070B10] font-bold shadow-sm"
                    : "text-[#8B949E] hover:text-white"
                }`}
              >
                {lang === "PYTHON" ? "Python SDK" : lang === "CURL" ? "cURL REST" : "TypeScript"}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Playground Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Panel (Left 4 cols) */}
          <div className="lg:col-span-4 rounded-xl border border-[#1E2C3D] bg-[#0E1520] p-5 space-y-5">
            <div>
              <label className="text-xs font-mono uppercase text-[#8B949E] block mb-2">
                Select API Endpoint:
              </label>
              <div className="space-y-1.5">
                {[
                  { id: "FORECAST", label: "FutureStock Forecasting", method: "POST", path: "/v1/futurestock/forecast" },
                  { id: "EVENT_STUDY", label: "Event Study Backtest (CAR)", method: "POST", path: "/v1/catalyst/event-study" },
                  { id: "TINYFISH", label: "TinyFish DOM Evidence", method: "POST", path: "/v1/tinyfish/extract" },
                ].map((ep) => {
                  const isSel = selectedEndpoint === ep.id;
                  return (
                    <button
                      key={ep.id}
                      onClick={() => setSelectedEndpoint(ep.id as any)}
                      className={`w-full text-left rounded-lg p-3 border transition-all ${
                        isSel
                          ? "border-[#00C4CC] bg-[#00C4CC]/10 text-white shadow-sm"
                          : "border-[#1E2C3D] bg-[#080C12] text-[#8B949E] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white">{ep.label}</span>
                        <span className="text-[10px] font-mono font-bold text-[#10B981] bg-[#10B981]/15 px-1.5 py-0.5 rounded">
                          {ep.method}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-[#8B949E] mt-1 truncate">{ep.path}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive Query Parameter Toggles */}
            <div className="border-t border-[#1E2C3D] pt-4 space-y-3">
              <label className="text-xs font-mono uppercase text-[#8B949E] block">
                Tweak Request Parameters:
              </label>

              <div>
                <label className="text-[11px] font-mono text-[#C9D1D9] block mb-1">Target Ticker:</label>
                <div className="flex gap-1.5">
                  {["NVDA", "AAPL", "TSLA", "RELIANCE.NS", "ZOMATO.NS"].map((tk) => (
                    <button
                      key={tk}
                      onClick={() => setTickerParam(tk)}
                      className={`rounded px-2 py-1 text-[11px] font-mono ${
                        tickerParam === tk
                          ? "bg-[#00C4CC] text-[#070B10] font-bold"
                          : "border border-[#1E2C3D] bg-[#080C12] text-[#8B949E] hover:text-white"
                      }`}
                    >
                      {tk.split(".")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {selectedEndpoint === "FORECAST" && (
                <div>
                  <label className="text-[11px] font-mono text-[#C9D1D9] block mb-1">Horizon:</label>
                  <div className="flex gap-1.5">
                    {["1m", "3m", "6m", "1y", "3y"].map((hz) => (
                      <button
                        key={hz}
                        onClick={() => setHorizonParam(hz)}
                        className={`rounded px-2.5 py-1 text-[11px] font-mono ${
                          horizonParam === hz
                            ? "bg-[#00C4CC] text-[#070B10] font-bold"
                            : "border border-[#1E2C3D] bg-[#080C12] text-[#8B949E] hover:text-white"
                        }`}
                      >
                        {hz}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Execute Button */}
            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="w-full flex items-center justify-center space-x-2 rounded-lg bg-gradient-to-r from-[#00C4CC] to-[#00A3AA] py-2.5 text-xs font-bold text-[#090D12] hover:brightness-110 active:scale-[0.99] transition-all shadow-md shadow-[#00C4CC]/20"
            >
              <Play className={`h-3.5 w-3.5 fill-current ${isSimulating ? "animate-spin" : ""}`} />
              <span>{isSimulating ? "Executing Sandbox Call..." : "Execute Test Call"}</span>
            </button>
          </div>

          {/* Code & Response Panel (Right 8 cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-4">
            {/* Code Snippet Box */}
            <div className="rounded-xl border border-[#1E2C3D] bg-[#0B111A] overflow-hidden shadow-2xl flex-1 flex flex-col">
              <div className="flex items-center justify-between border-b border-[#1E2C3D] px-4 py-2.5 bg-[#080C12]">
                <div className="flex items-center space-x-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF7B72]/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFBE5C]/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]/60" />
                  <span className="font-mono text-xs text-[#8B949E] ml-2">
                    {activeLang === "PYTHON" ? "quantintel_sample.py" : activeLang === "CURL" ? "request.sh" : "client.ts"}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(snippet)}
                  className="flex items-center space-x-1.5 rounded-md border border-[#1E2C3D] bg-[#0E1520] px-2.5 py-1 text-xs text-[#C9D1D9] hover:text-white hover:border-[#00C4CC] transition-colors"
                >
                  {isCopied ? <Check className="h-3 w-3 text-[#10B981]" /> : <Copy className="h-3 w-3" />}
                  <span>{isCopied ? "Copied" : "Copy Code"}</span>
                </button>
              </div>

              <div className="p-4 bg-[#070B10] overflow-x-auto font-mono text-xs text-[#E6EDF3] leading-relaxed flex-1">
                <pre>{snippet}</pre>
              </div>
            </div>

            {/* Simulated Response Viewer */}
            {showResponse && (
              <div className="rounded-xl border border-[#10B981]/40 bg-[#0B111A] overflow-hidden shadow-xl animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-[#1E2C3D] px-4 py-2 bg-[#080C12]">
                  <div className="flex items-center space-x-2 text-xs font-mono text-[#10B981]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span className="font-bold">STATUS 200 OK</span>
                    <span className="text-[#8B949E]">({selectedEndpoint === "FORECAST" ? "8 Agents Coordinated in 640ms" : "Sandbox OLS Finished in 140ms"})</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8B949E]">application/json</span>
                </div>
                <div className="p-4 bg-[#070B10] max-h-60 overflow-y-auto font-mono text-xs text-[#38BDF8]">
                  <pre>{JSON.stringify(getSimulatedResponse(), null, 2)}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
