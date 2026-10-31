"""
FutureStock: Autonomous AI Stock Intelligence, Forecasting & Quantitative Research Engine
Integrated module inside QuantIntel.
"""

from .schemas import (
    FutureStockReport,
    CompanyProfile,
    FinancialMetrics,
    QuantMetrics,
    MonteCarloResult,
    ForecastScenario,
    ForecastHorizon,
    ValuationMetrics,
    HistoricalAnalog,
    RiskAssessment,
    VerificationAudit,
    InvestmentThesis,
    PortfolioHolding,
    PortfolioAnalysisResult,
)
from .market_data import MarketDataService
from .quant_engine import FutureStockQuantEngine
from .tinyfish_researcher import TinyFishStockResearcher
from .agents.orchestrator import FutureStockOrchestrator
from .tracker import ForecastTrackRecordLedger
from .dossier import generate_futurestock_markdown, generate_futurestock_pdf

__all__ = [
    "FutureStockReport",
    "CompanyProfile",
    "FinancialMetrics",
    "QuantMetrics",
    "MonteCarloResult",
    "ForecastScenario",
    "ForecastHorizon",
    "ValuationMetrics",
    "HistoricalAnalog",
    "RiskAssessment",
    "VerificationAudit",
    "InvestmentThesis",
    "PortfolioHolding",
    "PortfolioAnalysisResult",
    "MarketDataService",
    "FutureStockQuantEngine",
    "TinyFishStockResearcher",
    "FutureStockOrchestrator",
    "ForecastTrackRecordLedger",
    "generate_futurestock_markdown",
    "generate_futurestock_pdf",
]
