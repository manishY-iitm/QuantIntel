"""
Country-Level Live Stock Market Intelligence Package for QuantIntel.
Provides country research, live news classification, sector impact mapping,
stock discovery, market benchmark feeds, and forward scenario generation.
"""

from .schemas import (
    CountryCode,
    CountryMetadata,
    NewsCategory,
    SentimentClassification,
    ScenarioType,
    CountryNewsItem,
    SectorImpact,
    StockToWatch,
    ForwardScenario,
    CountryMacroSummary,
    CountryIntelligenceReport,
    SUPPORTED_COUNTRIES,
    resolve_country,
)
from .market_service import CountryMarketService
from .country_researcher import TinyFishCountryResearcher
from .classifier import CountryIntelligenceClassifier

__all__ = [
    "CountryCode",
    "CountryMetadata",
    "NewsCategory",
    "SentimentClassification",
    "ScenarioType",
    "CountryNewsItem",
    "SectorImpact",
    "StockToWatch",
    "ForwardScenario",
    "CountryMacroSummary",
    "CountryIntelligenceReport",
    "SUPPORTED_COUNTRIES",
    "resolve_country",
    "CountryMarketService",
    "TinyFishCountryResearcher",
    "CountryIntelligenceClassifier",
]
