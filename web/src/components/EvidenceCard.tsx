"use client";

import React from "react";
import { ShieldCheck, ExternalLink, Calendar, FileText, CheckCircle2 } from "lucide-react";
import { EventEvidence } from "../lib/types";

interface EvidenceCardProps {
  evidence: EventEvidence;
}

export function EvidenceCard({ evidence }: EvidenceCardProps) {
  return (
    <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722] p-5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#1E2C3D] pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <FileText className="h-4 w-4 text-[#00C4CC]" />
            <h4 className="font-bold text-white text-sm">Pydantic Evidence Contract</h4>
          </div>
          <span className="rounded bg-[#10B981]/15 px-2 py-0.5 text-[10px] font-mono font-bold text-[#10B981] flex items-center space-x-1">
            <ShieldCheck className="h-3 w-3" />
            <span>ZERO LOOK-AHEAD VERIFIED</span>
          </span>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-[#8B949E]">Target Entity:</span>
            <span className="font-semibold text-white">
              {evidence.companyName} (<span className="text-[#00C4CC] font-mono">${evidence.ticker}</span>)
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#8B949E]">Event Classification:</span>
            <span className="rounded bg-[#16202E] px-2 py-0.5 font-mono text-[11px] text-[#C9D1D9] border border-[#1E2C3D]">
              {evidence.eventType}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[#8B949E]">Locked UTC Timestamp:</span>
            <span className="font-mono text-[#FFBE5C] font-medium flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{evidence.eventDateUtc.replace("T", " ")}</span>
            </span>
          </div>

          <div>
            <span className="text-[#8B949E] block mb-1">Audited Source Citation:</span>
            <a
              href={evidence.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 font-mono text-[11px] text-[#38BDF8] hover:underline break-all"
            >
              <span>{evidence.sourceUrl}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
          </div>

          {/* Verbatim Quote Excerpt */}
          <div className="mt-3 rounded-lg border-l-4 border-[#00C4CC] bg-[#090D12] p-3 text-xs italic text-[#C9D1D9]">
            &ldquo;{evidence.verbatimExcerpt}&rdquo;
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#1E2C3D] flex items-center justify-between text-[11px] text-[#8B949E] font-mono">
        <span>PROVENANCE CONFIDENCE:</span>
        <span className="text-[#10B981] font-bold">{(evidence.confidenceScore * 100).toFixed(1)}% GROUNDED</span>
      </div>
    </div>
  );
}
