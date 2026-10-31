"use client";

import React, { useState } from "react";
import { Terminal, ExternalLink, Activity, Search, Menu, X, Play, Layers } from "lucide-react";

interface HeaderProps {
  activeModule?: "FUTURESTOCK" | "CATALYST";
  onSelectModule?: (module: "FUTURESTOCK" | "CATALYST") => void;
  onOpenCommandPalette?: () => void;
}

export function Header({
  activeModule = "FUTURESTOCK",
  onSelectModule,
  onOpenCommandPalette,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string, module?: "FUTURESTOCK" | "CATALYST") => {
    if (module && onSelectModule) {
      onSelectModule(module);
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#1E2C3D] bg-[#070B10]/95 backdrop-blur-md">
      {/* Telemetry Status Strip */}
      <div className="border-b border-[#1E2C3D]/60 bg-[#090D12] px-4 py-1 text-[11px] text-[#8B949E]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="flex items-center space-x-1.5 text-[#10B981]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] animate-pulse"></span>
              <span className="font-mono font-medium">TINYFISH CHROMIUM FLEET: ACTIVE</span>
            </span>
            <span className="hidden sm:inline text-[#2A3F58]">|</span>
            <span className="hidden sm:inline font-mono text-[#8B949E]">SANDBOX: 8-AGENT QUANT ENGINE</span>
          </div>
          <div className="flex items-center space-x-3 font-mono">
            <span className="hidden md:inline text-[#00C4CC] font-medium">SWIM WITH TINYFISH HACKATHON</span>
            <span className="rounded bg-[#FFBE5C]/15 px-2 py-0.5 text-[10px] font-bold text-[#FFBE5C] border border-[#FFBE5C]/30">
              $2M SPRINT TRACK
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center space-x-3">
          <a href="#" className="flex items-center space-x-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#00C4CC] to-[#0A84FF] shadow-md shadow-[#00C4CC]/20 group-hover:brightness-110 transition-all">
              <Terminal className="h-4 w-4 text-[#070B10] stroke-[2.5]" />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-[#00C4CC] transition-colors">
                QuantIntel
              </span>
              <span className="rounded border border-[#00C4CC]/30 bg-[#00C4CC]/10 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-[#00C4CC]">
                v1.0
              </span>
            </div>
          </a>
        </div>

        {/* Clean Desktop Navigation Links (Properly Spaced & No Wrapping) */}
        <nav className="hidden xl:flex items-center space-x-7 text-xs font-medium text-[#C9D1D9]">
          <button
            onClick={() => handleNavClick("futurestock", "FUTURESTOCK")}
            className={`whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeModule === "FUTURESTOCK" ? "text-[#00C4CC] font-semibold" : "hover:text-[#00C4CC]"
            }`}
          >
            <span>FutureStock</span>
            {activeModule === "FUTURESTOCK" && (
              <span className="h-1 w-1 rounded-full bg-[#00C4CC]"></span>
            )}
          </button>
          <button
            onClick={() => handleNavClick("studio", "CATALYST")}
            className={`whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeModule === "CATALYST" ? "text-[#00C4CC] font-semibold" : "hover:text-[#00C4CC]"
            }`}
          >
            <span>Event Studies</span>
            {activeModule === "CATALYST" && (
              <span className="h-1 w-1 rounded-full bg-[#00C4CC]"></span>
            )}
          </button>
          <button
            onClick={() => handleNavClick("architecture")}
            className="whitespace-nowrap hover:text-[#00C4CC] transition-colors"
          >
            Architecture
          </button>
          <button
            onClick={() => handleNavClick("case-studies")}
            className="whitespace-nowrap hover:text-[#00C4CC] transition-colors"
          >
            Case Studies
          </button>
          <button
            onClick={() => handleNavClick("token-economy")}
            className="whitespace-nowrap hover:text-[#00C4CC] transition-colors"
          >
            Token ROI
          </button>
          <button
            onClick={() => handleNavClick("api-docs")}
            className="whitespace-nowrap hover:text-[#00C4CC] transition-colors"
          >
            API &amp; SDK
          </button>
          <button
            onClick={() => handleNavClick("roadmap")}
            className="whitespace-nowrap hover:text-[#00C4CC] transition-colors"
          >
            Roadmap
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-2.5">
          {/* Quick Search Button (⌘K) */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="flex items-center space-x-2 rounded-lg border border-[#1E2C3D] bg-[#0E1520] px-2.5 py-1.5 text-xs font-mono text-[#8B949E] hover:border-[#2A3F58] hover:text-white transition-all shadow-sm"
              title="Search tickers, cases, and navigation (Cmd+K)"
            >
              <Search className="h-3.5 w-3.5 text-[#00C4CC]" />
              <span className="hidden sm:inline text-[11px]">Quick Search</span>
              <kbd className="hidden sm:inline-block rounded border border-[#1E2C3D] bg-[#080C12] px-1.5 py-0.5 text-[9px] text-[#8B949E]">
                ⌘K
              </kbd>
            </button>
          )}

          {/* GitHub Link */}
          <a
            href="https://github.com/manishY-iitm/QuantIntel"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center space-x-1.5 rounded-lg border border-[#1E2C3D] bg-[#0E1520] px-2.5 py-1.5 text-xs font-medium text-[#C9D1D9] hover:border-[#2A3F58] hover:text-white transition-all"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
            <ExternalLink className="h-3 w-3 text-[#8B949E]" />
          </a>

          {/* Primary CTA */}
          <button
            onClick={() => handleNavClick(activeModule === "FUTURESTOCK" ? "futurestock" : "studio")}
            className="flex items-center space-x-1.5 rounded-lg bg-gradient-to-r from-[#00C4CC] to-[#00A3AA] px-3.5 py-1.5 text-xs font-semibold text-[#070B10] shadow-sm shadow-[#00C4CC]/30 hover:brightness-110 active:scale-[0.98] transition-all whitespace-nowrap"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Launch Terminal</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 rounded-lg border border-[#1E2C3D] bg-[#0E1520] text-[#C9D1D9] hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#1E2C3D] bg-[#090D12] px-4 py-4 space-y-3 font-mono text-xs">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-[#1E2C3D]">
            <button
              onClick={() => handleNavClick("futurestock", "FUTURESTOCK")}
              className={`rounded-lg p-2 text-center border font-bold ${
                activeModule === "FUTURESTOCK"
                  ? "border-[#00C4CC] bg-[#00C4CC]/10 text-[#00C4CC]"
                  : "border-[#1E2C3D] text-[#8B949E]"
              }`}
            >
              🔮 FutureStock
            </button>
            <button
              onClick={() => handleNavClick("studio", "CATALYST")}
              className={`rounded-lg p-2 text-center border font-bold ${
                activeModule === "CATALYST"
                  ? "border-[#00C4CC] bg-[#00C4CC]/10 text-[#00C4CC]"
                  : "border-[#1E2C3D] text-[#8B949E]"
              }`}
            >
              📈 Catalyst Studies
            </button>
          </div>
          <div className="space-y-2">
            {[
              { id: "architecture", label: "Dual-Engine Architecture" },
              { id: "case-studies", label: "Historical Case Studies" },
              { id: "token-economy", label: "Token ROI Calculator" },
              { id: "api-docs", label: "Developer API & SDK" },
              { id: "roadmap", label: "Pre-Accelerator Roadmap" },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="w-full text-left py-2 px-3 rounded-md hover:bg-[#152335] text-[#C9D1D9] transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
