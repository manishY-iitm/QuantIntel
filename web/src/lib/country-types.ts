export type CountryCode =
  | "IN"
  | "US"
  | "GB"
  | "CN"
  | "JP"
  | "DE"
  | "AU"
  | "CA"
  | "SG";

export type NewsCategory =
  | "GOVERNMENT_POLICY"
  | "CENTRAL_BANK"
  | "ECONOMIC_INDICATORS"
  | "EARNINGS"
  | "MERGERS_ACQUISITIONS"
  | "IPOS"
  | "FOREIGN_INVESTMENT"
  | "TRADE_TARIFFS"
  | "GEOPOLITICS"
  | "ENERGY_COMMODITIES"
  | "TECH_SEMICONDUCTORS"
  | "MAJOR_INDUSTRIES"
  | "MARKET_INDICES"
  | "COMPANY_SPECIFIC";

export type SentimentClassification =
  | "POSITIVE"
  | "NEGATIVE"
  | "MIXED"
  | "NEUTRAL"
  | "UNCONFIRMED";

export type ScenarioType = "BULLISH" | "BEARISH" | "NEUTRAL";

export type StockWatchCategory =
  | "POSITIVE_CATALYSTS"
  | "NEGATIVE_CATALYSTS"
  | "MIXED_OUTLOOK"
  | "FURTHER_INVESTIGATION";

export interface CountryMetadata {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  currencySymbol: string;
  primaryExchanges: string[];
  benchmarkIndexName: string;
  benchmarkIndexTicker: string;
  secondaryIndexTicker?: string;
  timezoneName: string;
  tradingHours: string;
  keySectors: string[];
}

export interface CountryNewsItem {
  id: string;
  headline: string;
  originalSource: string;
  url: string;
  publicationTimestamp: string;
  retrievalTimestamp: string;
  country: string;
  countryCode: CountryCode;
  relevantCompany?: string;
  ticker?: string;
  relevantSector: string;
  eventCategory: NewsCategory;
  sentiment: SentimentClassification;
  confidence: number;
  countryImpact: string;
  sectorImpact: string;
  companyImpact?: string;
  mainFindings: string;
  supportingEvidence: string;
  potentialRisks: string;
  isBreaking: boolean;
  isUnconfirmed: boolean;
  tokenSavingsPct: number;
  corroborationCount: number;
}

export interface SectorImpact {
  sectorName: string;
  countryCode: CountryCode;
  positiveCount: number;
  negativeCount: number;
  mixedCount: number;
  neutralCount: number;
  netSentiment: SentimentClassification;
  majorDevelopments: string[];
  supportingSources: string[];
  potentialBeneficiaries: string[];
  exposedCompanies: string[];
  risks: string[];
  latestPerformancePct?: number;
  benchmarkComparisonPct?: number;
  confidenceScore: number;
}

export interface StockToWatch {
  companyName: string;
  ticker: string;
  exchange: string;
  countryCode: CountryCode;
  sector: string;
  category: StockWatchCategory;
  relevantNews: string;
  relevanceReasoning: string;
  potentialPositiveCatalysts: string[];
  potentialNegativeCatalysts: string[];
  currentPrice?: number;
  priceChangePct?: number;
  currency: string;
  volume?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  historicalPerformance1mPct?: number;
  importantRisks: string[];
  sourceLinks: string[];
  marketDataTimestamp?: string;
  isMarketDataDelayed: boolean;
}

export interface ForwardScenario {
  scenarioType: ScenarioType;
  title: string;
  timeHorizon: string;
  probabilityPct?: number;
  supportingEvidence: string[];
  potentialCatalysts: string[];
  relevantSectors: string[];
  relevantCompanies: string[];
  mainAssumptions: string[];
  invalidationConditions: string[];
  keyRisks: string[];
  confidenceLevel: string;
  forecastMethodology: string;
}

export interface CountryMacroSummary {
  countryName: string;
  countryCode: CountryCode;
  asOfUtc: string;
  marketContext: string;
  majorEconomicDevelopments: string[];
  mostImportantPositiveCatalysts: string[];
  mostImportantNegativeCatalysts: string[];
  sectorsAttractingAttention: string[];
  sectorsFacingRisks: string[];
  materiallyExposedCompanies: string[];
  upcomingScheduledEvents: string[];
  majorUncertainties: string[];
}

export interface IndexQuote {
  name: string;
  ticker: string;
  price: number;
  changePct: number;
  currency: string;
  timestamp: string;
  isMarketOpen: boolean;
}

export interface CountryIntelligenceReport {
  countryMetadata: CountryMetadata;
  macroSummary: CountryMacroSummary;
  benchmarkQuote?: IndexQuote;
  secondaryQuote?: IndexQuote;
  sectors: SectorImpact[];
  stocksToWatch: StockToWatch[];
  scenarios: ForwardScenario[];
  newsFeed: CountryNewsItem[];
  totalSourcesAudited: number;
  averageTokenSavingsPct: number;
  retrievalTimestamp: string;
  dataFreshnessSeconds: number;
  isCached: boolean;
  warningNotes: string[];
}
