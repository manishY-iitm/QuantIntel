export type EventType =
  | "FDA_ADCOM"
  | "FDA_APPROVAL"
  | "CYBERSECURITY_OUTAGE"
  | "SEC_8K_DISCLOSURE"
  | "PRODUCT_CATALYST"
  | "LITIGATION_ANTITRUST"
  | "CUSTOM";

export type MetricTested = "CAR" | "ABNORMAL_VOLUME" | "VOLATILITY_EXPANSION";

export type LookAheadRisk = "VERIFIED_ZERO_RISK" | "LOW_RISK" | "MEDIUM_RISK";

export interface EventEvidence {
  ticker: string;
  companyName: string;
  eventType: EventType;
  headline: string;
  eventDateUtc: string;
  verbatimExcerpt: string;
  sourceUrl: string;
  lookaheadRisk: LookAheadRisk;
  confidenceScore: number;
}

export interface HypothesisContract {
  metricTested: MetricTested;
  nullHypothesisH0: string;
  alternativeHypothesisH1: string;
  significanceLevelAlpha: number;
  expectedDirection: "POSITIVE" | "NEGATIVE" | "TWO_SIDED";
}

export interface EventDayStat {
  dateStr: string;
  relativeDay: number;
  stockClose: number;
  benchmarkClose: number;
  stockReturnPct: number;
  benchmarkReturnPct: number;
  expectedReturnPct: number;
  abnormalReturnPct: number;
  cumulativeAbnormalReturnPct: number;
  volume: number;
  normalVolume: number;
  volumeRatio: number;
  ciLowerPct: number;
  ciUpperPct: number;
}

export interface EventStudyResult {
  ticker: string;
  companyName: string;
  benchmarkTicker: string;
  eventDate: string;
  evidence: EventEvidence;
  hypothesis: HypothesisContract;
  dayStats: EventDayStat[];
  estimationAlpha: number;
  estimationBeta: number;
  estimationR2: number;
  residualStdPct: number;
  carEventWindowPct: number;
  preEventCarPct: number;
  postEventCarPct: number;
  tStatistic: number;
  pValue: number;
  isStatisticallySignificant: boolean;
  avgVolumeRatio: number;
  maxVolumeRatio: number;
  empiricalVerdict: string;
  tokenSavingsPct: number;
}

export interface AgentTraceStep {
  timestamp: string;
  action: string;
  title: string;
  details: string;
  status: "completed" | "in_progress" | "pending";
  sourceUrl?: string;
  tokenSavingsPct?: number;
}

export interface PresetCase {
  id: string;
  title: string;
  badge: string;
  ticker: string;
  companyName: string;
  benchmarkTicker: string;
  eventDate: string;
  eventType: EventType;
  headline: string;
  eventDateUtc: string;
  verbatimExcerpt: string;
  sourceUrl: string;
  nullHypothesisH0: string;
  alternativeHypothesisH1: string;
  metricTested: MetricTested;
  expectedDirection: "POSITIVE" | "NEGATIVE" | "TWO_SIDED";
  queryExample: string;
  tokenSavingsPct: number;
  rawHtmlBytes: number;
  cleanMarkdownBytes: number;
}
