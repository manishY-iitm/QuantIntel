"""
Tests for Country-Level Live Stock Market Intelligence.
Validates schemas, TinyFish country research parsing, sentiment classification,
sector aggregation, market data formatting, and forward scenarios.
"""

import pytest
from quantintel.country.schemas import (
    CountryCode,
    NewsCategory,
    SentimentClassification,
    ScenarioType,
    StockWatchCategory,
    CountryNewsItem,
    SUPPORTED_COUNTRIES,
    resolve_country,
)
from quantintel.country.market_service import CountryMarketService
from quantintel.country.country_researcher import TinyFishCountryResearcher
from quantintel.country.classifier import CountryIntelligenceClassifier


def test_supported_countries_metadata():
    """Verify all major economies have full exchange and currency metadata."""
    assert CountryCode.INDIA in SUPPORTED_COUNTRIES
    assert CountryCode.UNITED_STATES in SUPPORTED_COUNTRIES
    assert CountryCode.UNITED_KINGDOM in SUPPORTED_COUNTRIES
    assert CountryCode.JAPAN in SUPPORTED_COUNTRIES
    assert CountryCode.GERMANY in SUPPORTED_COUNTRIES

    india = SUPPORTED_COUNTRIES[CountryCode.INDIA]
    assert india.name == "India"
    assert india.currency == "INR"
    assert india.benchmark_index_ticker == "^NSEI"
    assert len(india.key_sectors) > 5

    us = SUPPORTED_COUNTRIES[CountryCode.UNITED_STATES]
    assert us.currency == "USD"
    assert us.benchmark_index_ticker == "^GSPC"


def test_market_service_index_quotes():
    """Verify market service returns structured index quotes with market open tracking."""
    service = CountryMarketService()
    quote = service.get_index_quote(CountryCode.INDIA)

    assert quote is not None
    assert quote.ticker == "^NSEI"
    assert quote.price > 0
    assert quote.currency == "INR"
    assert isinstance(quote.is_market_open, bool)
    assert len(quote.timestamp) > 0


def test_country_researcher_offline_resilience():
    """Verify researcher constructs categorized news items with token savings."""
    researcher = TinyFishCountryResearcher()
    items = researcher.research_country(CountryCode.INDIA, max_results=5)

    assert len(items) >= 3
    first = items[0]
    assert isinstance(first, CountryNewsItem)
    assert first.country == "India"
    assert first.token_savings_pct >= 80.0
    assert first.sentiment in SentimentClassification
    assert first.event_category in NewsCategory
    assert len(first.url) > 0


def test_country_classifier_end_to_end():
    """Verify full report generation: macro summary, sectors, stocks, scenarios."""
    researcher = TinyFishCountryResearcher()
    classifier = CountryIntelligenceClassifier()

    news_items = researcher.research_country(CountryCode.UNITED_STATES, max_results=6)
    report = classifier.generate_report(CountryCode.UNITED_STATES, news_items)

    assert report.country_metadata.code == CountryCode.UNITED_STATES
    assert len(report.sectors) >= 5
    assert len(report.stocks_to_watch) >= 3
    assert len(report.scenarios) == 3

    # Check scenario distribution
    scenario_types = [s.scenario_type for s in report.scenarios]
    assert ScenarioType.BULLISH in scenario_types
    assert ScenarioType.NEUTRAL in scenario_types
    assert ScenarioType.BEARISH in scenario_types

    # Check macro summary
    assert len(report.macro_summary.market_context) > 0
    assert len(report.macro_summary.upcoming_scheduled_events) > 0

    # Check stock watch contract
    stock = report.stocks_to_watch[0]
    assert stock.category in StockWatchCategory
    assert len(stock.relevance_reasoning) > 0


def test_fuzzy_country_resolver():
    """Verify natural language queries and typos resolve accurately to countries."""
    # Typos and multi-word queries
    pak_meta = resolve_country("pakisant future in stock")
    assert pak_meta.code == CountryCode.PAKISTAN
    assert pak_meta.name == "Pakistan"
    assert pak_meta.benchmark_index_ticker == "^KSE"
    assert pak_meta.currency == "PKR"

    pak_meta2 = resolve_country("pakisant")
    assert pak_meta2.code == CountryCode.PAKISTAN

    pak_meta3 = resolve_country("Pakistan")
    assert pak_meta3.code == CountryCode.PAKISTAN

    pak_meta4 = resolve_country("kse-100")
    assert pak_meta4.code == CountryCode.PAKISTAN

    ind_meta = resolve_country("nifty 50")
    assert ind_meta.code == CountryCode.INDIA

    us_meta = resolve_country("sp500")
    assert us_meta.code == CountryCode.UNITED_STATES


def test_pakistan_country_intelligence_pipeline():
    """Verify full end-to-end country intelligence for Pakistan."""
    researcher = TinyFishCountryResearcher()
    classifier = CountryIntelligenceClassifier()

    news_items = researcher.research_country(CountryCode.PAKISTAN, max_results=5)
    assert len(news_items) >= 3

    report = classifier.generate_report(CountryCode.PAKISTAN, news_items)
    assert report.country_metadata.code == CountryCode.PAKISTAN
    assert report.country_metadata.name == "Pakistan"
    assert report.country_metadata.flag == "🇵🇰"
    assert report.country_metadata.currency == "PKR"
    assert report.benchmark_quote is not None
    assert report.benchmark_quote.ticker == "^KSE"
    assert len(report.sectors) >= 5
    assert len(report.stocks_to_watch) >= 3

    # Check anchor stocks include prominent Pakistani equities
    tickers = [s.ticker for s in report.stocks_to_watch]
    assert any("KA" in t or t in ["OGDC.KA", "MCB.KA", "LUCK.KA", "ENGRO.KA"] for t in tickers)


def test_sector_impact_across_united_states():
    """Verify Sector Impact Across United States generates comprehensive, validated sector matrices."""
    researcher = TinyFishCountryResearcher()
    classifier = CountryIntelligenceClassifier()

    news_items = researcher.research_country(CountryCode.UNITED_STATES, max_results=8)
    report = classifier.generate_report(CountryCode.UNITED_STATES, news_items)

    assert report.country_metadata.code == CountryCode.UNITED_STATES
    assert report.country_metadata.name == "United States"
    assert report.country_metadata.currency == "USD"
    assert len(report.sectors) >= 8

    sector_names = [s.sector_name for s in report.sectors]
    expected_us_sectors = [
        "Information Technology",
        "Artificial Intelligence & Semis",
        "Banking & Finance",
        "Healthcare & Biotech",
        "Energy & Oil",
        "Aerospace & Defence",
    ]
    for expected in expected_us_sectors:
        assert expected in sector_names, f"Expected US sector '{expected}' missing from sector impact report!"

    for sec in report.sectors:
        assert sec.country_code == CountryCode.UNITED_STATES
        assert isinstance(sec.net_sentiment, SentimentClassification)
        assert sec.positive_count >= 0
        assert sec.negative_count >= 0
        assert sec.mixed_count >= 0
        assert sec.neutral_count >= 0
        assert len(sec.major_developments) >= 1
        assert len(sec.supporting_sources) >= 1
        assert 0.0 < sec.confidence_score <= 1.0
        assert len(sec.risks) >= 1


def test_sector_impact_across_all_supported_countries():
    """Verify Sector Impact is non-empty and well-structured across all supported countries."""
    classifier = CountryIntelligenceClassifier()

    for code, meta in SUPPORTED_COUNTRIES.items():
        report = classifier.generate_report(code, [])
        assert report.country_metadata.code == code
        assert len(report.sectors) >= 5, f"Country {code} has fewer than 5 sectors!"
        
        for sec in report.sectors:
            assert sec.country_code == code
            assert len(sec.sector_name) > 0
            assert isinstance(sec.net_sentiment, SentimentClassification)
            assert len(sec.major_developments) >= 1


def test_sector_impact_empty_news_resilience():
    """Verify that even when web reconnaissance returns 0 news items, Sector Impact is fully preserved."""
    classifier = CountryIntelligenceClassifier()
    report = classifier.generate_report(CountryCode.UNITED_STATES, [])

    assert len(report.sectors) >= 8
    for sec in report.sectors:
        assert len(sec.major_developments) >= 1
        assert "throughput" in sec.major_developments[0].lower() or "operational" in sec.major_developments[0].lower()


