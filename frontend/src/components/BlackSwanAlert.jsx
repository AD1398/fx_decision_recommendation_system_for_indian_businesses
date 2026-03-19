import React from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';

const BlackSwanAlert = ({ riskDetails, onDismiss }) => {
    if (!riskDetails) return null;

    // Find currencies with High risk or anomalies
    const criticalCurrencies = Object.entries(riskDetails)
        .filter(([_, data]) => data.level === 'High' || data.is_anomaly)
        .map(([currency, data]) => ({ currency, ...data }));

    if (criticalCurrencies.length === 0) return null;

    const hasAnomaly = criticalCurrencies.some(c => c.is_anomaly);

    return (
        <div style={{
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05))',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '16px',
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            animation: 'pulse-border 2s infinite'
        }}>
            <div style={{
                background: 'rgba(239, 68, 68, 0.2)',
                padding: '0.6rem',
                borderRadius: '12px',
                flexShrink: 0,
                animation: 'pulse 2s infinite'
            }}>
                {hasAnomaly
                    ? <ShieldAlert size={24} color="#EF4444" />
                    : <AlertTriangle size={24} color="#EF4444" />
                }
            </div>

            <div style={{ flex: 1 }}>
                <h4 style={{
                    color: '#EF4444',
                    fontSize: '0.9rem',
                    fontWeight: 800,
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    marginBottom: '0.3rem'
                }}>
                    {hasAnomaly ? '⚠️ BLACK SWAN ALERT — MARKET ANOMALY DETECTED' : '⚠️ HIGH RISK ALERT'}
                </h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {criticalCurrencies.map(c => (
                        <div key={c.currency} style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '8px',
                            padding: '0.4rem 0.8rem',
                            fontSize: '0.75rem',
                            color: '#FCA5A5'
                        }}>
                            <strong>{c.currency}</strong>
                            {' — '}
                            Risk: {c.score}/100
                            {c.is_anomaly && ' | Z-Score Anomaly'}
                            {c.z_score !== undefined && ` | Z: ${c.z_score}`}
                        </div>
                    ))}
                </div>
                <p style={{ color: '#FCA5A5', fontSize: '0.8rem', marginTop: '0.5rem', lineHeight: 1.4 }}>
                    Major market volatility detected. Standard pricing models may be unreliable. Consider activating emergency hedging protocols.
                </p>
            </div>

            {onDismiss && (
                <button
                    onClick={onDismiss}
                    style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '8px',
                        padding: '0.3rem',
                        cursor: 'pointer',
                        color: '#EF4444',
                        flexShrink: 0
                    }}
                >
                    <X size={16} />
                </button>
            )}

            <style>{`
                @keyframes pulse-border {
                    0%, 100% { border-color: rgba(239, 68, 68, 0.3); }
                    50% { border-color: rgba(239, 68, 68, 0.6); }
                }
            `}</style>
        </div>
    );
};

export default BlackSwanAlert;
