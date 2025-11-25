import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import AppLayout from '@/components/layout/app-layout';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';
import { FirebaseClientProvider } from '@/firebase/client-provider';

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

function MissingApiKey() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-center">
      <div className="rounded-lg border-2 border-dashed border-destructive p-8">
        <h2 className="text-2xl font-bold text-destructive">API Key Missing</h2>
        <p className="mt-2 max-w-md text-muted-foreground">
          The Google Maps API key is not configured. Please add your key to the{' '}
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
            .env
          </code>{' '}
          file.
        </p>
        <pre className="mt-4 rounded-md bg-muted p-4 text-left">
          <code className="text-sm">
            NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="YOUR_API_KEY_HERE"
          </code>
        </pre>
      </div>
    </div>
  )
}


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
