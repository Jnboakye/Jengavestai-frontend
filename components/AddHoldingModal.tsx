'use client';

import { useState } from 'react';
import { IconX } from '@tabler/icons-react';
import { Stock } from '@/types';
import { usePortfolio, fmtUsd2 } from '@/lib/portfolio';

interface Props {
  stock: Stock;
  onClose: () => void;
  onAdded?: () => void;
}

export default function AddHoldingModal({ stock, onClose, onAdded }: Props) {
  const { addHolding } = usePortfolio();
  const [amount, setAmount] = useState('');

  const value = parseFloat(amount);
  const valid = !isNaN(value) && value > 0;
  const shares = valid ? value / stock.price : 0;

  const submit = () => {
    if (!valid) return;
    addHolding(stock.ticker, value);
    onAdded?.();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm bg-white rounded-2xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[13px] font-semibold text-gray-900">Add {stock.ticker}</p>
            <p className="text-[11px] text-gray-500">{stock.name} · {fmtUsd2(stock.price)}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <IconX size={16} />
          </button>
        </div>

        {/* Amount input */}
        <label className="text-[12px] font-medium text-gray-700">How much did you buy? (USD)</label>
        <div className="mt-1.5 flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3">
          <span className="text-gray-400 text-[14px]">$</span>
          <input
            type="number"
            min="0"
            step="any"
            autoFocus
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder="1000"
            className="flex-1 bg-transparent outline-none py-2.5 text-[14px] text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Quick chips */}
        <div className="flex gap-2 mt-2">
          {[500, 1000, 5000].map((v) => (
            <button
              key={v}
              onClick={() => setAmount(String(v))}
              className="text-[11px] px-2.5 py-1 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
            >
              ${v.toLocaleString()}
            </button>
          ))}
        </div>

        <p className="text-[11px] text-gray-500 mt-3">
          {valid ? `≈ ${shares.toFixed(4)} shares at ${fmtUsd2(stock.price)}` : 'Enter an amount to see estimated shares.'}
        </p>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 text-[12px] border border-gray-200 rounded-lg py-2.5 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={!valid}
            className="flex-1 text-[12px] bg-[#111827] text-white rounded-lg py-2.5 disabled:opacity-40 hover:bg-black"
          >
            Add to portfolio
          </button>
        </div>
      </div>
    </div>
  );
}
