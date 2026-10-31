"use client";

import React from "react";
import { CheckCircle2, ShieldAlert, Rocket, Target, Award, Users } from "lucide-react";

export function PreAcceleratorRoadmap() {
  const mvpDelivered = [
    "Interactive Streamlit & Next.js Web Dashboard with dark terminal UX",
    "Live TinyFish Agent Tracing with real-time DOM token compression metrics",
    "Strict Pydantic Evidence Contracts locking verified UTC release timestamps",
    "Automated Falsifiable Hypothesis Generator (H0 vs H1 at alpha = 0.05)",
    "Sandboxed Python & TypeScript Campbell-Lo-MacKinlay OLS Event Study Engine",
    "Interactive Visualizations: CAR % with 95% Confidence Band & Volume Ratios",
    "1-Click Research Export: Institutional PDF, Audited Markdown, and CSV",
  ];

  const disciplinedBoundaries = [
    "NO Automated Order Execution: Eliminates financial exposure and regulatory broker-dealer risks.",
    "NO Guaranteed Price Predictions: Rejects financial snake oil; outputs empirical p-values only.",
    "NO Sub-Millisecond HFT: Engineered for event-driven fundamental research, not microsecond market making.",
  ];

  const acceleratorMilestones = [
    {
      quarter: "Sprint Phase (Weeks 1-4)",
      title: "Pre-Accelerator Launch",
      description: "Close first 5 pilot boutique hedge fund design partners and integrate full SEC EDGAR Form 10-K/10-Q filing feeds.",
    },
    {
      quarter: "Scale Phase (Weeks 5-8)",
      title: "Intraday & Tick-Level Event Studies",
      description: "Extend Campbell-Lo-MacKinlay models to intraday 1-minute and 5-minute bars for immediate post-earnings reactions.",
    },
    {
      quarter: "Enterprise Phase (Weeks 9-12)",
      title: "Institutional API & B2B SaaS Rollout",
      description: "Deploy SOC2 Type II compliant multi-tenant cloud with tiered monthly subscriptions and TinyFish agent execution credits.",
    },
  ];

  return (
    <section id="roadmap" className="py-16 md:py-24 border-b border-[#1E2C3D] bg-[#090D12]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center space-x-1.5 rounded-full border border-[#FFBE5C]/30 bg-[#FFBE5C]/10 px-3 py-1 text-xs font-mono text-[#FFBE5C] mb-3">
            <Award className="h-3.5 w-3.5" />
            <span>TINYFISH $2M PRE-ACCELERATOR TRACK</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Sprint Roadmap & Commercialization
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#8B949E]">
            A disciplined, production-ready framework transitioning from 48-hour hackathon MVP to enterprise institutional SaaS.
          </p>
        </div>

        {/* 48-Hour Scope vs Disciplined Boundaries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Delivered in 48-Hour Sprint */}
          <div className="rounded-2xl border border-[#10B981]/30 bg-[#0F1722] p-6 lg:p-8">
            <div className="flex items-center space-x-2 text-[#10B981] font-mono text-xs font-bold mb-4">
              <CheckCircle2 className="h-4 w-4" />
              <span>DELIVERED IN 48-HOUR HACKATHON MVP (100% COMPLETE)</span>
            </div>
            <ul className="space-y-3 text-xs sm:text-sm text-[#C9D1D9]">
              {mvpDelivered.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] mt-2 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Disciplined Boundaries */}
          <div className="rounded-2xl border border-[#F59E0B]/30 bg-[#0F1722] p-6 lg:p-8">
            <div className="flex items-center space-x-2 text-[#F59E0B] font-mono text-xs font-bold mb-4">
              <ShieldAlert className="h-4 w-4" />
              <span>DISCIPLINED BOUNDARIES (OUT OF SCOPE BY DESIGN)</span>
            </div>
            <ul className="space-y-4 text-xs sm:text-sm text-[#C9D1D9]">
              {disciplinedBoundaries.map((item, idx) => (
                <li key={idx} className="flex items-start space-x-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B] mt-2 shrink-0"></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border border-[#1E2C3D] bg-[#090D12] p-3 text-xs font-mono text-[#8B949E]">
              &bull; Strict adherence to non-discretionary analytical research. QuantIntel does not give financial advice.
            </div>
          </div>
        </div>

        {/* Post-Hackathon $2M Sprint Milestones */}
        <div className="rounded-2xl border border-[#1E2C3D] bg-[#0F1722] p-6 lg:p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-2">
            <div>
              <span className="text-xs font-mono text-[#00C4CC] font-bold block">
                THE $2M PRE-ACCELERATOR COMMERCIALIZATION VISION
              </span>
              <h3 className="text-xl font-bold text-white mt-1">
                From Hackathon Prototype to Boutique Quant SaaS
              </h3>
            </div>
            <span className="rounded bg-[#00C4CC]/10 text-[#00C4CC] px-3 py-1 text-xs font-mono font-bold">
              TARGET: $100K ARR IN 90 DAYS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {acceleratorMilestones.map((m, idx) => (
              <div key={idx} className="rounded-xl border border-[#1E2C3D] bg-[#090D12] p-5 space-y-2">
                <span className="font-mono text-[11px] text-[#00C4CC] font-semibold">{m.quarter}</span>
                <h4 className="font-bold text-white text-base">{m.title}</h4>
                <p className="text-xs text-[#8B949E] leading-relaxed">{m.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
