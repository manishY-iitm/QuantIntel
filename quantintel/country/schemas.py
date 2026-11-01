"""
Data contracts and schemas for Country-Level Stock Market Intelligence.
Built on strict Pydantic models for verifiable, type-safe research pipelines.
"""

from enum import Enum
from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field


class CountryCode(str, Enum):
    INDIA = "IN"
    UNITED_STATES = "US"
    UNITED_KINGDOM = "GB"
    CHINA = "CN"
    JAPAN = "JP"
    GERMANY = "DE"
    AUSTRALIA = "AU"
    CANADA = "CA"
    SINGAPORE = "SG"
    PAKISTAN = "PK"
    SAUDI_ARABIA = "SA"
    BRAZIL = "BR"
    SOUTH_KOREA = "KR"
    UAE = "AE"


class NewsCategory(str, Enum):
    GOVERNMENT_POLICY = "GOVERNMENT_POLICY"
    CENTRAL_BANK = "CENTRAL_BANK"
    ECONOMIC_INDICATORS = "ECONOMIC_INDICATORS"
    EARNINGS = "EARNINGS"
    MERGERS_ACQUISITIONS = "MERGERS_ACQUISITIONS"
    IPOS = "IPOS"
    FOREIGN_INVESTMENT = "FOREIGN_INVESTMENT"
    TRADE_TARIFFS = "TRADE_TARIFFS"
    GEOPOLITICS = "GEOPOLITICS"
    ENERGY_COMMODITIES = "ENERGY_COMMODITIES"
    TECH_SEMICONDUCTORS = "TECH_SEMICONDUCTORS"
    MAJOR_INDUSTRIES = "MAJOR_INDUSTRIES"
    MARKET_INDICES = "MARKET_INDICES"
    COMPANY_SPECIFIC = "COMPANY_SPECIFIC"


class SentimentClassification(str, Enum):
    POSITIVE = "POSITIVE"
    NEGATIVE = "NEGATIVE"
    MIXED = "MIXED"
    NEUTRAL = "NEUTRAL"
    UNCONFIRMED = "UNCONFIRMED"


class ScenarioType(str, Enum):
    BULLISH = "BULLISH"
    BEARISH = "BEARISH"
    NEUTRAL = "NEUTRAL"


class StockWatchCategory(str, Enum):
    POSITIVE_CATALYSTS = "POSITIVE_CATALYSTS"
    NEGATIVE_CATALYSTS = "NEGATIVE_CATALYSTS"
    MIXED_OUTLOOK = "MIXED_OUTLOOK"
    FURTHER_INVESTIGATION = "FURTHER_INVESTIGATION"


class CountryMetadata(BaseModel):
    code: CountryCode
    name: str
    flag: str
    currency: str
    currency_symbol: str
    primary_exchanges: List[str]
    benchmark_index_name: str
    benchmark_index_ticker: str
    secondary_index_ticker: Optional[str] = None
    timezone_name: str
    trading_hours: str
    key_sectors: List[str]


class CountryNewsItem(BaseModel):
    id: str
    headline: str
    original_source: str
    url: str
    publication_timestamp: str
    retrieval_timestamp: str
    country: str
    country_code: CountryCode
    relevant_company: Optional[str] = None
    ticker: Optional[str] = None
    relevant_sector: str
    event_category: NewsCategory
    sentiment: SentimentClassification
    confidence: float = Field(ge=0.0, le=1.0)
    country_impact: str
    sector_impact: str
    company_impact: Optional[str] = None
    main_findings: str
    supporting_evidence: str
    potential_risks: str
    is_breaking: bool = False
    is_unconfirmed: bool = False
    token_savings_pct: float = 85.0
    corroboration_count: int = 1


class SectorImpact(BaseModel):
    sector_name: str
    country_code: CountryCode
    positive_count: int = 0
    negative_count: int = 0
    mixed_count: int = 0
    neutral_count: int = 0
    net_sentiment: SentimentClassification
    major_developments: List[str] = Field(default_factory=list)
    supporting_sources: List[str] = Field(default_factory=list)
    potential_beneficiaries: List[str] = Field(default_factory=list)
    exposed_companies: List[str] = Field(default_factory=list)
    risks: List[str] = Field(default_factory=list)
    latest_performance_pct: Optional[float] = None
    benchmark_comparison_pct: Optional[float] = None
    confidence_score: float = Field(ge=0.0, le=1.0, default=0.85)


class StockToWatch(BaseModel):
    company_name: str
    ticker: str
    exchange: str
    country_code: CountryCode
    sector: str
    category: StockWatchCategory
    relevant_news: str
    relevance_reasoning: str
    potential_positive_catalysts: List[str] = Field(default_factory=list)
    potential_negative_catalysts: List[str] = Field(default_factory=list)
    current_price: Optional[float] = None
    price_change_pct: Optional[float] = None
    currency: str = "USD"
    volume: Optional[int] = None
    fifty_two_week_high: Optional[float] = None
    fifty_two_week_low: Optional[float] = None
    historical_performance_1m_pct: Optional[float] = None
    important_risks: List[str] = Field(default_factory=list)
    source_links: List[str] = Field(default_factory=list)
    market_data_timestamp: Optional[str] = None
    is_market_data_delayed: bool = False


class ForwardScenario(BaseModel):
    scenario_type: ScenarioType
    title: str
    time_horizon: str = "1 to 6 months"
    probability_pct: Optional[float] = None
    supporting_evidence: List[str] = Field(default_factory=list)
    potential_catalysts: List[str] = Field(default_factory=list)
    relevant_sectors: List[str] = Field(default_factory=list)
    relevant_companies: List[str] = Field(default_factory=list)
    main_assumptions: List[str] = Field(default_factory=list)
    invalidation_conditions: List[str] = Field(default_factory=list)
    key_risks: List[str] = Field(default_factory=list)
    confidence_level: str = "Medium"
    forecast_methodology: str = "Evidence-Synthesized Qualitative Macro Scenario"


class CountryMacroSummary(BaseModel):
    country_name: str
    country_code: CountryCode
    as_of_utc: str
    market_context: str
    major_economic_developments: List[str] = Field(default_factory=list)
    most_important_positive_catalysts: List[str] = Field(default_factory=list)
    most_important_negative_catalysts: List[str] = Field(default_factory=list)
    sectors_attracting_attention: List[str] = Field(default_factory=list)
    sectors_facing_risks: List[str] = Field(default_factory=list)
    materially_exposed_companies: List[str] = Field(default_factory=list)
    upcoming_scheduled_events: List[str] = Field(default_factory=list)
    major_uncertainties: List[str] = Field(default_factory=list)


class IndexQuote(BaseModel):
    name: str
    ticker: str
    price: float
    change_pct: float
    currency: str
    timestamp: str
    is_market_open: bool = False


class CountryIntelligenceReport(BaseModel):
    country_metadata: CountryMetadata
    macro_summary: CountryMacroSummary
    benchmark_quote: Optional[IndexQuote] = None
    secondary_quote: Optional[IndexQuote] = None
    sectors: List[SectorImpact] = Field(default_factory=list)
    stocks_to_watch: List[StockToWatch] = Field(default_factory=list)
    scenarios: List[ForwardScenario] = Field(default_factory=list)
    news_feed: List[CountryNewsItem] = Field(default_factory=list)
    total_sources_audited: int = 0
    average_token_savings_pct: float = 86.5
    retrieval_timestamp: str
    data_freshness_seconds: int = 0
    is_cached: bool = False
    warning_notes: List[str] = Field(default_factory=list)


SUPPORTED_COUNTRIES: Dict[CountryCode, CountryMetadata] = {
    CountryCode.INDIA: CountryMetadata(
        code=CountryCode.INDIA,
        name="India",
        flag="🇮🇳",
        currency="INR",
        currency_symbol="₹",
        primary_exchanges=["NSE", "BSE"],
        benchmark_index_name="Nifty 50",
        benchmark_index_ticker="^NSEI",
        secondary_index_ticker="^BSESN",
        timezone_name="Asia/Kolkata",
        trading_hours="09:15 - 15:30 IST (Mon-Fri)",
        key_sectors=[
            "Banking & Financial Services",
            "Information Technology",
            "Energy & Oil",
            "Automotive",
            "Pharmaceuticals & Healthcare",
            "Infrastructure & Capital Goods",
            "Consumer Goods (FMCG)",
            "Metals & Mining",
            "Telecommunications",
            "Renewable Energy",
        ],
    ),
    CountryCode.UNITED_STATES: CountryMetadata(
        code=CountryCode.UNITED_STATES,
        name="United States",
        flag="🇺🇸",
        currency="USD",
        currency_symbol="$",
        primary_exchanges=["NYSE", "NASDAQ"],
        benchmark_index_name="S&P 500",
        benchmark_index_ticker="^GSPC",
        secondary_index_ticker="^IXIC",
        timezone_name="America/New_York",
        trading_hours="09:30 - 16:00 EST (Mon-Fri)",
        key_sectors=[
            "Information Technology",
            "Artificial Intelligence & Semis",
            "Banking & Finance",
            "Healthcare & Biotech",
            "Energy & Oil",
            "Consumer Discretionary",
            "Aerospace & Defence",
            "Telecommunications",
            "Industrials",
            "Real Estate",
        ],
    ),
    CountryCode.UNITED_KINGDOM: CountryMetadata(
        code=CountryCode.UNITED_KINGDOM,
        name="United Kingdom",
        flag="🇬🇧",
        currency="GBP",
        currency_symbol="£",
        primary_exchanges=["LSE"],
        benchmark_index_name="FTSE 100",
        benchmark_index_ticker="^FTSE",
        secondary_index_ticker="^FTMC",
        timezone_name="Europe/London",
        trading_hours="08:00 - 16:30 GMT (Mon-Fri)",
        key_sectors=[
            "Banking & Financial Services",
            "Energy & Oil (Supermajors)",
            "Pharmaceuticals & Healthcare",
            "Mining & Materials",
            "Consumer Staples",
            "Aerospace & Defence",
            "Telecommunications",
            "Utilities",
        ],
    ),
    CountryCode.JAPAN: CountryMetadata(
        code=CountryCode.JAPAN,
        name="Japan",
        flag="🇯🇵",
        currency="JPY",
        currency_symbol="¥",
        primary_exchanges=["TSE"],
        benchmark_index_name="Nikkei 225",
        benchmark_index_ticker="^N225",
        secondary_index_ticker="1306.T",
        timezone_name="Asia/Tokyo",
        trading_hours="09:00 - 15:30 JST (Mon-Fri)",
        key_sectors=[
            "Automotive & Mobility",
            "Semiconductor Equipment & Electronics",
            "Robotics & Industrial Automation",
            "Banking & Financial Services",
            "Trading Companies (Sogo Shosha)",
            "Pharmaceuticals & Chemicals",
            "Consumer Electronics",
        ],
    ),
    CountryCode.GERMANY: CountryMetadata(
        code=CountryCode.GERMANY,
        name="Germany",
        flag="🇩🇪",
        currency="EUR",
        currency_symbol="€",
        primary_exchanges=["XETRA", "Frankfurt"],
        benchmark_index_name="DAX 40",
        benchmark_index_ticker="^GDAXI",
        secondary_index_ticker="^MDAXI",
        timezone_name="Europe/Berlin",
        trading_hours="09:00 - 17:30 CET (Mon-Fri)",
        key_sectors=[
            "Automotive Engineering",
            "Chemicals & Materials",
            "Industrial Machinery & Siemens",
            "Software & Cloud (SAP)",
            "Healthcare & MedTech",
            "Renewables & Utilities",
            "Financial Services",
        ],
    ),
    CountryCode.CHINA: CountryMetadata(
        code=CountryCode.CHINA,
        name="China",
        flag="🇨🇳",
        currency="CNY",
        currency_symbol="¥",
        primary_exchanges=["SSE", "SZSE", "HKEX"],
        benchmark_index_name="Shanghai Composite",
        benchmark_index_ticker="000001.SS",
        secondary_index_ticker="399001.SZ",
        timezone_name="Asia/Shanghai",
        trading_hours="09:30 - 15:00 CST (Mon-Fri)",
        key_sectors=[
            "Electric Vehicles & Battery Tech",
            "E-commerce & Big Tech",
            "Semiconductors & Hardware",
            "Renewable Energy & Solar",
            "State-Owned Banking & Finance",
            "Real Estate & Construction",
            "Consumer Discretionary",
        ],
    ),
    CountryCode.AUSTRALIA: CountryMetadata(
        code=CountryCode.AUSTRALIA,
        name="Australia",
        flag="🇦🇺",
        currency="AUD",
        currency_symbol="A$",
        primary_exchanges=["ASX"],
        benchmark_index_name="S&P/ASX 200",
        benchmark_index_ticker="^AXJO",
        secondary_index_ticker="^AORD",
        timezone_name="Australia/Sydney",
        trading_hours="10:00 - 16:00 AEST (Mon-Fri)",
        key_sectors=[
            "Mining & Iron Ore (BHP/Rio)",
            "Banking (Big Four)",
            "Energy & LNG",
            "Healthcare (Biotech)",
            "Real Estate Investment Trusts",
            "Consumer Discretionary",
        ],
    ),
    CountryCode.CANADA: CountryMetadata(
        code=CountryCode.CANADA,
        name="Canada",
        flag="🇨🇦",
        currency="CAD",
        currency_symbol="C$",
        primary_exchanges=["TSX"],
        benchmark_index_name="S&P/TSX Composite",
        benchmark_index_ticker="^GSPTSE",
        secondary_index_ticker="XIU.TO",
        timezone_name="America/Toronto",
        trading_hours="09:30 - 16:00 EST (Mon-Fri)",
        key_sectors=[
            "Banking & Financial Services",
            "Energy & Oil Sands",
            "Mining & Critical Minerals",
            "Technology & Software",
            "Transportation & Logistics",
            "Telecommunications",
        ],
    ),
    CountryCode.SINGAPORE: CountryMetadata(
        code=CountryCode.SINGAPORE,
        name="Singapore",
        flag="🇸🇬",
        currency="SGD",
        currency_symbol="S$",
        primary_exchanges=["SGX"],
        benchmark_index_name="Straits Times Index (STI)",
        benchmark_index_ticker="^STI",
        secondary_index_ticker="ES3.SI",
        timezone_name="Asia/Singapore",
        trading_hours="09:00 - 17:00 SGT (Mon-Fri)",
        key_sectors=[
            "Banking & Wealth Management (DBS/OCBC/UOB)",
            "Real Estate Investment Trusts (S-REITs)",
            "Industrial Conglomerates",
            "Telecommunications & Tech",
            "Aviation & Logistics",
        ],
    ),
    CountryCode.PAKISTAN: CountryMetadata(
        code=CountryCode.PAKISTAN,
        name="Pakistan",
        flag="🇵🇰",
        currency="PKR",
        currency_symbol="₨",
        primary_exchanges=["PSX"],
        benchmark_index_name="KSE 100 Index",
        benchmark_index_ticker="^KSE",
        secondary_index_ticker="KSE30.KA",
        timezone_name="Asia/Karachi",
        trading_hours="09:15 - 15:30 PKT (Mon-Fri)",
        key_sectors=[
            "Commercial Banking",
            "Oil & Gas Exploration & Production",
            "Fertilizers & Agriculture",
            "Cement & Construction Materials",
            "Textiles & Apparel",
            "Power Generation & Utilities",
            "Technology & IT Services",
            "Automotive Assembly",
            "Pharmaceuticals",
            "Chemicals",
        ],
    ),
    CountryCode.SAUDI_ARABIA: CountryMetadata(
        code=CountryCode.SAUDI_ARABIA,
        name="Saudi Arabia",
        flag="🇸🇦",
        currency="SAR",
        currency_symbol="﷼",
        primary_exchanges=["Tadawul"],
        benchmark_index_name="Tadawul All Share Index (TASI)",
        benchmark_index_ticker="^TASI.SR",
        secondary_index_ticker="2222.SR",
        timezone_name="Asia/Riyadh",
        trading_hours="10:00 - 15:00 AST (Sun-Thu)",
        key_sectors=[
            "Energy & Oil (Aramco)",
            "Banking & Financial Services",
            "Petrochemicals & Materials (SABIC)",
            "Telecommunications (STC)",
            "Mining & Metals (Ma'aden)",
            "Utilities & Power",
        ],
    ),
    CountryCode.BRAZIL: CountryMetadata(
        code=CountryCode.BRAZIL,
        name="Brazil",
        flag="🇧🇷",
        currency="BRL",
        currency_symbol="R$",
        primary_exchanges=["B3"],
        benchmark_index_name="Ibovespa",
        benchmark_index_ticker="^BVSP",
        secondary_index_ticker="PETR4.SA",
        timezone_name="America/Sao_Paulo",
        trading_hours="10:00 - 17:00 BRT (Mon-Fri)",
        key_sectors=[
            "Energy & Petrobras",
            "Mining & Iron Ore (Vale)",
            "Banking & Financial Services",
            "Agriculture & Food Processing",
            "Pulp & Paper",
            "Utilities",
        ],
    ),
    CountryCode.SOUTH_KOREA: CountryMetadata(
        code=CountryCode.SOUTH_KOREA,
        name="South Korea",
        flag="🇰🇷",
        currency="KRW",
        currency_symbol="₩",
        primary_exchanges=["KRX"],
        benchmark_index_name="KOSPI",
        benchmark_index_ticker="^KS11",
        secondary_index_ticker="005930.KS",
        timezone_name="Asia/Seoul",
        trading_hours="09:00 - 15:30 KST (Mon-Fri)",
        key_sectors=[
            "Semiconductors & Memory (Samsung, SK Hynix)",
            "Automotive & Batteries (Hyundai)",
            "Consumer Electronics & Appliances",
            "Biopharmaceuticals & Healthcare",
            "Shipbuilding & Heavy Equipment",
            "Internet & Gaming",
        ],
    ),
    CountryCode.UAE: CountryMetadata(
        code=CountryCode.UAE,
        name="United Arab Emirates",
        flag="🇦🇪",
        currency="AED",
        currency_symbol="د.إ",
        primary_exchanges=["ADX", "DFM"],
        benchmark_index_name="FTSE ADX General Index",
        benchmark_index_ticker="^FADGI",
        secondary_index_ticker="DFMGI.AE",
        timezone_name="Asia/Dubai",
        trading_hours="10:00 - 15:00 GST (Mon-Fri)",
        key_sectors=[
            "Banking & Wealth Management",
            "Real Estate & Development (Emaar)",
            "Energy & Infrastructure",
            "Aviation & Logistics",
            "Telecommunications (e&)",
        ],
    ),
}


def resolve_country(query: str) -> CountryMetadata:
    """
    Fuzzy Country Search Engine Resolver.
    Resolves natural language queries, country names, typos, and phrases like:
    'pakisant future in stock' -> Pakistan (PK)
    'pakistan' -> Pakistan (PK)
    'kse 100' -> Pakistan (PK)
    'india stock' -> India (IN)
    'nifty' -> India (IN)
    'saudi arabia' -> Saudi Arabia (SA)
    """
    if not query or not query.strip():
        return SUPPORTED_COUNTRIES[CountryCode.INDIA]

    raw = query.strip()
    upper = raw.upper()

    # 1. Direct CountryCode enum match
    for code, meta in SUPPORTED_COUNTRIES.items():
        if upper == code.value or upper == code.name:
            return meta

    # 2. Normalize and strip generic financial filler words
    cleaned = raw.lower()
    fillers = [
        "future in stock", "future stock", "future in", "future",
        "in stock", "stock market", "stocks", "stock", "shares",
        "market", "economy", "outlook", "intelligence", "forecast",
        "investing", "investment", "analysis", "what is happening in",
        "how is", "growth in", "trend in"
    ]
    for f in fillers:
        cleaned = cleaned.replace(f, " ")
    cleaned = " ".join(cleaned.split()).strip()

    # Common aliases & typo map (e.g. 'pakisant' -> Pakistan)
    alias_map = {
        "pakisant": CountryCode.PAKISTAN,
        "pakistan": CountryCode.PAKISTAN,
        "pakistn": CountryCode.PAKISTAN,
        "pak": CountryCode.PAKISTAN,
        "pk": CountryCode.PAKISTAN,
        "pkr": CountryCode.PAKISTAN,
        "kse": CountryCode.PAKISTAN,
        "kse100": CountryCode.PAKISTAN,
        "kse-100": CountryCode.PAKISTAN,
        "psx": CountryCode.PAKISTAN,
        "karachi": CountryCode.PAKISTAN,
        "islamabad": CountryCode.PAKISTAN,
        "lahore": CountryCode.PAKISTAN,
        
        "india": CountryCode.INDIA,
        "bharat": CountryCode.INDIA,
        "ind": CountryCode.INDIA,
        "in": CountryCode.INDIA,
        "nifty": CountryCode.INDIA,
        "sensex": CountryCode.INDIA,
        "nse": CountryCode.INDIA,
        "bse": CountryCode.INDIA,

        "us": CountryCode.UNITED_STATES,
        "usa": CountryCode.UNITED_STATES,
        "united states": CountryCode.UNITED_STATES,
        "america": CountryCode.UNITED_STATES,
        "sp500": CountryCode.UNITED_STATES,
        "s&p": CountryCode.UNITED_STATES,
        "nasdaq": CountryCode.UNITED_STATES,
        "nyse": CountryCode.UNITED_STATES,

        "uk": CountryCode.UNITED_KINGDOM,
        "united kingdom": CountryCode.UNITED_KINGDOM,
        "britain": CountryCode.UNITED_KINGDOM,
        "england": CountryCode.UNITED_KINGDOM,
        "ftse": CountryCode.UNITED_KINGDOM,
        "lse": CountryCode.UNITED_KINGDOM,

        "japan": CountryCode.JAPAN,
        "jp": CountryCode.JAPAN,
        "tokyo": CountryCode.JAPAN,
        "nikkei": CountryCode.JAPAN,
        "tse": CountryCode.JAPAN,

        "germany": CountryCode.GERMANY,
        "deutschland": CountryCode.GERMANY,
        "de": CountryCode.GERMANY,
        "dax": CountryCode.GERMANY,
        "frankfurt": CountryCode.GERMANY,

        "china": CountryCode.CHINA,
        "prc": CountryCode.CHINA,
        "cn": CountryCode.CHINA,
        "shanghai": CountryCode.CHINA,
        "sse": CountryCode.CHINA,
        "shenzhen": CountryCode.CHINA,

        "australia": CountryCode.AUSTRALIA,
        "aussie": CountryCode.AUSTRALIA,
        "au": CountryCode.AUSTRALIA,
        "asx": CountryCode.AUSTRALIA,
        "sydney": CountryCode.AUSTRALIA,

        "canada": CountryCode.CANADA,
        "ca": CountryCode.CANADA,
        "tsx": CountryCode.CANADA,
        "toronto": CountryCode.CANADA,

        "singapore": CountryCode.SINGAPORE,
        "sg": CountryCode.SINGAPORE,
        "sgx": CountryCode.SINGAPORE,
        "sti": CountryCode.SINGAPORE,

        "saudi": CountryCode.SAUDI_ARABIA,
        "saudi arabia": CountryCode.SAUDI_ARABIA,
        "ksa": CountryCode.SAUDI_ARABIA,
        "tasi": CountryCode.SAUDI_ARABIA,
        "tadawul": CountryCode.SAUDI_ARABIA,

        "brazil": CountryCode.BRAZIL,
        "brasil": CountryCode.BRAZIL,
        "b3": CountryCode.BRAZIL,
        "ibovespa": CountryCode.BRAZIL,

        "korea": CountryCode.SOUTH_KOREA,
        "south korea": CountryCode.SOUTH_KOREA,
        "kospi": CountryCode.SOUTH_KOREA,
        "krx": CountryCode.SOUTH_KOREA,

        "uae": CountryCode.UAE,
        "dubai": CountryCode.UAE,
        "abu dhabi": CountryCode.UAE,
        "adx": CountryCode.UAE,
        "dfm": CountryCode.UAE,
    }

    if cleaned in alias_map:
        return SUPPORTED_COUNTRIES[alias_map[cleaned]]

    # 3. Substring / Token search in alias map or raw query
    for token in (cleaned.split() + raw.lower().split()):
        if token in alias_map:
            return SUPPORTED_COUNTRIES[alias_map[token]]

    # 4. Partial name / benchmark matching
    for code, meta in SUPPORTED_COUNTRIES.items():
        if (
            cleaned in meta.name.lower()
            or meta.name.lower() in cleaned
            or cleaned in meta.benchmark_index_name.lower()
            or cleaned in meta.benchmark_index_ticker.lower()
            or any(ex.lower() in cleaned for ex in meta.primary_exchanges)
        ):
            return meta

    # 5. Fuzzy character similarity fallback (e.g. 'pakisant' vs 'pakistan')
    for code, meta in SUPPORTED_COUNTRIES.items():
        name_lower = meta.name.lower()
        if len(cleaned) >= 4 and len(name_lower) >= 4:
            # Check character overlap ratio
            overlap = sum(1 for ch in set(cleaned) if ch in set(name_lower))
            if overlap / max(len(set(cleaned)), len(set(name_lower))) > 0.75:
                return meta

    return SUPPORTED_COUNTRIES[CountryCode.INDIA]
