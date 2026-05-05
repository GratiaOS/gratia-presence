'use client';

import VortexScene from './VortexScene';
import SceneLayout from '@/components/layouts/SceneLayout';
import { I18nProvider, useTranslation } from '../../i18n/I18nProvider';

function VortexPageContent() {
  const { t } = useTranslation('vortex');

  return (
    <SceneLayout
      eyebrow="Ritual · Vortex"
      title={t('title')}
      subtitle={t('subtitle')}
      backHref="/"
      backLabel="Înapoi în Grădină"
    >
      <VortexScene title={t('title')} subtitle={t('subtitle')} stayHint={t('stayHint')} />
    </SceneLayout>
  );
}

export default function VortexPageClient() {
  return (
    <I18nProvider>
      <VortexPageContent />
    </I18nProvider>
  );
}
