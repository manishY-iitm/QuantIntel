"""
FutureStock Pydantic Schemas & Typed Data Contracts
Defines typed structures for company profiles, financials, quantitative simulations,
forecast scenarios, multi-agent outputs, and verification audits.
"""

from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class MarketRegion(str, Enum):
    US = "US"
    INDIA = "INDIA"
    GLOBAL = "GLOBAL"


class ScenarioType(str, Enum):
    BEARISH = "BEARISH"
    BASE = "BASE"
    BULLISH = "BULLISH"


class ForecastHorizon(str, Enum):
    ONE_MONTH = "1m"
    THREE_MONTHS = "3m"
    SIX_MONTHS = "6m"
    ONE_YEAR = "1y"
    THREE_YEARS = "3y"
    FIVE_YEARS = "5y"


class AnalogOutcome(str, Enum):
    OUTPERFORMER = "OUTPERFORMER"
    MARKET_PERFORMER = "MARKET_PERFORMER"
    UNDERPERFORMER = "UNDERPERFORMER"
    FAILED_OR_DELISTED = "FAILED_OR_DELISTED"


class CompanyProfile(BaseModel):
    ticker: str
    company_name: str
    exchange: str
    currency: str
    market_region: MarketRegion
    sector: str
    industry: str
    current_price: float
    market_cap: float
    fifty_two_week_high: Optional[float] = None
    fifty_two_week_low: Optional[float] = None
    is_ipo: bool = False
    ipo_date: Optional[str] = None
    ipo_offer_price: Optional[float] = None
    listing_day_return_pct: Optional[float] = None
    data_timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class FinancialMetrics(BaseModel):
    revenue: Optional[float] = None
    revenue_growth_yoy_pct: Optional[float] = None
    gross_margin_pct: Optional[float] = None
    operating_margin_pct: Optional[float] = None
    net_margin_pct: Optional[float] = None
    trailing_eps: Optional[float] = None
    forward_eps: Optional[float] = None
    operating_cash_flow: Optional[float] = None
    free_cash_flow: Optional[float] = None
    debt_to_equity: Optional[float] = None
    current_ratio: Optional[float] = None
    return_on_equity_pct: Optional[float] = None
    return_on_invested_capital_pct: Optional[float] = None
    shares_outstanding: Optional[float] = None
    is_estimated: bool = False
    notes: Optional[str] = None


class QuantMetrics(BaseModel):
    annualized_return_pct: float
    annualized_volatility_pct: float
    max_drawdown_pct: float
    sharpe_ratio: float
    sortino_ratio: float
    daily_var_95_pct: float
    daily_cvar_95_pct: float
    beta_vs_benchmark: float
    benchmark_symbol: str


class MonteCarloResult(BaseModel):
    horizon_code: ForecastHorizon
    trading_days: int
    iterations: int
    initial_price: float
    median_final_price: float
    p5_price: float
    p25_price: float
    p75_price: float
    p95_price: float
    var_95_pct: float
    cvar_95_pct: float
    sample_paths: List[List[float]] = Field(default_factory=list, description="5 sample representative price trajectories")
    distribution_bins: List[Dict[str, Any]] = Field(default_factory=list, description="Histogram bins of final price distribution")
    assumptions: str


class ForecastScenario(BaseModel):
    scenario_type: ScenarioType
    horizon: ForecastHorizon
    reference_price: float
    target_price: float
    potential_return_pct: float
    currency: str
    methodology: str
    key_assumptions: List[str]
    relevant_catalysts: List[str]
    downside_risks: List[str]
    limitations: str


class ValuationMetrics(BaseModel):
    trailing_pe: Optional[float] = None
    forward_pe: Optional[float] = None
    price_to_sales: Optional[float] = None
    ev_to_ebitda: Optional[float] = None
    price_to_book: Optional[float] = None
    dcf_bear_price: Optional[float] = None
    dcf_base_price: Optional[float] = None
    dcf_bull_price: Optional[float] = None
    wacc_pct: Optional[float] = None
    terminal_growth_pct: Optional[float] = None
    valuation_summary: str


class HistoricalAnalog(BaseModel):
    analog_company: str
    analog_ticker: str
    similarity_factors: str
    business_comparison: str
    horizon_tested: str
    post_event_return_pct: float
    outcome_category: AnalogOutcome
    survivorship_notes: str


class RiskAssessment(BaseModel):
    overvaluation_risk_score: int = Field(..., ge=1, le=10)
    financial_health_score: int = Field(..., ge=1, le=10)
    competitive_threat_score: int = Field(..., ge=1, le=10)
    regulatory_risk_score: int = Field(..., ge=1, le=10)
    adversarial_bear_thesis: str
    adversarial_bull_counterargument: str
    model_limitation_warning: str


class VerificationAudit(BaseModel):
    ticker_verified: bool = True
    exchange_and_currency_verified: bool = True
    arithmetic_validated: bool = True
    timestamps_consistent: bool = True
    sources_retrieved_count: int
    claims_with_evidence_pct: float
    audit_notes: List[str]
    is_audit_passed: bool = True


class InvestmentThesis(BaseModel):
    core_thesis: str
    bullish_argument: str
    bearish_argument: str
    fundamental_evidence: List[str]
    valuation_evidence: List[str]
    potential_catalysts: List[str]
    invalidation_conditions: List[str]
    unanswered_questions: List[str]


class WebResearchEvidence(BaseModel):
    title: str
    url: str
    publication_date: Optional[str] = None
    retrieval_timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    domain: str
    extracted_snippet: str
    category: str  # EARNINGS, FILING, NEWS, RISKS, IPO_PROSPECTUS, CATALYST
    token_savings_pct: Optional[float] = None


class PortfolioHolding(BaseModel):
    ticker: str
    weight_pct: float
    shares: Optional[float] = None
    current_price: Optional[float] = None


class PortfolioAnalysisResult(BaseModel):
    holdings: List[PortfolioHolding]
    portfolio_annualized_return_pct: float
    portfolio_annualized_volatility_pct: float
    portfolio_sharpe_ratio: float
    portfolio_max_drawdown_pct: float
    stress_scenarios: List[Dict[str, Any]]
    diversification_score: float
    correlation_matrix: Dict[str, Dict[str, float]]


class FutureStockReport(BaseModel):
    request_ticker: str
    report_timestamp_utc: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    company_profile: CompanyProfile
    financials: FinancialMetrics
    quant_metrics: QuantMetrics
    monte_carlo: MonteCarloResult
    scenarios: List[ForecastScenario]
    valuation: ValuationMetrics
    analogs: List[HistoricalAnalog]
    risk_assessment: RiskAssessment
    verification_audit: VerificationAudit
    investment_thesis: InvestmentThesis
    research_evidence: List[WebResearchEvidence]
    beginner_summary: str
    advanced_details: str
