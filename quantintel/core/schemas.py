"""
QuantIntel Pydantic Schemas & Data Contracts
Ensures 100% source provenance, strict UTC timestamp typing, and clean mathematical interfaces.
"""

from datetime import datetime, date, timezone
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, HttpUrl


class EventType(str, Enum):
    FDA_APPROVAL = "FDA_APPROVAL"
    FDA_ADCOM = "FDA_ADCOM"
    SEC_8K_DISCLOSURE = "SEC_8K_DISCLOSURE"
    EARNINGS_ANNOUNCEMENT = "EARNINGS_ANNOUNCEMENT"
    CYBERSECURITY_OUTAGE = "CYBERSECURITY_OUTAGE"
    LITIGATION_ANTITRUST = "LITIGATION_ANTITRUST"
    EXECUTIVE_TRANSITION = "EXECUTIVE_TRANSITION"
    PRODUCT_CATALYST = "PRODUCT_CATALYST"
    CUSTOM = "CUSTOM"


class MetricTested(str, Enum):
    CUMULATIVE_ABNORMAL_RETURN = "CAR"
    ABNORMAL_VOLUME = "ABNORMAL_VOLUME"
    VOLATILITY_EXPANSION = "VOLATILITY_EXPANSION"


class LookAheadRisk(str, Enum):
    VERIFIED_ZERO_RISK = "VERIFIED_ZERO_RISK"
    LOW_RISK = "LOW_RISK"
    MEDIUM_RISK = "MEDIUM_RISK"
    UNCERTAIN = "UNCERTAIN"


class AgentActionType(str, Enum):
    QUERY_DECOMPOSE = "QUERY_DECOMPOSE"
    TINYFISH_SEARCH = "TINYFISH_SEARCH"
    TINYFISH_FETCH = "TINYFISH_FETCH"
    DOM_CLEANING = "DOM_CLEANING"
    EVIDENCE_EXTRACTION = "EVIDENCE_EXTRACTION"
    TIMESTAMP_VERIFICATION = "TIMESTAMP_VERIFICATION"
    HYPOTHESIS_FORMULATION = "HYPOTHESIS_FORMULATION"
    QUANT_EXECUTION = "QUANT_EXECUTION"


class AgentTraceStep(BaseModel):
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    action: AgentActionType
    title: str
    details: str
    status: str = "completed"  # completed, in_progress, info
    source_url: Optional[str] = None
    token_savings_pct: Optional[float] = None


class EventEvidence(BaseModel):
    ticker: str = Field(..., description="Stock ticker symbol (e.g. BIIB, CRWD, TSLA)")
    company_name: str = Field(..., description="Full legal name of the entity")
    event_type: EventType = Field(..., description="Classified category of corporate disclosure")
    headline: str = Field(..., description="Official headline or disclosure title")
    event_date_utc: datetime = Field(..., description="Strict UTC timestamp of the public release")
    verbatim_excerpt: str = Field(..., description="Exact quote from source text proving the disclosure")
    source_url: str = Field(..., description="Direct clickable source link for audited provenance")
    lookahead_risk: LookAheadRisk = Field(
        default=LookAheadRisk.VERIFIED_ZERO_RISK,
        description="Audit assessment that timestamp preceded market open/close without drift"
    )
    confidence_score: float = Field(default=0.98, ge=0.0, le=1.0)


class HypothesisContract(BaseModel):
    metric_tested: MetricTested = Field(default=MetricTested.CUMULATIVE_ABNORMAL_RETURN)
    null_hypothesis_H0: str = Field(..., description="Formal H0 (e.g. CAR in event window is statistically indistinguishable from 0)")
    alternative_hypothesis_H1: str = Field(..., description="Formal H1 (e.g. Significant abnormal returns or volume drift exist)")
    significance_level_alpha: float = Field(default=0.05, description="Significance threshold (typically 0.05 for 95% confidence)")
    expected_direction: str = Field(default="POSITIVE", description="Expected impact: POSITIVE, NEGATIVE, or TWO_SIDED")


class EventStudyConfig(BaseModel):
    ticker: str
    benchmark_ticker: str = "SPY"
    event_date: date
    estimation_window_days: int = 90
    pre_event_days: int = 5
    post_event_days: int = 10


class EventDayStat(BaseModel):
    date_str: str
    relative_day: int
    stock_close: float
    benchmark_close: float
    stock_return_pct: float
    benchmark_return_pct: float
    expected_return_pct: float
    abnormal_return_pct: float
    cumulative_abnormal_return_pct: float
    volume: int
    normal_volume: int
    volume_ratio: float
    ci_lower_pct: float
    ci_upper_pct: float


class EventStudyResult(BaseModel):
    config: EventStudyConfig
    evidence: EventEvidence
    hypothesis: HypothesisContract
    day_stats: List[EventDayStat]
    estimation_alpha: float
    estimation_beta: float
    estimation_r2: float
    residual_std_pct: float
    car_event_window_pct: float
    pre_event_car_pct: float
    post_event_car_pct: float
    t_statistic: float
    p_value: float
    is_statistically_significant: bool
    avg_event_volume_ratio: float
    max_volume_ratio: float
    empirical_verdict: str
