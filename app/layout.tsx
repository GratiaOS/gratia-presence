import type { Metadata } from 'next';
import Script from 'next/script';
import { Suspense, type ReactNode } from 'react';
import './globals.css';
import { SpiritModeProvider } from '@/components/SpiritModeProvider';
import { ClientProviders } from '@/components/ClientProviders';
import EnergySystemClient from '@/components/energy/EnergySystemClient';
import SiteHeader from '@/components/SiteHeader';
import { SkinFieldProvider } from './skin/SkinFieldProvider';
import { defaultLocale, supportedLocales } from '../i18n/config';

export const metadata: Metadata = {
  metadataBase: new URL('https://gratia.space'),
  title: {
    default: 'Gratia - Personal OS',
    template: '%s | Gratia',
  },
  description:
    'Quiet software for presence, reflection, and rhythm. No account, no feed, no pressure.',
  openGraph: {
    title: 'Gratia - Personal OS',
    description: 'Quiet software for presence, reflection, and rhythm.',
    url: 'https://gratia.space',
    siteName: 'Gratia',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Gratia - Personal OS',
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
  const initialSkin = undefined;

  const setInitialSkin = `
    try {
      if (!document.documentElement.dataset.skinId) {
        const stored =
          window.localStorage.getItem('gratiaSkinId') ??
          window.localStorage.getItem('gratia.skinId');
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const next = stored
          ? (prefersDark && stored === 'SUN' ? 'MOON' : stored)
          : prefersDark ? 'MOON' : 'SUN';
        document.documentElement.dataset.skinId = next;
      }
    } catch (e) {
      document.documentElement.dataset.skinId = 'MOON';
    }
  `;
  const setInitialTypo = `
    try {
      const stored = window.localStorage.getItem('gratia.typo');
      const next = stored === 'mono' ? 'mono' : 'ui';
      document.documentElement.dataset.typo = next;
    } catch (e) {
      document.documentElement.dataset.typo = 'ui';
    }
  `;
  const setInitialLocale = `
    try {
      const supported = ${JSON.stringify(supportedLocales)};
      const params = new URLSearchParams(window.location.search);
      const fromQuery = params.get('lang');
      const stored = window.localStorage.getItem('gratia.locale');
      const pick = (value) => (value && supported.includes(value) ? value : null);
      const next = pick(fromQuery) || pick(stored) || '${defaultLocale}';
      document.documentElement.lang = next;
      if (fromQuery && pick(fromQuery)) {
        window.localStorage.setItem('gratia.locale', next);
      }
    } catch (e) {
      document.documentElement.lang = '${defaultLocale}';
    }
  `;

  return (
    <html
      lang={defaultLocale}
      dir="ltr"
      data-typo="ui"
      data-skin-id={initialSkin}
      suppressHydrationWarning
    >
      <head>
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
        <Script id="gratia-initial-typo" strategy="beforeInteractive">
          {setInitialTypo}
        </Script>
        <Script id="gratia-initial-locale" strategy="beforeInteractive">
          {setInitialLocale}
        </Script>
      </head>
      <body className="bg-surface text-on-surface">
        <SkinFieldProvider>
          <SpiritModeProvider>
            <Suspense fallback={null}>
              <SiteHeader />
            </Suspense>
            <EnergySystemClient />
            {children}
            <ClientProviders />
          </SpiritModeProvider>
        </SkinFieldProvider>
      </body>
    </html>
  );
}
