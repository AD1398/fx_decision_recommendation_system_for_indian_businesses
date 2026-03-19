"""
data_engine.py — ETL Module (The "Eyes")
=========================================
Author : Srividya Manikandan (Data & Pipeline Lead)
Project: FX Decision Recommendation System for Indian Businesses

Provides a single entry-point function `get_final_data()` that returns
the complete historical + live exchange-rate DataFrame along with
ADF stationarity test results.
"""

import os
import warnings
from datetime import datetime, date

import numpy as np
import pandas as pd
import yfinance as yf
from statsmodels.tsa.stattools import adfuller

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

# Resolve path relative to *this* file so it works from any working directory
# data_engine.py lives in backend/, but data/ is at the project root (one level up)
_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.dirname(_BASE_DIR)
CSV_PATH = os.path.join(_PROJECT_ROOT, "data", "processed", "cleaned_fx_data.csv")

# yfinance ticker symbols for the four currency pairs
TICKERS = {
    "USD": "USDINR=X",
    "GBP": "GBPINR=X",
    "EUR": "EURINR=X",
    "JPY": "JPYINR=X",
}

# Currencies in the order they appear in the CSV
CURRENCIES = ["USD", "GBP", "EUR", "JPY"]

# Rolling window for volatility calculation (matches preprocessing notebook)
VOLATILITY_WINDOW = 30


# ---------------------------------------------------------------------------
# Step 1 — Load Historical Data
# ---------------------------------------------------------------------------

def load_historical_data(csv_path: str = CSV_PATH) -> pd.DataFrame:
    """
    Load the cleaned historical FX data from CSV.

    Returns a DataFrame indexed by Date with columns:
        EUR, GBP, JPY, USD, *_Return, *_Volatility
    """
    df = pd.read_csv(csv_path, index_col=0, parse_dates=True)
    df.index.name = "Date"

    # Ensure the index is a proper DatetimeIndex (no timezone)
    df.index = pd.DatetimeIndex(df.index)

    print(f"[DATA ENGINE] Loaded {len(df)} rows of historical data "
          f"({df.index.min().date()} → {df.index.max().date()})")
    return df


# ---------------------------------------------------------------------------
# Step 2 — Fetch Live Rates
# ---------------------------------------------------------------------------

def fetch_live_rates(start_date: str = None) -> pd.DataFrame:
    """
    Fetch rates from Yahoo Finance.
    If start_date is provided, it fetches all days from start_date up to today (BACKFILL).
    If None, it fetches only the last 1d (SNAPSHOT).
    """
    all_currency_data = []

    for currency, ticker in TICKERS.items():
        try:
            if start_date:
                data = yf.download(ticker, start=start_date, progress=False)
            else:
                data = yf.download(ticker, period="1d", progress=False)

            if data.empty:
                continue

            # Handle column structure
            close_col = data["Close"]
            if isinstance(close_col, pd.DataFrame):
                close_col = close_col.iloc[:, 0]
            
            s = close_col.astype(float)
            if currency == "JPY":
                s = s * 100.0
            
            s.name = currency
            all_currency_data.append(s)

        except Exception as exc:
            warnings.warn(f"[DATA ENGINE] Failed to fetch {ticker}: {exc}")

    if not all_currency_data:
        return pd.DataFrame()

    new_data = pd.concat(all_currency_data, axis=1)
    new_data.index.name = "Date"
    return new_data


# ---------------------------------------------------------------------------
# Step 3 — Append Live Row
# ---------------------------------------------------------------------------

def append_live_data(df: pd.DataFrame, new_data: pd.DataFrame) -> pd.DataFrame:
    """
    Merge newly fetched data into the historical DataFrame and remove duplicates.
    """
    if new_data.empty:
        return df

    # Update core rate columns
    for col in CURRENCIES:
        if col in new_data.columns:
            df[col] = df[col].combine_first(new_data[col])
        
    # Add entirely new dates
    new_dates = new_data.index.difference(df.index)
    if not new_dates.empty:
        df = pd.concat([df, new_data.loc[new_dates]])
        
    return df.sort_index()


# ---------------------------------------------------------------------------
# Step 4 — Compute Derived Columns (Returns & Volatility)
# ---------------------------------------------------------------------------

def compute_derived_columns(df: pd.DataFrame) -> pd.DataFrame:
    """
    Recalculate daily returns and 30-day rolling volatility for every
    currency so that all new rows are properly filled.
    """
    for cur in CURRENCIES:
        # 1. Forward fill any missing spots in the raw rates first
        df[cur] = df[cur].ffill()
        
        # 2. Daily return = (price_t / price_{t-1}) – 1
        df[f"{cur}_Return"] = df[cur].pct_change()

        # 3. 30-day rolling standard deviation of returns
        df[f"{cur}_Volatility"] = (
            df[f"{cur}_Return"]
            .rolling(window=VOLATILITY_WINDOW)
            .std()
        )

    print("[DATA ENGINE] Recomputed Returns & Volatility for all currencies.")
    return df


# ---------------------------------------------------------------------------
# Step 5 — ADF Stationarity Tests
# ---------------------------------------------------------------------------

def run_adf_tests(df: pd.DataFrame) -> dict:
    """
    Run the Augmented Dickey-Fuller test on each currency's Return series.

    Returns a dict of the form:
        {
            "USD": {"adf_stat": -59.12, "p_value": 0.0, "is_stationary": True},
            ...
        }
    """
    adf_results = {}

    for cur in CURRENCIES:
        col = f"{cur}_Return"
        series = df[col].dropna()

        if series.empty:
            warnings.warn(f"[DATA ENGINE] {col} is empty — skipping ADF test.")
            continue

        stat, pvalue, *_ = adfuller(series)
        is_stationary = pvalue < 0.05

        adf_results[cur] = {
            "adf_stat": round(stat, 4),
            "p_value": round(pvalue, 6),
            "is_stationary": is_stationary,
        }

        status = "STATIONARY ✓ (Ready for AI Modeling)" if is_stationary \
                 else "NON-STATIONARY ✗"
        print(f"[DATA ENGINE] ADF Test — {cur} Returns: "
              f"Stat={stat:.4f}, p={pvalue:.6f} → {status}")

    return adf_results


# ---------------------------------------------------------------------------
# Public API — get_final_data()
# ---------------------------------------------------------------------------

def get_final_data(csv_path: str = CSV_PATH, save_to_csv: bool = True):
    """
    Master function that loads, backfills, saves, and analyzes the FX data.
    """
    # 1. Load historical
    df = load_historical_data(csv_path)

    # 2. Determine Backfill Range
    last_date = df.index.max()
    today = datetime.now()
    
    # Check if we have a gap (if last_date is older than yesterday)
    # We use a 1-day buffer to account for market closure timing
    if last_date.date() < today.date():
        print(f"[DATA ENGINE] Gap detected! Filling from {last_date.date()} to {today.date()}...")
        
        # 3. Fetch (Backfill)
        new_data = fetch_live_rates(start_date=last_date.strftime("%Y-%m-%d"))
        
        if not new_data.empty:
            # 4. Append
            df = append_live_data(df, new_data)
            
            # 5. Derived Analysis
            df = compute_derived_columns(df)
            
            # 6. Save (The "Memory" Step)
            if save_to_csv:
                try:
                    # Attempt to save to the main file
                    df_to_save = df.copy()
                    df_to_save.index = df_to_save.index.strftime('%Y-%m-%d')
                    df_to_save.to_csv(csv_path, index_label='Date')
                    print(f"[DATA ENGINE] Updated dataset saved to {csv_path}")
                except PermissionError:
                    print("\n" + "!" * 60)
                    print("[CRITICAL] PERMISSION DENIED: Cannot save to cleaned_fx_data.csv")
                    print("This usually happens if the file is OPEN in Excel or another program.")
                    print("ACTION REQUIRED: Please CLOSE the CSV file and restart the system.")
                    print("!" * 60 + "\n")
                    # Fallback save so we don't lose the fetched data
                    fallback_path = csv_path.replace(".csv", "_backup.csv")
                    df.to_csv(fallback_path)
                    print(f"[DATA ENGINE] Emergency backup saved to {fallback_path}")
                except Exception as e:
                    print(f"[ERROR] Unexpected error during to_csv: {e}")
                    raise
        else:
             print("[DATA ENGINE] No new data was returned from Yahoo Finance.")
    else:
        print("[DATA ENGINE] Dataset is already up to date.")

    # 7. Stationarity check
    adf_results = run_adf_tests(df)

    print("=" * 60)
    print("  FX DATA ENGINE — Pipeline Complete")
    print(f"  Total rows: {len(df)} | Date range: "
          f"{df.index.min().date()} → {df.index.max().date()}")
    print("=" * 60)

    return df, adf_results


# ---------------------------------------------------------------------------
# Allow running the module directly for quick testing
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    df, adf = get_final_data()
    print("\n--- Last 5 rows ---")
    print(df.tail())
    print("\n--- ADF Results ---")
    for cur, result in adf.items():
        print(f"  {cur}: {result}")
