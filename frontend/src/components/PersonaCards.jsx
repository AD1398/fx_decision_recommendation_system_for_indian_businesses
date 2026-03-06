import React from 'react';
import GlassCard from './GlassCard';
import { ShoppingCart, Send, Laptop } from 'lucide-react';

const PersonaCards = () => {
    const personas = [
        {
            id: 'importer',
            name: 'Importer',
            icon: <ShoppingCart size={20} className="text-blue-500" />,
            impact: 'HIGH',
            strategy: 'Hedge to lock in current rate before potential INR depreciation.',
            color: '#2563EB'
        },
        {
            id: 'exporter',
            name: 'Exporter',
            icon: <Send size={20} className="text-emerald-500" />,
            impact: 'MEDIUM',
            strategy: 'Wait for peak INR depreciation to maximize USD conversion.',
            color: '#10B981'
        },
        {
            id: 'it-service',
            name: 'IT Services',
            icon: <Laptop size={20} className="text-amber-500" />,
            impact: 'LOW',
            strategy: 'Partial hedging recommended for fixed offshore operational costs.',
            color: '#F59E0B'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {personas.map(p => (
                <GlassCard key={p.id} title={`${p.name} Strategy`} className="hover:scale-105 transition-transform">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ padding: '8px', background: `${p.color}15`, borderRadius: '8px' }}>{p.icon}</div>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>IMPACT: {p.impact}</span>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{p.strategy}</p>
                </GlassCard>
            ))}
        </div>
    );
};

export default PersonaCards;
