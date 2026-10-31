export type MarketRegion = "US" | "INDIA" | "GLOBAL";

export type ScenarioType = "BEARISH" | "BASE" | "BULLISH";

export type ForecastHorizon = "1m" | "3m" | "6m" | "1y" | "3y" | "5y";

export type AnalogOutcome = "OUTPERFORMER" | "MARKET_PERFORMER" | "UNDERPERFORMER" | "FAILED_OR_DELISTED";

export interface CompanyProfile {
  ticker: string;
  companyName: string;
  exchange: string;
  currency: string;
  marketRegion: MarketRegion;
  sector: string;
  industry: string;
  currentPrice: number;
  marketCap: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  isIpo: boolean;
  ipoDate?: string;
  dataTimestamp: string;
}

export interface FinancialMetrics {
  revenue: number;
  revenueGrowthYoyPct: number;
  grossMarginPct: number;
  operatingMarginPct: number;
  netMarginPct: number;
  trailingEps: number;
  forwardEps: number;
  operatingCashFlow: number;
  freeCashFlow: number;
  debtToEquity: number;
  currentRatio: number;
  returnOnEquityPct: number;
  sharesOutstanding: number;
  isEstimated: boolean;
  notes?: string;
}

export interface QuantMetrics {
  annualizedReturnPct: number;
  annualizedVolatilityPct: number;
  maxDrawdownPct: number;
  sharpeRatio: number;
  sortinoRatio: number;
  dailyVar95Pct: number;
  dailyCvar95Pct: number;
  betaVsBenchmark: number;
  benchmarkSymbol: string;
}

export interface MonteCarloResult {
  horizonCode: ForecastHorizon;
  tradingDays: number;
  iterations: number;
  initialPrice: number;
  medianFinalPrice: number;
  p5Price: number;
  p25Price: number;
  p75Price: number;
  p95Price: number;
  var95Pct: number;
  cvar95Pct: number;
  samplePaths: number[][];
  distributionBins: { rangeLow: number; rangeHigh: number; count: number; pct: number }[];
  assumptions: string;
}

export interface ForecastScenario {
  scenarioType: ScenarioType;
  horizon: ForecastHorizon;
  referencePrice: number;
  targetPrice: number;
  potentialReturnPct: number;
  currency: string;
  methodology: string;
  keyAssumptions: string[];
  relevantCatalysts: string[];
  downsideRisks: string[];
  limitations: string;
}

export interface ValuationMetrics {
  trailingPe: number | null;
  forwardPe: number | null;
  priceToSales: number;
  evToEbitda: number;
  priceToBook: number;
  dcfBearPrice: number;
  dcfBasePrice: number;
  dcfBullPrice: number;
  waccPct: number;
  terminalGrowthPct: number;
  valuationSummary: string;
}

export interface HistoricalAnalog {
  analogCompany: string;
  analogTicker: string;
  similarityFactors: string;
  businessComparison: string;
  horizonTested: string;
  postEventReturnPct: number;
  outcomeCategory: AnalogOutcome;
  survivorshipNotes: string;
}

export interface RiskAssessment {
  overvaluationRiskScore: number;
  financialHealthScore: number;
  competitiveThreatScore: number;
  regulatoryRiskScore: number;
  adversarialBearThesis: string;
  adversarialBullCounterargument: string;
  modelLimitationWarning: string;
}

export interface VerificationAudit {
  tickerVerified: boolean;
  exchangeAndCurrencyVerified: boolean;
  arithmeticValidated: boolean;
  timestampsConsistent: boolean;
  sourcesRetrievedCount: number;
  claimsWithEvidencePct: number;
  auditNotes: string[];
  isAuditPassed: boolean;
}

export interface InvestmentThesis {
  coreThesis: string;
  bullishArgument: string;
  bearishArgument: string;
  fundamentalEvidence: string[];
  valuationEvidence: string[];
  potentialCatalysts: string[];
  invalidationConditions: string[];
  unansweredQuestions: string[];
}

export interface WebResearchEvidence {
  title: string;
  url: string;
  publicationDate: string;
  retrievalTimestamp: string;
  domain: string;
  extractedSnippet: string;
  category: string;
  tokenSavingsPct: number;
}

export interface PortfolioHolding {
  ticker: string;
  weightPct: number;
}

export interface FutureStockReport {
  requestTicker: string;
  reportTimestampUtc: string;
  companyProfile: CompanyProfile;
  financials: FinancialMetrics;
  quantMetrics: QuantMetrics;
  monteCarlo: MonteCarloResult;
  scenarios: ForecastScenario[];
  valuation: ValuationMetrics;
  analogs: HistoricalAnalog[];
  riskAssessment: RiskAssessment;
  verificationAudit: VerificationAudit;
  investmentThesis: InvestmentThesis;
  researchEvidence: WebResearchEvidence[];
  beginnerSummary: string;
  advancedDetails: string;
}
