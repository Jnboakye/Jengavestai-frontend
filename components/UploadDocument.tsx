'use client';

import React from 'react';

export default function Settings() {
  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: 'var(--color-main-bg)' }}>
      {/* Header */}
      <div
        className="shrink-0 px-6 py-4 border-b"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-card-bg)' }}
      >
        <h1 className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>Settings</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>Manage your preferences</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div
          className="max-w-lg rounded-lg border p-6"
          style={{ backgroundColor: 'var(--color-card-bg)', borderColor: 'var(--color-border)' }}
        >
          {/* Notifications */}
          <div className="mb-6">
            <h3 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
              Notifications
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Email notifications', defaultChecked: true },
                { label: 'Push notifications', defaultChecked: true },
                { label: 'Portfolio alerts', defaultChecked: false },
              ].map(({ label, defaultChecked }) => (
                <label key={label} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked={defaultChecked}
                    className="rounded"
                    style={{ accentColor: '#1D9E75' }}
                  />
                  <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Data */}
          <div className="border-t pt-6" style={{ borderColor: 'var(--color-border)' }}>
            <h3 className="text-xs font-medium uppercase tracking-wider mb-4" style={{ color: 'var(--color-text-muted)', letterSpacing: '0.05em' }}>
              Data
            </h3>
            <button
              className="text-sm"
              style={{ color: '#dc2626' }}
            >
              Clear chat history
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
