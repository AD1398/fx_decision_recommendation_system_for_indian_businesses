import pandas as pd
import numpy as np

class ExposureEngine:
    """
    Handles business-specific logic for FX exposure, scenarios, and sensitivity.
    Migrated from 'Sprint1_Business_Exposure_Modelling.ipynb'.
    """

    def calculate_scenarios(self, amount, current_rate, business_type="Importer"):
        """
        Calculates financial impact under Favorable, Neutral, and Adverse scenarios.
        """
        # Define scenario adjustments (percentage changes)
        # Sourced from notebook multipliers
        scenarios = {
            "Favorable": -0.01 if business_type == "Importer" else 0.01,
            "Neutral": 0.00,
            "Adverse": 0.02 if business_type == "Importer" else -0.02
        }

        results = []
        base_cost = amount * current_rate

        for name, pct_change in scenarios.items():
            scenario_rate = current_rate * (1 + pct_change)
            new_cost = amount * scenario_rate
            
            # Impact calculation
            # For Importer: Higher Rate = Loss (Positive Impact in terms of COST, Negative in terms of PROFIT)
            # For Exporter: Lower Rate = Loss (Revenue Decrease)
            
            if business_type == "Importer":
                gain_loss = base_cost - new_cost # Positive means we SAVED money (Gain)
            else:
                gain_loss = new_cost - base_cost # Positive means we EARNED more (Gain)

            results.append({
                "scenario": name,
                "rate": round(scenario_rate, 4),
                "gain_loss": round(gain_loss, 2),
                "percent_change": f"{pct_change*100:+.1f}%"
            })

        return results

    def get_sensitivity(self, amount, business_type):
        """
        Determines sensitivity and risk priority based on transaction size.
        """
        # Sensitivity per ₹1 movement
        # Logic: If rate moves by ₹1, impact is exactly total USD amount in INR terms (1 * Amount)
        sensitivity_per_rupee = amount 

        # Risk Priority Logic (from notebook thresholds)
        if amount >= 500000:
            priority = "High"
            zone = "Danger"
            message = "Critical Exposure. Active hedging mandatory."
        elif amount >= 100000:
            priority = "Medium"
            zone = "Warning"
            message = "Moderate Exposure. Consider partial hedging."
        else:
            priority = "Low"
            zone = "Safe"
            message = "Low impact. Spot conversion acceptable."

        return {
            "sensitivity_per_rupee": sensitivity_per_rupee,
            "priority": priority,
            "zone": zone,
            "message": message
        }
