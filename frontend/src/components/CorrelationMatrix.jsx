import React from 'react';

const CorrelationMatrix = ({ data }) => {
    if (!data) return null;

    const currencies = Object.keys(data);

    const getIntensity = (val) => {
        if (val > 0) {
            const opacity = 0.1 + (val * 0.7);
            return {
                background: `rgba(37, 99, 235, ${opacity})`,
                color: val > 0.4 ? '#fff' : 'rgba(255,255,255,0.7)',
                border: val > 0.8 ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.05)'
            };
        } else {
            const abs = Math.abs(val);
            const opacity = 0.1 + (abs * 0.7);
            return {
                background: `rgba(239, 68, 68, ${opacity})`,
                color: abs > 0.4 ? '#fff' : 'rgba(255,255,255,0.7)',
                border: abs > 0.8 ? '1px solid rgba(255,255,255,0.3)' : '1px solid rgba(255,255,255,0.05)'
            };
        }
    };

    return (
        <div style={{ padding: '1rem', overflowX: 'auto' }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: `80px repeat(${currencies.length}, 1fr)`,
                gap: '8px',
                minWidth: '400px'
            }}>
                <div />
                {currencies.map(c => (
                    <div key={c} style={{
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        paddingBottom: '8px',
                        letterSpacing: '1px'
                    }}>
                        {c}
                    </div>
                ))}

                {currencies.map(row => (
                    <React.Fragment key={row}>
                        <div style={{
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            color: 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            paddingRight: '12px'
                        }}>
                            {row}
                        </div>
                        {currencies.map(col => {
                            const styleOpts = getIntensity(data[row][col]);
                            return (
                                <div
                                    key={`${row}-${col}`}
                                    style={{
                                        aspectRatio: '1/1',
                                        background: styleOpts.background,
                                        borderRadius: '10px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '0.9rem',
                                        fontWeight: 900,
                                        color: '#fff', // Force white for maximum contrast on colored backgrounds
                                        border: styleOpts.border,
                                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                        boxShadow: data[row][col] > 0.8 || data[row][col] < -0.8 ? 'inset 0 0 10px rgba(255,255,255,0.1)' : 'none',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.5)' // Add shadow for legibility
                                    }}
                                >
                                    {data[row][col].toFixed(2)}
                                </div>
                            );
                        })}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default CorrelationMatrix;
