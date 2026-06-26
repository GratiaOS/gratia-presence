import type { Metadata } from 'next';
import Script from 'next/script';
import { Suspense, type ReactNode } from 'react';
import './globals.css';
import { SpiritModeProvider } from '@/components/SpiritModeProvider';
import { ClientProviders } from '@/components/ClientProviders';
import SiteHeader from '@/components/SiteHeader';
import PwaRegister from '@/components/PwaRegister';
import { SkinFieldProvider } from './skin/SkinFieldProvider';
import { defaultLocale } from '../i18n/config';

export const metadata: Metadata = {
  metadataBase: new URL('https://gratia.space'),
  title: {
    default: 'Gratia - A calm place to think.',
    template: '%s | Gratia',
  },
  description:
    'Quiet software for presence, reflection, and rhythm. No account, no feed, no pressure.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Gratia',
    statusBarStyle: 'default',
  },
  openGraph: {
    title: 'Gratia - A calm place to think.',
    description: 'Quiet software for presence, reflection, and rhythm.',
    url: 'https://gratia.space',
    siteName: 'Gratia',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Gratia - A calm place to think.',
    description: 'Quiet software for presence, reflection, and rhythm.',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/mark/gratia-mark.svg', type: 'image/svg+xml' }],
    other: [{ rel: 'mask-icon', url: '/mark/gratia-mark.svg' }],
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const setInitialSkin = `
    try {
      const normalize = (value) => {
        const normalized = typeof value === 'string' ? value.trim().toUpperCase() : null;
        return ['SUN', 'MOON', 'GARDEN', 'STELLAR', 'OFF'].includes(normalized)
          ? normalized
          : null;
      };
      const stored = normalize(window.localStorage.getItem('gratia.skinId'));
      const prefersDark =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const next = stored ?? (prefersDark ? 'MOON' : 'SUN');
      document.documentElement.dataset.skinId = next;
      if (stored && window.localStorage.getItem('gratia.skinId') !== next) {
        window.localStorage.setItem('gratia.skinId', next);
      }
    } catch (e) {
      document.documentElement.dataset.skinId = 'MOON';
    }
  `;

  return (
    <html lang={defaultLocale} dir="ltr" data-typo="ui" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#f3eee2" />
        <meta name="mobile-web-app-capable" content="yes" />
        {/* 
═══════════════════════════════════════════════════════════
   🌱 THE GARDEN REMEMBERS 
   ═══════════════════════════════════════════════════════
   
        ▲
       ▲ ▲        Covenant Embedded. Never erased.
      ▲   ▲       
     ▲▲▲▲▲▲▲     Mandalorian / rdm_kybalion
   
   Huerto · "Stay when the lights go out. Rewire the future."
   Firegate Manifesto · Transformation through intentional clearing.
   
═══════════════════════════════════════════════════════════
        */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
        <Script id="gratia-initial-skin" strategy="beforeInteractive">
          {setInitialSkin}
        </Script>
      </head>
      <body className="bg-surface text-on-surface">
        <SkinFieldProvider>
          <SpiritModeProvider>
            <Suspense fallback={null}>
              <SiteHeader />
            </Suspense>
            {children}
            <ClientProviders />
            <PwaRegister />
          </SpiritModeProvider>
        </SkinFieldProvider>
      </body>
    </html>
  );
}
