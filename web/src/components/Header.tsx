"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Terminal,
  ExternalLink,
  Activity,
  Search,
  Menu,
  X,
  Key,
  ChevronDown,
  Layers,
  TrendingUp,
  FileText,
  Compass,
  Cpu,
  ShieldCheck,
  Globe2,
} from "lucide-react";

interface HeaderProps {
  activeModule?: "FUTURESTOCK" | "CATALYST" | "COUNTRY";
  onSelectModule?: (module: "FUTURESTOCK" | "CATALYST" | "COUNTRY") => void;
  onOpenCommandPalette?: () => void;
}

export function Header({
  activeModule = "COUNTRY",
  onSelectModule,
  onOpenCommandPalette,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [docsMenuOpen, setDocsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDocsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavClick = (sectionId: string, module?: "FUTURESTOCK" | "CATALYST" | "COUNTRY") => {
    if (module && onSelectModule) {
      onSelectModule(module);
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
    setDocsMenuOpen(false);
  };

  return (
    <>
      {/* 1. Ultra-Sleek Institutional Telemetry Status Strip */}
      <div className="border-b border-[#16202E] bg-[#05080D] px-4 py-1.5 text-[11px] text-[#8B949E]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* TinyFish Status */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-mono text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold tracking-wide">TINYFISH FLEET</span>
              <span className="text-emerald-500/70 font-normal">ACTIVE</span>
            </span>

            {/* LSE Data Feed Status */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#00C4CC]/10 border border-[#00C4CC]/25 px-2 py-0.5 text-[10px] font-mono text-[#00C4CC]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00C4CC]" />
              <span className="font-semibold tracking-wide">LSE DATA 3.0</span>
              <span className="text-[#00C4CC]/70 font-normal">STREAMING</span>
            </span>

            {/* Quant Sandbox */}
            <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-[#0F1722] border border-[#1E2C3D] px-2 py-0.5 text-[10px] font-mono text-[#94A3B8]">
              <Cpu className="h-3 w-3 text-[#38BDF8]" />
              <span>8-AGENT QUANT ENGINE</span>
            </span>
          </div>

          <div className="flex items-center gap-3 font-mono">
            <span className="hidden lg:inline text-[10px] text-[#64748B]">
              Deterministic Math &bull; Zero Hallucination
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 shadow-sm shadow-emerald-950/40">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span>INSTITUTIONAL GRADE</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Sticky Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-[#16202E] bg-[#070B10]/95 backdrop-blur-md shadow-lg shadow-black/20">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 sm:px-6">
          {/* Brand Logo */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            <a href="#" className="flex items-center space-x-2.5 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00C4CC] to-[#0A84FF] shadow-md shadow-[#00C4CC]/25 group-hover:brightness-110 transition-all">
                <Terminal className="h-4 w-4 text-[#070B10] stroke-[2.5]" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-bold tracking-tight text-white group-hover:text-[#00C4CC] transition-colors">
                  QuantIntel
                </span>
                <span className="rounded border border-[#00C4CC]/30 bg-[#00C4CC]/10 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-[#00C4CC]">
                  v1.0
                </span>
              </div>
            </a>
          </div>

          {/* Central Segmented Studio Control */}
          <div className="hidden lg:flex items-center space-x-3">
            <div className="flex items-center rounded-xl border border-[#1E2C3D] bg-[#0A0F16]/90 p-1 shadow-inner">
              <button
                onClick={() => handleNavClick("country-intelligence", "COUNTRY")}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all ${
                  activeModule === "COUNTRY"
                    ? "bg-gradient-to-r from-[#00C4CC] to-[#00A3AA] text-[#070B10] shadow-sm shadow-[#00C4CC]/30"
                    : "text-[#8B949E] hover:text-white hover:bg-[#121A26]"
                }`}
              >
                <span>🌍</span>
                <span>Country Intel</span>
              </button>
              <button
                onClick={() => handleNavClick("futurestock", "FUTURESTOCK")}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all ${
                  activeModule === "FUTURESTOCK"
                    ? "bg-gradient-to-r from-[#00C4CC] to-[#00A3AA] text-[#070B10] shadow-sm shadow-[#00C4CC]/30"
                    : "text-[#8B949E] hover:text-white hover:bg-[#121A26]"
                }`}
              >
                <span>🔮</span>
                <span>FutureStock</span>
              </button>
              <button
                onClick={() => handleNavClick("studio", "CATALYST")}
                className={`flex items-center space-x-1.5 rounded-lg px-3 py-1.5 text-xs font-mono font-bold transition-all ${
                  activeModule === "CATALYST"
                    ? "bg-gradient-to-r from-[#00C4CC] to-[#00A3AA] text-[#070B10] shadow-sm shadow-[#00C4CC]/30"
                    : "text-[#8B949E] hover:text-white hover:bg-[#121A26]"
                }`}
              >
                <span>📈</span>
                <span>Event Studies</span>
              </button>
            </div>

            {/* Docs & Architecture Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDocsMenuOpen(!docsMenuOpen)}
                className="flex items-center space-x-1.5 rounded-lg border border-[#1E2C3D]/80 bg-[#0E1520] px-3 py-1.5 text-xs font-medium text-[#C9D1D9] hover:border-[#2A3F58] hover:text-[#00C4CC] transition-all"
              >
                <span>Explore &amp; Docs</span>
                <ChevronDown
                  className={`h-3 w-3 text-[#8B949E] transition-transform duration-200 ${
                    docsMenuOpen ? "rotate-180 text-[#00C4CC]" : ""
                  }`}
                />
              </button>

              {docsMenuOpen && (
                <div className="absolute left-0 mt-2 w-60 rounded-xl border border-[#1E2C3D] bg-[#0A0F16] p-1.5 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-[#6E7681] border-b border-[#1E2C3D]/60 mb-1">
                    System Architecture
                  </div>
                  <button
                    onClick={() => handleNavClick("architecture")}
                    className="w-full flex items-center space-x-2 text-left px-2.5 py-2 text-xs text-[#C9D1D9] hover:bg-[#16202E] hover:text-[#00C4CC] rounded-lg transition-colors"
                  >
                    <Layers className="h-3.5 w-3.5 text-[#00C4CC]" />
                    <div>
                      <div className="font-medium">Dual-Engine Architecture</div>
                      <div className="text-[10px] text-[#6E7681]">TinyFish + Quant Sandbox</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleNavClick("case-studies")}
                    className="w-full flex items-center space-x-2 text-left px-2.5 py-2 text-xs text-[#C9D1D9] hover:bg-[#16202E] hover:text-[#00C4CC] rounded-lg transition-colors"
                  >
                    <Activity className="h-3.5 w-3.5 text-[#10B981]" />
                    <div>
                      <div className="font-medium">Historical Case Studies</div>
                      <div className="text-[10px] text-[#6E7681]">CrowdStrike &amp; Biogen</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleNavClick("token-economy")}
                    className="w-full flex items-center space-x-2 text-left px-2.5 py-2 text-xs text-[#C9D1D9] hover:bg-[#16202E] hover:text-[#00C4CC] rounded-lg transition-colors"
                  >
                    <TrendingUp className="h-3.5 w-3.5 text-[#FFBE5C]" />
                    <div>
                      <div className="font-medium">Token ROI Matrix</div>
                      <div className="text-[10px] text-[#6E7681]">85%+ LLM Context Savings</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleNavClick("api-docs")}
                    className="w-full flex items-center space-x-2 text-left px-2.5 py-2 text-xs text-[#C9D1D9] hover:bg-[#16202E] hover:text-[#00C4CC] rounded-lg transition-colors"
                  >
                    <Terminal className="h-3.5 w-3.5 text-[#38BDF8]" />
                    <div>
                      <div className="font-medium">API &amp; Python SDK</div>
                      <div className="text-[10px] text-[#6E7681]">Programmatic Endpoints</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleNavClick("roadmap")}
                    className="w-full flex items-center space-x-2 text-left px-2.5 py-2 text-xs text-[#C9D1D9] hover:bg-[#16202E] hover:text-[#00C4CC] rounded-lg transition-colors"
                  >
                    <Compass className="h-3.5 w-3.5 text-[#A78BFA]" />
                    <div>
                      <div className="font-medium">Product Roadmap</div>
                      <div className="text-[10px] text-[#6E7681]">Q1 - Q4 Milestones</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Action Controls (Right-aligned, Guaranteed Never Clipped) */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Quick Search Button (⌘K) */}
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="flex items-center space-x-1.5 rounded-lg border border-[#1E2C3D] bg-[#0E1520] px-2.5 py-1.5 text-xs font-mono text-[#8B949E] hover:border-[#2A3F58] hover:text-white transition-all shadow-sm"
                title="Search tickers, cases, and navigation (Cmd+K)"
              >
                <Search className="h-3.5 w-3.5 text-[#00C4CC]" />
                <span className="hidden sm:inline text-[11px]">Search</span>
                <kbd className="hidden md:inline-block rounded border border-[#1E2C3D] bg-[#080C12] px-1 py-0.5 text-[9px] text-[#8B949E]">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* API Keys Configuration Button */}
            <button
              onClick={() => {
                const el = document.getElementById("api-keys-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("open-api-keys"));
                }
              }}
              className="flex items-center space-x-1.5 rounded-lg border border-[#FFBE5C]/35 bg-[#FFBE5C]/10 px-2.5 py-1.5 text-xs font-mono text-[#FFBE5C] hover:border-[#FFBE5C]/60 hover:bg-[#FFBE5C]/20 transition-all shadow-sm"
              title="Configure API Keys (TinyFish, LLM, LSE Data)"
            >
              <Key className="h-3.5 w-3.5 text-[#FFBE5C]" />
              <span className="hidden sm:inline text-[11px] font-bold">API Keys</span>
            </button>

            {/* GitHub Link */}
            <a
              href="https://github.com/manishY-iitm/QuantIntel"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center space-x-1.5 rounded-lg border border-[#1E2C3D] bg-[#0E1520] px-2.5 py-1.5 text-xs font-medium text-[#C9D1D9] hover:border-[#2A3F58] hover:text-white transition-all"
              title="GitHub Repository"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span className="hidden xl:inline text-[11px]">GitHub</span>
              <ExternalLink className="h-3 w-3 text-[#8B949E]" />
            </a>

            {/* Primary Action Button - Flex-shrink-0 to prevent clipping */}
            <button
              onClick={() =>
                handleNavClick(
                  activeModule === "COUNTRY"
                    ? "country-intelligence"
                    : activeModule === "FUTURESTOCK"
                    ? "futurestock"
                    : "studio"
                )
              }
              className="flex-shrink-0 flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-[#00C4CC] to-[#00A3AA] px-3.5 py-1.5 text-xs font-bold text-[#070B10] shadow-sm shadow-[#00C4CC]/30 hover:brightness-110 active:scale-[0.98] transition-all whitespace-nowrap"
            >
              <Activity className="h-3.5 w-3.5" />
              <span>Launch Terminal</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg border border-[#1E2C3D] bg-[#0E1520] text-[#C9D1D9] hover:text-white"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-[#1E2C3D] bg-[#090D12] px-4 py-4 space-y-3 font-mono text-xs animate-in slide-in-from-top duration-150">
            <div className="grid grid-cols-3 gap-2 pb-3 border-b border-[#1E2C3D]">
              <button
                onClick={() => handleNavClick("country-intelligence", "COUNTRY")}
                className={`rounded-lg p-2.5 text-center border font-bold flex flex-col items-center gap-1 ${
                  activeModule === "COUNTRY"
                    ? "border-[#00C4CC] bg-[#00C4CC]/10 text-[#00C4CC]"
                    : "border-[#1E2C3D] text-[#8B949E]"
                }`}
              >
                <span className="text-base">🌍</span>
                <span className="text-[10px]">Country Intel</span>
              </button>
              <button
                onClick={() => handleNavClick("futurestock", "FUTURESTOCK")}
                className={`rounded-lg p-2.5 text-center border font-bold flex flex-col items-center gap-1 ${
                  activeModule === "FUTURESTOCK"
                    ? "border-[#00C4CC] bg-[#00C4CC]/10 text-[#00C4CC]"
                    : "border-[#1E2C3D] text-[#8B949E]"
                }`}
              >
                <span className="text-base">🔮</span>
                <span className="text-[10px]">FutureStock</span>
              </button>
              <button
                onClick={() => handleNavClick("studio", "CATALYST")}
                className={`rounded-lg p-2.5 text-center border font-bold flex flex-col items-center gap-1 ${
                  activeModule === "CATALYST"
                    ? "border-[#00C4CC] bg-[#00C4CC]/10 text-[#00C4CC]"
                    : "border-[#1E2C3D] text-[#8B949E]"
                }`}
              >
                <span className="text-base">📈</span>
                <span className="text-[10px]">Event Studies</span>
              </button>
            </div>
            <div className="space-y-1.5 pt-1">
              {[
                { id: "architecture", label: "Dual-Engine Architecture", icon: Layers },
                { id: "case-studies", label: "Historical Case Studies", icon: Activity },
                { id: "token-economy", label: "Token ROI Matrix", icon: TrendingUp },
                { id: "api-docs", label: "API & Python SDK", icon: Terminal },
                { id: "roadmap", label: "Product Roadmap", icon: Compass },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="w-full text-left py-2 px-3 rounded-lg hover:bg-[#152335] text-[#C9D1D9] flex items-center space-x-2.5 transition-colors font-sans text-xs"
                >
                  <item.icon className="h-3.5 w-3.5 text-[#00C4CC]" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
