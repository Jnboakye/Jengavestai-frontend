export interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  tools_used?: string[];
}

export interface Holding {
  ticker: string;
  name: string;
  quantity: number;
  current_price: number;
  price_change: number;
  price_change_percent: number;
}

export interface PortfolioMetrics {
  total_value: number;
  day_gain: number;
  day_gain_percent: number;
}

export interface ChatRequest {
  message: string;
  conversation_history: Message[];
}

export interface ChatResponse {
  response: string;
  citations?: string[];
  tools_used?: string[];
  query_type?: string;
}

export interface NewsItem {
  title: string;
  source: string;
  date: string;
  sentiment: 'Positive' | 'Negative' | 'Watch';
}

export interface UploadResponse {
  status: string;
  message: string;
}

export interface HealthResponse {
  status: string;
}