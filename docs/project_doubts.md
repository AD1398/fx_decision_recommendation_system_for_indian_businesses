# Project Doubts Resolution

## 1. Future Prediction (Adwaitha's Module)

**Yes, the future prediction logic is implemented.**

*   **Location:** The logic resides in the `FXEngine` class in `backend/fx_engine.py`, specifically in the `get_forecast` method.
*   **Technology:** It uses **Prophet** (from Facebook/Meta), a robust library for time series forecasting.
*   **How it works:**
    1.  **Data Source:** It takes the consolidated historical exchange rate data (merging RBI and FBIL sources).
    2.  **Training:** It uses the last **365 days** of historical data to train the model.
    3.  **Forecast:** It generates a prediction for the next **7 days** (default) or a specified custom range.
    4.  **Output:** It provides:
        *   `predicted_rate`: The expected exchange rate.
        *   `trend`: A direction indicator ("UP" or "DOWN").

**Usage in Dashboard:**
When you view the dashboard, the engine automatically runs this forecast and uses the `trend` ("UP" or "DOWN") to influence the final recommendation.

---

## 2. Risk Assessment (Kanishkhan's Module)

### What defines "High Risk" vs. "Low Risk"?

In the current implementation (`get_risk_assessment` method in `fx_engine.py`), risk is calculated using a **weighted score** composed of two factors:

1.  **Volatility Score (60% Weight):**
    *   Measures how unstable the currency price is.
    *   High Volatility = High Risk.
    *   It compares the *current* volatility against the historical minimum and maximum volatility. If the current market is moving wildly compared to the past, this score goes up.

2.  **Exposure Score (40% Weight):**
    *   Measures the financial magnitude of the transaction.
    *   Higher Amount = Higher Risk.
    *   It scales linearly between **$50,000 (Low)** and **$500,000 (High)**. If you are transacting a large amount (e.g., $500k), you are automatically considered at higher risk because you have more to lose.

**Risk Levels:**
*   **Low Risk:** Score < 40
*   **Medium Risk:** Score 40 - 70
*   **High Risk:** Score > 70

### Is it risky to change INR -> USD or USD -> INR?

This depends on your **Position** (Importer vs. Exporter), but the current system seems primarily tuned to assist with **buying foreign currency (INR -> USD)**.

*   **INR -> USD (Importer):**
    *   **High Risk Scenario:** When the **USD is Rising (Trend = UP)** or **Volatility is High**.
    *   *Why?* You will have to pay more INR to get the same amount of USD. The system recommends "HEDGE" (buy now or lock rates) in this case to protect against rising costs.

*   **USD -> INR (Exporter):**
    *   **High Risk Scenario:** When the **USD is Falling (Trend = DOWN)** or **Volatility is High**.
    *   *Why?* You will receive less INR for your USD earnings.
    *   *Note:* The current recommendation logic specifically looks for `TREND == "UP"` to suggest hedging, which favors the Importer perspective.

### Summary Table

| Metric | High Risk Condition | Impact |
| :--- | :--- | :--- |
| **Volatility** | Rate is fluctuating wildly | Hard to predict costs/revenue |
| **Trend (for Importer)** | USD is getting stronger (Rate $\uparrow$) | Imports become more expensive |
| **Trend (for Exporter)** | USD is getting weaker (Rate $\downarrow$) | Revenue in INR decreases |
| **Exposure** | Transaction amount is large | larger financial impact |
