import type {Metadata} from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/lib/language';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Warehouse Sentinel - Intelligent Storage Monitoring',
  description: 'Monitor your warehouse storage environment with AI-powered insights for temperature, humidity, and dust.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
        <link rel="preload" href="https://i.ibb.co/0ySs51QD/tdms-in-warehouse.png" as="image" />
      </Head>
      <body className="font-body antialiased">
        <AuthProvider>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}