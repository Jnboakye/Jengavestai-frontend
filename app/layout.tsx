import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'JengaVest — AI Financial Analyst',
  description: 'AI powered financial analyst dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}