'use client';

import React from 'react';

export default function PortfolioPage() {
  const holdings = [
    {
      name: 'Apple Inc.',
      ticker: 'AAPL',
      quantity: 50,
      price: '$189.42',
      value: '$9,471',
      change: '+1.8%',
    },
    {
      name: 'Microsoft Corporation',
      ticker: 'MSFT',
      quantity: 30,
      price: '$412.10',
      value: '$12,363',
      change: '+2.1%',
    },
    {
      name: 'S&P 500 ETF',
      ticker: 'SPY',
      quantity: 25,
      price: '$521.30',
      value: '$13,032.50',
      change: '+1.2%',
    },
    {
      name: 'Bitcoin',
      ticker: 'BTC',
      quantity: 0.5,
      price: '$67,204',
      value: '$33,602',
      change: '-0.8%',
    },
    {
      name: 'Ethereum',
      ticker: 'ETH',
      quantity: 5,
      price: '$2,450',
      value: '$12,250',
      change: '-1.2%',
    },
  ];

  const allocations = [
    { name: 'Stocks', value: 40, color: '#10b981' },
    { name: 'ETFs', value: 20, color: '#378ADD' },
    { name: 'Crypto', value: 14, color: '#EF9F27' },
    { name: 'Bonds', value: 26, color: '#8B8680' },
  ];

  return (
    <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--color-main-bg)' }}>
      {/* Header */}
      <div className="border-b px-6 py-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}>
        <h1 className="text-xl font-medium">Portfolio</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>Complete list of your holdings</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Holdings Table */}
        <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
          <div className="p-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-sm font-medium">All holdings</h3>
          </div>
          <table className="w-full text-sm">
            <thead style={{ backgroundColor: 'var(--color-main-bg)', borderBottomColor: 'var(--color-border)', borderBottomWidth: '1px' }}>
              <tr>
                <th className="px-4 py-2 text-left font-medium text-xs" style={{ color: 'var(--color-text-muted)' }}>Name</th>
                <th className="px-4 py-2 text-left font-medium text-xs" style={{ color: 'var(--color-text-muted)' }}>Ticker</th>
                <th className="px-4 py-2 text-left font-medium text-xs" style={{ color: 'var(--color-text-muted)' }}>Qty</th>
                <th className="px-4 py-2 text-left font-medium text-xs" style={{ color: 'var(--color-text-muted)' }}>Price</th>
                <th className="px-4 py-2 text-left font-medium text-xs" style={{ color: 'var(--color-text-muted)' }}>Value</th>
                <th className="px-4 py-2 text-left font-medium text-xs" style={{ color: 'var(--color-text-muted)' }}>Change</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding) => (
                <tr key={holding.ticker} style={{ borderBottomColor: 'var(--color-border)', borderBottomWidth: '1px' }}>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>{holding.name}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-secondary)' }}>{holding.ticker}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-text-primary)' }}>{holding.quantity}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-text-primary)' }}>{holding.price}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-text-primary)' }}>{holding.value}</td>
                  <td className="px-4 py-3">
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: holding.change.startsWith('+') ? '#10b98133' : '#ef444433',
                        color: holding.change.startsWith('+') ? '#10b981' : '#ef4444',
                      }}
                    >
                      {holding.change}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Allocation Chart */}
        <div className="rounded-lg border p-4" style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}>
          <h3 className="text-sm font-medium mb-4">Asset allocation</h3>
          <div className="flex gap-8">
            {/* Chart */}
            <div className="flex-1">
              <div className="flex justify-center mb-3">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {allocations.reduce(
                      (acc, { value, color }, idx) => {
                        const prevOffset = acc.offset;
                        const percentage = (value / 100) * 360;
                        const startAngle = (prevOffset * Math.PI) / 180;
                        const endAngle = ((prevOffset + percentage) * Math.PI) / 180;

                        const x1 = 50 + 40 * Math.cos(startAngle - Math.PI / 2);
                        const y1 = 50 + 40 * Math.sin(startAngle - Math.PI / 2);
                        const x2 = 50 + 40 * Math.cos(endAngle - Math.PI / 2);
                        const y2 = 50 + 40 * Math.sin(endAngle - Math.PI / 2);

                        const largeArc = percentage > 180 ? 1 : 0;

                        return {
                          elements: [
                            ...acc.elements,
                            <path
                              key={idx}
                              d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                              fill={color}
                            />,
                          ],
                          offset: prevOffset + percentage,
                        };
                      },
                      { elements: [], offset: 0 }
                    ).elements}
                  </svg>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-col justify-center space-y-3">
              {allocations.map(({ name, value, color }) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>{name}</p>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{value}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}