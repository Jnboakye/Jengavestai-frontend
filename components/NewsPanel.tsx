import { NewsItem } from '../types';

const dummyNews: NewsItem[] = [
  {
    title: 'Fed Signals Potential Rate Cuts in Q4',
    source: 'Bloomberg',
    date: '2024-01-15',
    sentiment: 'Positive',
  },
  {
    title: 'Tech Stocks Rally on AI Optimism',
    source: 'Reuters',
    date: '2024-01-14',
    sentiment: 'Positive',
  },
  {
    title: 'Oil Prices Surge Amid Geopolitical Tensions',
    source: 'CNBC',
    date: '2024-01-13',
    sentiment: 'Negative',
  },
  {
    title: 'Cryptocurrency Market Shows Signs of Recovery',
    source: 'CoinDesk',
    date: '2024-01-12',
    sentiment: 'Watch',
  },
];

export default function NewsPanel() {
  const getSentimentColor = (sentiment: NewsItem['sentiment']) => {
    switch (sentiment) {
      case 'Positive':
        return 'bg-green-100 text-green-800';
      case 'Negative':
        return 'bg-red-100 text-red-800';
      case 'Watch':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Market News</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {dummyNews.map((news, index) => (
          <div key={index} className="p-4 hover:bg-gray-50">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-sm font-medium text-gray-900 flex-1 mr-4">
                {news.title}
              </h4>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(news.sentiment)}`}>
                {news.sentiment}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{news.source}</span>
              <span>{new Date(news.date).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}