'use client';

import { Suspense } from 'react';
import NoteLayout from '@/components/layouts/NoteLayout';
import ContentEs from './content.es.mdx';
import ContentRo from './content.ro.mdx';
import ContentEn from './content.en.mdx';
import frontmatters from '../frontmatters.json';
import { defaultLocale } from '../../../i18n/config';
import { useLocale } from '../../../i18n/useLocale';

const contentMap = {
  es: ContentEs,
  ro: ContentRo,
  en: ContentEn,
};

function PageContent() {
  const locale = useLocale();

  const fm =
    frontmatters['own-system-failed'][locale as keyof (typeof frontmatters)['own-system-failed']] ||
    frontmatters['own-system-failed'][defaultLocale];
  const Content = contentMap[locale as keyof typeof contentMap] || contentMap[defaultLocale];

  return (
    <NoteLayout hero={fm.title} updated={fm.updated}>
      <Content />
    </NoteLayout>
  );
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <PageContent />
    </Suspense>
  );
}
