"""
Unified Market Data Service for QuantIntel.
Orchestrates LSE Data 3.0 and secondary providers with automatic routing,
caching, data normalization, and fallback resilience.
"""

import time
from datetime import datetime, timezone
from typing import Dict, Optional, Any, List
from .schemas import (
    MarketDataSource,
    DataFreshnessStatus,
    InstrumentQuote,
    HistoricalOHLCV,
    MarketIndexQuote,
    OptionChainData,
    MacroSeriesData,
)
from .providers.lse_provider import LSEDataProvider


class UnifiedMarketDataService:
    """
    Primary Market Data Orchestrator.
    Routes queries to LSE Data 3.0 where supported and authorized,
    with automatic secondary failover and rate-limit buffering.
    """

    def __init__(self, lse_api_key: Optional[str] = None):
        self.lse_provider = LSEDataProvider(api_key=lse_api_key)
        self._quote_cache: Dict[str, Dict[str, Any]] = {}
        self._cache_ttl = 60  # seconds

    def is_lse_configured(self) -> bool:
        """Check if LSE Data 3.0 live key is active."""
        return self.lse_provider.is_live_configured()

    def get_latest_price(
        self, symbol: str, country: str = "US", preferred_provider: str = "auto"
    ) -> InstrumentQuote:
        """
        Fetch latest available price quote for an equity or index.
        """
        cache_key = f"quote_{symbol.upper()}"
        now = time.time()
        if cache_key in self._quote_cache:
            entry = self._quote_cache[cache_key]
            if now - entry["time"] < self._cache_ttl:
                return entry["data"]

        # If user explicitly chose or auto-routes to LSE Data
        if preferred_provider in ["auto", "lse"] and self.is_lse_configured():
            try:
                market = "us_stocks"
                currency = "USD"
                if symbol.endswith(".L"):
                    market = "uk_stocks"
                    currency = "GBP"
                elif symbol.endswith(".TO"):
                    market = "ca_stocks"
                    currency = "CAD"

                quote = self.lse_provider.get_latest_price(symbol, market=market, currency=currency)
                if quote.data_source == MarketDataSource.LSE_DATA_3_0:
                    self._quote_cache[cache_key] = {"time": now, "data": quote}
                    return quote
            except Exception:
                pass

        # Fallback to public exchange provider (yfinance) for Indian / global coverage
        quote = self._fetch_secondary_quote(symbol, country)
        self._quote_cache[cache_key] = {"time": now, "data": quote}
        return quote

    def get_historical_ohlcv(
        self,
        symbol: str,
        timeframe: str = "1d",
        start: Optional[str] = None,
        end: Optional[str] = None,
        limit: int = 100,
        preferred_provider: str = "auto",
    ) -> HistoricalOHLCV:
        """
        Retrieve standardized OHLCV candles for quantitative backtesting.
        """
        if preferred_provider in ["auto", "lse"] and self.is_lse_configured():
            try:
                market = "us_stocks"
                if symbol.endswith(".L"):
                    market = "uk_stocks"
                elif symbol.endswith(".TO"):
                    market = "ca_stocks"

                data = self.lse_provider.get_historical_ohlcv(
                    symbol, timeframe=timeframe, start=start, end=end, limit=limit, market=market
                )
                if data.data_source == MarketDataSource.LSE_DATA_3_0 and len(data.bars) > 0:
                    return data
            except Exception:
                pass

        # Fallback to secondary provider or LSE fallback
        return self.lse_provider.get_historical_ohlcv(symbol, timeframe=timeframe, limit=limit)

    def get_options_chain(self, underlying: str) -> OptionChainData:
        """Retrieve options contracts, IV, and Greeks via LSE Data."""
        return self.lse_provider.get_options_chain(underlying)

    def get_macro_series(self, series_id: str) -> MacroSeriesData:
        """Retrieve macro time series via LSE Data."""
        return self.lse_provider.get_macro_series(series_id)

    def _fetch_secondary_quote(self, symbol: str, country: str) -> InstrumentQuote:
        """Secondary public exchange quote provider with explicit provenance."""
        now_iso = datetime.now(timezone.utc).isoformat()
        currency = "INR" if country.upper() == "IN" or symbol.endswith(".NS") else "USD"
        exchange = "NSE / BSE" if currency == "INR" else "NASDAQ / NYSE"

        try:
            import yfinance as yf
            t = yf.Ticker(symbol)
            fast = getattr(t, "fast_info", None)
            if fast and getattr(fast, "last_price", None) is not None:
                p = float(fast.last_price)
                prev = getattr(fast, "previous_close", p) or p
                change_pct = round(((p - prev) / prev) * 100, 2) if prev > 0 else 0.0

                return InstrumentQuote(
                    symbol=symbol,
                    exchange=exchange,
                    currency=currency,
                    timestamp=now_iso,
                    price=round(p, 2),
                    change_pct=change_pct,
                    open=getattr(fast, "open", p),
                    high=getattr(fast, "year_high", p),
                    low=getattr(fast, "year_low", p),
                    close=round(p, 2),
                    volume=int(getattr(fast, "last_volume", 0) or 0),
                    data_source=MarketDataSource.YAHOO_FINANCE,
                    data_freshness_status=DataFreshnessStatus.DELAYED_15M,
                    is_delayed=True,
                    provider_notes="Retrieved via Secondary Public Exchange Adapter",
                )
        except Exception:
            pass

        return self.lse_provider.get_latest_price(symbol, currency=currency)
