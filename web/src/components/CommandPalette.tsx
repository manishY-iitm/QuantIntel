"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, ArrowRight, Activity, TrendingUp, FileText, Layers, Terminal } from "lucide-react";
import { POPULAR_TICKERS } from "../lib/futurestock-data";
import { PRESET_CASES } from "../lib/presets";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTicker: (ticker: string) => void;
  onSelectCase: (caseId: string) => void;
  onNavigateSection: (sectionId: string) => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onSelectTicker,
  onSelectCase,
  onNavigateSection,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger open via custom event or parent
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTickers = POPULAR_TICKERS.filter(
    (t) =>
      t.ticker.toLowerCase().includes(query.toLowerCase()) ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.sector.toLowerCase().includes(query.toLowerCase()) ||
      (query.toLowerCase().includes("jio") && t.ticker === "JPL")
  );

  const filteredCases = PRESET_CASES.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.ticker.toLowerCase().includes(query.toLowerCase()) ||
      c.headline.toLowerCase().includes(query.toLowerCase())
  );

  const sections = [
    { id: "futurestock", name: "🔮 FutureStock Research Terminal", desc: "8-agent quant forecasting & Monte Carlo" },
    { id: "studio", name: "📈 Catalyst Event Studies", desc: "Abnormal returns & CAR regression backtesting" },
    { id: "architecture", name: "⚡ Dual-Engine Architecture", desc: "TinyFish web agent + deterministic sandbox" },
    { id: "case-studies", name: "🏛️ Verified Case Studies", desc: "FDA adcom, outages & SEC 8-K filings" },
    { id: "token-economy", name: "💰 Token Economy Calculator", desc: "86%+ DOM reduction and cost ROI" },
    { id: "api-docs", name: "💻 Developer API & SDK Explorer", desc: "Python, cURL & TypeScript integrations" },
    { id: "roadmap", name: "🚀 Product Roadmap", desc: "Enterprise architecture & institutional milestones" },
  ].filter(
    (s) =>
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-2xl rounded-xl border border-[#1E2C3D] bg-[#0E1520] shadow-2xl shadow-cyan-950/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-[#1E2C3D] px-4 py-3 bg-[#0B111A]">
          <Search className="h-4 w-4 text-[#00C4CC] mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tickers, case studies, tools, or navigation (ESC to close)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-[#484F58] focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="p-1 rounded text-[#8B949E] hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <span className="rounded border border-[#1E2C3D] bg-[#080C12] px-1.5 py-0.5 text-[10px] font-mono text-[#8B949E]">
              ESC
            </span>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs font-mono">
          {/* Tickers Section */}
          {filteredTickers.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[10px] uppercase font-bold text-[#8B949E] tracking-wider">
                FutureStock Tickers
              </div>
              <div className="space-y-1">
                {filteredTickers.map((t) => (
                  <button
                    key={t.ticker}
                    onClick={() => {
                      onSelectTicker(t.ticker);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-[#162232] transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <TrendingUp className="h-3.5 w-3.5 text-[#00C4CC]" />
                      <span className="font-bold text-white group-hover:text-[#00C4CC]">
                        {t.ticker}
                      </span>
                      <span className="text-[11px] font-sans text-[#8B949E] truncate max-w-xs">
                        {t.name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="rounded bg-[#080C12] border border-[#1E2C3D] px-1.5 py-0.5 text-[10px] text-[#FFBE5C]">
                        {t.currency} {t.price}
                      </span>
                      <span className="text-[10px] text-[#484F58]">{t.region}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Case Studies Section */}
          {filteredCases.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[10px] uppercase font-bold text-[#8B949E] tracking-wider">
                Catalyst Event Cases
              </div>
              <div className="space-y-1">
                {filteredCases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelectCase(c.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-[#162232] transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5 truncate mr-2">
                      <Activity className="h-3.5 w-3.5 text-[#10B981]" />
                      <span className="font-bold text-white group-hover:text-[#10B981]">
                        ${c.ticker}
                      </span>
                      <span className="text-[11px] font-sans text-[#8B949E] truncate">
                        {c.headline}
                      </span>
                    </div>
                    <span className="rounded bg-[#10B981]/15 px-1.5 py-0.5 text-[10px] text-[#10B981] whitespace-nowrap">
                      {c.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Sections */}
          {sections.length > 0 && (
            <div>
              <div className="px-2 pb-1.5 text-[10px] uppercase font-bold text-[#8B949E] tracking-wider">
                Jump to Platform Section
              </div>
              <div className="space-y-1">
                {sections.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      onNavigateSection(s.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-[#162232] transition-colors group"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Layers className="h-3.5 w-3.5 text-[#0A84FF]" />
                      <span className="font-sans font-medium text-white group-hover:text-[#0A84FF]">
                        {s.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#8B949E] font-sans">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredTickers.length === 0 && filteredCases.length === 0 && sections.length === 0 && (
            <div className="py-8 text-center text-[#8B949E] font-sans">
              No matching tickers, cases, or sections found for &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="border-t border-[#1E2C3D] px-4 py-2 bg-[#0B111A] flex items-center justify-between text-[11px] text-[#8B949E]">
          <div className="flex items-center space-x-3">
            <span><strong className="text-white">↵</strong> to select</span>
            <span><strong className="text-white">ESC</strong> to exit</span>
          </div>
          <span className="font-mono text-[#00C4CC]">QuantIntel Quick Navigator</span>
        </div>
      </div>
    </div>
  );
}
