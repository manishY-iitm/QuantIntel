"""
TinyFish Web Research Engine for FutureStock
Extends QuantIntel's TinyFish client to autonomously crawl, parse, and structure
company filings, IPO prospectuses, earnings calls, news catalysts, and business risks.
"""

from datetime import datetime, timezone
from typing import List, Dict, Any, Optional
from quantintel.core.tinyfish_client import TinyFishClient
from quantintel.futurestock.schemas import WebResearchEvidence, MarketRegion


class TinyFishStockResearcher:
    """
    Autonomous Web Research Agent leveraging TinyFish Chromium fleet.
    Extracts structured evidence from dynamic IR pages, regulatory portals, and financial wires.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.client = TinyFishClient(api_key=api_key)

    def research_company(
        self, ticker: str, company_name: str, region: MarketRegion, is_ipo: bool = False
    ) -> List[WebResearchEvidence]:
        """
        Conduct deep multi-source live web research on target company.
        """
        evidence_list: List[WebResearchEvidence] = []
        now_iso = datetime.now(timezone.utc).isoformat()

        # Tailor search domains by market region
        if region == MarketRegion.INDIA:
            domains = ["bseindia.com", "nseindia.com", "sebi.gov.in", "moneycontrol.com", "livemint.com", "reuters.com"]
        else:
            domains = ["sec.gov", "businesswire.com", "prnewswire.com", "reuters.com", "bloomberg.com", "fda.gov"]

        queries = [
            f"{company_name} {ticker} official quarterly earnings financial results disclosures",
            f"{company_name} {ticker} management guidance forward catalysts major announcements",
            f"{company_name} {ticker} regulatory antitrust litigation competitive business risks",
        ]

        if is_ipo:
            queries.append(f"{company_name} {ticker} IPO prospectus offer price listing day valuation anchor investors")

        for q in queries:
            search_res = self.client.search(query=q, domains=domains, max_results=2)
            results = search_res.get("results", [])

            for r in results:
                url = r.get("url", "")
                title = r.get("title", f"Regulatory Disclosure: {ticker}")
                snippet = r.get("snippet", "")
                domain = r.get("domain", "sec.gov" if region == MarketRegion.US else "bseindia.com")

                # Fetch and clean DOM via TinyFish
                fetch_res = self.client.fetch_markdown(url)
                token_savings = fetch_res.get("token_savings_pct", 86.0)
                cleaned_text = fetch_res.get("content_markdown", snippet)

                # Categorize evidence
                category = "NEWS"
                q_lower = q.lower()
                if "earnings" in q_lower or "results" in q_lower:
                    category = "EARNINGS"
                elif "catalysts" in q_lower or "announcements" in q_lower:
                    category = "CATALYST"
                elif "risks" in q_lower or "antitrust" in q_lower:
                    category = "RISKS"
                elif "ipo" in q_lower or "prospectus" in q_lower:
                    category = "IPO_PROSPECTUS"

                evidence_list.append(
                    WebResearchEvidence(
                        title=title,
                        url=url,
                        publication_date=r.get("publication_date", "2024-Q3"),
                        retrieval_timestamp=now_iso,
                        domain=domain,
                        extracted_snippet=cleaned_text[:450] if cleaned_text else snippet[:450],
                        category=category,
                        token_savings_pct=token_savings,
                    )
                )

        # Deduplicate by URL
        seen_urls = set()
        deduped = []
        for ev in evidence_list:
            if ev.url not in seen_urls:
                seen_urls.add(ev.url)
                deduped.append(ev)

        return deduped
