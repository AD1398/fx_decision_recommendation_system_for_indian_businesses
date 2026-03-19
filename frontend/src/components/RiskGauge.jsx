import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import GlassCard from './GlassCard';

ChartJS.register(ArcElement, Tooltip);

const RiskGauge = ({ score = 0, level = 'Low', currency = 'USD' }) => {
    // Gauge segments: Green (0-40), Yellow (40-70), Red (70-100)
    const remaining = 100 - score;

    const gaugeColor = score >= 70 ? '#EF4444' : score >= 40 ? '#F59E0B' : '#10B981';
    const gaugeLabel = score >= 70 ? '🔴 DANGEROUS' : score >= 40 ? '🟡 CAUTION' : '🟢 STABLE';

    const data = {
        datasets: [{
            data: [score, remaining],
            backgroundColor: [gaugeColor, 'rgba(255,255,255,0.05)'],
            borderWidth: 0,
            circumference: 240,
            rotation: 240,
            cutout: '80%',
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: { enabled: false },
            legend: { display: false }
        }
    };

    return (
        <GlassCard title={`${currency} Risk Gauge`}>
            <div style={{ position: 'relative', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '180px', height: '180px', position: 'relative' }}>
                    <Doughnut data={data} options={options} />
                    <div style={{
                        position: 'absolute',
                        top: '55%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: gaugeColor, fontFamily: 'monospace' }}>
                            {score}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
                            / 100
                        </div>
                    </div>
                </div>
                <div style={{
                    marginTop: '0.5rem',
                    padding: '4px 14px',
                    borderRadius: '100px',
                    background: `${gaugeColor}20`,
                    color: gaugeColor,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.5px'
                }}>
                    {gaugeLabel}
                </div>
            </div>
        </GlassCard>
    );
};

export default RiskGauge;
