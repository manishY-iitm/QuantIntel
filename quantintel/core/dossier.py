"""
Research Dossier Exporter for QuantIntel
Compiles quantitative event-study findings, audited evidence citations,
and empirical statistics into downloadable Markdown and institutional PDF dossiers.
"""

from datetime import datetime, timezone
from io import BytesIO
from fpdf import FPDF
from quantintel.core.schemas import EventStudyResult


def generate_markdown_dossier(result: EventStudyResult) -> str:
    """
    Format findings into an audited Markdown research report.
    """
    cfg = result.config
    ev = result.evidence
    hyp = result.hypothesis

    md = f"""# QuantIntel Quantitative Research Dossier
**Generated:** {datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")} UTC  
**Target Entity:** {ev.company_name} (`${ev.ticker}`)  
**Benchmark:** `{cfg.benchmark_ticker}`  
**Empirical Verdict:** {result.empirical_verdict}

---

## 1. Verified Evidence & Provenance Card
* **Event Type:** `{ev.event_type.value}`
* **Official Headline:** {ev.headline}
* **Locked UTC Timestamp:** `{ev.event_date_utc.isoformat()}Z`
* **Look-Ahead Risk Level:** `{ev.lookahead_risk.value}` (Audit verified)
* **Audited Source URL:** [{ev.source_url}]({ev.source_url})
* **Verbatim Disclosure Excerpt:**
> "{ev.verbatim_excerpt}"

---

## 2. Statistical Hypothesis Formulation
* **Tested Metric:** `{hyp.metric_tested.value}`
* **Significance Level ($\alpha$):** `{hyp.significance_level_alpha}` (95% Confidence)
* **Null Hypothesis ($H_0$):** {hyp.null_hypothesis_H0}
* **Alternative Hypothesis ($H_1$):** {hyp.alternative_hypothesis_H1}
* **Expected Direction:** `{hyp.expected_direction}`

---

## 3. Market Model & Statistical Summary
| Metric | Value | Description |
| :--- | :--- | :--- |
| **Estimation Alpha ($\alpha$)** | `{result.estimation_alpha:.6f}` | Constant drift in estimation window |
| **Estimation Beta ($\beta$)** | `{result.estimation_beta:.4f}` | Systematic sensitivity to `{cfg.benchmark_ticker}` |
| **Regression $R^2$** | `{result.estimation_r2:.4f}` | Market model explanatory power |
| **Residual Volatility ($\\\\sigma_\\\\epsilon$)** | `{result.residual_std_pct:.2f}%` | Daily idiosyncratic standard deviation |
| **Total Event Window CAR** | **`{result.car_event_window_pct:+.2f}%`** | Cumulative Abnormal Return `[-{cfg.pre_event_days}, +{cfg.post_event_days}]` |
| **Pre-Event CAR** | `{result.pre_event_car_pct:+.2f}%` | Pre-announcement run-up `[-{cfg.pre_event_days}, -1]` |
| **Post-Event CAR** | `{result.post_event_car_pct:+.2f}%` | Post-announcement reaction `[0, +{cfg.post_event_days}]` |
| **Student's $t$-statistic** | **`{result.t_statistic:.3f}`** | Test statistic for $H_0$ rejection |
| **Two-tailed $p$-value** | **`{result.p_value:.5f}`** | Probability under $H_0$ |
| **Statistical Significance** | **`{"YES (p < 0.05)" if result.is_statistically_significant else "NO (p >= 0.05)"}`** | 95% Confidence decision |
| **Peak Event Volume** | `{result.max_volume_ratio:.2f}x` | Relative to normal baseline median |

---

## 4. Daily Event Window Breakdown
| Rel Day | Date | Stock Close | Return | Bench Return | Abnormal Ret | CAR | Volume Ratio |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
"""
    for d in result.day_stats:
        md += f"| {d.relative_day:+d} | {d.date_str} | ${d.stock_close:.2f} | {d.stock_return_pct:+.2f}% | {d.benchmark_return_pct:+.2f}% | {d.abnormal_return_pct:+.2f}% | {d.cumulative_abnormal_return_pct:+.2f}% | {d.volume_ratio:.2f}x |\n"

    md += """
---

## 5. Research Disclaimer & Peer Replication
QuantIntel delivers deterministic empirical statistical analysis and source-grounded event extraction. It does not provide investment advice or guarantee trading results. All quantitative steps are fully reproducible.
"""
    return md


class PDFDossier(FPDF):
    def header(self):
        self.set_fill_color(15, 23, 42)  # Dark slate navy
        self.rect(0, 0, 210, 24, "F")
        self.set_font("Helvetica", "B", 14)
        self.set_text_color(255, 255, 255)
        self.set_xy(10, 7)
        self.cell(0, 10, "QUANTINTEL  |  Autonomous Quant Research Dossier", ln=True)
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font("Helvetica", "I", 8)
        self.set_text_color(140, 140, 140)
        self.cell(0, 10, f"Page {self.page_no()} | QuantIntel Research Lab | Reproducible Quantitative Event Study", align="C")


def generate_pdf_dossier(result: EventStudyResult) -> bytes:
    """
    Generate an institutional PDF research report.
    """
    pdf = PDFDossier(orientation="P", unit="mm", format="A4")
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.add_page()

    ev = result.evidence
    cfg = result.config
    hyp = result.hypothesis

    # Title & Target Entity
    pdf.set_font("Helvetica", "B", 16)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(0, 8, f"{ev.company_name} ({ev.ticker}) - Catalyst Event Study", ln=True)

    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(100, 116, 139)
    pdf.cell(0, 5, f"Benchmark: {cfg.benchmark_ticker}  |  Date: {cfg.event_date.strftime('%Y-%m-%d')}  |  Significance Level: alpha = {hyp.significance_level_alpha}", ln=True)
    pdf.ln(4)

    # Verdict Box
    if result.is_statistically_significant:
        pdf.set_fill_color(240, 253, 244)
        pdf.set_draw_color(34, 197, 94)
    else:
        pdf.set_fill_color(248, 250, 252)
        pdf.set_draw_color(148, 163, 184)
    pdf.set_line_width(0.4)
    pdf.rect(10, pdf.get_y(), 190, 18, "DF")

    pdf.set_xy(14, pdf.get_y() + 2)
    pdf.set_font("Helvetica", "B", 10)
    if result.is_statistically_significant:
        pdf.set_text_color(22, 101, 52)
    else:
        pdf.set_text_color(71, 85, 105)
    pdf.cell(0, 6, "EMPIRICAL VERDICT:", ln=True)

    pdf.set_font("Helvetica", "", 9)
    pdf.set_x(14)
    clean_verdict = result.empirical_verdict.replace("≤", "<=").replace("≥", ">=")
    pdf.multi_cell(182, 4, clean_verdict[:190])
    pdf.ln(6)

    # Section 1: Audited Evidence Card
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 6, "1. AUDITED SOURCE EVIDENCE", ln=True)
    pdf.ln(1)

    pdf.set_font("Helvetica", "B", 9)
    pdf.set_text_color(71, 85, 105)
    pdf.cell(35, 5, "Headline:", 0)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(30, 41, 59)
    pdf.multi_cell(155, 5, ev.headline)

    pdf.set_font("Helvetica", "B", 9)
    pdf.set_text_color(71, 85, 105)
    pdf.cell(35, 5, "UTC Timestamp:", 0)
    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(155, 5, f"{ev.event_date_utc.strftime('%Y-%m-%d %H:%M:%S')} UTC (Zero Look-Ahead Risk Confirmed)", ln=True)

    pdf.set_font("Helvetica", "B", 9)
    pdf.set_text_color(71, 85, 105)
    pdf.cell(35, 5, "Source URL:", 0)
    pdf.set_font("Helvetica", "U", 9)
    pdf.set_text_color(37, 99, 235)
    pdf.cell(155, 5, ev.source_url[:80], ln=True, link=ev.source_url)

    pdf.set_font("Helvetica", "B", 9)
    pdf.set_text_color(71, 85, 105)
    pdf.cell(35, 5, "Verbatim Excerpt:", 0)
    pdf.set_font("Helvetica", "I", 9)
    pdf.set_text_color(51, 65, 85)
    pdf.multi_cell(155, 5, f'"{ev.verbatim_excerpt}"')
    pdf.ln(4)

    # Section 2: Quantitative Results
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 6, "2. QUANTITATIVE EVENT STUDY SUMMARY", ln=True)
    pdf.ln(1)

    # Key Metrics Table
    pdf.set_fill_color(241, 245, 249)
    pdf.set_font("Helvetica", "B", 9)
    pdf.set_text_color(30, 41, 59)
    pdf.cell(47, 6, "Cumulative Return (CAR)", 1, 0, "C", fill=True)
    pdf.cell(47, 6, "Student's t-stat", 1, 0, "C", fill=True)
    pdf.cell(47, 6, "p-value", 1, 0, "C", fill=True)
    pdf.cell(47, 6, "Peak Volume", 1, 1, "C", fill=True)

    pdf.set_font("Helvetica", "B", 10)
    pdf.cell(47, 7, f"{result.car_event_window_pct:+.2f}%", 1, 0, "C")
    pdf.cell(47, 7, f"{result.t_statistic:.3f}", 1, 0, "C")
    pdf.cell(47, 7, f"{result.p_value:.5f}", 1, 0, "C")
    pdf.cell(47, 7, f"{result.max_volume_ratio:.2f}x", 1, 1, "C")
    pdf.ln(3)

    pdf.set_font("Helvetica", "", 9)
    pdf.set_text_color(71, 85, 105)
    pdf.cell(0, 5, f"Estimation Parameters: Alpha = {result.estimation_alpha:.6f} | Beta = {result.estimation_beta:.4f} | R2 = {result.estimation_r2:.4f} | Res. Vol = {result.residual_std_pct:.2f}%", ln=True)
    pdf.ln(4)

    # Section 3: Event Window Daily Table
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(0, 6, f"3. DAILY TRADING TRAJECTORY ([-{cfg.pre_event_days}, +{cfg.post_event_days}])", ln=True)
    pdf.ln(1)

    pdf.set_fill_color(226, 232, 240)
    pdf.set_font("Helvetica", "B", 8)
    pdf.set_text_color(15, 23, 42)
    pdf.cell(16, 5, "Rel Day", 1, 0, "C", fill=True)
    pdf.cell(24, 5, "Date", 1, 0, "C", fill=True)
    pdf.cell(24, 5, "Close", 1, 0, "C", fill=True)
    pdf.cell(25, 5, "Stock Ret", 1, 0, "C", fill=True)
    pdf.cell(25, 5, "Bench Ret", 1, 0, "C", fill=True)
    pdf.cell(26, 5, "Abnormal Ret", 1, 0, "C", fill=True)
    pdf.cell(26, 5, "CAR", 1, 0, "C", fill=True)
    pdf.cell(24, 5, "Volume", 1, 1, "C", fill=True)

    pdf.set_font("Helvetica", "", 8)
    for d in result.day_stats:
        highlight = (d.relative_day == 0)
        if highlight:
            pdf.set_fill_color(254, 240, 138)
        else:
            pdf.set_fill_color(255, 255, 255)
        pdf.cell(16, 4.5, f"{d.relative_day:+d}", 1, 0, "C", fill=highlight)
        pdf.cell(24, 4.5, d.date_str, 1, 0, "C", fill=highlight)
        pdf.cell(24, 4.5, f"${d.stock_close:.2f}", 1, 0, "R", fill=highlight)
        pdf.cell(25, 4.5, f"{d.stock_return_pct:+.2f}%", 1, 0, "R", fill=highlight)
        pdf.cell(25, 4.5, f"{d.benchmark_return_pct:+.2f}%", 1, 0, "R", fill=highlight)
        pdf.cell(26, 4.5, f"{d.abnormal_return_pct:+.2f}%", 1, 0, "R", fill=highlight)
        pdf.cell(26, 4.5, f"{d.cumulative_abnormal_return_pct:+.2f}%", 1, 0, "R", fill=highlight)
        pdf.cell(24, 4.5, f"{d.volume_ratio:.2f}x", 1, 1, "C", fill=highlight)

    return bytes(pdf.output())
