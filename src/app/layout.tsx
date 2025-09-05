import type { Metadata } from 'next';
import './globals.css';
import { RootLayoutClient } from '@/components/layout/RootLayoutClient';

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
    <html lang="en" dir="ltr" data-rs-theme="superfood" data-rs-color-mode="light">
      <head>
        <link 
          rel="preload" 
          href="/Midruns-Font-Duo/Web Fonts/midruns_-_script-webfont.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous"
        />
        <link 
          rel="preconnect" 
          href="https://fonts.googleapis.com"
        />
        <link 
          rel="preconnect" 
          href="https://fonts.gstatic.com" 
          crossOrigin="anonymous"
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
