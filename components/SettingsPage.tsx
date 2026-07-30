'use client';

import { usePortfolio } from '@/lib/portfolio';

export default function SettingsPage({ onLogout }: { onLogout: () => void }) {
  const { reset, holdings } = usePortfolio();

  const notifications = [
    { label: 'Email notifications', defaultChecked: true },
    { label: 'Push notifications', defaultChecked: true },
    { label: 'Portfolio alerts', defaultChecked: false },
  ];

  const handleReset = () => {
    if (holdings.length === 0) return;
    if (confirm('Remove all holdings from your portfolio?')) reset();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <div className="px-6 py-3.5 bg-white border-b border-gray-200">
        <h1 className="text-[13px] font-medium text-gray-900">Settings</h1>
        <p className="text-[11px] text-gray-500 mt-0.5">Manage your preferences (demo — not persisted)</p>
      </div>

      <div className="p-4">
        <div className="max-w-lg bg-white border border-gray-200 rounded-xl p-5">
          <h3 className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-3">Notifications</h3>
          <div className="flex flex-col gap-3">
            {notifications.map(({ label, defaultChecked }) => (
              <label key={label} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" defaultChecked={defaultChecked} className="rounded" style={{ accentColor: '#1D9E75' }} />
                <span className="text-[12px] text-gray-700">{label}</span>
              </label>
            ))}
          </div>

          <div className="border-t border-gray-200 mt-5 pt-5">
            <h3 className="text-[10px] font-medium uppercase tracking-wider text-gray-400 mb-3">Data</h3>
            <div className="flex flex-col items-start gap-3">
              <button onClick={handleReset} className="text-[12px] text-red-600 hover:text-red-700">
                Reset portfolio
              </button>
              <button onClick={onLogout} className="text-[12px] text-gray-600 hover:text-gray-800">
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
