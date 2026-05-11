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
    { name: 'Stocks', value: 40, color: '#1D9E75' },
    { name: 'ETFs', value: 20, color: '#378ADD' },
    { name: 'Crypto', value: 14, color: '#EF9F27' },
    { name: 'Bonds', value: 26, color: '#D3D1C7' },
  ];

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-medium">Portfolio</h1>
        <p className="text-sm text-gray-500 mt-1">Complete list of your holdings</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Holdings Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-sm font-medium">All holdings</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Ticker</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Qty</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Price</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Value</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {holdings.map((holding) => (
                <tr key={holding.ticker} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-gray-900">{holding.name}</td>
                  <td className="px-4 py-2 text-gray-600 font-medium">{holding.ticker}</td>
                  <td className="px-4 py-2 text-gray-900">{holding.quantity}</td>
                  <td className="px-4 py-2 text-gray-900 font-medium">{holding.price}</td>
                  <td className="px-4 py-2 text-gray-900 font-medium">{holding.value}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        holding.change.startsWith('+') ? 'badge-positive' : 'badge-negative'
                      }`}
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
        <div className="bg-white rounded-lg border border-gray-200 p-4">
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
            <div className="flex flex-col justify-center space-y-2">
              {allocations.map(({ name, value, color }) => (
                <div key={name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{name}</p>
                    <p className="text-xs text-gray-500">{value}%</p>
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