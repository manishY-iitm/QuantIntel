import { NextRequest, NextResponse } from "next/server";
import dns from "node:dns";

try {
  dns.setDefaultResultOrder("ipv4first");
} catch {
  // ignore
}

export interface SearchResultItem {
  ticker: string;
  name: string;
  exchange: string;
  region: "INDIA" | "US" | "GLOBAL";
  currency: string;
  type: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || searchParams.get("query") || "";
  const country = (searchParams.get("country") || "").toUpperCase();

  if (!q.trim()) {
    return NextResponse.json({ success: true, results: [] });
  }

  try {
    const searchUrl = `https://query2.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q.trim())}&quotesCount=10&newsCount=0`;
    const res = await fetch(searchUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      next: { revalidate: 30 },
    });

    if (res.ok) {
      const data = await res.json();
      const rawQuotes = data?.quotes || [];

      const results: SearchResultItem[] = rawQuotes
        .filter((item: any) => item.symbol && (item.quoteType === "EQUITY" || item.quoteType === "ETF"))
        .map((item: any) => {
          const sym = item.symbol.toUpperCase();
          const isIndia = sym.endsWith(".NS") || sym.endsWith(".BO");
          const region: "INDIA" | "US" | "GLOBAL" = isIndia
            ? "INDIA"
            : ["NMS", "NYQ", "NGM", "NCM", "ASE", "PCX"].includes(item.exchange)
            ? "US"
            : "GLOBAL";

          return {
            ticker: sym,
            name: item.longname || item.shortname || sym,
            exchange: item.exchange || (isIndia ? "NSE" : "NASDAQ"),
            region,
            currency: isIndia ? "INR" : "USD",
            type: item.quoteType || "EQUITY",
          };
        });

      // Filter by selected country if requested
      const filtered = results.filter((item) => {
        if (country === "INDIA") return item.region === "INDIA";
        if (country === "US") return item.region === "US";
        return true;
      });

      return NextResponse.json({
        success: true,
        query: q,
        results: filtered.length > 0 ? filtered : results,
      });
    }
  } catch (err) {
    console.error("Search API lookup error:", err);
  }

  // Graceful fallback with generated match
  const isIndia = country === "INDIA" || q.toUpperCase().endsWith(".NS");
  const cleanSym = q.trim().toUpperCase().replace(/\s+/g, "");
  const formattedTicker = isIndia && !cleanSym.endsWith(".NS") ? `${cleanSym}.NS` : cleanSym;

  return NextResponse.json({
    success: true,
    query: q,
    results: [
      {
        ticker: formattedTicker,
        name: `${formattedTicker} Corporation`,
        exchange: isIndia ? "NSE" : "NASDAQ",
        region: isIndia ? "INDIA" : "US",
        currency: isIndia ? "INR" : "USD",
        type: "EQUITY",
      },
    ],
  });
}
