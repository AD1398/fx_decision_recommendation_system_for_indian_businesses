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

const RateChart = ({ data, currency = 'USD', color = '#2563EB', label = 'USD/INR' }) => {
    if (!data || !data.length) return null;

    const chartData = {
        labels: data.map(item => item.Date),
        datasets: [
            {
                fill: true,
                label: label,
                data: data.map(item => item[currency]),
                borderColor: color,
                backgroundColor: `${color}1A`, // 10% opacity
                tension: 0.4,
                pointRadius: 0,
                borderWidth: 2,
            }
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#9CA3AF', font: { family: 'Inter' } }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#16161a',
                titleColor: '#fff',
                bodyColor: '#9CA3AF',
                borderColor: 'rgba(255,255,255,0.1)',
                borderWidth: 1,
            },
        },
        scales: {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)' },
                ticks: { color: '#9CA3AF' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#9CA3AF', maxRotation: 45, minRotation: 45 }
            },
        },
    };

    return (
        <div style={{ height: '350px' }}>
            <Line options={options} data={chartData} />
        </div>
    );
};

export default RateChart;
