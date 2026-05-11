import { Holding } from '../types';

const dummyHoldings: Holding[] = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    quantity: 100,
    current_price: 150.25,
    price_change: 2.50,
    price_change_percent: 1.69,
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    quantity: 50,
    current_price: 2800.00,
    price_change: -15.25,
    price_change_percent: -0.54,
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    quantity: 75,
    current_price: 305.80,
    price_change: 5.20,
    price_change_percent: 1.73,
  },
  {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    quantity: 25,
    current_price: 220.50,
    price_change: -8.75,
    price_change_percent: -3.82,
  },
];

export default function HoldingsTable() {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Holdings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ticker
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Change %
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {dummyHoldings.map((holding) => (
              <tr key={holding.ticker} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {holding.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {holding.ticker}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${holding.current_price.toFixed(2)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  holding.price_change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {holding.price_change >= 0 ? '+' : ''}${holding.price_change.toFixed(2)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  holding.price_change_percent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {holding.price_change_percent >= 0 ? '+' : ''}{holding.price_change_percent.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}