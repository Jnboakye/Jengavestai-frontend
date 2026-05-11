'use client';

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Dashboard from '../components/Dashboard';
import ChatPanel from '../components/ChatPanel';

export default function Home() {
  const [activeItem, setActiveItem] = useState('Dashboard');

  return (
    <div className="flex h-screen">
      <Sidebar activeItem={activeItem} onItemClick={setActiveItem} />
      <Dashboard />
      <ChatPanel />
    </div>
  );
}
