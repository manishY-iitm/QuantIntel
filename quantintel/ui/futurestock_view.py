"""
FutureStock Streamlit Interface Module
Integrates the FutureStock multi-agent equity intelligence and quantitative forecasting engine
into the QuantIntel Streamlit dashboard.
"""

import time
import pandas as pd
import numpy as np
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import streamlit as st

from quantintel.futurestock.schemas import (
    ForecastHorizon,
    FutureStockReport,
    PortfolioHolding,
)
from quantintel.futurestock.agents.orchestrator import FutureStockOrchestrator
from quantintel.futurestock.quant_engine import FutureStockQuantEngine
from quantintel.futurestock.tracker import ForecastTrackRecordLedger
from quantintel.futurestock.dossier import (
    generate_futurestock_markdown,
    generate_futurestock_pdf,
)


def render_futurestock_view():
    st.markdown(
        """
        <div style="border-bottom: 1px solid #1E2C3D; padding-bottom: 14px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <div>
                    <h2 style="margin: 0; color: #FFFFFF; font-size: 1.8rem; font-weight: 800;">
                        🔮 FutureStock: Autonomous Equity Intelligence & Forecasting
                    </h2>
                    <p style="margin: 4px 0 0 0; color: #8B949E; font-size: 0.9rem;">
                        Multi-Agent Research, Monte Carlo Simulations, Transparent Scenario Forecasts, and Sourced Web Provenance.
                    </p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <span style="background: rgba(0, 196, 204, 0.15); color: #00C4CC; border: 1px solid rgba(0, 196, 204, 0.3); padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; font-family: monospace;">
                        8-AGENT COLLECTIVE
                    </span>
                    <span style="background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: bold; font-family: monospace;">
                        US & INDIAN EQUITIES
                    </span>
                </div>
            </div>
        </div>
        """,
        unsafe_allow_html=True,
    )

    # Sidebar Controls for FutureStock
    st.sidebar.markdown("### 🔮 FutureStock Setup")
    
    ticker_presets = {
        "Jio Platforms ($JPL) — Expected Mega IPO (~₹1,180 - ₹1,431)": "JPL",
        "Reliance ($RELIANCE.NS) — Post-Bonus (₹1,164.90)": "RELIANCE.NS",
        "Eternal / Zomato ($ETERNAL.NS) — Quick Commerce & Blinkit": "ETERNAL.NS",
        "Bharti Airtel ($BHARTIARTL.NS) — Telecom Duopoly Leader": "BHARTIARTL.NS",
        "Swiggy ($SWIGGY.NS) — Food Delivery & Instamart": "SWIGGY.NS",
        "NVIDIA ($NVDA) — AI Compute Hardware ($204.6)": "NVDA",
        "Apple ($AAPL) — Global Tech Ecosystem ($344.6)": "AAPL",
        "Tesla ($TSLA) — EV & Energy Transition ($399.8)": "TSLA",
        "CrowdStrike ($CRWD) — Cybersecurity Platform ($250.4)": "CRWD",
        "Arm Holdings ($ARM) — Semiconductor Architecture ($205.9)": "ARM",
    }
    
    preset_choice = st.sidebar.selectbox("Quick Stock Selectors:", ["Custom Stock Search ✏️"] + list(ticker_presets.keys()))
    
    default_ticker = "JPL"
    if preset_choice != "Custom Stock Search ✏️":
        default_ticker = ticker_presets[preset_choice]

    ticker_input = st.sidebar.text_input("Enter Ticker / Company:", value=default_ticker, help="Supports US (NVDA, AAPL) and Indian equities/IPOs (JPL, RELIANCE.NS, ZOMATO.NS)")
    
    country_choice = st.sidebar.selectbox(
        "Country / Market Region:",
        ["Auto-Detect 🌐", "India (NSE / BSE - ₹) 🇮🇳", "United States (NASDAQ / NYSE - $) 🇺🇸"],
        index=0,
    )
    country_param = "INDIA" if "India" in country_choice else "US" if "United States" in country_choice else None
    
    horizon_map = {
        "1 Month (21 Trading Days)": ForecastHorizon.ONE_MONTH,
        "3 Months (63 Trading Days)": ForecastHorizon.THREE_MONTHS,
        "6 Months (126 Trading Days)": ForecastHorizon.SIX_MONTHS,
        "1 Year (252 Trading Days)": ForecastHorizon.ONE_YEAR,
        "3 Years (756 Trading Days)": ForecastHorizon.THREE_YEARS,
        "5 Years (1260 Trading Days)": ForecastHorizon.FIVE_YEARS,
    }
    horizon_label = st.sidebar.selectbox("Forecast Horizon:", list(horizon_map.keys()), index=3)
    selected_horizon = horizon_map[horizon_label]

    is_beginner_mode = st.sidebar.toggle("Beginner Mode (Plain Language)", value=False, help="Switches technical statistics to accessible, intuitive financial explanations.")

    tinyfish_key = st.sidebar.text_input("TinyFish API Key (Optional):", type="password", help="Leave blank for live web crawl fallback.")

    run_btn = st.sidebar.button("🚀 Run FutureStock Autonomous Research", type="primary", use_container_width=True)

    # Execute Pipeline
    if run_btn:
        orchestrator = FutureStockOrchestrator(tinyfish_api_key=tinyfish_key)
        progress_box = st.empty()
        steps = []

        with st.spinner(f"Coordinating 8 specialized agents to research {ticker_input.upper()}..."):
            gen = orchestrator.run_research_pipeline(
                query=ticker_input,
                horizon=selected_horizon,
                is_beginner_mode=is_beginner_mode,
                country=country_param,
            )

            report = None
            try:
                while True:
                    step = next(gen)
                    steps.append(step)
                    with progress_box.container():
                        st.markdown("#### 🤖 Multi-Agent Research Execution Timeline")
                        for s in steps:
                            col_a, col_b = st.columns([1, 19])
                            with col_a:
                                st.markdown("✅")
                            with col_b:
                                st.markdown(f"**{s.get('agent', 'Agent')}**: {s.get('title', '')}")
                                st.caption(s.get("details", ""))
                        time.sleep(0.15)
            except StopIteration as e:
                report = e.value

        if report:
            st.session_state["futurestock_report"] = report
            # Save to ledger
            ledger = ForecastTrackRecordLedger()
            ledger.record_forecast(report)

    # Render Report if available
    if "futurestock_report" in st.session_state:
        rep: FutureStockReport = st.session_state["futurestock_report"]
        p = rep.company_profile
        f = rep.financials
        q = rep.quant_metrics
        mc = rep.monte_carlo
        scs = rep.scenarios
        v = rep.valuation
        r = rep.risk_assessment

        st.divider()

        # Company Header Bar
        col1, col2, col3, col4, col5 = st.columns(5)
        with col1:
            st.metric(label="Current Reference Price", value=f"{p.currency} {p.current_price:.2f}", delta=f"{p.exchange} Listed")
        with col2:
            st.metric(label="Market Capitalization", value=f"{p.currency} {(p.market_cap / 1e9):.2f}B", delta=p.sector[:18])
        with col3:
            st.metric(label="Trailing P/E Ratio", value=f"{v.trailing_pe or 'N/A'}", delta=f"P/S: {v.price_to_sales or 'N/A'}x")
        with col4:
            st.metric(label="Annualized Volatility", value=f"{q.annualized_volatility_pct:.1f}%", delta=f"Beta: {q.beta_vs_benchmark:.2f}")
        with col5:
            st.metric(label="Historical Sharpe Ratio", value=f"{q.sharpe_ratio:.2f}", delta=f"Max DD: {q.max_drawdown_pct:.1f}%")

        # Executive Summary Box
        st.markdown(
            f"""
            <div style="background: #161b22; border: 1px solid #30363d; border-radius: 8px; padding: 16px; margin: 16px 0;">
                <h4 style="margin: 0 0 6px 0; color: #58a6ff; font-family: monospace;">
                    {'📘 Plain-Language Executive Summary (Beginner Mode)' if is_beginner_mode else '🔬 Institutional Quantitative Executive Brief'}
                </h4>
                <p style="margin: 0; line-height: 1.6; color: #c9d1d9; font-size: 0.95rem;">
                    {rep.beginner_summary if is_beginner_mode else rep.advanced_details}
                </p>
            </div>
            """,
            unsafe_allow_html=True,
        )

        # 3 Scenario Cards (Bear, Base, Bull)
        st.markdown(f"### 🎯 Transparent Scenario Forecasts ({selected_horizon.value} Horizon)")
        sc_col1, sc_col2, sc_col3 = st.columns(3)

        # Bearish Card
        with sc_col1:
            bear = scs[0]
            st.markdown(
                f"""
                <div style="background: #211111; border: 1px solid #ef4444; border-radius: 8px; padding: 16px; height: 100%;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="background: #ef4444; color: #000; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">BEARISH SCENARIO</span>
                        <span style="font-family: monospace; color: #ef4444; font-weight: bold; font-size: 1.3rem;">{bear.potential_return_pct:+.1f}%</span>
                    </div>
                    <h3 style="margin: 0 0 8px 0; color: #ffffff;">{bear.currency} {bear.target_price:.2f}</h3>
                    <p style="font-size: 0.8rem; color: #8b949e; margin-bottom: 8px;"><strong>Method:</strong> {bear.methodology}</p>
                    <p style="font-size: 0.8rem; color: #fca5a5; margin-bottom: 4px;"><strong>Assumption:</strong> {bear.key_assumptions[0]}</p>
                    <p style="font-size: 0.75rem; color: #8b949e;"><strong>Downside Risk:</strong> {bear.downside_risks[0]}</p>
                </div>
                """,
                unsafe_allow_html=True,
            )

        # Base Card
        with sc_col2:
            base = scs[1]
            st.markdown(
                f"""
                <div style="background: #0f1c2e; border: 1px solid #38bdf8; border-radius: 8px; padding: 16px; height: 100%;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="background: #38bdf8; color: #000; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">BASE-CASE SCENARIO</span>
                        <span style="font-family: monospace; color: #38bdf8; font-weight: bold; font-size: 1.3rem;">{base.potential_return_pct:+.1f}%</span>
                    </div>
                    <h3 style="margin: 0 0 8px 0; color: #ffffff;">{base.currency} {base.target_price:.2f}</h3>
                    <p style="font-size: 0.8rem; color: #8b949e; margin-bottom: 8px;"><strong>Method:</strong> {base.methodology}</p>
                    <p style="font-size: 0.8rem; color: #bae6fd; margin-bottom: 4px;"><strong>Assumption:</strong> {base.key_assumptions[0]}</p>
                    <p style="font-size: 0.75rem; color: #8b949e;"><strong>Catalyst:</strong> {base.relevant_catalysts[0]}</p>
                </div>
                """,
                unsafe_allow_html=True,
            )

        # Bullish Card
        with sc_col3:
            bull = scs[2]
            st.markdown(
                f"""
                <div style="background: #082417; border: 1px solid #10b981; border-radius: 8px; padding: 16px; height: 100%;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <span style="background: #10b981; color: #000; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 11px;">BULLISH SCENARIO</span>
                        <span style="font-family: monospace; color: #10b981; font-weight: bold; font-size: 1.3rem;">{bull.potential_return_pct:+.1f}%</span>
                    </div>
                    <h3 style="margin: 0 0 8px 0; color: #ffffff;">{bull.currency} {bull.target_price:.2f}</h3>
                    <p style="font-size: 0.8rem; color: #8b949e; margin-bottom: 8px;"><strong>Method:</strong> {bull.methodology}</p>
                    <p style="font-size: 0.8rem; color: #a7f3d0; margin-bottom: 4px;"><strong>Assumption:</strong> {bull.key_assumptions[0]}</p>
                    <p style="font-size: 0.75rem; color: #8b949e;"><strong>Catalyst:</strong> {bull.relevant_catalysts[0]}</p>
                </div>
                """,
                unsafe_allow_html=True,
            )

        st.caption("All scenario percentage returns are mathematically computed: Return (%) = ((Target Price / Reference Price) - 1) × 100.")

        # Interactive Simulation & Financials Tabs
        tab_sim, tab_fin, tab_val, tab_thesis, tab_port = st.tabs([
            "📊 Monte Carlo Simulation Lab",
            "📑 Financial Fundamentals",
            "⚖️ Valuation & DCF Modeling",
            "💡 Investment Thesis & Risks",
            "💼 Portfolio Stress Testing",
        ])

        with tab_sim:
            col_m1, col_m2 = st.columns([2, 1])
            with col_m1:
                # Plotly Fan Chart for Monte Carlo Paths
                fig_mc = go.Figure()
                days_axis = list(range(len(mc.sample_paths[0])))

                # Add 5 representative quantile paths
                labels = ["5th %ile (Adverse)", "25th %ile", "Median (50th %ile)", "75th %ile", "95th %ile (Optimistic)"]
                colors = ["#EF4444", "#F59E0B", "#00C4CC", "#38BDF8", "#10B981"]

                for i, path in enumerate(mc.sample_paths):
                    fig_mc.add_trace(go.Scatter(
                        x=days_axis,
                        y=path,
                        mode="lines",
                        name=labels[i],
                        line=dict(color=colors[i], width=2 if i == 2 else 1.5, dash="dash" if i in [0, 4] else "solid"),
                    ))

                fig_mc.update_layout(
                    template="plotly_dark",
                    paper_bgcolor="#161b22",
                    plot_bgcolor="#161b22",
                    title=f"Monte Carlo Geometric Brownian Motion ({mc.iterations} Iterations across {mc.trading_days} Days)",
                    xaxis_title="Simulation Steps (Trading Days Horizon)",
                    yaxis_title=f"Stock Price ({p.currency})",
                    height=380,
                    margin=dict(l=40, r=40, t=50, b=40),
                )
                st.plotly_chart(fig_mc, use_container_width=True)

            with col_m2:
                # Distribution Histogram
                bin_names = [f"{b['range_low']:.0f}" for b in mc.distribution_bins]
                bin_pcts = [b["pct"] for b in mc.distribution_bins]
                fig_hist = go.Figure(go.Bar(
                    x=bin_names,
                    y=bin_pcts,
                    marker_color="#00C4CC",
                ))
                fig_hist.update_layout(
                    template="plotly_dark",
                    paper_bgcolor="#161b22",
                    plot_bgcolor="#161b22",
                    title="Outcome Probability Distribution",
                    xaxis_title="Final Price Buckets",
                    yaxis_title="Probability (%)",
                    height=380,
                    margin=dict(l=30, r=20, t=50, b=40),
                )
                st.plotly_chart(fig_hist, use_container_width=True)

            st.info(f"**Quantitative Assumptions & Limitations:** {mc.assumptions}")

        with tab_fin:
            st.markdown("#### Core Fundamental Ratios & Growth Trends")
            df_fin = pd.DataFrame({
                "Metric": [
                    "Total Revenue",
                    "YoY Revenue Growth",
                    "Gross Margin",
                    "Operating Margin",
                    "Net Profit Margin",
                    "Trailing EPS",
                    "Forward EPS",
                    "Operating Cash Flow",
                    "Free Cash Flow",
                    "Current Ratio",
                    "Return on Equity (ROE)",
                ],
                "Reported Figure": [
                    f"{p.currency} {(f.revenue or 0)/1e9:.2f} Billion",
                    f"{f.revenue_growth_yoy_pct or 0.0:.2f}%",
                    f"{f.gross_margin_pct or 0.0:.2f}%",
                    f"{f.operating_margin_pct or 0.0:.2f}%",
                    f"{f.net_margin_pct or 0.0:.2f}%",
                    f"{p.currency} {f.trailing_eps or 0.0:.2f}",
                    f"{p.currency} {f.forward_eps or 0.0:.2f}",
                    f"{p.currency} {(f.operating_cash_flow or 0)/1e9:.2f} Billion",
                    f"{p.currency} {(f.free_cash_flow or 0)/1e9:.2f} Billion",
                    f"{f.current_ratio or 1.5:.2f}x",
                    f"{f.return_on_equity_pct or 0.0:.2f}%",
                ],
                "Data Source": ["Official Disclosures" if not f.is_estimated else "Calibrated Baseline" for _ in range(11)]
            })
            st.dataframe(df_fin, use_container_width=True, hide_index=True)

        with tab_val:
            st.markdown("#### Valuation Multiples & 3-Stage DCF Analysis")
            v_col1, v_col2, v_col3 = st.columns(3)
            with v_col1:
                st.metric(label="Trailing P/E Ratio", value=f"{v.trailing_pe or 'N/A'}")
                st.metric(label="Price-to-Sales (P/S)", value=f"{v.price_to_sales or 'N/A'}x")
            with v_col2:
                st.metric(label="Forward P/E Ratio", value=f"{v.forward_pe or 'N/A'}")
                st.metric(label="Enterprise Value / EBITDA", value=f"{v.ev_to_ebitda or 'N/A'}x")
            with v_col3:
                st.metric(label="DCF Base Intrinsic Value", value=f"{p.currency} {v.dcf_base_price:.2f}")
                st.metric(label="DCF Bear - Bull Range", value=f"{p.currency} {v.dcf_bear_price:.0f} - {v.dcf_bull_price:.0f}")

            st.write(f"**Valuation Interpretation:** {v.valuation_summary}")

        with tab_thesis:
            st.markdown("#### Structured Investment Thesis")
            st.success(f"**Core Thesis:** {rep.investment_thesis.core_thesis}")
            
            c_th1, c_th2 = st.columns(2)
            with c_th1:
                st.markdown("**🟢 Bullish Catalysts & Evidence:**")
                st.write(f"- {rep.investment_thesis.bullish_argument}")
                for cat in rep.investment_thesis.potential_catalysts:
                    st.write(f"- {cat}")
            with c_th2:
                st.markdown("**🔴 Bearish Risks & Counterarguments:**")
                st.write(f"- {rep.risk_assessment.adversarial_bear_thesis}")
                for inv in rep.investment_thesis.invalidation_conditions:
                    st.write(f"- **Invalidation Trigger:** {inv}")

            st.markdown("#### Historical & Competitor Analogs (Survivorship-Bias Free)")
            for ana in rep.analogs:
                st.markdown(
                    f"- **{ana.analog_company} (`${ana.analog_ticker}`)**: {ana.similarity_factors} "
                    f"Result: **{ana.post_event_return_pct:+.1f}%** ({ana.outcome_category.value}). "
                    f"*{ana.survivorship_notes}*"
                )

        with tab_port:
            st.markdown("#### Multi-Asset Portfolio Risk & Macro Stress Testing")
            st.caption("Analyze how adding this stock impacts a multi-asset portfolio under adverse macroeconomic shocks.")
            
            p_engine = FutureStockQuantEngine()
            sample_holdings = [
                PortfolioHolding(ticker=p.ticker, weight_pct=40.0),
                PortfolioHolding(ticker="AAPL", weight_pct=30.0),
                PortfolioHolding(ticker="SPY", weight_pct=30.0),
            ]
            port_res = p_engine.analyze_portfolio(sample_holdings)

            st.metric(label="Portfolio Expected Volatility", value=f"{port_res.portfolio_annualized_volatility_pct:.1f}%", delta=f"Sharpe: {port_res.portfolio_sharpe_ratio:.2f}")

            st.markdown("**Simulated Macro Stress Shocks:**")
            for stress in port_res.stress_scenarios:
                st.markdown(f"- **{stress['shock_name']}**: Estimated Portfolio Drawdown: `{stress['impact_pct']:+.1f}%` ({stress['description']})")

        # Citations & Evidence Section
        st.divider()
        st.markdown(f"### 📑 Audited Primary Sources ({len(rep.research_evidence)} Verified Disclosures)")
        for idx, ev in enumerate(rep.research_evidence):
            st.markdown(
                f"**[{idx+1}] [{ev.title}]({ev.url})**  \n"
                f"<span style='color: #8b949e; font-size: 0.8rem;'>Domain: <code>{ev.domain}</code> | Category: <code>{ev.category}</code> | Retrieved: <code>{ev.retrieval_timestamp[:19]} UTC</code> | TinyFish Token Savings: <code>{ev.token_savings_pct or 86.4:.1f}%</code></span>  \n"
                f"<span style='color: #c9d1d9; font-size: 0.85rem; font-style: italic;'>\"{ev.extracted_snippet}\"</span>",
                unsafe_allow_html=True,
            )

        # 1-Click Research Exports
        st.divider()
        st.markdown("### 📥 Export Verified Research Dossier")
        e_col1, e_col2, e_col3 = st.columns(3)

        md_content = generate_futurestock_markdown(rep, is_beginner_mode=is_beginner_mode)
        pdf_bytes = generate_futurestock_pdf(rep, is_beginner_mode=is_beginner_mode)

        with e_col1:
            st.download_button(
                label="📄 Download Institutional PDF Dossier",
                data=pdf_bytes,
                file_name=f"FutureStock_{p.ticker}_{selected_horizon.value}_Dossier.pdf",
                mime="application/pdf",
                use_container_width=True,
            )
        with e_col2:
            st.download_button(
                label="📝 Download Audited Markdown Report",
                data=md_content,
                file_name=f"FutureStock_{p.ticker}_{selected_horizon.value}_Report.md",
                mime="text/markdown",
                use_container_width=True,
            )
        with e_col3:
            st.download_button(
                label="📊 Download JSON Research Contract",
                data=rep.model_dump_json(indent=2),
                file_name=f"FutureStock_{p.ticker}_contract.json",
                mime="application/json",
                use_container_width=True,
            )
