import { NextRequest, NextResponse } from "next/server";
import { SUPPORTED_COUNTRIES_LIST, resolveCountry } from "@/lib/country-data";
import { CountryMetadata } from "@/lib/country-types";

export interface CountrySearchResultItem {
  code: string;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  benchmarkIndexName: string;
  benchmarkIndexTicker: string;
  primaryExchanges: string[];
  keySectors: string[];
  displayTitle: string;
  displaySubtitle: string;
  highlight: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || searchParams.get("query") || "";

  if (!q.trim()) {
    // Return popular starter economies
    const defaultList: CountrySearchResultItem[] = SUPPORTED_COUNTRIES_LIST.slice(0, 8).map(
      (c) => ({
        code: c.code,
        name: c.name,
        flag: c.flag,
        currency: c.currency,
        currencySymbol: c.currencySymbol,
        benchmarkIndexName: c.benchmarkIndexName,
        benchmarkIndexTicker: c.benchmarkIndexTicker,
        primaryExchanges: c.primaryExchanges,
        keySectors: c.keySectors,
        displayTitle: `${c.flag} ${c.name}`,
        displaySubtitle: `${c.benchmarkIndexName} (${c.benchmarkIndexTicker}) • ${c.primaryExchanges.join(", ")}`,
        highlight: c.currency,
      })
    );
    return NextResponse.json({ success: true, results: defaultList });
  }

  const queryText = q.trim();

  // 1. Resolve primary matched country using fuzzy & typo engine (e.g. 'pakisant future in stock' -> Pakistan)
  const resolved = resolveCountry(queryText);

  // 2. Filter list of all countries that match the query by name, code, exchange, or sectors
  const cleanQ = queryText.toLowerCase();
  const matchedList = SUPPORTED_COUNTRIES_LIST.filter((c) => {
    if (c.code === resolved.code) return true;
    return (
      c.name.toLowerCase().includes(cleanQ) ||
      c.code.toLowerCase().includes(cleanQ) ||
      c.benchmarkIndexName.toLowerCase().includes(cleanQ) ||
      c.benchmarkIndexTicker.toLowerCase().includes(cleanQ) ||
      c.primaryExchanges.some((ex) => ex.toLowerCase().includes(cleanQ)) ||
      c.keySectors.some((sec) => sec.toLowerCase().includes(cleanQ))
    );
  });

  // Make sure resolved country is first
  const results: CountrySearchResultItem[] = [];
  const addedCodes = new Set<string>();

  // Add primary resolved country first
  results.push({
    code: resolved.code,
    name: resolved.name,
    flag: resolved.flag,
    currency: resolved.currency,
    currencySymbol: resolved.currencySymbol,
    benchmarkIndexName: resolved.benchmarkIndexName,
    benchmarkIndexTicker: resolved.benchmarkIndexTicker,
    primaryExchanges: resolved.primaryExchanges,
    keySectors: resolved.keySectors,
    displayTitle: `${resolved.flag} ${resolved.name}`,
    displaySubtitle: `${resolved.benchmarkIndexName} (${resolved.benchmarkIndexTicker}) • ${resolved.primaryExchanges.join(", ")}`,
    highlight: "Primary Match",
  });
  addedCodes.add(resolved.code);

  // Add additional matches
  for (const c of matchedList) {
    if (!addedCodes.has(c.code)) {
      addedCodes.add(c.code);
      results.push({
        code: c.code,
        name: c.name,
        flag: c.flag,
        currency: c.currency,
        currencySymbol: c.currencySymbol,
        benchmarkIndexName: c.benchmarkIndexName,
        benchmarkIndexTicker: c.benchmarkIndexTicker,
        primaryExchanges: c.primaryExchanges,
        keySectors: c.keySectors,
        displayTitle: `${c.flag} ${c.name}`,
        displaySubtitle: `${c.benchmarkIndexName} (${c.benchmarkIndexTicker}) • ${c.primaryExchanges.join(", ")}`,
        highlight: c.currency,
      });
    }
  }

  return NextResponse.json({
    success: true,
    query: queryText,
    resolvedCode: resolved.code,
    results,
  });
}
