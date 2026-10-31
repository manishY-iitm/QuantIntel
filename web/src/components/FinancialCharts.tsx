"use client";

import React, { useState } from "react";
import { EventDayStat, EventStudyResult } from "../lib/types";

interface FinancialChartsProps {
  result: EventStudyResult;
}

export function FinancialCharts({ result }: FinancialChartsProps) {
  const [activeTab, setActiveTab] = useState<"car" | "price" | "volume">("car");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const days = result.dayStats;
  const n = days.length;
  if (n === 0) return null;

  // Chart dimensions
  const width = 850;
  const height = 340;
  const padding = { top: 30, right: 30, bottom: 45, left: 55 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  // X Scale: relativeDay mapped across innerWidth
  const getX = (idx: number) => padding.left + (idx / Math.max(n - 1, 1)) * innerWidth;

  // 1. CAR Chart Scaling
  const carValues = days.map((d) => d.cumulativeAbnormalReturnPct);
  const ciUpperValues = days.map((d) => d.ciUpperPct);
  const ciLowerValues = days.map((d) => d.ciLowerPct);

  const minCar = Math.min(...ciLowerValues, 0) * 1.15;
  const maxCar = Math.max(...ciUpperValues, 0) * 1.15;
  const carRange = maxCar - minCar || 1;

  const getYCar = (val: number) =>
    padding.top + innerHeight - ((val - minCar) / carRange) * innerHeight;

  // 2. Price Scaling
  const stockBase = days[0].stockClose || 1;
  const benchBase = days[0].benchmarkClose || 1;
  const normStock = days.map((d) => (d.stockClose / stockBase) * 100);
  const normBench = days.map((d) => (d.benchmarkClose / benchBase) * 100);
  const allNorm = [...normStock, ...normBench];
  const minPrice = Math.min(...allNorm) * 0.96;
  const maxPrice = Math.max(...allNorm) * 1.04;
  const priceRange = maxPrice - minPrice || 1;
  const getYPrice = (val: number) =>
    padding.top + innerHeight - ((val - minPrice) / priceRange) * innerHeight;

  // 3. Volume Scaling
  const volRatios = days.map((d) => d.volumeRatio);
  const maxVol = Math.max(...volRatios, 2.5) * 1.15;
  const getYVol = (val: number) =>
    padding.top + innerHeight - (val / maxVol) * innerHeight;

  // Event Day (t=0) index
  const eventIdx = days.findIndex((d) => d.relativeDay === 0);
  const eventX = eventIdx !== -1 ? getX(eventIdx) : getX(0);

  // Path generators
  const carLinePath = days.reduce(
    (acc, d, i) => `${acc} ${i === 0 ? "M" : "L"} ${getX(i)} ${getYCar(d.cumulativeAbnormalReturnPct)}`,
    ""
  );

  // Confidence Interval Area polygon
  const ciAreaPath =
    days.reduce((acc, d, i) => `${acc} ${i === 0 ? "M" : "L"} ${getX(i)} ${getYCar(d.ciUpperPct)}`, "") +
    days
      .slice()
      .reverse()
      .reduce((acc, d, i) => `${acc} L ${getX(n - 1 - i)} ${getYCar(d.ciLowerPct)}`, "") +
    " Z";

  const stockLinePath = normStock.reduce(
    (acc, val, i) => `${acc} ${i === 0 ? "M" : "L"} ${getX(i)} ${getYPrice(val)}`,
    ""
  );

  const benchLinePath = normBench.reduce(
    (acc, val, i) => `${acc} ${i === 0 ? "M" : "L"} ${getX(i)} ${getYPrice(val)}`,
    ""
  );

  return (
    <div className="rounded-xl border border-[#1E2C3D] bg-[#0F1722] p-5 shadow-xl">
      {/* Chart Navigation Tabs & Legend */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#1E2C3D] pb-3 mb-4 gap-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("car")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === "car"
                ? "bg-[#00C4CC]/20 text-[#00C4CC] border border-[#00C4CC]/40 font-semibold"
                : "text-[#8B949E] hover:text-white hover:bg-[#16202E]"
            }`}
          >
            📈 Cumulative Abnormal Return (CAR)
          </button>
          <button
            onClick={() => setActiveTab("price")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === "price"
                ? "bg-[#00C4CC]/20 text-[#00C4CC] border border-[#00C4CC]/40 font-semibold"
                : "text-[#8B949E] hover:text-white hover:bg-[#16202E]"
            }`}
          >
            ⚖️ Stock vs Benchmark ({result.benchmarkTicker})
          </button>
          <button
            onClick={() => setActiveTab("volume")}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === "volume"
                ? "bg-[#00C4CC]/20 text-[#00C4CC] border border-[#00C4CC]/40 font-semibold"
                : "text-[#8B949E] hover:text-white hover:bg-[#16202E]"
            }`}
          >
            📊 Volume Multiplier
          </button>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-xs font-mono text-[#8B949E]">
          {activeTab === "car" && (
            <>
              <span className="flex items-center space-x-1.5">
                <span className="h-2 w-4 rounded bg-[#00C4CC]"></span>
                <span className="text-[#C9D1D9]">CAR %</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="h-2 w-4 rounded bg-[#00C4CC]/25"></span>
                <span>95% CI Band</span>
              </span>
            </>
          )}
          {activeTab === "price" && (
            <>
              <span className="flex items-center space-x-1.5">
                <span className="h-2 w-4 rounded bg-[#38BDF8]"></span>
                <span className="text-[#C9D1D9]">${result.ticker}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="h-2 w-4 border-t-2 border-dashed border-[#8B949E]"></span>
                <span>{result.benchmarkTicker} Benchmark</span>
              </span>
            </>
          )}
          <span className="flex items-center space-x-1.5 text-[#FFBE5C]">
            <span className="h-2 w-0.5 bg-[#FFBE5C]"></span>
            <span>t=0 Event</span>
          </span>
        </div>
      </div>

      {/* Responsive SVG Chart Canvas */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto select-none"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = padding.top + innerHeight * ratio;
            return (
              <line
                key={ratio}
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#1E2C3D"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {/* 0-level horizontal baseline */}
          {activeTab === "car" && (
            <line
              x1={padding.left}
              y1={getYCar(0)}
              x2={width - padding.right}
              y2={getYCar(0)}
              stroke="#30363D"
              strokeWidth="1.5"
            />
          )}

          {activeTab === "volume" && (
            <line
              x1={padding.left}
              y1={getYVol(1.0)}
              x2={width - padding.right}
              y2={getYVol(1.0)}
              stroke="#30363D"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />
          )}

          {/* Event Catalyst vertical line at t=0 */}
          {eventIdx !== -1 && (
            <g>
              <line
                x1={eventX}
                y1={padding.top}
                x2={eventX}
                y2={height - padding.bottom}
                stroke="#FFBE5C"
                strokeWidth="2"
                strokeDasharray="5 3"
              />
              <text
                x={eventX + 5}
                y={padding.top + 14}
                fill="#FFBE5C"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
              >
                t=0 DISCLOSURE
              </text>
            </g>
          )}

          {/* TAB 1: CAR + 95% Confidence Band */}
          {activeTab === "car" && (
            <g>
              {/* Shaded Confidence Interval */}
              <path d={ciAreaPath} fill="rgba(0, 196, 204, 0.12)" />

              {/* Main CAR Line */}
              <path
                d={carLinePath}
                fill="none"
                stroke="#00C4CC"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {days.map((d, i) => (
                <circle
                  key={d.relativeDay}
                  cx={getX(i)}
                  cy={getYCar(d.cumulativeAbnormalReturnPct)}
                  r={hoveredIdx === i ? 6 : 3.5}
                  fill={hoveredIdx === i ? "#FFFFFF" : "#00C4CC"}
                  stroke="#090D12"
                  strokeWidth="2"
                  className="transition-all duration-150 cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                />
              ))}
            </g>
          )}

          {/* TAB 2: Normalized Stock vs Benchmark */}
          {activeTab === "price" && (
            <g>
              <path
                d={benchLinePath}
                fill="none"
                stroke="#8B949E"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <path
                d={stockLinePath}
                fill="none"
                stroke="#38BDF8"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {days.map((d, i) => (
                <circle
                  key={d.relativeDay}
                  cx={getX(i)}
                  cy={getYPrice(normStock[i])}
                  r={hoveredIdx === i ? 6 : 3.5}
                  fill={hoveredIdx === i ? "#FFFFFF" : "#38BDF8"}
                  stroke="#090D12"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(i)}
                />
              ))}
            </g>
          )}

          {/* TAB 3: Volume Anomaly Multiplier */}
          {activeTab === "volume" && (
            <g>
              {days.map((d, i) => {
                const x = getX(i) - 9;
                const barWidth = 18;
                const y = getYVol(d.volumeRatio);
                const barHeight = Math.max(0, height - padding.bottom - y);
                const isSpike = d.volumeRatio >= 2.0;
                return (
                  <rect
                    key={d.relativeDay}
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="3"
                    fill={isSpike ? "#EF4444" : "#0A84FF"}
                    opacity={hoveredIdx === i ? 1 : 0.8}
                    className="cursor-pointer transition-opacity"
                    onMouseEnter={() => setHoveredIdx(i)}
                  />
                );
              })}
            </g>
          )}

          {/* X Axis Labels */}
          {days.map((d, i) => {
            // Label every other day on small sets, or specific markers
            if (i % 2 === 0 || d.relativeDay === 0) {
              return (
                <text
                  key={d.relativeDay}
                  x={getX(i)}
                  y={height - padding.bottom + 18}
                  fill={d.relativeDay === 0 ? "#FFBE5C" : "#8B949E"}
                  fontSize="10"
                  fontFamily="monospace"
                  textAnchor="middle"
                  fontWeight={d.relativeDay === 0 ? "bold" : "normal"}
                >
                  {d.relativeDay >= 0 ? `+${d.relativeDay}` : d.relativeDay}
                </text>
              );
            }
            return null;
          })}

          {/* Axis Titles */}
          <text
            x={padding.left}
            y={padding.top - 12}
            fill="#8B949E"
            fontSize="10"
            fontFamily="monospace"
          >
            {activeTab === "car" ? "CAR (%)" : activeTab === "price" ? "INDEX (100 = Base)" : "VOL RATIO (x)"}
          </text>

          <text
            x={width / 2}
            y={height - 6}
            fill="#8B949E"
            fontSize="10"
            fontFamily="monospace"
            textAnchor="middle"
          >
            RELATIVE TRADING DAY (t=0 IS CATALYST DISCLOSURE)
          </text>
        </svg>

        {/* Hover Floating Details Card */}
        {hoveredIdx !== null && days[hoveredIdx] && (
          <div
            className="absolute top-2 right-4 pointer-events-none rounded-lg border border-[#00C4CC]/40 bg-[#090D12]/95 p-3 text-xs font-mono shadow-xl backdrop-blur-md"
            style={{ minWidth: "210px" }}
          >
            <div className="flex items-center justify-between border-b border-[#1E2C3D] pb-1.5 mb-1.5">
              <span className="text-white font-bold">
                Day {days[hoveredIdx].relativeDay >= 0 ? `+${days[hoveredIdx].relativeDay}` : days[hoveredIdx].relativeDay}
              </span>
              <span className="text-[#8B949E]">{days[hoveredIdx].dateStr}</span>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Stock Close:</span>
                <span className="text-white font-semibold">${days[hoveredIdx].stockClose.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Daily Return:</span>
                <span className={days[hoveredIdx].stockReturnPct >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}>
                  {days[hoveredIdx].stockReturnPct >= 0 ? "+" : ""}
                  {days[hoveredIdx].stockReturnPct.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B949E]">Abnormal Return:</span>
                <span className={days[hoveredIdx].abnormalReturnPct >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}>
                  {days[hoveredIdx].abnormalReturnPct >= 0 ? "+" : ""}
                  {days[hoveredIdx].abnormalReturnPct.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between border-t border-[#1E2C3D] pt-1 font-bold">
                <span className="text-[#00C4CC]">Cumulative CAR:</span>
                <span className={days[hoveredIdx].cumulativeAbnormalReturnPct >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}>
                  {days[hoveredIdx].cumulativeAbnormalReturnPct >= 0 ? "+" : ""}
                  {days[hoveredIdx].cumulativeAbnormalReturnPct.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between text-[#8B949E]">
                <span>Volume Spike:</span>
                <span className="text-white">{days[hoveredIdx].volumeRatio.toFixed(2)}x normal</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
