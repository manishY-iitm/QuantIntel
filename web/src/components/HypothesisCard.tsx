"use client";

import React from "react";
import { Scale, CheckCircle2, AlertTriangle, Compass } from "lucide-react";
import { HypothesisContract } from "../lib/types";

interface HypothesisCardProps {
  hypothesis: HypothesisContract;
}

export function HypothesisCard({ hypothesis }: HypothesisCardProps) {
  return (
    <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722] p-5 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between border-b border-[#1E2C3D] pb-3 mb-3">
          <div className="flex items-center space-x-2">
            <Scale className="h-4 w-4 text-[#FFBE5C]" />
            <h4 className="font-bold text-white text-sm">Falsifiable Hypothesis Contract</h4>
          </div>
          <span className="rounded bg-[#00C4CC]/15 px-2 py-0.5 text-[10px] font-mono font-bold text-[#00C4CC]">
            &alpha; = {hypothesis.significanceLevelAlpha} (95% CONFIDENCE)
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#8B949E]">Statistical Metric:</span>
            <span className="font-mono font-semibold text-white">
              {hypothesis.metricTested}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#8B949E]">Expected Direction:</span>
            <span className="rounded bg-[#16202E] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#FFBE5C] border border-[#1E2C3D]">
              {hypothesis.expectedDirection}
            </span>
          </div>

          {/* H0 Box */}
          <div className="rounded-lg border-l-4 border-[#F59E0B] bg-[#090D12] p-3">
            <div className="flex items-center space-x-1.5 font-mono font-bold text-[#F59E0B] text-[11px] mb-1">
              <AlertTriangle className="h-3 w-3" />
              <span>NULL HYPOTHESIS (H0):</span>
            </div>
            <p className="text-xs text-[#C9D1D9] leading-relaxed">
              {hypothesis.nullHypothesisH0}
            </p>
          </div>

          {/* H1 Box */}
          <div className="rounded-lg border-l-4 border-[#10B981] bg-[#090D12] p-3">
            <div className="flex items-center space-x-1.5 font-mono font-bold text-[#10B981] text-[11px] mb-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>ALTERNATIVE HYPOTHESIS (H1):</span>
            </div>
            <p className="text-xs text-[#C9D1D9] leading-relaxed">
              {hypothesis.alternativeHypothesisH1}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-[#1E2C3D] flex items-center justify-between text-[11px] text-[#8B949E] font-mono">
        <span>FALSIFIABILITY STATUS:</span>
        <span className="text-[#38BDF8] font-semibold">EMPIRICALLY TESTABLE</span>
      </div>
    </div>
  );
}
