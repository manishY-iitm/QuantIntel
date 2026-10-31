"use client";

import React from "react";
import { Terminal, ExternalLink, ShieldAlert, Heart, FileText } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[#1E2C3D] bg-[#070A0E] text-[#8B949E] text-xs py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#00C4CC] text-[#090D12]">
                <Terminal className="h-4 w-4 stroke-[2.5]" />
              </div>
              <span className="font-bold text-white text-base">QuantIntel</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Autonomous Agentic Quantitative Research Laboratory. Powered by TinyFish Web Agents and Deterministic Python Backtesting.
            </p>
            <div className="font-mono text-[10px] text-[#00C4CC]">
              SWIM WITH TINYFISH HACKATHON ENTRY
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a href="#studio" className="hover:text-white transition-colors">
                  Web Quant Studio (Terminal)
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-white transition-colors">
                  Dual-Engine Pipeline
                </a>
              </li>
              <li>
                <a href="#case-studies" className="hover:text-white transition-colors">
                  Historical Catalyst Benchmarks
                </a>
              </li>
              <li>
                <a href="#token-economy" className="hover:text-white transition-colors">
                  Token Economy & Cost Calculator
                </a>
              </li>
              <li>
                <a href="#roadmap" className="hover:text-white transition-colors">
                  $2M Pre-Accelerator Roadmap
                </a>
              </li>
            </ul>
          </div>

          {/* Competition Artifacts */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono mb-3">
              Presentation & Pitch
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a
                  href="https://github.com/manishY-iitm/QuantIntel/blob/main/QuantIntel_Hackathon_Proposal.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00C4CC] transition-colors inline-flex items-center space-x-1"
                >
                  <FileText className="h-3 w-3" />
                  <span>10-Slide Pitch Deck (PDF)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/manishY-iitm/QuantIntel/blob/main/QuantIntel_Hackathon_Proposal.pptx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00C4CC] transition-colors inline-flex items-center space-x-1"
                >
                  <FileText className="h-3 w-3" />
                  <span>PowerPoint Presentation (.pptx)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://tinyfish.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#00C4CC] transition-colors inline-flex items-center space-x-1"
                >
                  <span>TinyFish Live Web Infrastructure</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </li>
            </ul>
          </div>

          {/* Developer / Author */}
          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider font-mono mb-3">
              Author & Attribution
            </h4>
            <p className="text-[11px] leading-relaxed mb-2">
              Proposed and built by <strong className="text-white">Manish Yadav</strong>
            </p>
            <p className="text-[11px] text-[#6E7681] mb-3">
              Scaler School of Technology
            </p>
            <a
              href="https://github.com/manishY-iitm/QuantIntel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1.5 rounded-lg border border-[#1E2C3D] bg-[#0F1722] px-3 py-1.5 text-xs text-white hover:border-[#00C4CC] transition-all"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>@manishY-iitm/QuantIntel</span>
            </a>
          </div>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="border-t border-[#1E2C3D] pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#6E7681]">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-[#F59E0B] shrink-0" />
            <p>
              <strong>Institutional Research Disclaimer:</strong> QuantIntel is an analytical quantitative research assistant. It delivers deterministic empirical backtests and source-grounded event extraction. It disclaims financial advisory status and does not make price guarantees.
            </p>
          </div>
          <div className="whitespace-nowrap font-mono">
            &copy; {new Date().getFullYear()} QuantIntel. Open-source under MIT License.
          </div>
        </div>
      </div>
    </footer>
  );
}
