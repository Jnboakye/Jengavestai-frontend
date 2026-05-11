'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Jan', value: 100000 },
  { date: 'Feb', value: 105000 },
  { date: 'Mar', value: 102000 },
  { date: 'Apr', value: 108000 },
  { date: 'May', value: 112000 },
  { date: 'Jun', value: 115000 },
  { date: 'Jul', value: 118000 },
  { date: 'Aug', value: 122000 },
  { date: 'Sep', value: 120000 },
  { date: 'Oct', value: 125000 },
  { date: 'Nov', value: 128000 },
  { date: 'Dec', value: 1234567 },
];

export default function PortfolioChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">Portfolio Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Value']} />
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}