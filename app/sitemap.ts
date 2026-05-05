import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://gratia.space';
  const pages = [
    '',
    '/today',
    '/about',
    '/support',
    '/manifesto',
    '/protocols',
    '/protocols/splinters-gift',
    '/join',
    '/contribute',
    '/living',
    '/whisper',
    '/vortex',
    '/codex/vienna',
  ];
  const now = new Date().toISOString();

  return pages.map((p) => ({
    url: `${base}${p}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p === '' ? 1 : 0.6,
  }));
}
