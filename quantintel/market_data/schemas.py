"""
Unified Market Data Contracts for QuantIntel.
Standardizes data models across LSE Data 3.0, public exchange feeds, and quantitative engines.
"""

from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class MarketDataSource(str, Enum):
    LSE_DATA_3_0 = "LSE Data 3.0"
    YAHOO_FINANCE = "Yahoo Finance"
    SYNTHETIC_FALLBACK = "Synthetic Fallback"


class DataFreshnessStatus(str, Enum):
    REAL_TIME = "REAL_TIME"
    DELAYED_15M = "DELAYED_15M"
    END_OF_DAY = "END_OF_DAY"
    STALE = "STALE"
    UNAVAILABLE = "UNAVAILABLE"


class MarketDataBar(BaseModel):
    timestamp: str
    open: float
    high: float
    low: float
    close: float
    volume: int = 0


class InstrumentQuote(BaseModel):
    symbol: str
    exchange: str
    currency: str
    timestamp: str
    price: float
    change_pct: float
    open: Optional[float] = None
    high: Optional[float] = None
    low: Optional[float] = None
    close: float
    volume: Optional[int] = None
    data_source: MarketDataSource = MarketDataSource.LSE_DATA_3_0
    data_freshness_status: DataFreshnessStatus = DataFreshnessStatus.DELAYED_15M
    is_delayed: bool = True
    provider_notes: Optional[str] = None


class HistoricalOHLCV(BaseModel):
    symbol: str
    timeframe: str = "1d"
    bars: List[MarketDataBar] = Field(default_factory=list)
    data_source: MarketDataSource = MarketDataSource.LSE_DATA_3_0
    data_freshness_status: DataFreshnessStatus = DataFreshnessStatus.END_OF_DAY
    total_bars: int = 0


class MarketIndexQuote(BaseModel):
    name: str
    symbol: str
    price: float
    change_pct: float
    currency: str
    timestamp: str
    data_source: MarketDataSource = MarketDataSource.LSE_DATA_3_0
    is_market_open: bool = False


class OptionContractData(BaseModel):
    symbol: str
    underlying: str
    right: str  # "call" or "put"
    strike: float
    expiry: str
    dte: Optional[int] = None
    last_price: float
    volume: int = 0
    implied_volatility: Optional[float] = None
    delta: Optional[float] = None
    gamma: Optional[float] = None


class OptionChainData(BaseModel):
    underlying: str
    contracts: List[OptionContractData] = Field(default_factory=list)
    timestamp: str
    data_source: MarketDataSource = MarketDataSource.LSE_DATA_3_0
    total_contracts: int = 0


class MacroSeriesPoint(BaseModel):
    date: str
    value: float


class MacroSeriesData(BaseModel):
    series_id: str
    title: str
    data_points: List[MacroSeriesPoint] = Field(default_factory=list)
    data_source: MarketDataSource = MarketDataSource.LSE_DATA_3_0
