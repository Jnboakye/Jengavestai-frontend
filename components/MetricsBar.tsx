export default function MetricsBar() {
  const metrics = [
    { label: 'Portfolio Value', value: '$1,234,567', change: '+2.34%', isPositive: true },
    { label: 'Day Gain', value: '$28,945', change: '+2.34%', isPositive: true },
    { label: 'S&P 500', value: '4,567.89', change: '-0.12%', isPositive: false },
    { label: 'Risk Score', value: 'Medium', change: '', isPositive: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric) => (
        <div key={metric.label} className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-600">{metric.label}</div>
          <div className="text-2xl font-semibold mt-1">{metric.value}</div>
          {metric.change && (
            <div className={`text-sm mt-1 ${metric.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {metric.change}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}