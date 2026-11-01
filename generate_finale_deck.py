"""
QuantIntel Finale Presentation & PDF Generator (15-Slide Institutional Master Deck)
Generates an institutional-grade, 15-slide widescreen 16:9 PowerPoint presentation (.pptx)
and an executive landscape PDF presentation (.pdf) covering the entire QuantIntel project:
- FutureStock 8-Agent Autonomous Research Collective (2,000-path Monte Carlo, 3-stage DCF)
- Country Intelligence (14+ sovereign markets, 14-category AI news classifier, sector heatmaps, forward scenarios)
- LSE Data 3.0 Institutional Market Data Provider (Real-time feeds, OHLCV, Options Chain tape with Greeks, Macro series)
- Web Quant Studio Campbell-Lo-MacKinlay (1997) Econometric Event Studies
- FutureStock-Grade Search Engine with fuzzy query and typo tolerance ("pakisant future in stock" -> Pakistan PSX)
- TinyFish Web Reconnaissance with -88.5% DOM token reduction
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE
from fpdf import FPDF

# ==============================================================================
# COLOR PALETTE DEFINITIONS (Obsidian Dark Cyber-Quant Theme)
# ==============================================================================
C_BG = RGBColor(7, 11, 16)           # Deep Obsidian #070B10
C_CARD = RGBColor(14, 21, 32)        # Dark Slate Navy #0E1520
C_CARD_HOVER = RGBColor(19, 29, 44)  # Lighter Slate #131D2C
C_BORDER = RGBColor(30, 44, 61)      # Slate Border #1E2C3D
C_CYAN = RGBColor(0, 196, 204)       # Tech Electric Cyan #00C4CC
C_EMERALD = RGBColor(16, 185, 129)   # Verified Green #10B981
C_AMBER = RGBColor(255, 190, 92)     # Catalyst Gold #FFBE5C
C_RED = RGBColor(239, 68, 68)        # Bearish Coral #EF4444
C_WHITE = RGBColor(255, 255, 255)    # Primary Title #FFFFFF
C_GRAY = RGBColor(139, 148, 158)     # Secondary Subtitle #8B949E
C_TEXT = RGBColor(201, 209, 217)     # Body Copy #C9D1D9
C_PURPLE = RGBColor(167, 139, 250)   # AI Purple #A78BFA
C_BLUE = RGBColor(10, 132, 255)      # Royal Blue #0A84FF

TOTAL_SLIDES = 15

def create_pptx():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    def set_slide_background(slide):
        bg_shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg_shape.fill.solid()
        bg_shape.fill.fore_color.rgb = C_BG
        bg_shape.line.color.rgb = C_BG

    def add_header(slide, badge_text, title_text, subtitle_text, slide_num):
        # Badge
        badge_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.4), Inches(3.6), Inches(0.35))
        badge_box.fill.solid()
        badge_box.fill.fore_color.rgb = RGBColor(0, 40, 45)
        badge_box.line.color.rgb = C_CYAN
        badge_box.line.width = Pt(1)
        tf = badge_box.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = badge_text.upper()
        p.font.name = "Calibri"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = C_CYAN
        p.alignment = PP_ALIGN.CENTER

        # Slide Number
        num_box = slide.shapes.add_textbox(Inches(11.8), Inches(0.4), Inches(0.8), Inches(0.35))
        tf_num = num_box.text_frame
        p_num = tf_num.paragraphs[0]
        p_num.text = f"{slide_num:02d} / {TOTAL_SLIDES}"
        p_num.font.name = "Calibri"
        p_num.font.size = Pt(11)
        p_num.font.bold = True
        p_num.font.color.rgb = C_GRAY
        p_num.alignment = PP_ALIGN.RIGHT

        # Main Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.8), Inches(0.6))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title_text
        p_title.font.name = "Arial"
        p_title.font.size = Pt(21)
        p_title.font.bold = True
        p_title.font.color.rgb = C_WHITE

        # Subtitle
        sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(11.8), Inches(0.45))
        tf_sub = sub_box.text_frame
        tf_sub.word_wrap = True
        p_sub = tf_sub.paragraphs[0]
        p_sub.text = subtitle_text
        p_sub.font.name = "Calibri"
        p_sub.font.size = Pt(11.5)
        p_sub.font.color.rgb = C_GRAY

    # ==========================================================================
    # SLIDE 1: COVER
    # ==========================================================================
    s1 = prs.slides.add_slide(blank_layout)
    set_slide_background(s1)

    tag_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.7), Inches(5.0), Inches(0.4))
    tag_box.fill.solid()
    tag_box.fill.fore_color.rgb = RGBColor(0, 35, 40)
    tag_box.line.color.rgb = C_CYAN
    tag_box.line.width = Pt(1.2)
    p = tag_box.text_frame.paragraphs[0]
    p.text = "⚡ QUANTINTEL EXECUTIVE MASTER PRESENTATION"
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_CYAN
    p.alignment = PP_ALIGN.CENTER

    brand_box = s1.shapes.add_textbox(Inches(0.75), Inches(1.25), Inches(11.5), Inches(1.1))
    p = brand_box.text_frame.paragraphs[0]
    p.text = "QuantIntel"
    p.font.name = "Arial"
    p.font.size = Pt(54)
    p.font.bold = True
    p.font.color.rgb = C_WHITE

    sub_brand = s1.shapes.add_textbox(Inches(0.8), Inches(2.4), Inches(11.5), Inches(0.75))
    p = sub_brand.text_frame.paragraphs[0]
    p.text = "Autonomous Quantitative Research Collective & Sovereign Market Intelligence"
    p.font.name = "Arial"
    p.font.size = Pt(19)
    p.font.bold = True
    p.font.color.rgb = C_CYAN

    desc_box = s1.shapes.add_textbox(Inches(0.8), Inches(3.2), Inches(11.5), Inches(0.95))
    tf = desc_box.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = (
        "Connecting live web research, institutional market data, 14-category sovereign news classification, "
        "2,000-path Monte Carlo fan forecasting, and Campbell-Lo-MacKinlay event studies into one unified intelligence platform."
    )
    p.font.name = "Calibri"
    p.font.size = Pt(13)
    p.font.color.rgb = C_TEXT

    badges = [
        ("🌍 COUNTRY INTELLIGENCE", "14+ Sovereign Markets & PSX/NSE\n14-Category AI News & Sector Heatmaps", C_CYAN),
        ("📊 LSE DATA 3.0 PROVIDER", "Real-Time Stock Feeds & OHLCV\nOptions Chain Tape with Greeks & IV", C_BLUE),
        ("🔮 FUTURESTOCK 8-AGENT", "Autonomous Research Collective\n2,000-Path Monte Carlo & 3-Stage DCF", C_EMERALD),
        ("📈 WEB QUANT STUDIO", "Campbell-Lo-MacKinlay (1997) Studies\nMarket Model OLS & Abnormal Return CAR", C_AMBER),
    ]

    for i, (b_title, b_sub, b_color) in enumerate(badges):
        x = Inches(0.8 + i * 2.95)
        card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(4.35), Inches(2.8), Inches(1.9))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = b_title
        p1.font.name = "Arial"
        p1.font.size = Pt(10.5)
        p1.font.bold = True
        p1.font.color.rgb = b_color

        p2 = tf.add_paragraph()
        p2.text = b_sub
        p2.font.name = "Calibri"
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = C_TEXT

    foot = s1.shapes.add_textbox(Inches(0.8), Inches(6.6), Inches(11.8), Inches(0.5))
    p = foot.text_frame.paragraphs[0]
    p.text = "Lead Architect: Manish Yadav  |  Scaler School of Technology  •  Track: AI Autonomous Agents & Quantitative FinTech"
    p.font.name = "Calibri"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = C_GRAY

    # ==========================================================================
    # SLIDE 2: THE QUANTITATIVE RESEARCH CHASM (PROBLEM)
    # ==========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    set_slide_background(s2)
    add_header(s2, "01 • Market Bottleneck", "The Quantitative Research Chasm", "Quantitative researchers spend 70%+ of their time gathering and manually verifying messy web disclosures.", 2)

    prob_cards = [
        (
            "01 • FRAGMENTED LIVE WEB",
            "Alpha Hidden in Dynamic Silos",
            [
                "Modern Web is Dynamic: Critical sovereign announcements hide in central bank gazettes, SEC EDGAR tables, BSE/NSE dockets, and PSX circulars.",
                "Scrapers Break Instantly: Standard scrapers get blocked by Cloudflare and perimeter firewalls, starving quant models of live alpha.",
                "Knowledge Cutoff Limits: Static LLM training weights have zero knowledge of today's monetary policy rate hikes or corporate disclosures."
            ],
            C_RED
        ),
        (
            "02 • THE HALLUCINATION TRAP",
            "Catastrophic Look-Ahead Bias",
            [
                "Misattributed Timestamps: Generic AI frequently invents announcement dates, mistaking filing updates for primary press releases.",
                "The Look-Ahead Trap: Utilizing information even 1 trading day before public revelation completely invalidates backtests.",
                "Lack of Verifiable Provenance: Standard LLM chat outputs offer zero click-through links to audited primary filings."
            ],
            C_AMBER
        ),
        (
            "03 • THE WEB-TO-MATH GAP",
            "Manual & Disjointed Pipelines",
            [
                "Text vs Math Disconnect: Reading news is qualitative and messy; calculating abnormal returns (CAR) is strictly quantitative.",
                "Slow Time-to-Validation: Formulating statistical null hypotheses (H0 vs H1) and running OLS manually takes hours—by then, alpha decays.",
                "Lack of Standardization: Discretionary teams fail to communicate structured hypotheses to algorithmic desks."
            ],
            C_CYAN
        )
    ]

    for i, (b_badge, b_title, bullets, b_color) in enumerate(prob_cards):
        x = Inches(0.8 + i * 3.95)
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.9), Inches(3.8), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = b_badge
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = b_color

        p2 = tf.add_paragraph()
        p2.text = b_title
        p2.font.name = "Arial"
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = C_WHITE

        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = "• " + b
            p_b.font.name = "Calibri"
            p_b.font.size = Pt(9.5)
            p_b.font.color.rgb = C_TEXT

    takeaway2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.55), Inches(11.8), Inches(0.55))
    takeaway2.fill.solid()
    takeaway2.fill.fore_color.rgb = RGBColor(15, 25, 38)
    takeaway2.line.color.rgb = C_CYAN
    p = takeaway2.text_frame.paragraphs[0]
    p.text = "THE QUANTINTEL OPPORTUNITY: Replace brittle manual research with an autonomous multi-agent collective that crawls, computes, and verifies in seconds."
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_CYAN
    p.alignment = PP_ALIGN.CENTER

    # ==========================================================================
    # SLIDE 3: UNIFIED 4-PILLAR ARCHITECTURE
    # ==========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    set_slide_background(s3)
    add_header(s3, "02 • Architectural Paradigm", "Unified Multi-Pillar Intelligence Architecture", "QuantIntel integrates live web discovery, institutional market data, sovereign intelligence, and econometric rigor.", 3)

    pillars = [
        (
            "PILLAR 1: TINYFISH WEB",
            "Autonomous Live Web Recon",
            "Headless Chromium Agent Fleet",
            [
                "Crawls breaking corporate filings, central bank dockets, and financial news.",
                "Renders JavaScript SPAs and dynamic tables effortlessly.",
                "Strips DOM clutter down to Markdown with 88.5% token reduction."
            ],
            C_CYAN
        ),
        (
            "PILLAR 2: LSE DATA 3.0",
            "Institutional Market Data",
            "Official Package Provider Integration",
            [
                "Live prices, historical OHLCV, and global market indices.",
                "Real-time Options Chain: Strike, IV, and Greeks (Delta, Gamma, Vega).",
                "Fixed Income Macro Series: 10-Yr Treasury yields, Fed Funds, CPI."
            ],
            C_BLUE
        ),
        (
            "PILLAR 3: COUNTRY INTEL",
            "Sovereign-Level Discovery",
            "14+ Economies & Sector Impact",
            [
                "14-Category AI News Classification: Central Bank, Policy, GDP, Trade.",
                "Dynamic Sector Heatmaps & exposure matrices across key industries.",
                "Defensible Stocks to Watch & 3 forward scenarios (Bull/Base/Bear)."
            ],
            C_EMERALD
        ),
        (
            "PILLAR 4: QUANT CORE",
            "Econometric & Valuation Lab",
            "Deterministic Math & Event Studies",
            [
                "Campbell-Lo-MacKinlay (1997) Event Studies with Patell/BMP t-tests.",
                "2,000-Path Monte Carlo Geometric Brownian Motion fan forecasts.",
                "3-Stage DCF Valuation with WACC and historical analog matching."
            ],
            C_AMBER
        ),
    ]

    for i, (p_tag, p_title, p_sub, bullets, p_col) in enumerate(pillars):
        x = Inches(0.8 + i * 2.95)
        card = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.9), Inches(2.8), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = p_tag
        p1.font.name = "Calibri"
        p1.font.size = Pt(10)
        p1.font.bold = True
        p1.font.color.rgb = p_col

        p2 = tf.add_paragraph()
        p2.text = p_title
        p2.font.name = "Arial"
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = C_WHITE

        p3 = tf.add_paragraph()
        p3.text = p_sub
        p3.font.name = "Calibri"
        p3.font.size = Pt(9)
        p3.font.color.rgb = C_GRAY

        for b in bullets:
            pb = tf.add_paragraph()
            pb.text = "• " + b
            pb.font.name = "Calibri"
            pb.font.size = Pt(9)
            pb.font.color.rgb = C_TEXT

    takeaway3 = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.55), Inches(11.8), Inches(0.55))
    takeaway3.fill.solid()
    takeaway3.fill.fore_color.rgb = RGBColor(15, 25, 38)
    takeaway3.line.color.rgb = C_EMERALD
    p = takeaway3.text_frame.paragraphs[0]
    p.text = "FOUNDATIONAL PRINCIPLE: TinyFish gathers unstructured web disclosures; LSE Data streams structured prices; Python computes the math."
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD
    p.alignment = PP_ALIGN.CENTER

    # ==========================================================================
    # SLIDE 4: COUNTRY INTELLIGENCE (NEW CORE PILLAR)
    # ==========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    set_slide_background(s4)
    add_header(s4, "03 • Sovereign Intelligence", "Country Intelligence: Live Macro & Sector Impact", "Investigate sovereign economies, central bank policy, industry sectors, and publicly traded stocks right now.", 4)

    ci_cards = [
        (
            "14-CATEGORY AI CLASSIFIER",
            "Structured Macro Synthesis",
            [
                "Strict News Taxonomies: Classifies every disclosure across 14 categories (Central Bank, Fiscal Policy, Inflation, Earnings, IPOs, M&A, Energy, Trade Tariffs).",
                "Defensible Sentiment Grading: Categorizes each event as POSITIVE, NEGATIVE, MIXED, NEUTRAL, or UNCONFIRMED.",
                "Multi-Tier Reasoning: Assesses potential impact on national GDP, sovereign benchmark index, industry sector, and exposed equities."
            ],
            C_CYAN
        ),
        (
            "DYNAMIC SECTOR HEATMAP",
            "Real-Time Industry Exposure",
            [
                "Sovereign Industry Mapping: Tracks Banking, Energy, Tech, Cement, Fertilizers, Auto, and Pharmaceuticals.",
                "Net Sentiment Scoring: Aggregates positive, negative, and mixed catalysts with quantitative confidence metrics.",
                "Constituent Exposure: Pinpoints specific publicly traded beneficiaries and vulnerable high-debt companies."
            ],
            C_EMERALD
        ),
        (
            "STOCKS TO WATCH & SCENARIOS",
            "Actionable Market Discovery",
            [
                "Catalyst Mapping: Discovers equities with verified empirical exposure to breaking government/central bank catalysts.",
                "3 Forward Scenarios: Generates Bullish, Neutral, and Bearish macroeconomic paths with explicit probabilities (e.g. 45% / 35% / 20%).",
                "Invalidation Rules: Sets concrete economic conditions that would invalidate each forward forecast."
            ],
            C_AMBER
        )
    ]

    for i, (b_badge, b_title, bullets, b_color) in enumerate(ci_cards):
        x = Inches(0.8 + i * 3.95)
        card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.9), Inches(3.8), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = b_badge
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = b_color

        p2 = tf.add_paragraph()
        p2.text = b_title
        p2.font.name = "Arial"
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = C_WHITE

        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = "• " + b
            p_b.font.name = "Calibri"
            p_b.font.size = Pt(9.5)
            p_b.font.color.rgb = C_TEXT

    takeaway4 = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.55), Inches(11.8), Inches(0.55))
    takeaway4.fill.solid()
    takeaway4.fill.fore_color.rgb = RGBColor(15, 25, 38)
    takeaway4.line.color.rgb = C_CYAN
    p = takeaway4.text_frame.paragraphs[0]
    p.text = "SOVEREIGN VALUE: Allows institutional investors to evaluate macro inflection points and sector capital rotation in real time."
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_CYAN
    p.alignment = PP_ALIGN.CENTER

    # ==========================================================================
    # SLIDE 5: LIVE FINANCIAL SEARCH ENGINE & FUZZY RESOLUTION
    # ==========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    set_slide_background(s5)
    add_header(s5, "04 • Search Engine Architecture", "FutureStock Search Engine & Fuzzy Country Resolver", "Upgraded Country Intelligence to match FutureStock's search engine with typo tolerance and instant resolution.", 5)

    search_cards = [
        (
            "DUAL SEARCH ENGINE BAR",
            "Universal Query & Country Form",
            [
                "FutureStock-Grade Experience: Unified typeahead input bar with live debounced suggestions, sovereign region selector, and Analyze action button.",
                "Keyboard & Click Navigation: Pressing Enter or clicking any suggestion triggers instant live country scan.",
                "Trending Economies Bar: Direct one-click quick pills for Pakistan, India, US, UK, China, Japan, Germany, and Saudi Arabia."
            ],
            C_CYAN
        ),
        (
            "FUZZY TYPO & PHRASE TOLERANCE",
            "'pakisant future in stock' -> Pakistan (PK)",
            [
                "Filler Word Stripping: Automatically removes natural language phrases like 'future in stock', 'stock market', 'forecast', and 'shares'.",
                "Typo Resilience: Resolves 'pakisant' -> Pakistan, 'bharat' -> India, 'deutschland' -> Germany, 'ksa' -> Saudi Arabia.",
                "Ticker & Exchange Matching: Resolves '^KSE' / 'PSX' / 'Karachi' -> Pakistan, '^NSEI' / 'Nifty' -> India, '^GSPC' / 'S&P' -> US."
            ],
            C_AMBER
        ),
        (
            "8-AGENT DYNAMIC COLLECTIVE",
            "Real-Time Execution Pipeline Banner",
            [
                "8-Agent Visual Collective: Monitors Country Resolver, TinyFish Fleet, Central Bank, Index Feeds, 14-Category AI, Sector Heatmap, Stocks & LSE, and Scenarios.",
                "Live Activity Feedback: Animates during active web crawling and turns green with audited metrics on completion.",
                "Token Savings Telemetry: Displays real-time DOM token reduction (86.5% - 88.5%) and total web sources audited."
            ],
            C_EMERALD
        )
    ]

    for i, (b_badge, b_title, bullets, b_color) in enumerate(search_cards):
        x = Inches(0.8 + i * 3.95)
        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.9), Inches(3.8), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = b_badge
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = b_color

        p2 = tf.add_paragraph()
        p2.text = b_title
        p2.font.name = "Arial"
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = C_WHITE

        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = "• " + b
            p_b.font.name = "Calibri"
            p_b.font.size = Pt(9.5)
            p_b.font.color.rgb = C_TEXT

    takeaway5 = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.55), Inches(11.8), Inches(0.55))
    takeaway5.fill.solid()
    takeaway5.fill.fore_color.rgb = RGBColor(15, 25, 38)
    takeaway5.line.color.rgb = C_AMBER
    p = takeaway5.text_frame.paragraphs[0]
    p.text = "USER EXPERIENCE: Eliminates frustrating 404s and empty searches by resolving natural language and misspelled queries instantly."
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_AMBER
    p.alignment = PP_ALIGN.CENTER

    # ==========================================================================
    # SLIDE 6: FUTURESTOCK 8-AGENT RESEARCH COLLECTIVE
    # ==========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    set_slide_background(s6)
    add_header(s6, "05 • Core Platform Pillar", "FutureStock: 8-Agent Research Collective", "Eight specialized autonomous agents collaborate sequentially and in parallel to build an audited equity dossier.", 6)

    agents = [
        ("Agent A: Orchestrator", "Parses user query, resolves tickers across NSE/BSE/NASDAQ, and coordinates execution pipeline.", C_CYAN),
        ("Agent B: TinyFish Web", "Crawls SEC EDGAR, BSE dockets & news. Strips DOM boilerplate down to Markdown with 88% token savings.", C_CYAN),
        ("Agent C: Financials Core", "Audits balance sheet, income statement, revenue YoY growth, gross/operating margins, and FCF.", C_EMERALD),
        ("Agent D: Quant Lab", "Simulates 2,000 Geometric Brownian Motion (GBM) paths. Computes volatility, 95% VaR, and CVaR.", C_EMERALD),
        ("Agent E: Valuation DCF", "Builds 3-Stage DCF model under varying WACC assumptions alongside EV/EBITDA and P/E multiples.", C_AMBER),
        ("Agent F: Peer Analogs", "Maps historical peer cohorts and post-IPO trajectories, guarding strictly against survivorship bias.", C_AMBER),
        ("Agent G: Adversarial Bear", "Powered by Gemini 3.5 Flash: challenges consensus, models macro shocks, and sets invalidation triggers.", C_RED),
        ("Agent H: Verifier Audit", "Audits mathematical consistency: ((Target / Spot) - 1) * 100, verifying timestamps and provenance.", C_PURPLE),
    ]

    for i, (name, desc, col) in enumerate(agents):
        row = i // 4
        col_idx = i % 4
        x = Inches(0.8 + col_idx * 2.95)
        y = Inches(1.9 + row * 2.25)

        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(2.8), Inches(2.1))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = name
        p1.font.name = "Arial"
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = col

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = "Calibri"
        p2.font.size = Pt(9.5)
        p2.font.color.rgb = C_TEXT

    takeaway6 = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.55), Inches(11.8), Inches(0.55))
    takeaway6.fill.solid()
    takeaway6.fill.fore_color.rgb = RGBColor(15, 25, 38)
    takeaway6.line.color.rgb = C_CYAN
    p = takeaway6.text_frame.paragraphs[0]
    p.text = "COLLABORATIVE VALUE: Replaces biased single-prompt LLM outputs with an audited, adversarial consensus backed by statistical math."
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_CYAN
    p.alignment = PP_ALIGN.CENTER

    # ==========================================================================
    # SLIDE 7: LSE DATA 3.0 PROVIDER (NEW!)
    # ==========================================================================
    s7 = prs.slides.add_slide(blank_layout)
    set_slide_background(s7)
    add_header(s7, "06 • Market Data Provider", "LSE Data 3.0: Institutional Market Data & Options Tape", "Integrated londonstrategicedge/lse-data package into QuantIntel's unified financial data layer.", 7)

    lse_cards = [
        (
            "REAL-TIME PRICING & OHLCV",
            "Institutional Execution Feeds",
            [
                "Live Spot Quotes & History: Fetches latest bid/ask spot prices, historical OHLCV bar series, and volume.",
                "Multi-Asset Coverage: Equities, ETFs, futures, forex pairs, and major global market benchmark indices.",
                "Clean Provider Abstraction: Implemented via LSEMarketDataProvider and UnifiedMarketDataService with strict data freshness reporting."
            ],
            C_BLUE
        ),
        (
            "OPTIONS CHAIN & GREEKS TAPE",
            "Real-Time Volatility Surface",
            [
                "Live Options Tape: Interactive modal displaying strike prices, expiration dates, and bid/ask spreads.",
                "Implied Volatility (IV): Calculates real-time implied volatility across call and put strikes.",
                "Option Greeks: Streams Delta (directional sensitivity), Gamma, Theta (time decay), and Vega for risk management."
            ],
            C_CYAN
        ),
        (
            "MACRO SERIES & FIXED INCOME",
            "Benchmark Sovereign Indicators",
            [
                "Treasury Yields: Streams US 10-Year Treasury Yields for risk-free rate calibration in DCF models.",
                "Monetary Policy Benchmarks: Pulls Fed Funds effective rate and CPI inflation data.",
                "TinyFish + LSE Synergy: TinyFish discovers web catalysts; LSE Data provides structured market pricing & options."
            ],
            C_EMERALD
        )
    ]

    for i, (b_badge, b_title, bullets, b_color) in enumerate(lse_cards):
        x = Inches(0.8 + i * 3.95)
        card = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.9), Inches(3.8), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = b_badge
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = b_color

        p2 = tf.add_paragraph()
        p2.text = b_title
        p2.font.name = "Arial"
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = C_WHITE

        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = "• " + b
            p_b.font.name = "Calibri"
            p_b.font.size = Pt(9.5)
            p_b.font.color.rgb = C_TEXT

    takeaway7 = s7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.55), Inches(11.8), Inches(0.55))
    takeaway7.fill.solid()
    takeaway7.fill.fore_color.rgb = RGBColor(15, 25, 38)
    takeaway7.line.color.rgb = C_BLUE
    p = takeaway7.text_frame.paragraphs[0]
    p.text = "DATA SYNERGY: Combines unstructured web research from TinyFish with institutional structured quotes and options from LSE Data."
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_BLUE
    p.alignment = PP_ALIGN.CENTER

    # ==========================================================================
    # SLIDE 8: WEB QUANT STUDIO - EVENT STUDIES
    # ==========================================================================
    s8 = prs.slides.add_slide(blank_layout)
    set_slide_background(s8)
    add_header(s8, "07 • Econometric Engine", "Web Quant Studio: Academic Event Studies", "Testing qualitative corporate disclosures and market announcements against real live OHLCV price series.", 8)

    eq_cards = [
        (
            "01 • MARKET MODEL OLS",
            "R_it = alpha_i + beta_i * R_mt + eps_it",
            [
                "Estimation Window (T0 to T1): Typically 90 to 250 trading days prior to event.",
                "OLS Regression: Estimates equity alpha and systematic beta against market benchmark (^NSEI or ^GSPC).",
                "Deterministic Math: Computed via NumPy and SciPy; zero LLM hallucination."
            ],
            C_CYAN
        ),
        (
            "02 • ABNORMAL RETURNS",
            "AR_it = R_it - (alpha + beta * R_mt)",
            [
                "Event Window (T1 to T2): e.g., [-5, +10] days around disclosure date (tau = 0).",
                "Isolates Idiosyncratic Impact: Strips out broader market tide to prove event-driven alpha.",
                "Cumulative Abnormal Return (CAR): Sums daily abnormal returns across multi-day event window."
            ],
            C_EMERALD
        ),
        (
            "03 • STATISTICAL TESTS",
            "Patell Standardized & BMP t-Tests",
            [
                "Patell Test: Standardizes abnormal returns by forecast standard error.",
                "BMP Test: Adjusts for event-induced variance changes across cohorts.",
                "p-Value Rigor: Null hypothesis (H0: CAR = 0) rejected only at p < 0.05 threshold."
            ],
            C_AMBER
        )
    ]

    for i, (b_badge, b_title, bullets, b_color) in enumerate(eq_cards):
        x = Inches(0.8 + i * 3.95)
        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.9), Inches(3.8), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = b_badge
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = b_color

        p2 = tf.add_paragraph()
        p2.text = b_title
        p2.font.name = "Arial"
        p2.font.size = Pt(12)
        p2.font.bold = True
        p2.font.color.rgb = C_WHITE

        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = "• " + b
            p_b.font.name = "Calibri"
            p_b.font.size = Pt(9.5)
            p_b.font.color.rgb = C_TEXT

    takeaway8 = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.55), Inches(11.8), Inches(0.55))
    takeaway8.fill.solid()
    takeaway8.fill.fore_color.rgb = RGBColor(15, 25, 38)
    takeaway8.line.color.rgb = C_EMERALD
    p = takeaway8.text_frame.paragraphs[0]
    p.text = "ACADEMIC RIGOR: Built on Campbell, Lo, and MacKinlay (1997) standards—the gold standard of institutional quantitative finance."
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD
    p.alignment = PP_ALIGN.CENTER

    # ==========================================================================
    # SLIDE 9: TINYFISH WEB AGENT & TOKEN ECONOMY
    # ==========================================================================
    s9 = prs.slides.add_slide(blank_layout)
    set_slide_background(s9)
    add_header(s9, "08 • Web Agent Efficiency", "TinyFish Reconnaissance & Token Economy Matrix", "Transforming bloated 300KB+ raw HTML investor portals into clean, structured, low-token Markdown briefs.", 9)

    tf_cards = [
        (
            "THE SCRAPING PROBLEM",
            "Raw HTML Waste",
            [
                "Bloated Boilerplate: Modern corporate websites ship 300KB to 2MB of CSS, SVG sprites, tracking pixels, and ads.",
                "Token Exhaustion: Ingesting raw HTML directly into LLMs consumes 50,000 to 100,000 tokens per page.",
                "Extreme API Costs: Uncleaned HTML burns dollar budgets and dilutes the model's analytical attention window."
            ],
            C_RED
        ),
        (
            "TINYFISH DOM PURIFIER",
            "Smart Cleaning Architecture",
            [
                "Headless Chromium Fleet: Renders client-side dynamic JavaScript and extracts pure semantic document nodes.",
                "Heuristic Content Scoring: Strips navigation menus, footer disclosures, cookie consent popups, and scripts.",
                "Structure Preservation: Extracts financial tables, balance sheet line items, and executive quotes into clean Markdown."
            ],
            C_CYAN
        ),
        (
            "88.5% TOKEN SAVINGS",
            "Measurable Economic Impact",
            [
                "88.5% Compression: Compresses an 85,000-token HTML page down to ~1,200 verified semantic tokens.",
                "Sub-Second Latency: Accelerates inference turnaround by 7x while preserving 100% of factual financial numbers.",
                "Zero Hallucination: Downstream reasoning agents see only high-signal text grounded in verified primary URLs."
            ],
            C_EMERALD
        )
    ]

    for i, (b_badge, b_title, bullets, b_color) in enumerate(tf_cards):
        x = Inches(0.8 + i * 3.95)
        card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.9), Inches(3.8), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = b_badge
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = b_color

        p2 = tf.add_paragraph()
        p2.text = b_title
        p2.font.name = "Arial"
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = C_WHITE

        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = "• " + b
            p_b.font.name = "Calibri"
            p_b.font.size = Pt(9.5)
            p_b.font.color.rgb = C_TEXT

    takeaway9 = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.55), Inches(11.8), Inches(0.55))
    takeaway9.fill.solid()
    takeaway9.fill.fore_color.rgb = RGBColor(15, 25, 38)
    takeaway9.line.color.rgb = C_EMERALD
    p = takeaway9.text_frame.paragraphs[0]
    p.text = "SCALER BENCHMARK: TinyFish slashes token spend by 88.5%, making continuous real-time market crawling economically viable."
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD
    p.alignment = PP_ALIGN.CENTER

    # ==========================================================================
    # SLIDE 10: MULTI-COUNTRY COVERAGE MATRIX (NEW!)
    # ==========================================================================
    s10 = prs.slides.add_slide(blank_layout)
    set_slide_background(s10)
    add_header(s10, "09 • Global Reach", "Global Sovereign Markets & Benchmark Coverage", "QuantIntel covers 14+ major global economies with localized exchanges, currencies, and trading calendars.", 10)

    countries = [
        ("🇵🇰 Pakistan (PSX)", "Benchmark: KSE-100 (^KSE)\nCurrency: PKR (₨)\nKey Sectors: Oil & Gas, Banking, Cement, Fertilizers\nAnchors: OGDC.KA, MCB.KA, LUCK.KA, ENGRO.KA", C_EMERALD),
        ("🇮🇳 India (NSE / BSE)", "Benchmark: Nifty 50 (^NSEI)\nCurrency: INR (₹)\nKey Sectors: IT, Banking, Energy, Auto, Pharma\nAnchors: RELIANCE.NS, TCS.NS, HDFCBANK.NS", C_CYAN),
        ("🇺🇸 United States", "Benchmark: S&P 500 (^GSPC)\nCurrency: USD ($)\nKey Sectors: AI/Semis, Cloud, Banking, Healthcare\nAnchors: NVDA, MSFT, AAPL, JPM, GOOGL", C_BLUE),
        ("🇬🇧 United Kingdom", "Benchmark: FTSE 100 (^FTSE)\nCurrency: GBP (£)\nKey Sectors: Energy, Pharma, Banking, Mining\nAnchors: SHEL.L, AZN.L, HSBA.L, BP.L", C_AMBER),
        ("🇸🇦 Saudi Arabia", "Benchmark: TASI (^TASI.SR)\nCurrency: SAR (﷼)\nKey Sectors: Oil & Gas, Islamic Banking, Petrochem\nAnchors: 2222.SR (Aramco), 1120.SR (Al Rajhi)", C_EMERALD),
        ("🇯🇵 Japan (TSE)", "Benchmark: Nikkei 225 (^N225)\nCurrency: JPY (¥)\nKey Sectors: Automotive, Robotics, Electronics\nAnchors: 7203.T (Toyota), 8035.T (Tokyo Electron)", C_PURPLE),
        ("🇩🇪 Germany (XETRA)", "Benchmark: DAX 40 (^GDAXI)\nCurrency: EUR (€)\nKey Sectors: Auto Engineering, Industrial Siemens, SAP\nAnchors: SAP.DE, SIE.DE, BMW.DE", C_WHITE),
        ("🇨🇳 China (SSE/SZSE)", "Benchmark: Shanghai (000001.SS)\nCurrency: CNY (¥)\nKey Sectors: EV/Batteries, E-Commerce, Solar\nAnchors: BABA, Tencent, BYD, State Banks", C_RED),
    ]

    for i, (name, desc, col) in enumerate(countries):
        row = i // 4
        col_idx = i % 4
        x = Inches(0.8 + col_idx * 2.95)
        y = Inches(1.9 + row * 2.25)

        card = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(2.8), Inches(2.1))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = name
        p1.font.name = "Arial"
        p1.font.size = Pt(11)
        p1.font.bold = True
        p1.font.color.rgb = col

        p2 = tf.add_paragraph()
        p2.text = desc
        p2.font.name = "Calibri"
        p2.font.size = Pt(9)
        p2.font.color.rgb = C_TEXT

    takeaway10 = s10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.55), Inches(11.8), Inches(0.55))
    takeaway10.fill.solid()
    takeaway10.fill.fore_color.rgb = RGBColor(15, 25, 38)
    takeaway10.line.color.rgb = C_CYAN
    p = takeaway10.text_frame.paragraphs[0]
    p.text = "GLOBAL COVERAGE: Also supports Canada (TSX), Australia (ASX), Singapore (SGX), Brazil (B3), South Korea (KRX), and UAE (ADX)."
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_CYAN
    p.alignment = PP_ALIGN.CENTER

    # ==========================================================================
    # SLIDE 11: END-TO-END RESEARCH JOURNEY
    # ==========================================================================
    s11 = prs.slides.add_slide(blank_layout)
    set_slide_background(s11)
    add_header(s11, "10 • Concrete Walkthrough", "End-to-End Alpha Research Journey", "Tracing a live equity or sovereign query from search input to verified institutional dossier.", 11)

    steps = [
        ("STAGE 1: SEARCH", "Entity & Country Input", "User enters ticker, sovereign query, or natural language (e.g. 'pakisant future in stock').", C_CYAN),
        ("STAGE 2: RESOLUTION", "Fuzzy Auto-Routing", "Fuzzy resolver detects sovereign jurisdiction (PSX/NSE/NASDAQ), benchmarks, and currency.", C_CYAN),
        ("STAGE 3: WEB CRAWL", "TinyFish Recon", "Chromium fleet crawls primary regulatory filings and news, stripping DOM clutter (-88.5%).", C_BLUE),
        ("STAGE 4: MARKET FEEDS", "LSE Data 3.0 Pull", "Pulls real-time spot price, historical OHLCV, market index levels, and Options Chain with Greeks.", C_BLUE),
        ("STAGE 5: QUANT SIM", "Monte Carlo & DCF", "Executes 2,000-path GBM simulations and 3-stage DCF valuation with deterministic math.", C_EMERALD),
        ("STAGE 6: ADVERSARIAL", "Bearish Stress-Test", "Adversarial agent red-teams assumptions, testing downside risks, inflation, and rate shocks.", C_RED),
        ("STAGE 7: VERIFICATION", "Provenance Audit", "Verifier checks 100% of mathematical formulas and links claims to audited source URLs.", C_PURPLE),
        ("STAGE 8: DELIVERY", "Interactive Dossier", "Dashboard renders fan charts, options tape, and offers instant export to PDF and Markdown.", C_AMBER),
    ]

    for i, (name, sub, desc, col) in enumerate(steps):
        row = i // 4
        col_idx = i % 4
        x = Inches(0.8 + col_idx * 2.95)
        y = Inches(1.9 + row * 2.25)

        card = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, Inches(2.8), Inches(2.1))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        p1 = tf.paragraphs[0]
        p1.text = name
        p1.font.name = "Arial"
        p1.font.size = Pt(10.5)
        p1.font.bold = True
        p1.font.color.rgb = col

        p2 = tf.add_paragraph()
        p2.text = sub
        p2.font.name = "Calibri"
        p2.font.size = Pt(10)
        p2.font.bold = True
        p2.font.color.rgb = C_WHITE

        p3 = tf.add_paragraph()
        p3.text = desc
        p3.font.name = "Calibri"
        p3.font.size = Pt(9)
        p3.font.color.rgb = C_TEXT

    takeaway11 = s11.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.55), Inches(11.8), Inches(0.55))
    takeaway11.fill.solid()
    takeaway11.fill.fore_color.rgb = RGBColor(15, 25, 38)
    takeaway11.line.color.rgb = C_CYAN
    p = takeaway11.text_frame.paragraphs[0]
    p.text = "SEAMLESS PIPELINE: Eliminates days of disjointed analysis, delivering verified institutional dossiers in seconds."
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_CYAN
    p.alignment = PP_ALIGN.CENTER

    # ==========================================================================
    # SLIDE 12: EMPIRICAL VALIDATION & CASE STUDIES
    # ==========================================================================
    s12 = prs.slides.add_slide(blank_layout)
    set_slide_background(s12)
    add_header(s12, "11 • Empirical Validation", "Empirical Validation Across Global Equities", "QuantIntel has been battle-tested against real live market data across major international equities.", 12)

    cases = [
        (
            "CASE 1: NVIDIA (NVDA)",
            "Hyperscale AI Hardware Cycle",
            [
                "Trigger: Hyperscale data center capex surge & Blackwell GPU architecture rollout.",
                "Live Feeds: Spot $204.64 | Monte Carlo median path: $255.40 (+24.8% upside).",
                "LSE Options: Real-time IV smile and Greeks tape confirming heavy call open interest.",
                "Adversarial: Modeled export restriction risks and semiconductor fab capacity bottlenecks."
            ],
            C_CYAN
        ),
        (
            "CASE 2: RELIANCE (RELIANCE.NS)",
            "Conglomerate Expansion & Capex",
            [
                "Trigger: Telecom ARPU expansion announcement & green hydrogen gigafactory progress.",
                "Live Feeds: Spot ₹1,348.60 (split-adjusted) | CLM Event Study CAR: +3.8% (p < 0.01).",
                "Valuation: 3-Stage DCF under 11.2% WACC yielding fair value upside corridor.",
                "Provenance: All claims tied to audited BSE/NSE regulatory dockets and filings."
            ],
            C_EMERALD
        ),
        (
            "CASE 3: PAKISTAN OIL (OGDC.KA)",
            "Sovereign Debt Settlement",
            [
                "Trigger: Economic Coordination Committee gas circular debt clearance resolution.",
                "Live Feeds: KSE-100 benchmark surge to 88,000+ index level on PSX.",
                "Country Intel: Categorized as POSITIVE for Energy sector & domestic liquidity.",
                "CLM Study: Abnormal return of +4.2% around ministerial gazette notification."
            ],
            C_AMBER
        )
    ]

    for i, (b_badge, b_title, bullets, b_color) in enumerate(cases):
        x = Inches(0.8 + i * 3.95)
        card = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.9), Inches(3.8), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = b_badge
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = b_color

        p2 = tf.add_paragraph()
        p2.text = b_title
        p2.font.name = "Arial"
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = C_WHITE

        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = "• " + b
            p_b.font.name = "Calibri"
            p_b.font.size = Pt(9.5)
            p_b.font.color.rgb = C_TEXT

    takeaway12 = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.55), Inches(11.8), Inches(0.55))
    takeaway12.fill.solid()
    takeaway12.fill.fore_color.rgb = RGBColor(15, 25, 38)
    takeaway12.line.color.rgb = C_EMERALD
    p = takeaway12.text_frame.paragraphs[0]
    p.text = "EMPIRICAL REALITY: Tested on real equities across Indian, US, UK, and Pakistani exchanges with 100% verified math."
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_EMERALD
    p.alignment = PP_ALIGN.CENTER

    # ==========================================================================
    # SLIDE 13: TECHNICAL ARCHITECTURE & DUAL SURFACE
    # ==========================================================================
    s13 = prs.slides.add_slide(blank_layout)
    set_slide_background(s13)
    add_header(s13, "12 • Tech Stack & Architecture", "Dual-Surface Product Architecture & Stack", "Next.js 16 Web Terminal + Python FastAPI Backend + Streamlit Cockpit with 27/27 green automated tests.", 13)

    tech_cards = [
        (
            "WEB TERMINAL SURFACE",
            "Next.js 16 & Turbopack",
            [
                "Next.js 16 App Router: Real-time server components, route handlers, and streaming UI.",
                "Tailwind CSS Dark Theme: High-density Obsidian cyber-quant aesthetic (#070B10).",
                "Recharts & Lucide: Interactive Monte Carlo fan charts, sector impact heatmaps, and options tape.",
                "0 Compilation Errors: 100% clean TypeScript build with strict data contracts."
            ],
            C_CYAN
        ),
        (
            "QUANT ENGINE BACKEND",
            "Python 3.14 & Numerical Stack",
            [
                "FastAPI & Pydantic v2: Strict schema validation across all agent inputs, quotes, and research dossiers.",
                "NumPy & SciPy Econometrics: Deterministic OLS regressions, CAR accumulation, and statistical tests.",
                "LSE Data 3.0 & yfinance: Direct integration of official market data providers with caching defense.",
                "27/27 Tests Green: Comprehensive pytest suite covering all modules end-to-end."
            ],
            C_EMERALD
        ),
        (
            "MULTI-MODEL LLM ENGINE",
            "Swappable Intelligence Core",
            [
                "Model Provider Agnostic: Native support for Google Gemini 3.5, Anthropic Claude, OpenAI GPT-4o, and Groq.",
                "Dynamic API Keys Manager: Browser localStorage encryption with live connectivity tester.",
                "Deterministic Local Fallback: Runs calibrated quantitative models even in full offline air-gapped environments.",
                "Zero Vendor Lock-In: Clean provider interfaces allow instant switching of LLM reasoning cores."
            ],
            C_PURPLE
        )
    ]

    for i, (b_badge, b_title, bullets, b_color) in enumerate(tech_cards):
        x = Inches(0.8 + i * 3.95)
        card = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.9), Inches(3.8), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = b_badge
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = b_color

        p2 = tf.add_paragraph()
        p2.text = b_title
        p2.font.name = "Arial"
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = C_WHITE

        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = "• " + b
            p_b.font.name = "Calibri"
            p_b.font.size = Pt(9.5)
            p_b.font.color.rgb = C_TEXT

    takeaway13 = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.55), Inches(11.8), Inches(0.55))
    takeaway13.fill.solid()
    takeaway13.fill.fore_color.rgb = RGBColor(15, 25, 38)
    takeaway13.line.color.rgb = C_CYAN
    p = takeaway13.text_frame.paragraphs[0]
    p.text = "PRODUCTION GRADE: Modern microservice architecture engineered for high throughput, test coverage, and modularity."
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_CYAN
    p.alignment = PP_ALIGN.CENTER

    # ==========================================================================
    # SLIDE 14: RESPONSIBLE AI & GOVERNANCE
    # ==========================================================================
    s14 = prs.slides.add_slide(blank_layout)
    set_slide_background(s14)
    add_header(s14, "13 • Governance & Safety", "Responsible AI & Anti-Hallucination Framework", "Institutional-grade rigor and ethical safeguards embedded into every layer of QuantIntel.", 14)

    gov_cards = [
        (
            "DETERMINISTIC BOUNDARIES",
            "Code Calculates, AI Synthesizes",
            [
                "Strict Separation of Concerns: LLMs are strictly forbidden from guessing numerical prices, CAR percentages, or VaR metrics.",
                "Zero-Hallucination Math: All equations execute in deterministic Python/TypeScript code and are validated before rendering.",
                "Mathematical Sanity Checks: Target prices must mathematically reconcile with spot prices: ((Target/Spot)-1)*100."
            ],
            C_CYAN
        ),
        (
            "CITATION PROVENANCE",
            "100% Source Traceability",
            [
                "Mandatory Citation Links: Every synthesized catalyst and news disclosure displays original source domain and clickable URL.",
                "Dual Timestamp Auditing: Displays both original article publication time and TinyFish retrieval timestamp.",
                "Unconfirmed Rumor Shield: Rumors, leaks, and speculation are prominently tagged with UNCONFIRMED warning badges."
            ],
            C_AMBER
        ),
        (
            "COMPLIANCE & GOVERNANCE",
            "Institutional Operational Guardrails",
            [
                "Ethical Web Scraping: TinyFish respects robots.txt, source rate limits, and terms of service across all domains.",
                "Clear Disclaimers: Prominently identifies research assessments as empirical academic analysis, not guaranteed financial advice.",
                "Audited Forecast Ledger: Appends all simulated predictions to an immutable historical ledger for forward calibration."
            ],
            C_PURPLE
        )
    ]

    for i, (b_badge, b_title, bullets, b_color) in enumerate(gov_cards):
        x = Inches(0.8 + i * 3.95)
        card = s14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.9), Inches(3.8), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = b_badge
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = b_color

        p2 = tf.add_paragraph()
        p2.text = b_title
        p2.font.name = "Arial"
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = C_WHITE

        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = "• " + b
            p_b.font.name = "Calibri"
            p_b.font.size = Pt(9.5)
            p_b.font.color.rgb = C_TEXT

    takeaway14 = s14.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.55), Inches(11.8), Inches(0.55))
    takeaway14.fill.solid()
    takeaway14.fill.fore_color.rgb = RGBColor(15, 25, 38)
    takeaway14.line.color.rgb = C_PURPLE
    p = takeaway14.text_frame.paragraphs[0]
    p.text = "GOVERNANCE STANDARD: Built for institutional compliance departments where provenance and auditability are non-negotiable."
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_PURPLE
    p.alignment = PP_ALIGN.CENTER

    # ==========================================================================
    # SLIDE 15: ROADMAP & STRATEGIC VISION (CONCLUSION)
    # ==========================================================================
    s15 = prs.slides.add_slide(blank_layout)
    set_slide_background(s15)
    add_header(s15, "14 • Scaler Vision & Roadmap", "Commercialization Trajectory & Scaling Roadmap", "From autonomous prototype to enterprise-grade quantitative intelligence collective.", 15)

    roadmap_phases = [
        (
            "PHASE 1: LIVE (COMPLETED)",
            "Core Multi-Pillar Engine",
            [
                "FutureStock 8-Agent Collective with 2,000-path Monte Carlo & DCF.",
                "Web Quant Studio CLM (1997) event studies on live market prices.",
                "Country Intelligence with 14+ economies & 14-category AI news engine.",
                "LSE Data 3.0 provider integration with real-time Options Chain & Greeks.",
                "FutureStock-grade search engine with fuzzy country & typo tolerance."
            ],
            C_CYAN
        ),
        (
            "PHASE 2: NEAR-TERM (Q1-Q2)",
            "Multi-Asset & Institutional Feeds",
            [
                "Fixed Income & Credit: Modeling sovereign yield curve shifts and credit spreads.",
                "Earnings Call Audio Analysis: Real-time speech-to-text sentiment tone detection.",
                "WebSocket Price Streaming: Real-time sub-second price tape updates via LSE Data.",
                "Multi-Stock Cohort Studies: Run multi-company event studies across entire sectors simultaneously."
            ],
            C_EMERALD
        ),
        (
            "PHASE 3: ENTERPRISE (Q3-Q4)",
            "B2B FinTech Platform & API",
            [
                "QuantIntel Headless API: Institutional SDK for hedge funds and family offices.",
                "Automated Portfolio Rebalancing: Connecting alpha signals to execution venues.",
                "Enterprise SSO & Compliance: Granular audit logs and SOC 2 / HIPAA compliance.",
                "Custom LLM Fine-Tuning: Domain-specialized financial reasoning models."
            ],
            C_PURPLE
        )
    ]

    for i, (b_badge, b_title, bullets, b_color) in enumerate(roadmap_phases):
        x = Inches(0.8 + i * 3.95)
        card = s15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, Inches(1.9), Inches(3.8), Inches(4.5))
        card.fill.solid()
        card.fill.fore_color.rgb = C_CARD
        card.line.color.rgb = C_BORDER
        card.line.width = Pt(1)

        tf = card.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = b_badge
        p.font.name = "Calibri"
        p.font.size = Pt(11)
        p.font.bold = True
        p.font.color.rgb = b_color

        p2 = tf.add_paragraph()
        p2.text = b_title
        p2.font.name = "Arial"
        p2.font.size = Pt(13)
        p2.font.bold = True
        p2.font.color.rgb = C_WHITE

        for b in bullets:
            p_b = tf.add_paragraph()
            p_b.text = "• " + b
            p_b.font.name = "Calibri"
            p_b.font.size = Pt(9.5)
            p_b.font.color.rgb = C_TEXT

    takeaway15 = s15.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(6.55), Inches(11.8), Inches(0.55))
    takeaway15.fill.solid()
    takeaway15.fill.fore_color.rgb = RGBColor(15, 25, 38)
    takeaway15.line.color.rgb = C_CYAN
    p = takeaway15.text_frame.paragraphs[0]
    p.text = "FINAL THOUGHT: QuantIntel bridges the chasm between messy live web disclosures, rigid institutional market data, and mathematical alpha."
    p.font.name = "Calibri"
    p.font.size = Pt(10.5)
    p.font.bold = True
    p.font.color.rgb = C_CYAN
    p.alignment = PP_ALIGN.CENTER

    pptx_path = "/home/kali/QuantIntel/QuantIntel_Finale_Presentation.pptx"
    prs.save(pptx_path)
    print(f"Presentation saved successfully to: {pptx_path}")


# ==============================================================================
# PDF GENERATION (Landscape Executive 15-Slide Presentation)
# ==============================================================================
class QuantIntelPDF(FPDF):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.add_font("DejaVu", "", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf")
        self.add_font("DejaVu", "B", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")

    def header(self):
        # Draw dark cyber background
        self.set_fill_color(7, 11, 16)
        self.rect(0, 0, 297, 210, "F")

    def footer(self):
        self.set_y(-12)
        self.set_font("DejaVu", "B", 8)
        self.set_text_color(139, 148, 158)
        self.cell(0, 10, f"QuantIntel  |  Autonomous Quantitative Intelligence  |  Page {self.page_no()} / {TOTAL_SLIDES}", align="C")


def create_pdf():
    pdf = QuantIntelPDF(orientation="landscape", unit="mm", format="A4")
    pdf.set_auto_page_break(auto=False)

    def draw_slide_header(badge, title, subtitle, page_num):
        pdf.add_page()
        # Top Badge
        pdf.set_xy(15, 10)
        pdf.set_font("DejaVu", "B", 8)
        pdf.set_text_color(0, 196, 204)
        pdf.set_fill_color(0, 35, 40)
        pdf.cell(85, 7, f"  {badge.upper()}  ", border=1, fill=True, new_x="RIGHT", new_y="TOP")

        # Page Number
        pdf.set_xy(260, 10)
        pdf.set_font("DejaVu", "B", 9)
        pdf.set_text_color(139, 148, 158)
        pdf.cell(22, 7, f"{page_num:02d} / {TOTAL_SLIDES}", align="R")

        # Main Title
        pdf.set_xy(15, 20)
        pdf.set_font("DejaVu", "B", 17)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(0, 9, title, new_x="LMARGIN", new_y="NEXT")

        # Subtitle
        pdf.set_xy(15, 29)
        pdf.set_font("DejaVu", "", 9.5)
        pdf.set_text_color(139, 148, 158)
        pdf.cell(0, 6, subtitle, new_x="LMARGIN", new_y="NEXT")

        # Divider line
        pdf.set_draw_color(30, 44, 61)
        pdf.set_line_width(0.4)
        pdf.line(15, 37, 282, 37)

    # 1. Cover
    pdf.add_page()
    pdf.set_xy(15, 22)
    pdf.set_font("DejaVu", "B", 10.5)
    pdf.set_text_color(0, 196, 204)
    pdf.cell(0, 8, "QUANTINTEL EXECUTIVE MASTER PRESENTATION", new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("DejaVu", "B", 36)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 18, "QuantIntel", new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("DejaVu", "B", 14)
    pdf.set_text_color(0, 196, 204)
    pdf.cell(0, 9, "Autonomous Quantitative Research Collective & Sovereign Market Intelligence", new_x="LMARGIN", new_y="NEXT")

    pdf.set_font("DejaVu", "", 10.5)
    pdf.set_text_color(201, 209, 217)
    pdf.multi_cell(265, 6.5, "Transforming live web disclosures, LSE Data institutional feeds, 14-category sovereign news classification, 2,000-path Monte Carlo fan forecasting, and Campbell-Lo-MacKinlay event studies into one unified intelligence platform.")

    covers = [
        ("COUNTRY INTEL", "14+ Sovereign Markets & PSX\n14-Category AI News & Sector Heatmaps", (0, 196, 204)),
        ("LSE DATA 3.0", "Real-Time Stock Feeds & OHLCV\nOptions Chain Tape with Greeks & IV", (10, 132, 255)),
        ("FUTURESTOCK", "Autonomous 8-Agent Collective\n2,000-Path Monte Carlo & 3-Stage DCF", (16, 185, 129)),
        ("QUANT STUDIO", "Campbell-Lo-MacKinlay Event Studies\nMarket Model OLS & Abnormal Return CAR", (255, 190, 92)),
    ]
    for i, (c_title, c_desc, c_col) in enumerate(covers):
        x = 15 + i * 68
        pdf.set_fill_color(14, 21, 32)
        pdf.set_draw_color(30, 44, 61)
        pdf.rect(x, 105, 63, 52, "DF")

        pdf.set_xy(x + 4, 112)
        pdf.set_font("DejaVu", "B", 9.5)
        pdf.set_text_color(*c_col)
        pdf.cell(55, 6, c_title, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 4, 122)
        pdf.set_font("DejaVu", "", 8.5)
        pdf.set_text_color(201, 209, 217)
        pdf.multi_cell(55, 4.5, c_desc)

    pdf.set_xy(15, 180)
    pdf.set_font("DejaVu", "B", 9.5)
    pdf.set_text_color(139, 148, 158)
    pdf.cell(0, 8, "Lead Architect: Manish Yadav | Scaler School of Technology  -  Track: AI Autonomous Agents & Quantitative FinTech")

    # 2. Problem
    draw_slide_header("01 - Market Bottleneck", "The Quantitative Research Chasm", "Quantitative researchers spend 70%+ of their time gathering and manually verifying messy web disclosures.", 2)
    probs = [
        ("01 - FRAGMENTED LIVE WEB", "Alpha Hidden in Dynamic Silos", "Modern Web is Dynamic: Critical sovereign announcements live in central bank gazettes, SEC EDGAR tables, and PSX/NSE dockets.\n\nScrapers Break Instantly: Standard scrapers get blocked by anti-bot firewalls, starving quant desks.\n\nKnowledge Cutoffs: Static LLMs lack access to today's interest rate decisions.", (239, 68, 68)),
        ("02 - THE HALLUCINATION TRAP", "Catastrophic Look-Ahead Bias", "Misattributed Timestamps: Generic AI hallucinates announcement dates, confusing release dates with filing dates.\n\nThe Look-Ahead Trap: Using data 1 day before public availability invalidates the entire backtest.\n\nLack of Provenance: Standard LLM outputs offer zero click-through links to audited filings.", (255, 190, 92)),
        ("03 - THE WEB-TO-MATH GAP", "Manual & Disjointed Pipelines", "Text vs Math Disconnect: Reading news is qualitative and messy; calculating abnormal returns (CAR) is strictly quantitative.\n\nSlow Validation: Formulating a statistical null hypothesis (H0 vs H1) takes hours—alpha decays.\n\nDisjointed Desks: Discretionary analysts cannot communicate structured tests to quants.", (0, 196, 204))
    ]
    for i, (p_tag, p_title, p_desc, p_col) in enumerate(probs):
        x = 15 + i * 90
        pdf.set_fill_color(14, 21, 32)
        pdf.set_draw_color(30, 44, 61)
        pdf.rect(x, 45, 84, 125, "DF")

        pdf.set_xy(x + 5, 52)
        pdf.set_font("DejaVu", "B", 9)
        pdf.set_text_color(*p_col)
        pdf.cell(74, 5, p_tag, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 60)
        pdf.set_font("DejaVu", "B", 11)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(74, 6, p_title, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 72)
        pdf.set_font("DejaVu", "", 8.5)
        pdf.set_text_color(201, 209, 217)
        pdf.multi_cell(74, 4.8, p_desc)

    pdf.set_xy(15, 178)
    pdf.set_fill_color(15, 25, 38)
    pdf.set_draw_color(0, 196, 204)
    pdf.rect(15, 176, 267, 12, "DF")
    pdf.set_xy(17, 179)
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(0, 196, 204)
    pdf.cell(263, 6, "THE QUANTINTEL OPPORTUNITY: Replace brittle manual research with an autonomous multi-agent collective.", align="C")

    # 3. System Architecture
    draw_slide_header("02 - Architectural Paradigm", "Unified Multi-Pillar Intelligence Architecture", "QuantIntel integrates live web discovery, institutional market data, sovereign intelligence, and econometric rigor.", 3)
    archs = [
        ("PILLAR 1: TINYFISH WEB", "Autonomous Web Recon", "Headless Chromium Fleet:\n\n- Proactively crawls corporate filings & dockets.\n- Renders dynamic JavaScript SPAs effortlessly.\n- Strips DOM boilerplate down with -88.5% token savings.", (0, 196, 204)),
        ("PILLAR 2: LSE DATA 3.0", "Institutional Market Data", "Official Package Provider:\n\n- Real-time stock prices & historical OHLCV.\n- Options Chain Tape with Greeks (Delta, Gamma, Vega).\n- Macro Series: 10-Yr Treasury, Fed Funds, CPI.", (10, 132, 255)),
        ("PILLAR 3: COUNTRY INTEL", "Sovereign Intelligence", "14+ Global Economies:\n\n- 14-Category AI News Classification Engine.\n- Dynamic Sector Impact Heatmap & Exposure.\n- Stocks to Watch & 3 Forward Scenarios.", (16, 185, 129)),
        ("PILLAR 4: QUANT CORE", "Econometric Lab", "Deterministic Math Rigor:\n\n- Campbell-Lo-MacKinlay (1997) Event Studies.\n- 2,000-Path Monte Carlo Geometric Brownian Motion.\n- 3-Stage DCF Valuation with WACC & peer analogs.", (255, 190, 92)),
    ]
    for i, (a_tag, a_title, a_desc, a_col) in enumerate(archs):
        x = 15 + i * 68
        pdf.set_fill_color(14, 21, 32)
        pdf.set_draw_color(30, 44, 61)
        pdf.rect(x, 45, 63, 125, "DF")

        pdf.set_xy(x + 4, 52)
        pdf.set_font("DejaVu", "B", 8.5)
        pdf.set_text_color(*a_col)
        pdf.cell(55, 5, a_tag, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 4, 60)
        pdf.set_font("DejaVu", "B", 10)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(55, 6, a_title, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 4, 70)
        pdf.set_font("DejaVu", "", 8.5)
        pdf.set_text_color(201, 209, 217)
        pdf.multi_cell(55, 4.5, a_desc)

    pdf.set_xy(15, 178)
    pdf.set_fill_color(15, 25, 38)
    pdf.set_draw_color(16, 185, 129)
    pdf.rect(15, 176, 267, 12, "DF")
    pdf.set_xy(17, 179)
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(263, 6, "FOUNDATIONAL PRINCIPLE: TinyFish gathers unstructured text; LSE Data streams prices; Python computes math.", align="C")

    # 4. Country Intelligence
    draw_slide_header("03 - Sovereign Intelligence", "Country Intelligence: Live Macro & Sector Impact", "Investigate sovereign economies, central bank policy, industry sectors, and publicly traded stocks right now.", 4)
    ci_list = [
        ("14-CATEGORY CLASSIFIER", "Structured Macro Taxonomies", "Classifies every disclosure across 14 categories: Central Bank, Fiscal Policy, Inflation, Earnings, IPOs, M&A, Energy, Trade Tariffs.\n\nSentiment Grading: POSITIVE, NEGATIVE, MIXED, NEUTRAL, or UNCONFIRMED.\n\nMulti-Tier Reasoning: Evaluates impact on GDP, sovereign benchmark, sectors, and equities.", (0, 196, 204)),
        ("DYNAMIC SECTOR HEATMAP", "Real-Time Industry Exposure", "Sovereign Industry Coverage: Commercial Banking, Energy, Technology, Cement, Fertilizers, Auto, and Pharma.\n\nNet Sentiment Scores: Aggregates positive, negative, and mixed catalysts with confidence scores.\n\nConstituent Exposure: Identifies beneficiaries and vulnerable high-debt firms.", (16, 185, 129)),
        ("STOCKS TO WATCH & SCENARIOS", "Actionable Sovereign Discovery", "Catalyst Discovery: Identifies equities with verified exposure to breaking sovereign policies.\n\n3 Forward Scenarios: Generates Bullish, Neutral, and Bearish paths with explicit probabilities (45% / 35% / 20%).\n\nInvalidation Rules: Sets concrete economic triggers that invalidate forecasts.", (255, 190, 92)),
    ]
    for i, (c_tag, c_title, c_desc, c_col) in enumerate(ci_list):
        x = 15 + i * 90
        pdf.set_fill_color(14, 21, 32)
        pdf.set_draw_color(30, 44, 61)
        pdf.rect(x, 45, 84, 125, "DF")

        pdf.set_xy(x + 5, 52)
        pdf.set_font("DejaVu", "B", 9)
        pdf.set_text_color(*c_col)
        pdf.cell(74, 5, c_tag, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 60)
        pdf.set_font("DejaVu", "B", 11)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(74, 6, c_title, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 72)
        pdf.set_font("DejaVu", "", 8.5)
        pdf.set_text_color(201, 209, 217)
        pdf.multi_cell(74, 4.8, c_desc)

    pdf.set_xy(15, 178)
    pdf.set_fill_color(15, 25, 38)
    pdf.set_draw_color(0, 196, 204)
    pdf.rect(15, 176, 267, 12, "DF")
    pdf.set_xy(17, 179)
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(0, 196, 204)
    pdf.cell(263, 6, "SOVEREIGN VALUE: Allows institutional investors to evaluate macro inflection points and sector capital rotation in real time.", align="C")

    # 5. Search Engine Architecture
    draw_slide_header("04 - Search Engine Architecture", "FutureStock Search Engine & Fuzzy Country Resolver", "Upgraded Country Intelligence to match FutureStock's search engine with typo tolerance and instant resolution.", 5)
    se_list = [
        ("DUAL SEARCH ENGINE BAR", "Universal Query & Country Form", "FutureStock Experience: Unified typeahead input bar with live debounced suggestions, sovereign region selector, and Analyze button.\n\nInstant Execution: Pressing Enter or clicking any suggestion triggers instant live country scan.\n\nTrending Economies: One-click pills for Pakistan, India, US, UK, China, Japan, Germany, and Saudi Arabia.", (0, 196, 204)),
        ("FUZZY TYPO & PHRASE TOLERANCE", "'pakisant future in stock' -> Pakistan", "Filler Word Stripping: Removes natural language words ('future in stock', 'stock market', 'forecast', 'shares').\n\nTypo Resilience: Resolves 'pakisant' -> Pakistan, 'bharat' -> India, 'deutschland' -> Germany, 'ksa' -> Saudi Arabia.\n\nBenchmark Matching: Resolves '^KSE' / 'PSX' / 'Karachi' -> Pakistan, '^NSEI' -> India, '^GSPC' -> US.", (255, 190, 92)),
        ("8-AGENT RECON COLLECTIVE", "Real-Time Pipeline Status Banner", "8-Agent Collective: Monitors Country Resolver, TinyFish Fleet, Central Bank, Index Feeds, 14-Category AI, Sector Heatmap, Stocks & LSE, and Scenarios.\n\nActivity Animation: Animates during active web crawling and turns green with audited metrics on completion.\n\nToken Telemetry: Displays DOM token reduction (-88.5%) and web sources audited.", (16, 185, 129)),
    ]
    for i, (s_tag, s_title, s_desc, s_col) in enumerate(se_list):
        x = 15 + i * 90
        pdf.set_fill_color(14, 21, 32)
        pdf.set_draw_color(30, 44, 61)
        pdf.rect(x, 45, 84, 125, "DF")

        pdf.set_xy(x + 5, 52)
        pdf.set_font("DejaVu", "B", 9)
        pdf.set_text_color(*s_col)
        pdf.cell(74, 5, s_tag, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 60)
        pdf.set_font("DejaVu", "B", 11)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(74, 6, s_title, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 72)
        pdf.set_font("DejaVu", "", 8.5)
        pdf.set_text_color(201, 209, 217)
        pdf.multi_cell(74, 4.8, s_desc)

    pdf.set_xy(15, 178)
    pdf.set_fill_color(15, 25, 38)
    pdf.set_draw_color(255, 190, 92)
    pdf.rect(15, 176, 267, 12, "DF")
    pdf.set_xy(17, 179)
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(255, 190, 92)
    pdf.cell(263, 6, "USER EXPERIENCE: Eliminates frustrating 404s and empty searches by resolving natural language and misspelled queries instantly.", align="C")

    # 6. FutureStock 8-Agent
    draw_slide_header("05 - Core Platform Pillar", "FutureStock: 8-Agent Research Collective", "Eight specialized autonomous agents collaborate sequentially and in parallel to build an audited equity dossier.", 6)
    ag_list = [
        ("Agent A: Orchestrator", "Parses user query, resolves tickers across NSE/BSE/NASDAQ, and coordinates execution pipeline.", (0, 196, 204)),
        ("Agent B: TinyFish Web", "Crawls SEC EDGAR, BSE dockets & news. Strips DOM boilerplate down to Markdown with 88% token savings.", (0, 196, 204)),
        ("Agent C: Financials Core", "Audits balance sheet, income statement, revenue YoY growth, gross/operating margins, and FCF.", (16, 185, 129)),
        ("Agent D: Quant Lab", "Simulates 2,000 Geometric Brownian Motion (GBM) paths. Computes volatility, 95% VaR, and CVaR.", (16, 185, 129)),
        ("Agent E: Valuation DCF", "Builds 3-Stage DCF model under varying WACC assumptions alongside EV/EBITDA and P/E multiples.", (255, 190, 92)),
        ("Agent F: Peer Analogs", "Maps historical peer cohorts and post-IPO trajectories, guarding strictly against survivorship bias.", (255, 190, 92)),
        ("Agent G: Adversarial Bear", "Powered by Gemini 3.5 Flash: challenges consensus, models macro shocks, and sets invalidation triggers.", (239, 68, 68)),
        ("Agent H: Verifier Audit", "Audits mathematical consistency: ((Target / Spot) - 1) * 100, verifying timestamps and provenance.", (167, 139, 250)),
    ]
    for i, (name, desc, col) in enumerate(ag_list):
        row = i // 4
        col_idx = i % 4
        x = 15 + col_idx * 68
        y = 45 + row * 62

        pdf.set_fill_color(14, 21, 32)
        pdf.set_draw_color(30, 44, 61)
        pdf.rect(x, y, 63, 56, "DF")

        pdf.set_xy(x + 4, y + 6)
        pdf.set_font("DejaVu", "B", 9.5)
        pdf.set_text_color(*col)
        pdf.cell(55, 5, name, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 4, y + 15)
        pdf.set_font("DejaVu", "", 8.5)
        pdf.set_text_color(201, 209, 217)
        pdf.multi_cell(55, 4.5, desc)

    pdf.set_xy(15, 178)
    pdf.set_fill_color(15, 25, 38)
    pdf.set_draw_color(0, 196, 204)
    pdf.rect(15, 176, 267, 12, "DF")
    pdf.set_xy(17, 179)
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(0, 196, 204)
    pdf.cell(263, 6, "COLLABORATIVE VALUE: Replaces biased single-prompt LLM outputs with an audited, adversarial consensus backed by statistical math.", align="C")

    # 7. LSE Data 3.0 Provider
    draw_slide_header("06 - Market Data Provider", "LSE Data 3.0: Institutional Market Data & Options Tape", "Integrated londonstrategicedge/lse-data package into QuantIntel's unified financial data layer.", 7)
    lse_list = [
        ("REAL-TIME PRICING & OHLCV", "Institutional Execution Feeds", "Live Spot Quotes & History: Fetches latest bid/ask spot prices, historical OHLCV bar series, and volume.\n\nMulti-Asset Coverage: Equities, ETFs, futures, forex pairs, and major global market benchmark indices.\n\nClean Abstraction: Implemented via LSEMarketDataProvider and UnifiedMarketDataService with data freshness reporting.", (10, 132, 255)),
        ("OPTIONS CHAIN & GREEKS TAPE", "Real-Time Volatility Surface", "Live Options Tape: Interactive modal displaying strike prices, expiration dates, and bid/ask spreads.\n\nImplied Volatility (IV): Calculates real-time implied volatility across call and put strikes.\n\nOption Greeks: Streams Delta (directional sensitivity), Gamma, Theta (time decay), and Vega for risk management.", (0, 196, 204)),
        ("MACRO SERIES & FIXED INCOME", "Benchmark Sovereign Indicators", "Treasury Yields: Streams US 10-Year Treasury Yields for risk-free rate calibration in DCF models.\n\nMonetary Policy Benchmarks: Pulls Fed Funds effective rate and CPI inflation data.\n\nTinyFish + LSE Synergy: TinyFish discovers web catalysts; LSE Data provides structured market pricing & options.", (16, 185, 129)),
    ]
    for i, (l_tag, l_title, l_desc, l_col) in enumerate(lse_list):
        x = 15 + i * 90
        pdf.set_fill_color(14, 21, 32)
        pdf.set_draw_color(30, 44, 61)
        pdf.rect(x, 45, 84, 125, "DF")

        pdf.set_xy(x + 5, 52)
        pdf.set_font("DejaVu", "B", 9)
        pdf.set_text_color(*l_col)
        pdf.cell(74, 5, l_tag, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 60)
        pdf.set_font("DejaVu", "B", 11)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(74, 6, l_title, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 72)
        pdf.set_font("DejaVu", "", 8.5)
        pdf.set_text_color(201, 209, 217)
        pdf.multi_cell(74, 4.8, l_desc)

    pdf.set_xy(15, 178)
    pdf.set_fill_color(15, 25, 38)
    pdf.set_draw_color(10, 132, 255)
    pdf.rect(15, 176, 267, 12, "DF")
    pdf.set_xy(17, 179)
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(10, 132, 255)
    pdf.cell(263, 6, "DATA SYNERGY: Combines unstructured web research from TinyFish with institutional structured quotes and options from LSE Data.", align="C")

    # 8. Web Quant Studio
    draw_slide_header("07 - Econometric Engine", "Web Quant Studio: Academic Event Studies", "Testing qualitative corporate disclosures and market announcements against real live OHLCV price series.", 8)
    quant_list = [
        ("01 - MARKET MODEL OLS", "R_it = alpha_i + beta_i * R_mt", "Estimation Window: Typically 90 to 250 trading days prior to event.\n\nOLS Regression: Estimates equity alpha and systematic beta against market benchmark (^NSEI or ^GSPC).\n\nDeterministic Math: Computed via NumPy and SciPy; zero LLM hallucination.", (0, 196, 204)),
        ("02 - ABNORMAL RETURNS", "AR_it = R_it - (alpha + beta*R_mt)", "Event Window: e.g. [-5, +10] days around disclosure date (tau = 0).\n\nIsolates Alpha: Strips out broader market tide to isolate true event reaction.\n\nCumulative Abnormal Return (CAR): Sums daily abnormal returns across multi-day event window.", (16, 185, 129)),
        ("03 - STATISTICAL TESTS", "Patell Standardized & BMP t-Tests", "Patell Test: Standardizes abnormal returns by forecast standard error.\n\nBMP Test: Adjusts for event-induced variance changes across cohorts.\n\np-Value Rigor: Null hypothesis (H0: CAR = 0) rejected only at p < 0.05 threshold.", (255, 190, 92)),
    ]
    for i, (q_tag, q_title, q_desc, q_col) in enumerate(quant_list):
        x = 15 + i * 90
        pdf.set_fill_color(14, 21, 32)
        pdf.set_draw_color(30, 44, 61)
        pdf.rect(x, 45, 84, 125, "DF")

        pdf.set_xy(x + 5, 52)
        pdf.set_font("DejaVu", "B", 9)
        pdf.set_text_color(*q_col)
        pdf.cell(74, 5, q_tag, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 60)
        pdf.set_font("DejaVu", "B", 11)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(74, 6, q_title, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 72)
        pdf.set_font("DejaVu", "", 8.5)
        pdf.set_text_color(201, 209, 217)
        pdf.multi_cell(74, 4.8, q_desc)

    pdf.set_xy(15, 178)
    pdf.set_fill_color(15, 25, 38)
    pdf.set_draw_color(16, 185, 129)
    pdf.rect(15, 176, 267, 12, "DF")
    pdf.set_xy(17, 179)
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(263, 6, "ACADEMIC RIGOR: Built on Campbell, Lo, and MacKinlay (1997) standards—the gold standard of institutional quantitative finance.", align="C")

    # 9. TinyFish Web Recon
    draw_slide_header("08 - Web Agent Efficiency", "TinyFish Reconnaissance & Token Economy Matrix", "Transforming bloated 300KB+ raw HTML investor portals into clean, structured, low-token Markdown briefs.", 9)
    tf_list = [
        ("THE SCRAPING PROBLEM", "Raw HTML Waste", "Bloated Boilerplate: Modern corporate portals ship 300KB to 2MB of CSS, SVG sprites, tracking pixels, and ads.\n\nToken Exhaustion: Ingesting raw HTML into LLMs burns 50k to 100k tokens per page.\n\nExtreme API Costs: Uncleaned HTML burns dollar budgets and dilutes attention windows.", (239, 68, 68)),
        ("TINYFISH DOM PURIFIER", "Smart Cleaning Architecture", "Headless Chromium Fleet: Renders client-side dynamic JavaScript and extracts pure semantic document nodes.\n\nHeuristic Scoring: Strips navigation menus, footer disclosures, cookie consent popups, and scripts.\n\nStructure Preservation: Extracts financial tables, line items, and executive quotes.", (0, 196, 204)),
        ("88.5% TOKEN SAVINGS", "Measurable Economic Impact", "88.5% Compression: Compresses an 85,000-token HTML page down to ~1,200 verified semantic tokens.\n\nSub-Second Latency: Accelerates inference turnaround by 7x while preserving 100% of numbers.\n\nZero Hallucination: Downstream agents see only high-signal text grounded in verified URLs.", (16, 185, 129)),
    ]
    for i, (t_tag, t_title, t_desc, t_col) in enumerate(tf_list):
        x = 15 + i * 90
        pdf.set_fill_color(14, 21, 32)
        pdf.set_draw_color(30, 44, 61)
        pdf.rect(x, 45, 84, 125, "DF")

        pdf.set_xy(x + 5, 52)
        pdf.set_font("DejaVu", "B", 9)
        pdf.set_text_color(*t_col)
        pdf.cell(74, 5, t_tag, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 60)
        pdf.set_font("DejaVu", "B", 11)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(74, 6, t_title, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 72)
        pdf.set_font("DejaVu", "", 8.5)
        pdf.set_text_color(201, 209, 217)
        pdf.multi_cell(74, 4.8, t_desc)

    pdf.set_xy(15, 178)
    pdf.set_fill_color(15, 25, 38)
    pdf.set_draw_color(16, 185, 129)
    pdf.rect(15, 176, 267, 12, "DF")
    pdf.set_xy(17, 179)
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(263, 6, "SCALER BENCHMARK: TinyFish slashes token spend by 88.5%, making continuous real-time market crawling economically viable.", align="C")

    # 10. Multi-Country Coverage
    draw_slide_header("09 - Global Reach", "Global Sovereign Markets & Benchmark Coverage", "QuantIntel covers 14+ major global economies with localized exchanges, currencies, and trading calendars.", 10)
    c_list = [
        ("Pakistan (PSX)", "Benchmark: KSE-100 (^KSE) | PKR (Rs)\nSectors: Oil & Gas, Banking, Cement, Power\nAnchors: OGDC.KA, MCB.KA, LUCK.KA, ENGRO.KA", (16, 185, 129)),
        ("India (NSE/BSE)", "Benchmark: Nifty 50 (^NSEI) | INR (Rs)\nSectors: IT, Banking, Energy, Auto, Pharma\nAnchors: RELIANCE.NS, TCS.NS, HDFCBANK.NS", (0, 196, 204)),
        ("United States", "Benchmark: S&P 500 (^GSPC) | USD ($)\nSectors: AI/Semis, Cloud, Banking, Healthcare\nAnchors: NVDA, MSFT, AAPL, JPM, GOOGL", (10, 132, 255)),
        ("United Kingdom", "Benchmark: FTSE 100 (^FTSE) | GBP (PS)\nSectors: Energy, Pharma, Banking, Mining\nAnchors: SHEL.L, AZN.L, HSBA.L, BP.L", (255, 190, 92)),
        ("Saudi Arabia", "Benchmark: TASI (^TASI.SR) | SAR\nSectors: Oil & Gas, Islamic Banking, Petrochem\nAnchors: 2222.SR (Aramco), 1120.SR (Al Rajhi)", (16, 185, 129)),
        ("Japan (TSE)", "Benchmark: Nikkei 225 (^N225) | JPY (Y)\nSectors: Automotive, Robotics, Electronics\nAnchors: 7203.T (Toyota), 8035.T (Tokyo Electron)", (167, 139, 250)),
        ("Germany (XETRA)", "Benchmark: DAX 40 (^GDAXI) | EUR (E)\nSectors: Auto Engineering, Siemens, SAP\nAnchors: SAP.DE, SIE.DE, BMW.DE", (255, 255, 255)),
        ("China (SSE/SZSE)", "Benchmark: Shanghai (000001.SS) | CNY\nSectors: EV/Batteries, E-Commerce, Solar\nAnchors: BABA, Tencent, BYD, State Banks", (239, 68, 68)),
    ]
    for i, (name, desc, col) in enumerate(c_list):
        row = i // 4
        col_idx = i % 4
        x = 15 + col_idx * 68
        y = 45 + row * 62

        pdf.set_fill_color(14, 21, 32)
        pdf.set_draw_color(30, 44, 61)
        pdf.rect(x, y, 63, 56, "DF")

        pdf.set_xy(x + 4, y + 6)
        pdf.set_font("DejaVu", "B", 9.5)
        pdf.set_text_color(*col)
        pdf.cell(55, 5, name, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 4, y + 15)
        pdf.set_font("DejaVu", "", 8)
        pdf.set_text_color(201, 209, 217)
        pdf.multi_cell(55, 4.2, desc)

    pdf.set_xy(15, 178)
    pdf.set_fill_color(15, 25, 38)
    pdf.set_draw_color(0, 196, 204)
    pdf.rect(15, 176, 267, 12, "DF")
    pdf.set_xy(17, 179)
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(0, 196, 204)
    pdf.cell(263, 6, "GLOBAL COVERAGE: Also supports Canada (TSX), Australia (ASX), Singapore (SGX), Brazil (B3), South Korea (KRX), and UAE (ADX).", align="C")

    # 11. End-to-End Walkthrough
    draw_slide_header("10 - Concrete Walkthrough", "End-to-End Alpha Research Journey", "Tracing a live equity or sovereign query from search input to verified institutional dossier.", 11)
    st_list = [
        ("STAGE 1: SEARCH", "Entity & Country Input", "User enters ticker, sovereign query, or natural language (e.g. 'pakisant future in stock').", (0, 196, 204)),
        ("STAGE 2: RESOLUTION", "Fuzzy Auto-Routing", "Fuzzy resolver detects sovereign jurisdiction (PSX/NSE/NASDAQ), benchmarks, and currency.", (0, 196, 204)),
        ("STAGE 3: WEB CRAWL", "TinyFish Recon", "Chromium fleet crawls primary regulatory filings and news, stripping DOM clutter (-88.5%).", (10, 132, 255)),
        ("STAGE 4: MARKET FEEDS", "LSE Data 3.0 Pull", "Pulls real-time spot price, historical OHLCV, market index levels, and Options Chain with Greeks.", (10, 132, 255)),
        ("STAGE 5: QUANT SIM", "Monte Carlo & DCF", "Executes 2,000-path GBM simulations and 3-stage DCF valuation with deterministic math.", (16, 185, 129)),
        ("STAGE 6: ADVERSARIAL", "Bearish Stress-Test", "Adversarial agent red-teams assumptions, testing downside risks, inflation, and rate shocks.", (239, 68, 68)),
        ("STAGE 7: VERIFICATION", "Provenance Audit", "Verifier checks 100% of mathematical formulas and links claims to audited source URLs.", (167, 139, 250)),
        ("STAGE 8: DELIVERY", "Interactive Dossier", "Dashboard renders fan charts, options tape, and offers instant export to PDF and Markdown.", (255, 190, 92)),
    ]
    for i, (name, sub, desc, col) in enumerate(st_list):
        row = i // 4
        col_idx = i % 4
        x = 15 + col_idx * 68
        y = 45 + row * 62

        pdf.set_fill_color(14, 21, 32)
        pdf.set_draw_color(30, 44, 61)
        pdf.rect(x, y, 63, 56, "DF")

        pdf.set_xy(x + 4, y + 6)
        pdf.set_font("DejaVu", "B", 9)
        pdf.set_text_color(*col)
        pdf.cell(55, 5, name, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 4, y + 13)
        pdf.set_font("DejaVu", "B", 8.5)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(55, 5, sub, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 4, y + 21)
        pdf.set_font("DejaVu", "", 8)
        pdf.set_text_color(201, 209, 217)
        pdf.multi_cell(55, 4.2, desc)

    pdf.set_xy(15, 178)
    pdf.set_fill_color(15, 25, 38)
    pdf.set_draw_color(0, 196, 204)
    pdf.rect(15, 176, 267, 12, "DF")
    pdf.set_xy(17, 179)
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(0, 196, 204)
    pdf.cell(263, 6, "SEAMLESS PIPELINE: Eliminates days of disjointed analysis, delivering verified institutional dossiers in seconds.", align="C")

    # 12. Empirical Validation
    draw_slide_header("11 - Empirical Validation", "Empirical Validation Across Global Equities", "QuantIntel has been battle-tested against real live market data across major international equities.", 12)
    ev_list = [
        ("CASE 1: NVIDIA (NVDA)", "Hyperscale AI Hardware Cycle", "Trigger: Hyperscale data center capex surge & Blackwell GPU architecture rollout.\n\nLive Feeds: Spot $204.64 | Monte Carlo median path: $255.40 (+24.8% upside).\n\nLSE Options: Real-time IV smile and Greeks tape confirming heavy call open interest.\n\nAdversarial: Modeled export restriction risks and fab capacity bottlenecks.", (0, 196, 204)),
        ("CASE 2: RELIANCE (RELIANCE.NS)", "Conglomerate Expansion & Capex", "Trigger: Telecom ARPU expansion announcement & green hydrogen progress.\n\nLive Feeds: Spot Rs 1,348.60 | CLM Event Study CAR: +3.8% (p < 0.01).\n\nValuation: 3-Stage DCF under 11.2% WACC yielding fair value upside corridor.\n\nProvenance: All claims tied to audited BSE/NSE regulatory filings.", (16, 185, 129)),
        ("CASE 3: PAKISTAN OIL (OGDC.KA)", "Sovereign Debt Settlement", "Trigger: Economic Coordination Committee gas circular debt clearance.\n\nLive Feeds: KSE-100 benchmark surge to 88,000+ index level on PSX.\n\nCountry Intel: Categorized as POSITIVE for Energy sector & domestic liquidity.\n\nCLM Study: Abnormal return of +4.2% around ministerial gazette notification.", (255, 190, 92)),
    ]
    for i, (e_tag, e_title, e_desc, e_col) in enumerate(ev_list):
        x = 15 + i * 90
        pdf.set_fill_color(14, 21, 32)
        pdf.set_draw_color(30, 44, 61)
        pdf.rect(x, 45, 84, 125, "DF")

        pdf.set_xy(x + 5, 52)
        pdf.set_font("DejaVu", "B", 9)
        pdf.set_text_color(*e_col)
        pdf.cell(74, 5, e_tag, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 60)
        pdf.set_font("DejaVu", "B", 11)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(74, 6, e_title, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 72)
        pdf.set_font("DejaVu", "", 8.5)
        pdf.set_text_color(201, 209, 217)
        pdf.multi_cell(74, 4.8, e_desc)

    pdf.set_xy(15, 178)
    pdf.set_fill_color(15, 25, 38)
    pdf.set_draw_color(16, 185, 129)
    pdf.rect(15, 176, 267, 12, "DF")
    pdf.set_xy(17, 179)
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(16, 185, 129)
    pdf.cell(263, 6, "EMPIRICAL REALITY: Tested on real equities across Indian, US, UK, and Pakistani exchanges with 100% verified math.", align="C")

    # 13. Technical Architecture
    draw_slide_header("12 - Tech Stack & Architecture", "Dual-Surface Product Architecture & Stack", "Next.js 16 Web Terminal + Python FastAPI Backend + Streamlit Cockpit with 27/27 green automated tests.", 13)
    t_list = [
        ("WEB TERMINAL SURFACE", "Next.js 16 & Turbopack", "Next.js 16 App Router: Real-time server components, route handlers, and streaming UI.\n\nTailwind CSS Dark Theme: High-density Obsidian cyber-quant aesthetic (#070B10).\n\nRecharts & Lucide: Interactive Monte Carlo fan charts, sector heatmaps, and options tape.\n\n0 Compilation Errors: 100% clean TypeScript build with strict data contracts.", (0, 196, 204)),
        ("QUANT ENGINE BACKEND", "Python 3.14 & Numerical Stack", "FastAPI & Pydantic v2: Strict schema validation across all agent inputs, quotes, and dossiers.\n\nNumPy & SciPy: Deterministic OLS regressions, CAR accumulation, and statistical tests.\n\nLSE Data 3.0 & yfinance: Direct integration of official market data providers with caching.\n\n27/27 Tests Green: Comprehensive pytest suite covering all modules end-to-end.", (16, 185, 129)),
        ("MULTI-MODEL LLM ENGINE", "Swappable Intelligence Core", "Model Provider Agnostic: Native support for Google Gemini 3.5, Anthropic Claude, OpenAI, and Groq.\n\nDynamic API Keys Manager: Browser localStorage encryption with live connectivity tester.\n\nDeterministic Fallback: Runs calibrated quantitative models even in full offline environments.\n\nZero Vendor Lock-In: Clean provider interfaces allow instant switching of LLMs.", (167, 139, 250)),
    ]
    for i, (t_tag, t_title, t_desc, t_col) in enumerate(t_list):
        x = 15 + i * 90
        pdf.set_fill_color(14, 21, 32)
        pdf.set_draw_color(30, 44, 61)
        pdf.rect(x, 45, 84, 125, "DF")

        pdf.set_xy(x + 5, 52)
        pdf.set_font("DejaVu", "B", 9)
        pdf.set_text_color(*t_col)
        pdf.cell(74, 5, t_tag, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 60)
        pdf.set_font("DejaVu", "B", 11)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(74, 6, t_title, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 72)
        pdf.set_font("DejaVu", "", 8.5)
        pdf.set_text_color(201, 209, 217)
        pdf.multi_cell(74, 4.8, t_desc)

    pdf.set_xy(15, 178)
    pdf.set_fill_color(15, 25, 38)
    pdf.set_draw_color(0, 196, 204)
    pdf.rect(15, 176, 267, 12, "DF")
    pdf.set_xy(17, 179)
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(0, 196, 204)
    pdf.cell(263, 6, "PRODUCTION GRADE: Modern microservice architecture engineered for high throughput, test coverage, and modularity.", align="C")

    # 14. Responsible AI & Governance
    draw_slide_header("13 - Governance & Safety", "Responsible AI & Anti-Hallucination Framework", "Institutional-grade rigor and ethical safeguards embedded into every layer of QuantIntel.", 14)
    gov_list = [
        ("DETERMINISTIC BOUNDARIES", "Code Calculates, AI Synthesizes", "Strict Separation: LLMs are strictly forbidden from guessing numerical prices, CAR percentages, or VaR metrics.\n\nZero-Hallucination Math: All equations execute in deterministic Python/TypeScript code.\n\nSanity Checks: Target prices must mathematically reconcile with spot prices: ((Target/Spot)-1)*100.", (0, 196, 204)),
        ("CITATION PROVENANCE", "100% Source Traceability", "Mandatory Citation Links: Every synthesized catalyst and news disclosure displays original domain and URL.\n\nDual Timestamp Auditing: Displays both original article publication time and TinyFish retrieval time.\n\nUnconfirmed Rumor Shield: Rumors and speculation are prominently tagged with UNCONFIRMED badges.", (255, 190, 92)),
        ("COMPLIANCE & GOVERNANCE", "Institutional Guardrails", "Ethical Web Scraping: TinyFish respects robots.txt, source rate limits, and terms of service.\n\nClear Disclaimers: Identifies research assessments as empirical academic analysis, not guaranteed financial advice.\n\nAudited Forecast Ledger: Appends all simulated predictions to an immutable historical ledger.", (167, 139, 250)),
    ]
    for i, (g_tag, g_title, g_desc, g_col) in enumerate(gov_list):
        x = 15 + i * 90
        pdf.set_fill_color(14, 21, 32)
        pdf.set_draw_color(30, 44, 61)
        pdf.rect(x, 45, 84, 125, "DF")

        pdf.set_xy(x + 5, 52)
        pdf.set_font("DejaVu", "B", 9)
        pdf.set_text_color(*g_col)
        pdf.cell(74, 5, g_tag, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 60)
        pdf.set_font("DejaVu", "B", 11)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(74, 6, g_title, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 72)
        pdf.set_font("DejaVu", "", 8.5)
        pdf.set_text_color(201, 209, 217)
        pdf.multi_cell(74, 4.8, g_desc)

    pdf.set_xy(15, 178)
    pdf.set_fill_color(15, 25, 38)
    pdf.set_draw_color(167, 139, 250)
    pdf.rect(15, 176, 267, 12, "DF")
    pdf.set_xy(17, 179)
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(167, 139, 250)
    pdf.cell(263, 6, "GOVERNANCE STANDARD: Built for institutional compliance departments where provenance and auditability are non-negotiable.", align="C")

    # 15. Strategic Roadmap
    draw_slide_header("14 - Scaler Vision & Roadmap", "Commercialization Trajectory & Scaling Roadmap", "From autonomous prototype to enterprise-grade quantitative intelligence collective.", 15)
    r_list = [
        ("PHASE 1: LIVE (COMPLETED)", "Core Multi-Pillar Engine", "- FutureStock 8-Agent Collective with 2,000-path Monte Carlo & DCF.\n- Web Quant Studio CLM (1997) event studies on live market prices.\n- Country Intelligence with 14+ economies & 14-category AI news.\n- LSE Data 3.0 provider integration with real-time Options Chain & Greeks.\n- FutureStock-grade search engine with fuzzy country & typo tolerance.", (0, 196, 204)),
        ("PHASE 2: NEAR-TERM (Q1-Q2)", "Multi-Asset & Real-Time Feeds", "- Fixed Income & Credit: Modeling yield curve shifts and credit spreads.\n- Earnings Call Audio: Real-time speech-to-text tone detection.\n- WebSocket Price Streaming: Sub-second price tape updates via LSE Data.\n- Multi-Stock Cohort Studies: Run multi-company event studies across entire sectors simultaneously.", (16, 185, 129)),
        ("PHASE 3: ENTERPRISE (Q3-Q4)", "B2B FinTech Platform & API", "- QuantIntel Headless API: Institutional SDK for hedge funds and family offices.\n- Automated Portfolio Rebalancing: Connecting alpha signals to execution venues.\n- Enterprise SSO & Compliance: Granular audit logs and SOC 2 compliance.\n- Custom LLM Fine-Tuning: Domain-specialized financial reasoning models.", (167, 139, 250)),
    ]
    for i, (r_tag, r_title, r_desc, r_col) in enumerate(r_list):
        x = 15 + i * 90
        pdf.set_fill_color(14, 21, 32)
        pdf.set_draw_color(30, 44, 61)
        pdf.rect(x, 45, 84, 125, "DF")

        pdf.set_xy(x + 5, 52)
        pdf.set_font("DejaVu", "B", 9)
        pdf.set_text_color(*r_col)
        pdf.cell(74, 5, r_tag, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 60)
        pdf.set_font("DejaVu", "B", 11)
        pdf.set_text_color(255, 255, 255)
        pdf.cell(74, 6, r_title, new_x="LMARGIN", new_y="NEXT")

        pdf.set_xy(x + 5, 72)
        pdf.set_font("DejaVu", "", 8.5)
        pdf.set_text_color(201, 209, 217)
        pdf.multi_cell(74, 4.8, r_desc)

    pdf.set_xy(15, 178)
    pdf.set_fill_color(15, 25, 38)
    pdf.set_draw_color(0, 196, 204)
    pdf.rect(15, 176, 267, 12, "DF")
    pdf.set_xy(17, 179)
    pdf.set_font("DejaVu", "B", 9)
    pdf.set_text_color(0, 196, 204)
    pdf.cell(263, 6, "FINAL THOUGHT: QuantIntel bridges the chasm between messy live web disclosures, rigid market data, and mathematical alpha.", align="C")

    pdf_path = "/home/kali/QuantIntel/QuantIntel_Finale_Presentation.pdf"
    pdf.output(pdf_path)
    print(f"PDF saved successfully to: {pdf_path}")


if __name__ == "__main__":
    print("Generating QuantIntel 15-Slide Master Executive Presentation (.pptx)...")
    create_pptx()
    print("Generating QuantIntel 15-Slide Landscape PDF Presentation (.pdf)...")
    create_pdf()
    print("Done! Both PPTX and PDF generated successfully.")
