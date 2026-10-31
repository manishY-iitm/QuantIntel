import pytest
from quantintel.futurestock.schemas import ForecastHorizon, ScenarioType, PortfolioHolding, MarketRegion
from quantintel.futurestock.market_data import MarketDataService
from quantintel.futurestock.quant_engine import FutureStockQuantEngine
from quantintel.futurestock.agents.orchestrator import FutureStockOrchestrator
from quantintel.futurestock.dossier import generate_futurestock_markdown, generate_futurestock_pdf
from quantintel.futurestock.tracker import ForecastTrackRecordLedger


def test_market_data_resolution():
    service = MarketDataService()
    t_us, reg_us, bench_us = service.resolve_ticker("NVDA")
    assert t_us == "NVDA"
    assert bench_us == "QQQ"

    t_in, reg_in, bench_in = service.resolve_ticker("RELIANCE")
    assert t_in == "RELIANCE.NS"
    assert bench_in == "^NSEI"

    profile, financials, df = service.get_company_data("NVDA")
    assert profile.ticker == "NVDA"
    assert profile.current_price > 0
    assert not df.empty
    assert "Close" in df.columns


def test_quant_engine_monte_carlo():
    engine = FutureStockQuantEngine()
    service = MarketDataService()
    profile, financials, df = service.get_company_data("NVDA")

    quant_metrics = engine.compute_historical_quant_metrics(df)
    assert quant_metrics.annualized_volatility_pct > 0
    assert -100 <= quant_metrics.max_drawdown_pct <= 0

    mc = engine.run_monte_carlo(
        current_price=profile.current_price,
        df=df,
        horizon=ForecastHorizon.ONE_YEAR,
        iterations=500,
        random_seed=42,
    )

    assert mc.trading_days == 252
    assert mc.p5_price <= mc.p25_price <= mc.median_final_price <= mc.p75_price <= mc.p95_price
    assert len(mc.sample_paths) == 5
    assert len(mc.distribution_bins) > 0


def test_scenario_return_formula():
    engine = FutureStockQuantEngine()
    service = MarketDataService()
    profile, financials, df = service.get_company_data("AAPL")

    mc = engine.run_monte_carlo(
        current_price=profile.current_price,
        df=df,
        horizon=ForecastHorizon.SIX_MONTHS,
        iterations=500,
    )

    scenarios = engine.generate_scenarios(
        profile=profile,
        financials=financials,
        mc_result=mc,
        horizon=ForecastHorizon.SIX_MONTHS,
    )

    assert len(scenarios) == 3
    for sc in scenarios:
        expected = round(((sc.target_price / sc.reference_price) - 1.0) * 100, 2)
        assert abs(sc.potential_return_pct - expected) < 0.05


def test_futurestock_orchestrator_pipeline():
    orchestrator = FutureStockOrchestrator()
    steps = []
    report = None

    gen = orchestrator.run_research_pipeline(
        query="NVDA",
        horizon=ForecastHorizon.ONE_YEAR,
        is_beginner_mode=False,
    )

    try:
        while True:
            step = next(gen)
            steps.append(step)
    except StopIteration as e:
        report = e.value

    assert len(steps) >= 8
    assert report is not None
    assert report.company_profile.ticker == "NVDA"
    assert report.verification_audit.is_audit_passed is True
    assert len(report.scenarios) == 3

    # Test PDF and Markdown Dossier generation
    md = generate_futurestock_markdown(report, is_beginner_mode=False)
    pdf_bytes = generate_futurestock_pdf(report, is_beginner_mode=False)

    assert len(md) > 1000
    assert len(pdf_bytes) > 1000

    # Test Ledger Persistence
    ledger = ForecastTrackRecordLedger()
    rec_id = ledger.record_forecast(report)
    assert rec_id.startswith("fs_NVDA")
    summary = ledger.get_track_record_summary()
    assert summary["total_forecasts_recorded"] >= 1


def test_portfolio_analysis():
    engine = FutureStockQuantEngine()
    holdings = [
        PortfolioHolding(ticker="NVDA", weight_pct=50.0),
        PortfolioHolding(ticker="AAPL", weight_pct=50.0),
    ]
    res = engine.analyze_portfolio(holdings)
    assert res.portfolio_annualized_volatility_pct > 0
    assert len(res.stress_scenarios) >= 3
    assert "NVDA" in res.correlation_matrix


def test_jio_ipo_and_country_aware_resolution():
    service = MarketDataService()

    # 1. Test Jio variations
    for query in ["JIO", "JPL", "JIO IPO", "Jio Platforms", "Reliance Jio"]:
        ticker, region, benchmark = service.resolve_ticker(query)
        assert ticker == "JPL.NS", f"Failed for query {query}"
        assert region == MarketRegion.INDIA
        assert benchmark == "^NSEI"

    # 2. Test Country Filter
    t_in, reg_in, _ = service.resolve_ticker("TCS", country="India")
    assert t_in == "TCS.NS"
    assert reg_in == MarketRegion.INDIA

    t_us, reg_us, _ = service.resolve_ticker("Apple", country="US")
    assert t_us == "AAPL"
    assert reg_us == MarketRegion.US

    # 3. Test JPL Company Profile and Financials
    profile, financials, df = service.get_company_data("JPL")
    assert profile.ticker == "JPL.NS"
    assert profile.currency == "INR"
    assert profile.is_ipo is True
    assert profile.current_price >= 1100.0  # Current market quote level ~₹1,180 - ₹1,431+
    assert profile.market_cap >= 9_000_000_000_000.0  # ₹13.18 Lakh Crore (~$158B)
    assert not df.empty
    assert "Close" in df.columns

    # Test Reliance Post-Bonus Price Resolution
    rel_profile, _, _ = service.get_company_data("RELIANCE")
    assert rel_profile.ticker == "RELIANCE.NS"
    assert 1100.0 <= rel_profile.current_price <= 1350.0  # 1164.9 post 1:1 bonus issue

    # 4. Test Orchestrator End-to-End on Jio IPO
    orchestrator = FutureStockOrchestrator()
    report = orchestrator.research("JIO IPO", horizon=ForecastHorizon.ONE_YEAR, country="India")
    assert report is not None
    assert report.company_profile.ticker == "JPL.NS"
    assert report.company_profile.currency == "INR"
    assert report.company_profile.is_ipo is True
    assert report.verification_audit.is_audit_passed is True
    assert len(report.scenarios) == 3
    # Check verified arithmetic: target vs return
    for s in report.scenarios:
        expected = round(((s.target_price / s.reference_price) - 1.0) * 100, 2)
        assert abs(s.potential_return_pct - expected) < 0.05


def test_random_equities_india_and_us_live_quotes():
    """
    Test random stocks from India and US that are not in the default presets.
    Verifies real market spot prices, correct currencies, exchange detection, and mathematical validity.
    """
    service = MarketDataService()
    orchestrator = FutureStockOrchestrator()

    # 1. Random Indian Stock: TCS (Tata Consultancy Services)
    tcs_ticker, tcs_reg, _ = service.resolve_ticker("TCS", country="India")
    assert tcs_ticker == "TCS.NS"
    assert tcs_reg == MarketRegion.INDIA
    tcs_prof, tcs_fin, tcs_df = service.get_company_data("TCS", country="India")
    assert tcs_prof.ticker == "TCS.NS"
    assert tcs_prof.currency == "INR"
    assert tcs_prof.current_price > 1000.0  # Real spot price ~₹2,500+
    assert tcs_prof.fifty_two_week_high >= tcs_prof.fifty_two_week_low
    assert not tcs_df.empty

    # 2. Random US Stock: Microsoft (MSFT)
    msft_ticker, msft_reg, _ = service.resolve_ticker("Microsoft", country="US")
    assert msft_ticker == "MSFT"
    assert msft_reg == MarketRegion.US
    msft_prof, msft_fin, msft_df = service.get_company_data("Microsoft", country="US")
    assert msft_prof.ticker == "MSFT"
    assert msft_prof.currency == "USD"
    assert msft_prof.current_price > 250.0  # Real spot price ~$500+
    assert msft_prof.fifty_two_week_high >= msft_prof.fifty_two_week_low
    assert not msft_df.empty

    # 3. End-to-end Orchestration for random stock TCS
    tcs_report = orchestrator.research("TCS", horizon=ForecastHorizon.SIX_MONTHS, country="India")
    assert tcs_report.company_profile.ticker == "TCS.NS"
    assert tcs_report.company_profile.currency == "INR"
    assert tcs_report.verification_audit.is_audit_passed is True
    assert len(tcs_report.scenarios) == 3
    for s in tcs_report.scenarios:
        expected = round(((s.target_price / s.reference_price) - 1.0) * 100, 2)
        assert abs(s.potential_return_pct - expected) < 0.05


def test_adani_group_equities_live_pricing_and_resolution():
    """
    Test Adani Group equities live market spot prices and multi-entity resolution.
    Validates Adani Enterprises, Adani Ports, Adani Power, and Adani Green.
    """
    service = MarketDataService()
    orchestrator = FutureStockOrchestrator()

    adani_entities = [
        ("ADANIENT", "ADANIENT.NS", 2000.0, 3500.0),      # Adani Enterprises (~₹2,579)
        ("Adani Ports", "ADANIPORTS.NS", 1400.0, 2200.0),  # Adani Ports (~₹1,850)
        ("ADANIPOWER", "ADANIPOWER.NS", 120.0, 300.0),     # Adani Power (~₹189)
        ("ADANIGREEN", "ADANIGREEN.NS", 900.0, 1600.0),   # Adani Green Energy (~₹1,298)
    ]

    for query, expected_ticker, min_price, max_price in adani_entities:
        ticker, region, _ = service.resolve_ticker(query, country="India")
        assert ticker == expected_ticker, f"Expected {expected_ticker} for query {query}"
        assert region == MarketRegion.INDIA

        prof, fin, df = service.get_company_data(query, country="India")
        assert prof.ticker == expected_ticker
        assert prof.currency == "INR"
        assert min_price <= prof.current_price <= max_price, (
            f"{prof.company_name} ({ticker}) price {prof.current_price} outside expected range [{min_price}, {max_price}]"
        )
        assert prof.fifty_two_week_high >= prof.fifty_two_week_low
        assert not df.empty
        assert "Close" in df.columns

    # End-to-end Adani Enterprises Forecast Dossier
    report = orchestrator.research("Adani Enterprises", horizon=ForecastHorizon.ONE_YEAR, country="India")
    assert report.company_profile.ticker == "ADANIENT.NS"
    assert report.company_profile.currency == "INR"
    assert report.company_profile.current_price > 2000.0
    assert report.verification_audit.is_audit_passed is True
    assert len(report.scenarios) == 3
    for s in report.scenarios:
        expected = round(((s.target_price / s.reference_price) - 1.0) * 100, 2)
        assert abs(s.potential_return_pct - expected) < 0.05


