import React, { useState } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  AlertTriangle,
  Settings,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  ShieldCheck,
  Zap,
  Globe,
  Calendar,
  AlertCircle,
  Calculator
} from 'lucide-react';
import { useFXData } from './hooks/useFXData';
import GlassCard from './components/GlassCard';
import RateChart from './components/RateChart';
import VolatilityChart from './components/VolatilityChart';
import CorrelationMatrix from './components/CorrelationMatrix';
import RiskMap from './components/RiskMap';
import PersonaCards from './components/PersonaCards';
import ExposureCalculator from './components/ExposureCalculator';
import './index.css';

function App() {
  const [selectedDate, setSelectedDate] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const { data, loading, error, refresh } = useFXData(selectedDate);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#000', color: '#fff' }}>
        <div className="text-center">
          <RefreshCcw className="animate-spin mb-4" size={48} color="#2563EB" />
          <p className="text-xl font-medium">Connecting to FX Engine...</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '8px' }}>Neural computations in progress...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (error) {
      return (
        <GlassCard title="Engine Connection Error" className="border-red-500/30">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: '#EF4444' }}>
            <AlertCircle size={32} />
            <div>
              <p style={{ fontWeight: 600 }}>{error}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Please ensure the Python API bridge is running (`python adarsh_part/api_bridge.py`).</p>
            </div>
          </div>
          <button onClick={refresh} style={{ marginTop: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '8px 20px', borderRadius: '8px', color: '#EF4444', fontWeight: 600, cursor: 'pointer' }}>
            Retry Connection
          </button>
        </GlassCard>
      );
    }
    const CURRENCIES = [
      { code: 'USD', color: '#2563EB', label: 'USD / INR' },
      { code: 'GBP', color: '#10B981', label: 'GBP / INR' },
      { code: 'EUR', color: '#6366F1', label: 'EUR / INR' },
      { code: 'JPY', color: '#F59E0B', label: 'JPY / INR' }
    ];

    switch (activeTab) {
      case 'overview':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {CURRENCIES.map(curr => {
                const pairData = data?.pairs?.[curr.code];
                return (
                  <GlassCard key={curr.code} title={`${curr.code} / INR Spot`} subtitle={`₹${pairData?.current_rate || '---'}`}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {pairData?.trend === 'UP' ? <TrendingUp color="#EF4444" size={16} /> : <TrendingDown color="#10B981" size={16} />}
                        <span style={{ color: pairData?.trend === 'UP' ? '#EF4444' : '#10B981', fontWeight: 700, fontSize: '0.7rem' }}>
                          {pairData?.trend}WARD TREND
                        </span>
                      </div>
                      <div style={{ padding: '4px 10px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '4px' }}>
                        Forecast: ₹{pairData?.forecast_7d || '---'}
                      </div>
                    </div>
                  </GlassCard>
                );
              })}
            </div>

            <div style={{ marginTop: '2.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem' }}>Multi-Currency Strategic Advisories</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {CURRENCIES.map(curr => {
                  const pairData = data?.pairs?.[curr.code];
                  return (
                    <GlassCard
                      key={curr.code}
                      title={`${curr.code} Strategy`}
                      style={{ borderLeft: `4px solid ${curr.color}`, position: 'relative', overflow: 'hidden' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ background: `linear-gradient(135deg, ${curr.color}20, transparent)`, padding: '0.8rem', borderRadius: '12px' }}>
                          <ShieldCheck size={28} color={curr.color} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{pairData?.recommendation || 'Engine Not Ready'}</h4>
                          <span style={{
                            padding: '2px 8px',
                            borderRadius: '100px',
                            background: pairData?.risk_level === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(37, 99, 235, 0.2)',
                            color: pairData?.risk_level === 'High' ? '#EF4444' : '#2563EB',
                            fontWeight: 800,
                            fontSize: '0.65rem',
                            letterSpacing: '0.5px',
                            display: 'inline-block',
                            marginTop: '6px'
                          }}>
                            {pairData?.risk_level?.toUpperCase()} RISK
                          </span>
                        </div>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </div>
            <div style={{ marginTop: '2.5rem', marginBottom: '1.5rem', paddingLeft: '4px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '2px' }}>Persona Analysis</h3>
            </div>
            <PersonaCards spotRate={data?.pairs?.USD?.current_rate} />
          </>
        );
      case 'analytics':
        return (
          <div className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {CURRENCIES.map(curr => (
                <GlassCard key={curr.code} title={`${curr.code} / INR Historical`}>
                  <RateChart data={data?.analysis?.historical_90d} currency={curr.code} color={curr.color} label={`${curr.code}/INR Spot`} />
                </GlassCard>
              ))}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.8rem', fontStyle: 'italic' }}>
              <strong>Interpretation:</strong> Tracks historical exchange rates for major pairs. Upward trends indicate INR weakness (higher cost to buy), while downward trends suggest INR strength against that specific currency.
            </p>

            <div style={{ marginTop: '2.5rem' }}>
              <GlassCard title="Currency Dependency Matrix (Interdependence)">
                <CorrelationMatrix data={data?.analysis?.correlations} />
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.8rem', fontStyle: 'italic' }}>
                  <strong>Interpretation:</strong> Measures how currencies move together. <strong>Blue (Positive)</strong> means they rise/fall in tandem. <strong>Red (Negative)</strong> means they move in opposite directions, acting as a natural hedge.
                </p>
              </GlassCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '2.5rem' }}>
              {CURRENCIES.map(curr => (
                <GlassCard key={curr.code} title={`${curr.code} Volatility Profile`}>
                  <VolatilityChart data={data?.analysis?.volatility_trend} currency={curr.code} color={curr.color} label={`${curr.code} Volatility`} />
                </GlassCard>
              ))}
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.8rem', fontStyle: 'italic' }}>
              <strong>Interpretation:</strong> Measures market "nervousness" and price swings for each currency. High peaks indicate periods of high uncertainty and increased financial risk for that specific pair.
            </p>
          </div>
        );
      case 'risk':
        return (
          <div className="flex flex-col gap-6" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {CURRENCIES.map(curr => {
                const pairData = data?.pairs?.[curr.code];
                return (
                  <GlassCard key={curr.code} title={`${curr.code} Risk Level`} subtitle={pairData?.risk_level}>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginTop: '12px' }}>
                      <div style={{
                        width: `${pairData?.risk_score || 0}%`,
                        height: '100%',
                        background: pairData?.risk_level === 'High' ? '#EF4444' : curr.color,
                        borderRadius: '4px',
                        transition: 'width 1s ease-in-out'
                      }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
                      <span>SCORE: {pairData?.risk_score}</span>
                      <span>{pairData?.status || 'MONITOR'}</span>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
              <GlassCard title="Engine Heartbeat" subtitle="ACTIVE">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#10B981', fontSize: '0.85rem', fontWeight: 600, marginTop: '12px' }}>
                  <div className="animate-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
                  MULTI-PAIR PROCESSING
                </div>
              </GlassCard>
              <GlassCard title="Last Compute" subtitle={data?.timestamp}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Dynamic cross-currency assessment.</p>
              </GlassCard>
              <GlassCard title="Prophet Signal" subtitle="SYNCED">
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>7-day neural projections active.</p>
              </GlassCard>
            </div>
            <GlassCard title="Advanced Risk Mapping (Volatility vs Sensitivity)">
              <div style={{ minHeight: '350px', padding: '1.5rem', marginTop: '1rem' }}>
                {data?.analysis?.risk_map ? (
                  <>
                    <RiskMap data={data.analysis.risk_map} />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', fontStyle: 'italic', lineHeight: '1.4' }}>
                      <strong>Interpretation:</strong> This quadrant identifies strategic risk clusters.
                      Assets in the <strong>Top-Left (Volatile)</strong> require active hedging.
                      Assets in the <strong>Bottom-Right (Safe Haven)</strong> are stable candidates for spot conversion.
                    </p>
                  </>
                ) : (
                  <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--glass-border)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
                    <div className="text-center">
                      <Globe size={48} className="mx-auto mb-4 opacity-20" color="var(--text-secondary)" />
                      <p style={{ color: 'var(--text-secondary)' }}>Advanced Risk Visualizer syncing with Prophet Engine...</p>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        );
      case 'calculator':
        return <ExposureCalculator />;
      case 'settings':
        return (
          <div style={{ maxWidth: '600px' }}>
            <GlassCard title="System Configuration">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <span>Engine Connection</span>
                  <span style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 800 }}>DOCKER_BRIDGE_UP</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <span>Forecast Horizon</span>
                  <span style={{ color: 'var(--text-secondary)' }}>7 Days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                  <span>Volatility Window</span>
                  <span style={{ color: 'var(--text-secondary)' }}>30 Days</span>
                </div>
              </div>
            </GlassCard>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="brand-section">
          <Zap size={32} color="#2563EB" fill="#2563EB" />
          <span className="brand">FX SCOPE</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            <LayoutDashboard size={20} />
            <span>Overview</span>
          </div>
          <div className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            <BarChart3 size={20} />
            <span>Market Analytics</span>
          </div>
          <div className={`nav-item ${activeTab === 'risk' ? 'active' : ''}`} onClick={() => setActiveTab('risk')}>
            <AlertTriangle size={20} />
            <span>Risk Matrix</span>
          </div>
          <div className={`nav-item ${activeTab === 'calculator' ? 'active' : ''}`} onClick={() => setActiveTab('calculator')}>
            <Calculator size={20} />
            <span>Fx Calculator</span>
          </div>
          <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')} style={{ marginTop: 'auto' }}>
            <Settings size={20} />
            <span>System Config</span>
          </div>
        </nav>

        <div style={{ marginTop: 'auto' }}>
          <GlassCard title="Engine Sync" className="bg-opacity-20 border-green-900/30">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }}></div>
              <span style={{ fontSize: '0.8rem', color: '#10B981' }}>Live Python Bridge</span>
            </div>
          </GlassCard>
        </div>
      </aside>

      <main className="main-content">
        <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, letterSpacing: '-1.5px', textTransform: 'capitalize' }}>{activeTab}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Automated Decision Intelligence • {data?.timestamp || 'Syncing...'}</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div className="glass-pane" style={{ padding: '0.6rem 1.2rem', borderRadius: '14px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar size={18} color="var(--accent-primary)" />
              <input
                type="date"
                value={selectedDate}
                onChange={handleDateChange}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  colorScheme: 'dark',
                  outline: 'none',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              />
            </div>
            <button onClick={refresh} className="glass-pane" style={{ padding: '0.8rem', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
              <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </header>

        {renderContent()}
      </main>
    </div>
  );
}

export default App;
