'use client';

import { IconTrash, IconSearch } from '@tabler/icons-react';
import { usePortfolio, fmtUsd, fmtUsd2 } from '@/lib/portfolio';

export default function PortfolioPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const { holdings, totals, removeHolding } = usePortfolio();
  const gainSign = totals.dayGainUsd >= 0 ? '+' : '';
  const gainColor = totals.dayGainUsd >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="px-6 py-3.5 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-[13px] font-medium text-gray-900">Portfolio</h1>
          <p className="text-[11px] text-gray-500 mt-0.5">Your holdings and performance</p>
        </div>
        <button
          onClick={() => onNavigate('markets')}
          className="bg-[#111827] text-white text-[11px] px-3 py-1.5 rounded-md"
        >
          Add holding
        </button>
      </div>

      {holdings.length === 0 ? (
        <div className="p-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-10 flex flex-col items-center text-center">
            <h2 className="text-[14px] font-semibold text-gray-900 mb-1">No holdings yet</h2>
            <p className="text-[12px] text-gray-500 mb-5">Add stocks from the Markets page to start building your portfolio.</p>
            <button
              onClick={() => onNavigate('markets')}
              className="flex items-center gap-1.5 bg-[#111827] text-white text-[12px] rounded-lg px-4 py-2.5 hover:bg-black"
            >
              <IconSearch size={14} /> Browse markets
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4 flex flex-col gap-3">
          {/* Summary bar */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-[11px] text-gray-500 mb-1">Total value</p>
              <p className="text-[18px] font-medium text-gray-900">{fmtUsd(totals.value)}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-[11px] text-gray-500 mb-1">Invested</p>
              <p className="text-[18px] font-medium text-gray-900">{fmtUsd(totals.invested)}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-[11px] text-gray-500 mb-1">Day gain</p>
              <p className={`text-[18px] font-medium ${gainColor}`}>{gainSign}{fmtUsd(totals.dayGainUsd)}</p>
            </div>
          </div>

          {/* Holdings table */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[560px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    {['Name', 'Price', 'Shares', 'Invested', 'Value', 'Change', ''].map((col) => (
                      <th key={col} className="px-4 py-2.5 text-left text-[10px] text-gray-500 font-normal">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {holdings.map((h, i) => (
                    <tr key={h.ticker} className={i < holdings.length - 1 ? 'border-b border-gray-200' : ''}>
                      <td className="px-4 py-3 text-[12px] text-gray-900">
                        <span className="font-medium">{h.ticker}</span>
                        <span className="text-gray-400"> · {h.name}</span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-gray-900">{fmtUsd2(h.price)}</td>
                      <td className="px-4 py-3 text-[12px] text-gray-500">{h.shares.toFixed(4)}</td>
                      <td className="px-4 py-3 text-[12px] text-gray-500">{fmtUsd(h.amountUsd)}</td>
                      <td className="px-4 py-3 text-[12px] text-gray-900">{fmtUsd2(h.currentValue)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${h.change >= 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                          {h.change >= 0 ? '+' : ''}{h.change.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => removeHolding(h.ticker)}
                          className="text-gray-300 hover:text-red-500 transition-colors"
                          aria-label={`Remove ${h.ticker}`}
                        >
                          <IconTrash size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
