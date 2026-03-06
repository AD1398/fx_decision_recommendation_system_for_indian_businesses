import React, { useState } from 'react';
import axios from 'axios';
import { Calculator, ArrowRight, TrendingUp, TrendingDown, AlertCircle, CheckCircle, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import GlassCard from './GlassCard';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const ExposureCalculator = () => {
    const [formData, setFormData] = useState({
        amount: 100000,
        currency: 'USD',
        type: 'Importer'
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCalculate = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/api/calculate-exposure', formData);
            setResult(response.data);
        } catch (error) {
            console.error("Calculation Error", error);
        } finally {
            setLoading(false);
        }
    };

    // Chart Data Preparation
    const chartData = result ? {
        labels: result.scenarios.map(s => s.scenario),
        datasets: [
            {
                label: 'Financial Impact (Gain/Loss)',
                data: result.scenarios.map(s => s.gain_loss),
                backgroundColor: result.scenarios.map(s => s.gain_loss >= 0 ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.6)'),
                borderColor: result.scenarios.map(s => s.gain_loss >= 0 ? '#10B981' : '#EF4444'),
                borderWidth: 1,
            }
        ]
    } : null;

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Scenario Analysis: Potential P&L (INR)', color: '#fff' }
        },
        scales: {
            y: { grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#bbb' } },
            x: { ticks: { color: '#fff' } }
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Input Panel */}
            <div className="lg:col-span-1">
                <GlassCard title="Business Parameters">
                    <div className="flex flex-col gap-6">
                        {/* Business Role Selector */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-3 font-semibold">Business Model</label>
                            <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 relative backdrop-blur-md">
                                {['Importer', 'Exporter'].map(role => (
                                    <button
                                        key={role}
                                        onClick={() => setFormData({ ...formData, type: role })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 relative z-10 ${formData.type === role
                                            ? 'text-white bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        {role === 'Importer' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                        {role}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Currency Selector */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-semibold">Target Currency</label>
                            <div className="relative group">
                                <select
                                    name="currency"
                                    value={formData.currency}
                                    onChange={handleChange}
                                    className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500 focus:bg-blue-600/10 transition-all font-mono tracking-wide cursor-pointer text-base backdrop-blur-md"
                                >
                                    <option value="USD" className="bg-[#0A0A0B]">USD - US Dollar</option>
                                    <option value="GBP" className="bg-[#0A0A0B]">GBP - British Pound</option>
                                    <option value="EUR" className="bg-[#0A0A0B]">EUR - Euro</option>
                                    <option value="JPY" className="bg-[#0A0A0B]">JPY - Japanese Yen</option>
                                    <option value="AUD" className="bg-[#0A0A0B]">AUD - Australian Dollar</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-400 transition-colors">
                                    <TrendingUp size={16} />
                                </div>
                            </div>
                        </div>

                        {/* Amount Input */}
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-semibold">Transaction Volume</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 font-bold">$</span>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 pl-8 text-white outline-none focus:border-blue-500 focus:bg-blue-600/10 transition-all font-mono text-lg font-bold placeholder-gray-600 backdrop-blur-md"
                                    placeholder="0.00"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm font-bold bg-white/5 px-2 py-1 rounded">{formData.currency}</span>
                            </div>
                        </div>

                        <div className="h-px bg-white/10 my-2"></div>

                        {/* Action Button */}
                        <button
                            onClick={handleCalculate}
                            disabled={loading}
                            className="w-full relative overflow-hidden group bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)]"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"></div>
                                    <span className="tracking-wide">COMPUTING...</span>
                                </>
                            ) : (
                                <>
                                    <Calculator size={20} className="group-hover:rotate-12 transition-transform" />
                                    <span className="tracking-wide">RUN SIMULATION</span>
                                    <ArrowRight size={18} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>
                </GlassCard>

                {result && (
                    <div className="mt-6">
                        <GlassCard>
                            <div className={`p-5 rounded-xl flex items-start gap-5 ${result.sensitivity.priority === 'High' ? 'bg-gradient-to-br from-red-500/10 to-red-900/10 border border-red-500/20' :
                                result.sensitivity.priority === 'Medium' ? 'bg-gradient-to-br from-yellow-500/10 to-yellow-900/10 border border-yellow-500/20' :
                                    'bg-gradient-to-br from-emerald-500/10 to-emerald-900/10 border border-emerald-500/20'
                                }`}>
                                <div className={`p-3 rounded-full ${result.sensitivity.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                                    result.sensitivity.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-emerald-500/20 text-emerald-400'
                                    }`}>
                                    {result.sensitivity.priority === 'High' ? <AlertCircle size={24} /> : <CheckCircle size={24} />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className={`text-lg font-bold tracking-tight ${result.sensitivity.priority === 'High' ? 'text-red-400' :
                                                result.sensitivity.priority === 'Medium' ? 'text-yellow-400' : 'text-emerald-400'
                                                }`}>
                                                {result.sensitivity.zone.toUpperCase()} ZONE
                                            </h4>
                                            <p className="text-sm text-gray-300 mt-1 leading-relaxed">{result.sensitivity.message}</p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center gap-3">
                                        <div className="px-3 py-1 rounded bg-black/30 border border-white/5 text-xs text-gray-400">
                                            Sensitivity
                                        </div>
                                        <div className="text-sm font-mono text-white">
                                            <span className="text-gray-500">₹</span>{result.sensitivity.sensitivity_per_rupee.toLocaleString()} <span className="text-gray-600">/ ₹1 shift</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>
                    </div>
                )}
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-2">
                {result ? (
                    <div className="flex flex-col gap-6">
                        {/* KPI Cards */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <GlassCard className="text-center py-2">
                                <p className="text-xs text-gray-400 uppercase tracking-widest">Base Rate Used</p>
                                <p className="text-2xl font-mono font-bold text-white mt-1">₹{result.current_rate}</p>
                            </GlassCard>
                            <GlassCard className="text-center py-2 col-span-2 md:col-span-1">
                                <p className="text-xs text-gray-400 uppercase tracking-widest">Est. Base Value</p>
                                <p className="text-2xl font-mono font-bold text-blue-400 mt-1">₹{(formData.amount * result.current_rate / 100000).toFixed(2)} L</p>
                            </GlassCard>
                            <GlassCard className="text-center py-2 md:col-span-1">
                                <p className="text-xs text-gray-400 uppercase tracking-widest">Adverse Risk</p>
                                <p className="text-2xl font-mono font-bold text-red-500 mt-1">
                                    {result.scenarios.find(s => s.scenario === 'Adverse')?.gain_loss < 0 ? '-' : '+'}
                                    ₹{Math.abs(result.scenarios.find(s => s.scenario === 'Adverse')?.gain_loss).toLocaleString()}
                                </p>
                            </GlassCard>
                        </div>

                        {/* Chart */}
                        <GlassCard title="Scenario Outcomes (Gain/Loss)">
                            <div className="h-64">
                                <Bar data={chartData} options={chartOptions} />
                            </div>
                        </GlassCard>

                        {/* Table */}
                        <GlassCard>
                            <table className="w-full text-left text-sm">
                                <thead>
                                    <tr className="border-b border-white/10 text-gray-400">
                                        <th className="pb-3 pl-2">Scenario</th>
                                        <th className="pb-3">Rate Used</th>
                                        <th className="pb-3 text-right pr-2">Net Impact (INR)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.scenarios.map((s, idx) => (
                                        <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                            <td className="py-3 pl-2 font-medium">
                                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${s.scenario === 'Favorable' ? 'bg-green-500' : s.scenario === 'Adverse' ? 'bg-red-500' : 'bg-gray-500'
                                                    }`}></span>
                                                {s.scenario} ({s.percent_change})
                                            </td>
                                            <td className="py-3 font-mono text-gray-300">₹{s.rate}</td>
                                            <td className={`py-3 text-right pr-2 font-bold font-mono ${s.gain_loss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {s.gain_loss > 0 ? '+' : ''}{s.gain_loss.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </GlassCard>
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                        <Calculator size={64} className="text-white/20 mb-6" />
                        <h3 className="text-xl font-bold text-white mb-2">Ready to Calculate</h3>
                        <p className="text-gray-400 text-center max-w-sm">Enter your transaction details on the left to simulate real-time market scenarios and exposure risk.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExposureCalculator;
