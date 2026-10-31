from datetime import date
import pytest
from quantintel.presets.data import PRESET_CASES
from quantintel.core.schemas import EventStudyConfig, EventEvidence, HypothesisContract
from quantintel.core.quant_engine import QuantEngine


def test_quant_engine_biogen_study():
    case = PRESET_CASES[0]
    evidence = EventEvidence(
        ticker=case["ticker"],
        company_name=case["company_name"],
        event_type=case["event_type"],
        headline=case["headline"],
        event_date_utc=case["event_date_utc"],
        verbatim_excerpt=case["verbatim_excerpt"],
        source_url=case["source_url"],
    )
    hypothesis = HypothesisContract(
        null_hypothesis_H0=case["null_hypothesis_H0"],
        alternative_hypothesis_H1=case["alternative_hypothesis_H1"],
        metric_tested=case["metric_tested"],
    )
    config = EventStudyConfig(
        ticker=case["ticker"],
        benchmark_ticker=case["benchmark_ticker"],
        event_date=case["event_date"],
        estimation_window_days=60,
        pre_event_days=3,
        post_event_days=5,
    )

    engine = QuantEngine(config)
    result = engine.run_event_study(evidence, hypothesis)

    assert result.config.ticker == "BIIB"
    assert len(result.day_stats) == 3 + 5 + 1  # [-3, +5] inclusive
    assert isinstance(result.t_statistic, float)
    assert isinstance(result.p_value, float)
    assert 0.0 <= result.p_value <= 1.0
    assert result.avg_event_volume_ratio > 0.0
    assert result.residual_std_pct > 0.0


def test_quant_engine_synthetic_fallback():
    # Test ticker with unusual dates forcing synthetic series
    evidence = EventEvidence(
        ticker="FAKECO",
        company_name="Fake Corporation",
        event_type="CUSTOM",
        headline="Synthetic Catalyst",
        event_date_utc="2024-01-10T12:00:00Z",
        verbatim_excerpt="Synthetic testing quote.",
        source_url="https://example.com",
    )
    hypothesis = HypothesisContract(
        null_hypothesis_H0="No impact",
        alternative_hypothesis_H1="Impact exists",
    )
    config = EventStudyConfig(
        ticker="FAKECO",
        benchmark_ticker="SPY",
        event_date=date(2024, 1, 10),
        estimation_window_days=40,
        pre_event_days=2,
        post_event_days=3,
    )
    engine = QuantEngine(config)
    result = engine.run_event_study(evidence, hypothesis)
    assert len(result.day_stats) == 6
    assert result.estimation_beta != 0.0
