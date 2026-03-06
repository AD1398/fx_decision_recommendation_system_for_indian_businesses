import React from 'react';

const GlassCard = ({ title, children, subtitle, className = "" }) => {
    return (
        <div className={`glass-pane p-6 flex flex-col gap-2 ${className}`} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div className="card-header pb-2">
                {title && <h3 className="text-sm font-medium text-gray-400 uppercase tracking-widest" style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</h3>}
                {subtitle && <p className="text-2xl font-bold mt-1" style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.25rem' }}>{subtitle}</p>}
            </div>
            <div className="card-body">
                {children}
            </div>
        </div>
    );
};

export default GlassCard;
