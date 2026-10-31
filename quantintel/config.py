"""
QuantIntel Configuration Module
Handles environment variables, API configurations, and backtesting defaults.
"""

import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env if present
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent

# TinyFish Configuration
TINYFISH_API_KEY = os.getenv("TINYFISH_API_KEY", "")
TINYFISH_BASE_URL = os.getenv("TINYFISH_BASE_URL", "https://api.tinyfish.ai/v1")

# LLM Providers (Optional for enhanced natural language parsing)
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

# Benchmark Mappings
BENCHMARK_SECTOR_MAP = {
    "DEFAULT": "SPY",     # S&P 500 ETF
    "BIOTECH": "XBI",     # SPDR S&P Biotech ETF
    "TECH": "XLK",        # Technology Select Sector SPDR
    "ENERGY": "XLE",      # Energy Select Sector SPDR
    "FINANCE": "XLF",     # Financial Select Sector SPDR
    "NASDAQ": "QQQ",      # Invesco QQQ Trust
}

# Default Event Study Parameters
DEFAULT_ESTIMATION_WINDOW = 90  # Trading days for beta/alpha estimation
DEFAULT_PRE_EVENT_DAYS = 5      # Trading days before event for pre-run-up
DEFAULT_POST_EVENT_DAYS = 10    # Trading days after event for post-reaction
DEFAULT_SIGNIFICANCE_ALPHA = 0.05
