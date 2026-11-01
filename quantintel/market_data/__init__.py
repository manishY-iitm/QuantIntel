"""
Market Data Package for QuantIntel.
Exposes standardized providers for LSE Data 3.0, secondary exchange feeds,
and unified market data routing.
"""

from .schemas import (
    MarketDataSource,
    DataFreshnessStatus,
    MarketDataBar,
    InstrumentQuote,
    HistoricalOHLCV,
    MarketIndexQuote,
    OptionContractData,
    OptionChainData,
    MacroSeriesPoint,
    MacroSeriesData,
)
from .providers.lse_provider import LSEDataProvider
from .service import UnifiedMarketDataService

__all__ = [
    "MarketDataSource",
    "DataFreshnessStatus",
    "MarketDataBar",
    "InstrumentQuote",
    "HistoricalOHLCV",
    "MarketIndexQuote",
    "OptionContractData",
    "OptionChainData",
    "MacroSeriesPoint",
    "MacroSeriesData",
    "LSEDataProvider",
    "UnifiedMarketDataService",
]
