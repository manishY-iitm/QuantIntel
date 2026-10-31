"""
Pre-configured High-Signal Catalyst Scenarios for QuantIntel
Enables instantaneous 1-click end-to-end demonstrations with real market data.
"""

from datetime import datetime, date
from typing import Dict, Any, List
from quantintel.core.schemas import (
    EventType,
    LookAheadRisk,
    MetricTested,
    EventEvidence,
    HypothesisContract,
    EventStudyConfig,
)

PRESET_CASES: List[Dict[str, Any]] = [
    {
        "id": "biogen_fda",
        "title": "Biogen (BIIB) - FDA Advisory Committee Unanimous Vote",
        "badge": "Biotech Catalyst",
        "ticker": "BIIB",
        "company_name": "Biogen Inc.",
        "benchmark_ticker": "XBI",
        "event_date": date(2023, 6, 9),
        "event_type": EventType.FDA_ADCOM,
        "headline": "FDA Advisory Panel Unanimously Endorses Full Approval for Alzheimer Drug Leqembi",
        "event_date_utc": datetime(2023, 6, 9, 17, 30, 0),
        "verbatim_excerpt": "The Peripheral and Central Nervous System Drugs Advisory Committee voted 6-0 confirming that the Phase 3 Clarity AD study verified clinical benefit for patients with early Alzheimer's disease.",
        "source_url": "https://www.fda.gov/news-events/press-announcements/fda-converts-novel-alzheimers-disease-treatment-traditional-approval",
        "null_hypothesis_H0": "The FDA AdCom vote produces Cumulative Abnormal Returns (CAR) indistinguishable from 0 at the 95% confidence level (alpha = 0.05).",
        "alternative_hypothesis_H1": "The FDA AdCom vote triggers statistically significant positive Cumulative Abnormal Returns (CAR > 0) and elevated pre-event volume.",
        "metric_tested": MetricTested.CUMULATIVE_ABNORMAL_RETURN,
        "expected_direction": "POSITIVE",
        "query_example": "Investigate FDA advisory committee unanimous vote on Biogen (BIIB) Leqembi approval on June 9, 2023. Test abnormal volume and CAR vs Biotech ETF (XBI).",
        "token_savings_pct": 86.4,
    },
    {
        "id": "crowdstrike_outage",
        "title": "CrowdStrike (CRWD) - Global IT Falcon Sensor Outage",
        "badge": "Cybersecurity Shock",
        "ticker": "CRWD",
        "company_name": "CrowdStrike Holdings Inc.",
        "benchmark_ticker": "XLK",
        "event_date": date(2024, 7, 19),
        "event_type": EventType.CYBERSECURITY_OUTAGE,
        "headline": "CrowdStrike Issues Global Remediation Notice for Faulty Falcon Sensor Update Crashing Windows",
        "event_date_utc": datetime(2024, 7, 19, 5, 30, 0),
        "verbatim_excerpt": "CrowdStrike is actively working with customers impacted by a defect found in a single content update for Windows hosts (Channel File 291). This is not a security incident or cyberattack.",
        "source_url": "https://www.crowdstrike.com/blog/falcon-update-for-windows-hosts-technical-details/",
        "null_hypothesis_H0": "The global outage disclosure produces no statistically significant negative abnormal returns across the [-1, +5] trading window.",
        "alternative_hypothesis_H1": "The outage disclosure triggers statistically significant negative Cumulative Abnormal Returns (CAR < 0) exceeding 3 standard deviations.",
        "metric_tested": MetricTested.CUMULATIVE_ABNORMAL_RETURN,
        "expected_direction": "NEGATIVE",
        "query_example": "Analyze market reaction to CrowdStrike (CRWD) global IT outage on July 19, 2024. Measure negative CAR and volume explosion vs Technology ETF (XLK).",
        "token_savings_pct": 89.2,
    },
    {
        "id": "tesla_8k",
        "title": "Tesla (TSLA) - SEC 8-K Executive Exit & Workforce Reduction",
        "badge": "SEC 8-K Disclosure",
        "ticker": "TSLA",
        "company_name": "Tesla, Inc.",
        "benchmark_ticker": "SPY",
        "event_date": date(2024, 4, 15),
        "event_type": EventType.SEC_8K_DISCLOSURE,
        "headline": "Tesla Files Item 5.02 Form 8-K: Departure of Key Senior Vice Presidents & 10% Global Workforce Cut",
        "event_date_utc": datetime(2024, 4, 15, 12, 15, 0),
        "verbatim_excerpt": "On April 14, 2024, Drew Baglino, Senior Vice President, Powertrain and Energy Engineering, resigned from Tesla, effective immediately... Tesla also initiated plans to reduce global headcount by more than 10 percent.",
        "source_url": "https://www.sec.gov/edgar/browse/?CIK=0001318605",
        "null_hypothesis_H0": "The SEC Form 8-K executive departure and restructuring filing does not induce statistically significant abnormal returns (p > 0.05).",
        "alternative_hypothesis_H1": "The dual revelation of key engineering executive departure and workforce contraction yields negative abnormal returns.",
        "metric_tested": MetricTested.CUMULATIVE_ABNORMAL_RETURN,
        "expected_direction": "NEGATIVE",
        "query_example": "Evaluate Tesla (TSLA) SEC 8-K disclosure on April 15, 2024 regarding executive departures and 10% headcount reduction vs SPY.",
        "token_savings_pct": 84.1,
    },
    {
        "id": "nvidia_blackwell",
        "title": "NVIDIA (NVDA) - GTC Keynote Blackwell Architecture Unveiling",
        "badge": "Tech Hardware Catalyst",
        "ticker": "NVDA",
        "company_name": "NVIDIA Corporation",
        "benchmark_ticker": "QQQ",
        "event_date": date(2024, 3, 18),
        "event_type": EventType.PRODUCT_CATALYST,
        "headline": "NVIDIA Announces Blackwell Platform to Power a New Era of Generative AI Computing",
        "event_date_utc": datetime(2024, 3, 18, 20, 0, 0),
        "verbatim_excerpt": "The NVIDIA Blackwell architecture features six revolutionary technologies for accelerated computing, enabling organizations everywhere to build and run real-time generative AI on trillion-parameter large language models.",
        "source_url": "https://nvidianews.nvidia.com/news/nvidia-blackwell-platform-arrives-to-power-a-new-era-of-computing",
        "null_hypothesis_H0": "The Blackwell GPU architecture announcement does not generate abnormal returns differing from standard tech market beta (CAR = 0).",
        "alternative_hypothesis_H1": "Blackwell unveiling drives positive Cumulative Abnormal Returns (CAR > 0) over the subsequent 10 trading sessions.",
        "metric_tested": MetricTested.CUMULATIVE_ABNORMAL_RETURN,
        "expected_direction": "POSITIVE",
        "query_example": "Test abnormal returns for NVIDIA (NVDA) following the GTC Blackwell GPU keynote on March 18, 2024 against QQQ.",
        "token_savings_pct": 88.5,
    }
]


def get_preset_by_id(preset_id: str) -> Dict[str, Any]:
    for case in PRESET_CASES:
        if case["id"] == preset_id:
            return case
    return PRESET_CASES[0]
