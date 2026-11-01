"""
Unit and Integration Tests for LSE Data 3.0 Provider.
Validates client initialization, authentication handling, OHLCV normalization,
options chain models, macro series, and QuantEngine integration.
"""

import pytest
from datetime import date
from quantintel.market_data.schemas import (
    MarketDataSource,
    DataFreshnessStatus,
    InstrumentQuote,
    HistoricalOHLCV,
    OptionChainData,
    MacroSeriesData,
)
from quantintel.market_data.providers.lse_provider import LSEDataProvider
from quantintel.market_data.service import UnifiedMarketDataService
from quantintel.core.schemas import EventStudyConfig
from quantintel.core.quant_engine import QuantEngine


def test_lse_provider_initialization_unconfigured():
    """Verify provider initializes gracefully when no key is set."""
    provider = LSEDataProvider(api_key="")
    assert not provider.is_live_configured()
    markets = provider.get_supported_markets()
    assert len(markets) == 11
    market_ids = [m["id"] for m in markets]
    assert "us_stocks" in market_ids
    assert "us_options" in market_ids
    assert "crypto" in market_ids


def test_lse_provider_authentication_failure_handling():
    """Verify provider handles invalid keys safely without throwing uncaught exceptions."""
    provider = LSEDataProvider(api_key="invalid_dummy_key_12345")
    assert provider.is_live_configured()
    # Health check should return error or unauthenticated status
    health = provider.get_health()
    assert health.get("status") in ["error", "unauthenticated", "unavailable"]


def test_lse_provider_ohlcv_normalization():
    """Verify historical candles are normalized into strict MarketDataBar objects."""
    provider = LSEDataProvider()
    ohlcv = provider.get_historical_ohlcv("AAPL", timeframe="1d", limit=10)

    assert isinstance(ohlcv, HistoricalOHLCV)
    assert ohlcv.symbol == "AAPL"
    assert len(ohlcv.bars) > 0
    bar = ohlcv.bars[0]
    assert bar.open > 0
    assert bar.high >= bar.low
    assert bar.close > 0
    assert len(bar.timestamp) > 0


def test_lse_provider_options_chain_data():
    """Verify options tape returns contracts with IV and Greeks."""
    provider = LSEDataProvider()
    chain = provider.get_options_chain("NVDA", max_dte=30)

    assert isinstance(chain, OptionChainData)
    assert chain.underlying == "NVDA"
    assert len(chain.contracts) > 0
    contract = chain.contracts[0]
    assert contract.strike > 0
    assert contract.right in ["call", "put"]
    assert contract.last_price > 0


def test_lse_provider_macro_series():
    """Verify macroeconomic series points are structured with date and value."""
    provider = LSEDataProvider()
    macro = provider.get_macro_series("US.core_inflation_rate")

    assert isinstance(macro, MacroSeriesData)
    assert macro.series_id == "US.core_inflation_rate"
    assert len(macro.data_points) > 0
    pt = macro.data_points[0]
    assert isinstance(pt.value, float)
    assert len(pt.date) > 0


def test_unified_market_data_service_routing():
    """Verify unified service routes US equities and regional equities appropriately."""
    service = UnifiedMarketDataService()
    us_quote = service.get_latest_price("AAPL", country="US")
    assert isinstance(us_quote, InstrumentQuote)
    assert us_quote.symbol == "AAPL"
    assert us_quote.price > 0

    in_quote = service.get_latest_price("RELIANCE.NS", country="IN")
    assert isinstance(in_quote, InstrumentQuote)
    assert in_quote.symbol == "RELIANCE.NS"
    assert in_quote.currency == "INR"


def test_quant_engine_integration_with_lse_layer():
    """Verify deterministic QuantEngine executes with market data provider layer."""
    from quantintel.core.schemas import EventEvidence, HypothesisContract

    evidence = EventEvidence(
        ticker="AAPL",
        company_name="Apple Inc.",
        event_type="CUSTOM",
        headline="Apple Intelligence Keynote",
        event_date_utc="2024-06-10T17:00:00Z",
        verbatim_excerpt="Apple announces on-device intelligence architecture.",
        source_url="https://apple.com",
    )
    hypothesis = HypothesisContract(
        null_hypothesis_H0="CAR is 0",
        alternative_hypothesis_H1="CAR != 0",
        metric_tested="CAR",
    )
    config = EventStudyConfig(
        ticker="AAPL",
        benchmark_ticker="SPY",
        event_date=date(2024, 6, 10),  # Apple Intelligence WWDC
        estimation_window_days=60,
        pre_event_days=3,
        post_event_days=5,
    )
    engine = QuantEngine(config)
    result = engine.run_event_study(evidence, hypothesis)

    assert result.config.ticker == "AAPL"
    assert result.config.benchmark_ticker == "SPY"
    assert isinstance(result.car_event_window_pct, float)
    assert isinstance(result.t_statistic, float)
    assert 0.0 <= result.p_value <= 1.0
    assert len(result.day_stats) == 9  # 3 pre + 1 event + 5 post
