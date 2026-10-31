"""
QuantIntel Web Application
Interactive Streamlit Dashboard pairing TinyFish Live-Web Agents with Deterministic Python Event Studies.
"""

import sys
from pathlib import Path

# Add project root to path
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import time
import pandas as pd
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import streamlit as st

from quantintel.config import (
    TINYFISH_API_KEY,
    BENCHMARK_SECTOR_MAP,
    DEFAULT_ESTIMATION_WINDOW,
    DEFAULT_PRE_EVENT_DAYS,
    DEFAULT_POST_EVENT_DAYS,
)
from quantintel.presets.data import PRESET_CASES, get_preset_by_id
from quantintel.core.agent import QuantAgent
from quantintel.core.dossier import generate_markdown_dossier, generate_pdf_dossier
from quantintel.ui.futurestock_view import render_futurestock_view


# Configure Streamlit Page
st.set_page_config(
    page_title="QuantIntel | Autonomous Agentic Quant Lab",
    page_icon="📈",
    layout="wide",
    initial_sidebar_state="expanded",
)

# Custom High-End Quant Lab CSS
st.markdown(
    """
    <style>
    /* Dark Theme Customization */
    .stApp {
        background-color: #0d1117;
        color: #e6edf3;
    }
    
    /* Headers & Text */
    h1, h2, h3, h4, h5 {
        color: #f0f6fc;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        font-weight: 700;
    }
    
    /* Neon & Accent Colors */
    .accent-cyan {
        color: #00C4CC;
    }
    .accent-green {
        color: #10B981;
    }
    .accent-amber {
        color: #F59E0B;
    }
    
    /* Metric Cards */
    div[data-testid="stMetricValue"] {
        font-size: 1.8rem;
        font-weight: 700;
        color: #58a6ff;
    }
    
    /* Evidence & Card Containers */
    .quant-card {
        background: #161b22;
        border: 1px solid #30363d;
        border-radius: 8px;
        padding: 16px;
        margin-bottom: 14px;
    }
    
    .verbatim-box {
        background: #090d13;
        border-left: 4px solid #00C4CC;
        padding: 12px 16px;
        border-radius: 4px;
        font-style: italic;
        color: #c9d1d9;
        margin: 10px 0;
    }

    .verdict-box-pass {
        background: #062b19;
        border: 1px solid #10b981;
        border-radius: 8px;
        padding: 16px;
        margin: 14px 0;
        color: #d1fae5;
    }

    .verdict-box-fail {
        background: #211c10;
        border: 1px solid #f59e0b;
        border-radius: 8px;
        padding: 16px;
        margin: 14px 0;
        color: #fef3c7;
    }

    .step-badge {
        display: inline-block;
        padding: 3px 8px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        background: #238636;
        color: #ffffff;
        margin-right: 8px;
    }
    </style>
    """,
    unsafe_allow_html=True,
)


def render_header():
    col1, col2 = st.columns([3, 1])
    with col1:
        st.markdown(
            """
            # 📈 QuantIntel: Autonomous Agentic Quant Lab
            **Turn unstructured live-web corporate disclosures into source-grounded, statistically validated quantitative hypotheses.**
            """
        )
    with col2:
        st.markdown(
            """
            <div style="text-align: right; padding-top: 10px;">
                <span style="background: #00C4CC; color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">Deterministic Quant Engine</span><br>
                <span style="background: #10B981; color: #000; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-size: 12px; margin-top: 4px; display: inline-block;">Institutional Suite</span>
            </div>
            """,
            unsafe_allow_html=True,
        )
    st.divider()


def render_sidebar():
    st.sidebar.markdown("### ⚙️ Research Console")

    preset_titles = [f"{c['title']} ({c['badge']})" for c in PRESET_CASES]
    preset_titles.append("Custom Natural Language Query ✏️")

    selected_option = st.sidebar.selectbox("Select Catalyst Scenario:", preset_titles, index=0)

    if selected_option != "Custom Natural Language Query ✏️":
        preset_idx = preset_titles.index(selected_option)
        preset = PRESET_CASES[preset_idx]
        default_query = preset["query_example"]
        default_ticker = preset["ticker"]
        default_bench = preset["benchmark_ticker"]
        default_date = preset["event_date"]
    else:
        preset = None
        default_query = "Analyze FDA approval decision for Biogen (BIIB) on 2023-06-09 and measure abnormal returns."
        default_ticker = "BIIB"
        default_bench = "XBI"
        default_date = pd.to_datetime("2023-06-09").date()

    st.sidebar.markdown("#### 🔍 Analyst Research Query")
    query_input = st.sidebar.text_area("Prompt / Hypothesis Target:", value=default_query, height=90)

    st.sidebar.markdown("#### 📐 Event Study Parameters")
    benchmark_list = ["SPY", "XBI", "XLK", "QQQ", "XLE", "XLF"]
    bench_index = benchmark_list.index(default_bench) if default_bench in benchmark_list else 0
    benchmark_ticker = st.sidebar.selectbox("Benchmark Proxy ETF:", benchmark_list, index=bench_index)

    estimation_window = st.sidebar.slider(
        "Estimation Window (Days for OLS Beta):", min_value=30, max_value=180, value=DEFAULT_ESTIMATION_WINDOW, step=15
    )

    col_w1, col_w2 = st.sidebar.columns(2)
    with col_w1:
        pre_event_days = st.slider("Pre-Event Days:", min_value=1, max_value=15, value=DEFAULT_PRE_EVENT_DAYS)
    with col_w2:
        post_event_days = st.slider("Post-Event Days:", min_value=1, max_value=25, value=DEFAULT_POST_EVENT_DAYS)

    st.sidebar.markdown("#### 🔑 TinyFish API Credentials")
    tinyfish_key = st.sidebar.text_input(
        "TinyFish API Key (Optional):",
        value=TINYFISH_API_KEY,
        type="password",
        help="Leave blank to use live web fetch fallback or autonomous simulation engine.",
    )

    return {
        "query": query_input,
        "benchmark": benchmark_ticker,
        "estimation_window": estimation_window,
        "pre_event_days": pre_event_days,
        "post_event_days": post_event_days,
        "tinyfish_key": tinyfish_key,
        "preset": preset,
    }


def render_agent_live_trace(trace_placeholder, steps):
    with trace_placeholder.container():
        st.markdown("### 🤖 Live TinyFish Agent Reconnaissance & Execution Trace")
        for s in steps:
            col_icon, col_content = st.columns([1, 19])
            with col_icon:
                st.markdown("✅")
            with col_content:
                st.markdown(f"**{s.title}**")
                st.markdown(f"<span style='color: #8b949e; font-size: 0.9rem;'>{s.details}</span>", unsafe_allow_html=True)
                if s.token_savings_pct:
                    st.markdown(
                        f"<span style='background: #238636; color: #fff; padding: 2px 6px; border-radius: 4px; font-size: 11px;'>TinyFish DOM Compression: {s.token_savings_pct}% Context Window Tokens Saved</span>",
                        unsafe_allow_html=True,
                    )
                if s.source_url:
                    st.markdown(
                        f"🔗 *Source:* [`{s.source_url}`]({s.source_url})",
                        unsafe_allow_html=True,
                    )
            st.write("")


def render_evidence_and_hypothesis(res):
    ev = res.evidence
    hyp = res.hypothesis
    cfg = res.config

    col1, col2 = st.columns(2)

    with col1:
        st.markdown(
            f"""
            <div class="quant-card">
                <h4>📑 Verified Pydantic Evidence Card</h4>
                <p><strong>Target Entity:</strong> {ev.company_name} (<code>${ev.ticker}</code>)</p>
                <p><strong>Event Classification:</strong> <code>{ev.event_type.value}</code></p>
                <p><strong>Locked UTC Timestamp:</strong> <code>{ev.event_date_utc.strftime('%Y-%m-%d %H:%M:%S')}Z</code> 
                   <span style="background: #1f6feb; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">Zero Look-Ahead Verified</span>
                </p>
                <p><strong>Audited Source URL:</strong> <a href="{ev.source_url}" target="_blank" style="color: #58a6ff;">{ev.source_url[:65]}... ↗</a></p>
                <div class="verbatim-box">
                    "{ev.verbatim_excerpt}"
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

    with col2:
        st.markdown(
            f"""
            <div class="quant-card">
                <h4>📐 Falsifiable Hypothesis Contract</h4>
                <p><strong>Tested Metric:</strong> <code>{hyp.metric_tested.value}</code> | <strong>Expected Direction:</strong> <code>{hyp.expected_direction}</code></p>
                <p><strong>Significance Level:</strong> &alpha; = <code>{hyp.significance_level_alpha}</code> (95% Confidence Interval)</p>
                <div style="background: #0d1117; padding: 10px; border-radius: 4px; border-left: 3px solid #F59E0B; margin-bottom: 8px;">
                    <strong>H<sub>0</sub> (Null Hypothesis):</strong><br>
                    <span style="color: #c9d1d9; font-size: 0.9rem;">{hyp.null_hypothesis_H0}</span>
                </div>
                <div style="background: #0d1117; padding: 10px; border-radius: 4px; border-left: 3px solid #10B981;">
                    <strong>H<sub>1</sub> (Alternative Hypothesis):</strong><br>
                    <span style="color: #c9d1d9; font-size: 0.9rem;">{hyp.alternative_hypothesis_H1}</span>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )


def render_metric_cards(res):
    st.markdown("### 📊 Empirical Quantitative Findings")
    m1, m2, m3, m4, m5 = st.columns(5)

    with m1:
        st.metric(
            label="Cumulative Abnormal Return",
            value=f"{res.car_event_window_pct:+.2f}%",
            delta=f"Pre: {res.pre_event_car_pct:+.2f}% | Post: {res.post_event_car_pct:+.2f}%",
            delta_color="normal" if res.car_event_window_pct >= 0 else "inverse",
        )
    with m2:
        st.metric(
            label="Student's t-statistic",
            value=f"{res.t_statistic:.3f}",
            delta=f"p = {res.p_value:.4f}",
            delta_color="off",
        )
    with m3:
        status_label = "REJECT H0 (Sig)" if res.is_statistically_significant else "FAIL TO REJECT"
        st.metric(
            label="Statistical Significance",
            value=status_label,
            delta="95% Confidence",
            delta_color="normal" if res.is_statistically_significant else "inverse",
        )
    with m4:
        st.metric(
            label="Market Beta (vs Benchmark)",
            value=f"{res.estimation_beta:.2f}",
            delta=f"Alpha: {res.estimation_alpha:.5f}",
            delta_color="off",
        )
    with m5:
        st.metric(
            label="Peak Volume Spike",
            value=f"{res.max_volume_ratio:.2f}x",
            delta=f"Avg: {res.avg_event_volume_ratio:.2f}x",
            delta_color="normal" if res.max_volume_ratio > 1.5 else "off",
        )


def render_charts(res):
    df_days = pd.DataFrame([d.model_dump() for d in res.day_stats])

    tab1, tab2, tab3 = st.tabs([
        "📈 Cumulative Abnormal Return (CAR) & 95% CI",
        "⚖️ Stock vs Benchmark Relative Price",
        "📊 Volume Anomaly Multiplier",
    ])

    with tab1:
        fig_car = go.Figure()

        # 95% Confidence Interval Band
        fig_car.add_trace(go.Scatter(
            x=df_days["relative_day"],
            y=df_days["ci_upper_pct"],
            mode="lines",
            line=dict(width=0),
            showlegend=False,
            hoverinfo="skip",
        ))
        fig_car.add_trace(go.Scatter(
            x=df_days["relative_day"],
            y=df_days["ci_lower_pct"],
            mode="lines",
            line=dict(width=0),
            fill="tonexty",
            fillcolor="rgba(0, 196, 204, 0.15)",
            name="95% Confidence Band",
            hoverinfo="skip",
        ))

        # Main CAR line
        fig_car.add_trace(go.Scatter(
            x=df_days["relative_day"],
            y=df_days["cumulative_abnormal_return_pct"],
            mode="lines+markers",
            name="Cumulative Abnormal Return (CAR %)",
            line=dict(color="#00C4CC", width=3),
            marker=dict(size=7, color="#00C4CC"),
            hovertemplate="Day %{x}: <b>%{y:+.2f}%</b><extra></extra>",
        ))

        # Catalyst Day vertical marker
        fig_car.add_vline(
            x=0, line_dash="dash", line_color="#FFBE5C", line_width=2,
            annotation_text="Catalyst Event (t=0)", annotation_position="top right"
        )
        fig_car.add_hline(y=0, line_color="#30363d", line_width=1)

        fig_car.update_layout(
            template="plotly_dark",
            paper_bgcolor="#161b22",
            plot_bgcolor="#161b22",
            title=f"Cumulative Abnormal Return (CAR) Horizon for ${res.evidence.ticker} vs {res.config.benchmark_ticker}",
            xaxis_title="Relative Trading Day (t=0 is Disclosure)",
            yaxis_title="Cumulative Abnormal Return (%)",
            hovermode="x unified",
            height=440,
            margin=dict(l=40, r=40, t=50, b=40),
        )
        st.plotly_chart(fig_car, use_container_width=True)

    with tab2:
        # Normalized price comparison
        norm_stock = (df_days["stock_close"] / df_days["stock_close"].iloc[0]) * 100
        norm_bench = (df_days["benchmark_close"] / df_days["benchmark_close"].iloc[0]) * 100

        fig_price = go.Figure()
        fig_price.add_trace(go.Scatter(
            x=df_days["relative_day"],
            y=norm_stock,
            mode="lines+markers",
            name=f"{res.evidence.ticker} Normalized",
            line=dict(color="#58a6ff", width=2.5),
        ))
        fig_price.add_trace(go.Scatter(
            x=df_days["relative_day"],
            y=norm_bench,
            mode="lines",
            name=f"{res.config.benchmark_ticker} Benchmark",
            line=dict(color="#8b949e", width=2, dash="dot"),
        ))
        fig_price.add_vline(x=0, line_dash="dash", line_color="#FFBE5C", annotation_text="t=0")
        fig_price.update_layout(
            template="plotly_dark",
            paper_bgcolor="#161b22",
            plot_bgcolor="#161b22",
            title=f"Relative Price Performance (Normalized to 100 at t = -{res.config.pre_event_days})",
            xaxis_title="Relative Trading Day",
            yaxis_title="Normalized Price Index",
            height=440,
            margin=dict(l=40, r=40, t=50, b=40),
        )
        st.plotly_chart(fig_price, use_container_width=True)

    with tab3:
        fig_vol = go.Figure()
        colors = ["#EF4444" if r >= 2.0 else "#3B82F6" for r in df_days["volume_ratio"]]

        fig_vol.add_trace(go.Bar(
            x=df_days["relative_day"],
            y=df_days["volume_ratio"],
            marker_color=colors,
            name="Volume Multiplier",
            hovertemplate="Day %{x}: <b>%{y:.2f}x</b> normal volume<extra></extra>",
        ))
        fig_vol.add_hline(y=1.0, line_dash="dash", line_color="#8b949e", annotation_text="1.0x Normal Median")
        fig_vol.add_vline(x=0, line_dash="dash", line_color="#FFBE5C")
        fig_vol.update_layout(
            template="plotly_dark",
            paper_bgcolor="#161b22",
            plot_bgcolor="#161b22",
            title=f"Daily Trading Volume Anomaly Ratio vs Baseline Median",
            xaxis_title="Relative Trading Day",
            yaxis_title="Volume Multiplier (x Normal)",
            height=440,
            margin=dict(l=40, r=40, t=50, b=40),
        )
        st.plotly_chart(fig_vol, use_container_width=True)


def render_verdict_and_dossier(res):
    box_class = "verdict-box-pass" if res.is_statistically_significant else "verdict-box-fail"
    st.markdown(
        f"""
        <div class="{box_class}">
            <h4 style="margin: 0 0 8px 0;">🏛️ Official Empirical Research Verdict</h4>
            <p style="font-size: 1.05rem; line-height: 1.5; margin: 0;">{res.empirical_verdict}</p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    st.markdown("### 📥 1-Click Research Export & Replication Dossier")
    col_d1, col_d2, col_d3 = st.columns(3)

    md_content = generate_markdown_dossier(res)
    pdf_bytes = generate_pdf_dossier(res)
    df_export = pd.DataFrame([d.model_dump() for d in res.day_stats])

    with col_d1:
        st.download_button(
            label="📄 Download Institutional PDF Dossier",
            data=pdf_bytes,
            file_name=f"QuantIntel_{res.evidence.ticker}_{res.config.event_date}_Dossier.pdf",
            mime="application/pdf",
            use_container_width=True,
        )

    with col_d2:
        st.download_button(
            label="📝 Download Audited Markdown Report",
            data=md_content,
            file_name=f"QuantIntel_{res.evidence.ticker}_{res.config.event_date}_Report.md",
            mime="text/markdown",
            use_container_width=True,
        )

    with col_d3:
        st.download_button(
            label="📊 Download Raw Daily Trading Data CSV",
            data=df_export.to_csv(index=False),
            file_name=f"QuantIntel_{res.evidence.ticker}_daily_stats.csv",
            mime="text/csv",
            use_container_width=True,
        )

    with st.expander("🔍 View Complete Daily Event Window Table"):
        st.dataframe(
            df_export[[
                "relative_day", "date_str", "stock_close", "benchmark_close",
                "stock_return_pct", "abnormal_return_pct", "cumulative_abnormal_return_pct", "volume_ratio"
            ]],
            use_container_width=True,
        )


def main():
    st.sidebar.markdown("### 🧭 Platform Navigation")
    platform_module = st.sidebar.radio(
        "Active Research Engine:",
        [
            "🔮 FutureStock: Autonomous AI Stock Forecasting",
            "📈 Catalyst Event Studies (QuantIntel Core)",
        ],
        index=0,
    )
    st.sidebar.divider()

    if platform_module.startswith("🔮 FutureStock"):
        render_futurestock_view()
        return

    render_header()
    params = render_sidebar()

    st.markdown(
        f"**Target Prompt:** *\"{params['query']}\"*  \n"
        f"**Benchmark:** `{params['benchmark']}` | **Estimation Window:** `{params['estimation_window']} days` | **Event Window:** `[-{params['pre_event_days']}, +{params['post_event_days']}]`"
    )

    run_btn = st.button("🚀 Execute QuantIntel Autonomous Workflow", type="primary", use_container_width=True)

    # Check if we should execute or show existing state
    if run_btn:
        agent = QuantAgent(tinyfish_api_key=params["tinyfish_key"])
        trace_placeholder = st.empty()
        steps = []

        with st.spinner("TinyFish Web Agent navigating live disclosures and running deterministic quant engine..."):
            gen = agent.execute_workflow(
                query=params["query"],
                benchmark_override=params["benchmark"],
                estimation_window=params["estimation_window"],
                pre_event_days=params["pre_event_days"],
                post_event_days=params["post_event_days"],
            )

            result = None
            try:
                while True:
                    step = next(gen)
                    steps.append(step)
                    render_agent_live_trace(trace_placeholder, steps)
                    time.sleep(0.3)  # Smooth UI visualization
            except StopIteration as e:
                result = e.value

        if result:
            st.session_state["latest_result"] = result
            st.session_state["trace_steps"] = steps

    # Display results if present in session state
    if "latest_result" in st.session_state:
        res = st.session_state["latest_result"]
        steps = st.session_state.get("trace_steps", [])

        st.divider()
        render_evidence_and_hypothesis(res)
        render_metric_cards(res)
        render_charts(res)
        render_verdict_and_dossier(res)


if __name__ == "__main__":
    main()
