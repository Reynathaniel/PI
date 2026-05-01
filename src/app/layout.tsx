import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'π Project Intelligence | EPC Management System',
  description: 'Comprehensive EPC Project Management System with 96 roles, HSSE, Planning, QC, Procurement, and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
