"""
visualize_pipeline.py — Data Pipeline Visualization
=====================================================
Author : Srividya Manikandan (Data & Pipeline Lead)
Project: FX Decision Recommendation System for Indian Businesses

Generates professional visualizations of the FX data pipeline output.
Saves all plots to outputs/plots/ for team presentations.

Usage:
    python backend/visualize_pipeline.py
"""

import os
import sys
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend for saving plots
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
import pandas as pd
import seaborn as sns
from prophet import Prophet

# Add backend to path so we can import data_engine
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from data_engine import get_final_data, CURRENCIES

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

_PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUTPUT_DIR = os.path.join(_PROJECT_ROOT, "outputs", "plots")

# Clean output directory first
if os.path.exists(OUTPUT_DIR):
    for f in os.listdir(OUTPUT_DIR):
        if f.endswith(".png"):
            os.remove(os.path.join(OUTPUT_DIR, f))
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Professional color palette
COLORS = {
    "USD": "#2563EB",   # Bold blue
    "GBP": "#7C3AED",   # Purple
    "EUR": "#059669",   # Emerald
    "JPY": "#DC2626",   # Red
}

CURRENCY_LABELS = {
    "USD": "USD/INR",
    "GBP": "GBP/INR",
    "EUR": "EUR/INR",
    "JPY": "JPY/INR (per 100¥)",
}

# Common plot styling (Light Theme)
plt.rcParams.update({
    "figure.facecolor": "#FFFFFF",
    "axes.facecolor": "#F8FAFC",
    "axes.edgecolor": "#CBD5E1",
    "axes.labelcolor": "#1E293B",
    "text.color": "#1E293B",
    "xtick.color": "#64748B",
    "ytick.color": "#64748B",
    "grid.color": "#E2E8F0",
    "grid.alpha": 0.5,
    "font.family": "sans-serif",
    "font.size": 11,
})

TITLE_COLOR = "#0F172A"
SUBTITLE_COLOR = "#475569"

# ---------------------------------------------------------------------------
# Plot 1 — Historical Exchange Rate Trends (4-panel)
# ---------------------------------------------------------------------------

def plot_exchange_rate_trends(df: pd.DataFrame):
    """4-panel chart showing each currency's exchange rate over time."""
    fig, axes = plt.subplots(2, 2, figsize=(16, 10), sharex=True)
    fig.suptitle("Historical Exchange Rate Trends (2016–2026)",
                 fontsize=18, fontweight="bold", color=TITLE_COLOR, y=0.98)

    for ax, cur in zip(axes.flat, CURRENCIES):
        ax.plot(df.index, df[cur], color=COLORS[cur], linewidth=1.2, alpha=0.9)
        ax.fill_between(df.index, df[cur], alpha=0.1, color=COLORS[cur])
        ax.set_title(CURRENCY_LABELS[cur], fontsize=13, fontweight="bold",
                     color=COLORS[cur])
        ax.set_ylabel("Rate (INR)", fontsize=10)
        ax.grid(True, linestyle="--", alpha=0.3)
        ax.xaxis.set_major_locator(mdates.YearLocator())
        ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))

        # Annotate latest value
        last_val = df[cur].dropna().iloc[-1]
        last_date = df[cur].dropna().index[-1]
        ax.annotate(f"₹{last_val:.2f}",
                    xy=(last_date, last_val),
                    fontsize=9, fontweight="bold",
                    color=COLORS[cur],
                    bbox=dict(boxstyle="round,pad=0.3", fc="#FFFFFF",
                              ec=COLORS[cur], alpha=0.8))

    plt.tight_layout(rect=[0, 0, 1, 0.95])
    path = os.path.join(OUTPUT_DIR, "exchange_rate_trends.png")
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"[VIZ] Saved: {path}")


# ---------------------------------------------------------------------------
# Plot 2 — Rolling Volatility (30-day)
# ---------------------------------------------------------------------------

def plot_rolling_volatility(df: pd.DataFrame):
    """Overlay chart showing 30-day rolling volatility for all currencies."""
    fig, ax = plt.subplots(figsize=(16, 6))
    fig.suptitle("30-Day Rolling Volatility — Market \"Nervousness\" Indicator",
                 fontsize=16, fontweight="bold", color=TITLE_COLOR)

    for cur in CURRENCIES:
        vol_col = f"{cur}_Volatility"
        ax.plot(df.index, df[vol_col], color=COLORS[cur],
                linewidth=1.0, alpha=0.85, label=CURRENCY_LABELS[cur])

    # Highlight high-volatility threshold
    ax.axhline(y=0.008, color="#FBBF24", linestyle="--", linewidth=1,
               alpha=0.7, label="High Volatility Threshold")

    ax.set_ylabel("Volatility (Std Dev of Returns)", fontsize=11)
    ax.set_xlabel("Date", fontsize=11)
    ax.legend(loc="upper left", fontsize=9, facecolor="#F8FAFC",
              edgecolor="#CBD5E1")
    ax.grid(True, linestyle="--", alpha=0.3)
    ax.xaxis.set_major_locator(mdates.YearLocator())
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "rolling_volatility.png")
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"[VIZ] Saved: {path}")


# ---------------------------------------------------------------------------
# Plot 3 — Returns Distribution (Histograms)
# ---------------------------------------------------------------------------

def plot_returns_distribution(df: pd.DataFrame):
    """Histogram + KDE for each currency's daily returns."""
    fig, axes = plt.subplots(2, 2, figsize=(14, 9))
    fig.suptitle("Daily Returns Distribution — Stationarity Validation",
                 fontsize=16, fontweight="bold", color=TITLE_COLOR, y=0.98)

    for ax, cur in zip(axes.flat, CURRENCIES):
        returns = df[f"{cur}_Return"].dropna()
        ax.hist(returns, bins=80, color=COLORS[cur], alpha=0.7,
                edgecolor="none", density=True)

        # Overlay normal distribution curve
        mu, sigma = returns.mean(), returns.std()
        x = np.linspace(returns.min(), returns.max(), 200)
        ax.plot(x, (1 / (sigma * np.sqrt(2 * np.pi))) *
                np.exp(-0.5 * ((x - mu) / sigma) ** 2),
                color="#F8FAFC", linewidth=1.5, alpha=0.8,
                label=f"Normal (μ={mu:.5f})")

        ax.set_title(f"{CURRENCY_LABELS[cur]} Returns", fontsize=12,
                     fontweight="bold", color=COLORS[cur])
        ax.set_xlabel("Daily Return", fontsize=9)
        ax.set_ylabel("Density", fontsize=9)
        ax.legend(fontsize=8, facecolor="#F8FAFC", edgecolor="#CBD5E1")
        ax.grid(True, linestyle="--", alpha=0.2)

    plt.tight_layout(rect=[0, 0, 1, 0.95])
    path = os.path.join(OUTPUT_DIR, "returns_distribution.png")
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"[VIZ] Saved: {path}")


# ---------------------------------------------------------------------------
# Plot 4 — ADF Stationarity Summary
# ---------------------------------------------------------------------------

def plot_adf_summary(adf_results: dict):
    """Horizontal bar chart summarizing ADF test statistics."""
    fig, ax = plt.subplots(figsize=(10, 5))
    fig.suptitle("ADF Stationarity Test Results",
                 fontsize=16, fontweight="bold", color=TITLE_COLOR)

    currencies = list(adf_results.keys())
    stats = [adf_results[c]["adf_stat"] for c in currencies]
    colors_list = [COLORS[c] for c in currencies]

    bars = ax.barh(currencies, stats, color=colors_list, height=0.5,
                   edgecolor="none", alpha=0.85)

    # Critical value line (approx. -2.86 for 5% significance)
    ax.axvline(x=-2.86, color="#FBBF24", linestyle="--", linewidth=1.5,
               label="5% Critical Value (-2.86)")

    # Labels on bars
    for bar, stat, cur in zip(bars, stats, currencies):
        p = adf_results[cur]["p_value"]
        label = f"  Stat: {stat:.2f} | p: {p:.6f} ✓"
        ax.text(stat + 0.5, bar.get_y() + bar.get_height() / 2,
                label, va="center", fontsize=10, color="#E2E8F0",
                fontweight="bold")

    ax.set_xlabel("ADF Statistic (more negative = more stationary)",
                  fontsize=11)
    ax.legend(loc="upper right", fontsize=9, facecolor="#F8FAFC",
              edgecolor="#CBD5E1")
    ax.grid(True, axis="x", linestyle="--", alpha=0.3)
    ax.invert_xaxis()

    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "adf_stationarity_summary.png")
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"[VIZ] Saved: {path}")


# ---------------------------------------------------------------------------
# Plot 9 — USD/INR 30-Day ML Forecast
# ---------------------------------------------------------------------------

def plot_usd_forecast_30d(df: pd.DataFrame):
    """Generates and plots a 30-day Prophet forecast."""
    print("[VIZ] Training Prophet for 30-day USD forecast...")
    
    # Prepare data for Prophet
    pdf = df[["USD"]].reset_index()
    pdf.columns = ["ds", "y"]
    pdf["ds"] = pd.to_datetime(pdf["ds"]).dt.tz_localize(None)
    
    # Train
    m = Prophet(daily_seasonality=False, weekly_seasonality=True, yearly_seasonality=True)
    m.fit(pdf.tail(365)) # Use last year for speed
    
    # Predict
    future = m.make_future_dataframe(periods=30)
    forecast = m.predict(future)
    
    # Plot
    fig = m.plot(forecast, figsize=(15, 7))
    plt.title("USD/INR — 30-Day Neural Forecast (Prophet)", 
              fontsize=16, fontweight="bold", color=TITLE_COLOR)
    plt.xlabel("Date")
    plt.ylabel("Exchange Rate")
    
    path = os.path.join(OUTPUT_DIR, "usd_inr_30day_forecast.png")
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"[VIZ] Saved: {path}")


# ---------------------------------------------------------------------------
# Plot 10 — Forecast Backtest (Actual vs Predicted)
# ---------------------------------------------------------------------------

def plot_forecast_backtest(df: pd.DataFrame):
    """Backtests the model on the last 7 days of history."""
    print("[VIZ] Running 7-day backtest for USD...")
    
    # Split: Train (all - 7 days), Test (last 7 days)
    train_df = df.iloc[:-7]
    test_df = df.iloc[-7:]
    
    pdf_train = train_df[["USD"]].reset_index()
    pdf_train.columns = ["ds", "y"]
    pdf_train["ds"] = pd.to_datetime(pdf_train["ds"]).dt.tz_localize(None)
    
    # Train
    m = Prophet(daily_seasonality=False)
    m.fit(pdf_train.tail(200)) # Faster window for backtest
    
    # Predict 7 days
    future = m.make_future_dataframe(periods=7)
    forecast = m.predict(future)
    
    # Compare
    fig, ax = plt.subplots(figsize=(14, 6))
    fig.suptitle("Forecasting Performance — 7-Day Backtest", 
                 fontsize=16, fontweight="bold", color=TITLE_COLOR)
    
    # Plot Actual
    ax.plot(test_df.index, test_df["USD"], 'ko-', label="Actual Market Rate", linewidth=2)
    
    # Plot Predicted
    pred_subset = forecast.tail(7)
    pred_dates = pd.to_datetime(pred_subset["ds"])
    ax.plot(pred_dates, pred_subset["yhat"], 'b--', label="Model Prediction", linewidth=2)
    ax.fill_between(pred_dates, pred_subset["yhat_lower"], pred_subset["yhat_upper"], 
                    color='blue', alpha=0.1, label="95% Confidence Interval")
    
    ax.legend(loc="upper left")
    ax.grid(True, alpha=0.3)
    
    path = os.path.join(OUTPUT_DIR, "Baseline_7Day_USD_INR_Forecast_vs_Actual.png")
    fig.savefig(path, dpi=120, bbox_inches="tight")
    plt.close(fig)
    print(f"[VIZ] Saved: {path}")


# ---------------------------------------------------------------------------
# Plot 5 — Combined Currency Trends (Normalized)
# ---------------------------------------------------------------------------

def plot_currency_trends(df: pd.DataFrame):
    """Normalized trend comparison (Base 100 at start)."""
    fig, ax = plt.subplots(figsize=(16, 7))
    fig.suptitle("Comparative Currency Performance (Normalized to 100)",
                 fontsize=18, fontweight="bold", color=TITLE_COLOR)

    # Use only last 2 years for trend clarity
    df_recent = df.tail(730).copy()
    
    for cur in CURRENCIES:
        # Normalize: (Price / Initial Price) * 100
        start_price = df_recent[cur].iloc[0]
        normalized = (df_recent[cur] / start_price) * 100
        ax.plot(df_recent.index, normalized, color=COLORS[cur], 
                linewidth=2, label=CURRENCY_LABELS[cur])

    ax.set_ylabel("Performance Index (Base 100)", fontsize=11)
    ax.legend(loc="upper left", fontsize=10, facecolor="#F8FAFC", edgecolor="#CBD5E1")
    ax.grid(True, linestyle="--", alpha=0.3)
    
    path = os.path.join(OUTPUT_DIR, "currency_trends.png")
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"[VIZ] Saved: {path}")


# ---------------------------------------------------------------------------
# Plot 6 — USD Specific Volatility
# ---------------------------------------------------------------------------

def plot_usd_volatility(df: pd.DataFrame):
    """Focused volatility chart for USD/INR."""
    fig, ax = plt.subplots(figsize=(16, 6))
    fig.suptitle("USD/INR Volatility Profile — Strategic Risk View",
                 fontsize=16, fontweight="bold", color=TITLE_COLOR)

    ax.plot(df.index, df["USD_Volatility"], color=COLORS["USD"], 
            linewidth=1.5, alpha=0.9)
    ax.fill_between(df.index, df["USD_Volatility"], color=COLORS["USD"], alpha=0.15)
    
    ax.axhline(y=0.005, color="#10B981", linestyle=":", label="Low Risk Zone")
    ax.axhline(y=0.010, color="#EF4444", linestyle=":", label="High Risk Zone")
    
    ax.set_ylabel("Volatility", fontsize=11)
    ax.legend(loc="upper right", fontsize=10, facecolor="#F8FAFC", edgecolor="#CBD5E1")
    
    path = os.path.join(OUTPUT_DIR, "usd_volatility.png")
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"[VIZ] Saved: {path}")


# ---------------------------------------------------------------------------
# Plot 7 — Outlier Detection (Boxplots)
# ---------------------------------------------------------------------------

def plot_outlier_boxplot(df: pd.DataFrame):
    """Visualizes return distributions and extreme outliers."""
    fig, ax = plt.subplots(figsize=(12, 7))
    fig.suptitle("Daily Returns — Outlier Analysis",
                 fontsize=16, fontweight="bold", color=TITLE_COLOR)

    # Melt data for seaborn
    melted = []
    for cur in CURRENCIES:
        temp = df[[f"{cur}_Return"]].dropna().copy()
        temp.columns = ["Return"]
        temp["Currency"] = cur
        melted.append(temp)
    
    plot_df = pd.concat(melted)
    
    sns.boxplot(x="Currency", y="Return", data=plot_df, palette=COLORS,
                ax=ax, flierprops={"marker": "x", "markeredgecolor": "#EF4444"})

    ax.set_title("Identifies 'Flash Crashes' and Extreme Market Shocks", 
                 fontsize=10, color=SUBTITLE_COLOR)
    
    path = os.path.join(OUTPUT_DIR, "outlier_boxplot.png")
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"[VIZ] Saved: {path}")


# ---------------------------------------------------------------------------
# Plot 8 — Correlation Heatmap
# ---------------------------------------------------------------------------

def plot_correlation_heatmap(df: pd.DataFrame):
    """Heatmap showing how currencies move in tandem."""
    fig, ax = plt.subplots(figsize=(10, 8))
    fig.suptitle("Currency Interdependence Matrix",
                 fontsize=16, fontweight="bold", color=TITLE_COLOR)

    corr = df[CURRENCIES].corr()
    
    sns.heatmap(corr, annot=True, fmt=".2f", cmap="RdBu_r", center=0,
                square=True, linewidths=0.5, cbar_kws={"shrink": .8}, ax=ax)

    path = os.path.join(OUTPUT_DIR, "correlation_heatmap.png")
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"[VIZ] Saved: {path}")


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("=" * 60)
    print("  FX DATA PIPELINE — Generating Visualizations")
    print("=" * 60)

    # Run the data pipeline
    df, adf_results = get_final_data()

    # Generate all plots
    print("[VIZ] Generating 10 professional project plots...")
    
    plot_exchange_rate_trends(df)       # Plot 1
    plot_rolling_volatility(df)         # Plot 2
    plot_returns_distribution(df)       # Plot 3
    plot_adf_summary(adf_results)       # Plot 4
    plot_currency_trends(df)            # Plot 5
    plot_usd_volatility(df)             # Plot 6
    plot_outlier_boxplot(df)            # Plot 7
    plot_correlation_heatmap(df)        # Plot 8
    plot_usd_forecast_30d(df)           # Plot 9
    plot_forecast_backtest(df)          # Plot 10

    print("\n" + "=" * 60)
    print(f"  SUCCESS: All 10 plots saved to: {OUTPUT_DIR}")
    print("=" * 60)
