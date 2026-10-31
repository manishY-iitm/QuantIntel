import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuantIntel | Autonomous Agentic Quant Research Lab",
  description:
    "Turn unstructured, live-web corporate disclosures into source-grounded, statistically validated quantitative hypotheses through TinyFish web agents and deterministic Python backtesting.",
  keywords: [
    "Quantitative Finance",
    "TinyFish AI",
    "Autonomous Web Agents",
    "Event Study",
    "Cumulative Abnormal Returns",
    "Pydantic Data Contracts",
    "Backtesting",
  ],
  authors: [{ name: "Manish Yadav" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#090D12] text-[#E6EDF3] antialiased selection:bg-[#00C4CC]/30 selection:text-white">
        <div className="relative min-h-screen bg-grid-pattern">
          {children}
        </div>
      </body>
    </html>
  );
}
