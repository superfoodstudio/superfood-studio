import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RootLayoutClient } from '@/components/layout/RootLayoutClient';

const inter = Inter({ subsets: ['latin'] });

// Debug environment variables
console.log('Root Layout - Privy App ID:', process.env.NEXT_PUBLIC_PRIVY_APP_ID);

export const metadata: Metadata = {
  title: 'Superfood Studio',
  description: 'Your source for healthy, delicious recipes',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
