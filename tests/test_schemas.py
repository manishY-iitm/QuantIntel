from datetime import datetime, date
import pytest
from quantintel.core.schemas import (
    EventType,
    LookAheadRisk,
    MetricTested,
    EventEvidence,
    HypothesisContract,
    EventStudyConfig,
    EventDayStat,
)


def test_event_evidence_validation():
    ev = EventEvidence(
        ticker="BIIB",
        company_name="Biogen Inc.",
        event_type=EventType.FDA_ADCOM,
        headline="FDA Advisory Panel Approval",
        event_date_utc=datetime(2023, 6, 9, 17, 30, 0),
        verbatim_excerpt="Voted 6-0 confirming clinical benefit.",
        source_url="https://www.fda.gov/news-events/advisory-panel",
        lookahead_risk=LookAheadRisk.VERIFIED_ZERO_RISK,
        confidence_score=0.99,
    )
    assert ev.ticker == "BIIB"
    assert ev.lookahead_risk == LookAheadRisk.VERIFIED_ZERO_RISK
    assert ev.confidence_score > 0.95


def test_hypothesis_contract():
    hyp = HypothesisContract(
        metric_tested=MetricTested.CUMULATIVE_ABNORMAL_RETURN,
        null_hypothesis_H0="CAR is 0",
        alternative_hypothesis_H1="CAR != 0",
        significance_level_alpha=0.05,
    )
    assert hyp.significance_level_alpha == 0.05
    assert hyp.metric_tested == MetricTested.CUMULATIVE_ABNORMAL_RETURN


def test_event_study_config():
    cfg = EventStudyConfig(
        ticker="CRWD",
        benchmark_ticker="XLK",
        event_date=date(2024, 7, 19),
        estimation_window_days=90,
        pre_event_days=5,
        post_event_days=10,
    )
    assert cfg.ticker == "CRWD"
    assert cfg.estimation_window_days == 90
