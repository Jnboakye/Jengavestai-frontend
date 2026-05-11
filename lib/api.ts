import axios from 'axios';
import { ChatRequest, ChatResponse, UploadResponse, HealthResponse, Message } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const sendMessage = async (message: string, history: Message[]): Promise<ChatResponse> => {
  const request: ChatRequest = {
    message,
    conversation_history: history,
  };

  const response = await axios.post(`${API_BASE_URL}/chat`, request);
  return response.data;
};

export const streamMessage = (message: string, history: Message[], onMessage: (chunk: string) => void): EventSource => {
  const request: ChatRequest = {
    message,
    conversation_history: history,
  };

  const eventSource = new EventSource(`${API_BASE_URL}/chat/stream?data=${encodeURIComponent(JSON.stringify(request))}`);

  eventSource.onmessage = (event) => {
    onMessage(event.data);
  };

  eventSource.onerror = (error) => {
    console.error('SSE error:', error);
    eventSource.close();
  };

  return eventSource;
};

export const uploadDocument = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const checkHealth = async (): Promise<HealthResponse> => {
  const response = await axios.get(`${API_BASE_URL}/health`);
  return response.data;
};