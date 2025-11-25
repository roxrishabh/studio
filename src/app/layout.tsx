import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import AppLayout from '@/components/layout/app-layout';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';
import { FirebaseClientProvider } from '@/firebase/client-provider';
import { MissingApiKey } from '@/components/MissingApiKey';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'TwinView - City-Scale Digital Twin',
  description: 'Monitor real-time IoT data streams across your city with an interactive digital twin.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}>
          <MissingApiKey />
        </body>
      </html>
    )
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable} font-body antialiased`}>
        <Providers>
          <FirebaseClientProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </FirebaseClientProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
