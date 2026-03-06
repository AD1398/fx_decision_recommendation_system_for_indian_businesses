import React from 'react';
import { AlertCircle, Shield, Zap, TrendingUp } from 'lucide-react';

const RiskMap = ({ data }) => {
    if (!data || !data.length) return null;

    // Normalizing values for mapping onto a 100x100 grid
    // Sensitivity: -1 to 1 -> 0% to 100%
    // Volatility: 0 to max_vol -> 0% to 100%
    const maxVol = Math.max(...data.map(d => d.volatility)) * 1.2 || 0.05;

    return (
        <div style={{ position: 'relative', height: '350px', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', marginLeft: '2rem' }}>
            {/* Quadrant Labels */}
            <div style={{ position: 'absolute', top: '15px', left: '15px', fontSize: '0.65rem', color: '#EF4444', fontWeight: 800, opacity: 0.6 }}>HIGH RISK / VOLATILE</div>
            <div style={{ position: 'absolute', bottom: '15px', right: '15px', fontSize: '0.65rem', color: '#10B981', fontWeight: 800, opacity: 0.6 }}>SAFE HAVEN / STABLE</div>

            {/* Grid Lines */}
            <div style={{ position: 'absolute', top: '50%', left: '0', right: '0', height: '1px', background: 'rgba(255,255,255,0.08)' }}></div>
            <div style={{ position: 'absolute', top: '0', bottom: '0', left: '50%', width: '1px', background: 'rgba(255,255,255,0.08)' }}></div>

            {/* Data Points */}
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                {data.map(item => {
                    // Sensitivity: -1 to 1 -> 0% to 100%
                    const x = ((item.sensitivity + 1) / 2) * 100;
                    // Volatility: 0 to max_vol -> 100% to 0% (up is higher)
                    const y = (1 - (item.volatility / maxVol)) * 100;

                    return (
                        <div
                            key={item.currency}
                            style={{
                                position: 'absolute',
                                left: `${x}%`,
                                top: `${y}%`,
                                transform: 'translate(-50%, -50%)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '4px',
                                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                                zIndex: 10
                            }}
                        >
                            <div style={{
                                width: `${24 + item.risk_score / 4}px`,
                                height: `${24 + item.risk_score / 4}px`,
                                background: item.volatility > maxVol / 2 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(37, 99, 235, 0.4)',
                                border: `2.5px solid ${item.volatility > maxVol / 2 ? '#EF4444' : '#2563EB'}`,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: `0 0 30px ${item.volatility > maxVol / 2 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(37, 99, 235, 0.3)'}`,
                                cursor: 'help'
                            }}>
                                {item.volatility > maxVol / 2 ? <Zap size={16} color="#fff" /> : <Shield size={16} color="#fff" />}
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)', letterSpacing: '0.5px' }}>{item.currency}</span>
                        </div>
                    );
                })}
            </div>

            {/* Axis Titles */}
            <div style={{ position: 'absolute', bottom: '-40px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '2px', whiteSpace: 'nowrap' }}>
                MARKET SENSITIVITY (USD CORRELATION)
            </div>
            <div style={{ position: 'absolute', left: '-50px', top: '50%', transform: 'rotate(-90deg) translateY(-50%)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', fontWeight: 800, letterSpacing: '2px', whiteSpace: 'nowrap' }}>
                CURRENCY VOLATILITY
            </div>
        </div>
    );
};

export default RiskMap;
