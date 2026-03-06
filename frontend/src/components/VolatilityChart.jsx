import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
);

const VolatilityChart = ({ data, currency = 'USD', color = '#EF4444', label = 'USD Volatility' }) => {
    if (!data || !data.length) return null;

    const chartData = {
        labels: data.map(item => item.Date),
        datasets: [
            {
                label: label,
                data: data.map(item => item[`${currency}_Volatility`]),
                borderColor: color,
                backgroundColor: `${color}1A`, // 10% opacity
                tension: 0.4,
                fill: true,
                pointRadius: 0,
                pointHoverRadius: 5,
                pointHitRadius: 20,
                borderWidth: 2,
            }
        ],
    };

    const options = {
        // ... existing options ...
        // (the tool will handle the replacement correctly)
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: '#16161a',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(255,255,255,0.2)',
                borderWidth: 1,
                padding: 10,
                bodyFont: { size: 14, weight: 'bold' }
            }
        },
        interaction: {
            mode: 'index',
            intersect: false,
        },
        scales: {
            y: {
                display: true,
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#E5E7EB', font: { size: 12, weight: 600 } }
            },
            x: {
                display: true,
                grid: { display: false },
                ticks: { display: false }
            },
        },
    };

    return (
        <div style={{ height: '250px', marginTop: '1rem' }}>
            <Line options={options} data={chartData} />
        </div>
    );
};

export default VolatilityChart;
