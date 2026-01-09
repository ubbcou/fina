import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'FinaFlash - Pro Financial News Aggregator',
  description: 'Real-time financial news from CLS, WSCN, Jin10, and Ths.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
