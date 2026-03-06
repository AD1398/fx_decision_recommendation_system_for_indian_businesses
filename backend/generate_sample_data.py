"""
Generate realistic FX data for the dashboard when raw data files are not available.
This creates a CSV file with historical rates from 2016-01-01 to 2026-01-01.
"""
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

# Set random seed for reproducibility
np.random.seed(42)

# Date range: 2016-01-01 to 2026-01-01 (as shown in notebook output)
start_date = datetime(2016, 1, 1)
end_date = datetime(2026, 1, 1)
date_range = pd.date_range(start=start_date, end=end_date, freq='D')

# Initial rates (realistic 2016 values)
initial_rates = {
    'USD': 67.20,
    'GBP': 97.35,
    'EUR': 73.12,
    'JPY': 55.12  # Corrected to be per 100 JPY
}

# Long-term drift (adjusted for realistic 2026 targets: USD~90, GBP~115)
drift_rates = {
    'USD': 0.000085, # Targeting ~83-84 by 2024
    'GBP': 0.000025, # Targeting ~106 by 2024
    'EUR': 0.00008,  # Targeting ~90 by 2024
    'JPY': 0.00001   # Targeting ~58-60 by 2024
}

# Daily volatility
volatility = {
    'USD': 0.003,
    'GBP': 0.004,
    'EUR': 0.0035,
    'JPY': 0.0045
}

def generate_currency_series(currency, num_days):
    """Generate realistic currency rate series using geometric Brownian motion."""
    initial = initial_rates[currency]
    drift = drift_rates[currency]
    vol = volatility[currency]
    
    rates = [initial]
    for i in range(1, num_days):
        # Add some mean reversion
        mean_reversion = 0.0001 * (initial * (1 + drift * i) - rates[-1])
        
        # Random walk component
        random_change = np.random.normal(drift + mean_reversion, vol)
        
        # Calculate new rate
        new_rate = rates[-1] * (1 + random_change)
        rates.append(new_rate)
    
    return rates

# Generate data
print("Generating FX data for 3653 days (2016-01-01 to 2026-01-01)...")
num_days = len(date_range)

data = {
    'Date': date_range,
    'USD': generate_currency_series('USD', num_days),
    'GBP': generate_currency_series('GBP', num_days),
    'EUR': generate_currency_series('EUR', num_days),
    'JPY': generate_currency_series('JPY', num_days)
}

df = pd.DataFrame(data)
df = df.set_index('Date')

# Calculate returns and volatility (matching fx_engine.py logic)
for cur in ['USD', 'GBP', 'EUR', 'JPY']:
    df[f'{cur}_Return'] = df[cur].pct_change()
    df[f'{cur}_Volatility'] = df[f'{cur}_Return'].rolling(window=30).std()

# Save to CSV
# Save to CSV
import os
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
output_path = os.path.join(base_dir, 'data', 'processed', 'cleaned_fx_data.csv')
df.to_csv(output_path)

print(f"[OK] Generated {len(df)} days of FX data")
print(f"[OK] Saved to: {output_path}")
print("\n--- Data Summary ---")
print(df[['USD', 'GBP', 'EUR', 'JPY']].describe())
