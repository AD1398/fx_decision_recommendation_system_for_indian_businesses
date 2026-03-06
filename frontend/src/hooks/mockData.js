export const MOCK_FX_DATA = {
    timestamp: "2026-02-01",
    selected_date: "2026-02-01",
    pairs: {
        USD: {
            current_rate: 84.52,
            forecast_7d: 84.89,
            trend: "UP",
            risk_level: "Medium",
            risk_score: 58.32,
            recommendation: "PARTIAL HEDGE (75%) (USD) - Rising rates and moderate risk. Act preemptively."
        },
        GBP: {
            current_rate: 106.43,
            forecast_7d: 105.92,
            trend: "DOWN",
            risk_level: "Low",
            risk_score: 34.12,
            recommendation: "WAIT / SPOT CONVERSION (GBP) - Optimal conditions. No immediate hedging needed."
        },
        EUR: {
            current_rate: 91.85,
            forecast_7d: 92.14,
            trend: "UP",
            risk_level: "Medium",
            risk_score: 52.45,
            recommendation: "TACTICAL HEDGE (25%) (EUR) - Volatility moderate, but trend is favorable."
        },
        JPY: {
            current_rate: 0.5678,
            forecast_7d: 0.5712,
            trend: "UP",
            risk_level: "Low",
            risk_score: 38.67,
            recommendation: "WATCHFUL BUYING (JPY) - Low risk but rates are rising. Cover short-term needs."
        }
    },
    analysis: {
        historical_90d: [
            { Date: '2025-11-01', USD: 83.50, GBP: 105.20, EUR: 90.10, JPY: 0.5512 },
            { Date: '2025-11-15', USD: 83.80, GBP: 105.85, EUR: 90.45, JPY: 0.5534 },
            { Date: '2025-12-01', USD: 84.10, GBP: 106.10, EUR: 91.20, JPY: 0.5598 },
            { Date: '2025-12-15', USD: 84.35, GBP: 106.55, EUR: 91.50, JPY: 0.5623 },
            { Date: '2026-01-01', USD: 84.20, GBP: 106.30, EUR: 91.65, JPY: 0.5645 },
            { Date: '2026-01-15', USD: 84.45, GBP: 106.20, EUR: 91.78, JPY: 0.5659 },
            { Date: '2026-02-01', USD: 84.52, GBP: 106.43, EUR: 91.85, JPY: 0.5678 }
        ],
        volatility_trend: [
            { Date: '2025-11-01', USD_Volatility: 0.000245, GBP_Volatility: 0.000312, EUR_Volatility: 0.000289, JPY_Volatility: 0.000198 },
            { Date: '2025-11-15', USD_Volatility: 0.000298, GBP_Volatility: 0.000345, EUR_Volatility: 0.000321, JPY_Volatility: 0.000234 },
            { Date: '2025-12-01', USD_Volatility: 0.000412, GBP_Volatility: 0.000289, EUR_Volatility: 0.000378, JPY_Volatility: 0.000267 },
            { Date: '2025-12-15', USD_Volatility: 0.000356, GBP_Volatility: 0.000267, EUR_Volatility: 0.000334, JPY_Volatility: 0.000245 },
            { Date: '2026-01-01', USD_Volatility: 0.000389, GBP_Volatility: 0.000234, EUR_Volatility: 0.000298, JPY_Volatility: 0.000212 },
            { Date: '2026-01-15', USD_Volatility: 0.000334, GBP_Volatility: 0.000201, EUR_Volatility: 0.000267, JPY_Volatility: 0.000189 },
            { Date: '2026-02-01', USD_Volatility: 0.000312, GBP_Volatility: 0.000178, EUR_Volatility: 0.000245, JPY_Volatility: 0.000167 }
        ],
        correlations: {
            "USD": { "USD": 1.00, "GBP": 0.82, "EUR": 0.91, "JPY": -0.45 },
            "GBP": { "USD": 0.82, "GBP": 1.00, "EUR": 0.78, "JPY": -0.32 },
            "EUR": { "USD": 0.91, "GBP": 0.78, "EUR": 1.00, "JPY": -0.41 },
            "JPY": { "USD": -0.45, "GBP": -0.32, "EUR": -0.41, "JPY": 1.00 }
        },
        risk_map: [
            { currency: "USD", volatility: 0.000312, sensitivity: 1.00, risk_score: 10.31, status: "Stable" },
            { currency: "GBP", volatility: 0.000178, sensitivity: 0.82, risk_score: 8.38, status: "Stable" },
            { currency: "EUR", volatility: 0.000245, sensitivity: 0.91, risk_score: 9.35, status: "Stable" },
            { currency: "JPY", volatility: 0.000167, sensitivity: -0.45, risk_score: 4.67, status: "Stable" }
        ]
    }
};
