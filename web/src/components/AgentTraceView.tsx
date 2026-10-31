"use client";

import React from "react";
import { CheckCircle2, Loader2, ExternalLink, ShieldCheck, Sparkles, Database } from "lucide-react";
import { AgentTraceStep } from "../lib/types";

interface AgentTraceViewProps {
  steps: AgentTraceStep[];
  isExecuting: boolean;
}

export function AgentTraceView({ steps, isExecuting }: AgentTraceViewProps) {
  return (
    <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722] p-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-[#1E2C3D] pb-3 mb-4">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4 text-[#00C4CC]" />
          <h3 className="font-bold text-white text-sm">
            TinyFish Live Web Agent & Reconnaissance Trace
          </h3>
        </div>
        {isExecuting ? (
          <div className="flex items-center space-x-2 text-xs font-mono text-[#00C4CC]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span>AGENTS AUTONOMOUSLY EXECUTING...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 text-xs font-mono text-[#10B981]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>PIPELINE EXECUTION VERIFIED</span>
          </div>
        )}
      </div>

      <div className="space-y-3.5">
        {steps.map((s, idx) => (
          <div key={idx} className="flex items-start space-x-3 text-xs">
            <div className="pt-0.5">
              {s.status === "completed" ? (
                <CheckCircle2 className="h-4 w-4 text-[#10B981] shrink-0" />
              ) : (
                <Loader2 className="h-4 w-4 text-[#00C4CC] animate-spin shrink-0" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="font-semibold text-white">{s.title}</span>
                <span className="font-mono text-[10px] text-[#6E7681]">{s.timestamp}</span>
              </div>
              <p className="text-[#8B949E] leading-relaxed">{s.details}</p>

              {s.tokenSavingsPct && (
                <div className="inline-flex items-center space-x-1.5 rounded bg-[#10B981]/15 px-2 py-0.5 font-mono text-[11px] font-semibold text-[#10B981] mt-1">
                  <span>TinyFish Context Compression:</span>
                  <span className="underline">{s.tokenSavingsPct}% Tokens Saved</span>
                </div>
              )}

              {s.sourceUrl && (
                <div className="pt-0.5">
                  <a
                    href={s.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1 font-mono text-[11px] text-[#38BDF8] hover:underline"
                  >
                    <span>Audited Source: {s.sourceUrl.slice(0, 55)}...</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
