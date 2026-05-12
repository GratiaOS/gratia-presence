'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card } from '@gratiaos/ui';
import { defaultLocale, supportedLocales } from '../../i18n/config';
import type { Locale } from '../../i18n/resources';

const BACKUP_SCHEMA = 'gratia.ghost.backup.v1';
const LOCALE_STORAGE_KEY = 'gratia.locale';
const EXPORT_KEY_PREFIXES = ['gratia.', 'pattern-mirror.'];

type BackupMode = 'merge' | 'replace';

interface GhostBackup {
  schema: typeof BACKUP_SCHEMA;
  app: 'gratia.space';
  exportedAt: string;
  origin: string;
  items: Record<string, string>;
}

const copy: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    subtitle: string;
    exportTitle: string;
    exportBody: string;
    exportCta: string;
    importTitle: string;
    importBody: string;
    merge: string;
    replace: string;
    importCta: string;
    reloadCta: string;
    empty: string;
    exported: (count: number) => string;
    imported: (count: number) => string;
    invalid: string;
    localItems: (count: number) => string;
  }
> = {
  en: {
    eyebrow: 'Ghost Mode',
    title: 'Move your Gratia data between browsers.',
    subtitle:
      'Export creates a local JSON file with your journal, energy marks, identity shadows, language, skin, and other browser-only settings. Nothing is sent to a server.',
    exportTitle: 'Export',
    exportBody: 'Create a portable snapshot from this browser.',
    exportCta: 'Export backup',
    importTitle: 'Import',
    importBody: 'Choose a Gratia backup file on the new browser.',
    merge: 'Merge with this browser',
    replace: 'Replace Gratia data here',
    importCta: 'Import backup',
    reloadCta: 'Reload to apply',
    empty: 'No local Gratia data found in this browser yet.',
    exported: (count) => `Exported ${count} local item${count === 1 ? '' : 's'}.`,
    imported: (count) => `Imported ${count} local item${count === 1 ? '' : 's'}.`,
    invalid: 'That file does not look like a Gratia Ghost Backup.',
    localItems: (count) => `${count} local item${count === 1 ? '' : 's'}`,
  },
  es: {
    eyebrow: 'Modo Ghost',
    title: 'Mueve tus datos de Gratia entre navegadores.',
    subtitle:
      'El export crea un JSON local con tu diario, marcas de energía, sombras de identidad, idioma, skin y otros ajustes del navegador. Nada se envía a un servidor.',
    exportTitle: 'Exportar',
    exportBody: 'Crea una copia portátil desde este navegador.',
    exportCta: 'Exportar backup',
    importTitle: 'Importar',
    importBody: 'Elige un archivo de backup de Gratia en el navegador nuevo.',
    merge: 'Mezclar con este navegador',
    replace: 'Reemplazar datos de Gratia aquí',
    importCta: 'Importar backup',
    reloadCta: 'Recargar para aplicar',
    empty: 'Todavía no hay datos locales de Gratia en este navegador.',
    exported: (count) => `Exportados ${count} elemento${count === 1 ? '' : 's'} locales.`,
    imported: (count) => `Importados ${count} elemento${count === 1 ? '' : 's'} locales.`,
    invalid: 'Ese archivo no parece un Gratia Ghost Backup.',
    localItems: (count) => `${count} elemento${count === 1 ? '' : 's'} locales`,
  },
  ro: {
    eyebrow: 'Ghost Mode',
    title: 'Mută datele Gratia între browsere.',
    subtitle:
      'Exportul creează un JSON local cu jurnalul, marcajele de energie, umbrele de identitate, limba, skin-ul și alte setări păstrate doar în browser. Nu trimitem nimic pe server.',
    exportTitle: 'Export',
    exportBody: 'Creează o copie portabilă din browserul acesta.',
    exportCta: 'Exportă backup',
    importTitle: 'Import',
    importBody: 'Alege un fișier de backup Gratia pe browserul nou.',
    merge: 'Combină cu browserul acesta',
    replace: 'Înlocuiește datele Gratia de aici',
    importCta: 'Importă backup',
    reloadCta: 'Reîncarcă pentru aplicare',
    empty: 'Nu am găsit încă date locale Gratia în browserul acesta.',
    exported: (count) => `Am exportat ${count} element${count === 1 ? '' : 'e'} locale.`,
    imported: (count) => `Am importat ${count} element${count === 1 ? '' : 'e'} locale.`,
    invalid: 'Fișierul acesta nu pare un Gratia Ghost Backup.',
    localItems: (count) => `${count} element${count === 1 ? '' : 'e'} locale`,
  },
};

function normalizeLocale(value?: string | null): Locale {
  if (value && supportedLocales.includes(value)) return value as Locale;
  return defaultLocale as Locale;
}

function isExportableKey(key: string): boolean {
  return EXPORT_KEY_PREFIXES.some((prefix) => key.startsWith(prefix));
}

function readLocalItems(): Record<string, string> {
  const items: Record<string, string> = {};
  for (let index = 0; index < window.localStorage.length; index += 1) {
    const key = window.localStorage.key(index);
    if (!key || !isExportableKey(key)) continue;
    const value = window.localStorage.getItem(key);
    if (value != null) items[key] = value;
  }
  return items;
}

function isGhostBackup(value: unknown): value is GhostBackup {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<GhostBackup>;
  if (candidate.schema !== BACKUP_SCHEMA || candidate.app !== 'gratia.space') return false;
  if (!candidate.items || typeof candidate.items !== 'object') return false;
  return Object.entries(candidate.items).every(
    ([key, item]) => typeof key === 'string' && isExportableKey(key) && typeof item === 'string'
  );
}

function BackupContent() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [locale, setLocale] = useState<Locale>(defaultLocale as Locale);
  const [mode, setMode] = useState<BackupMode>('merge');
  const [status, setStatus] = useState<string>('');
  const [itemCount, setItemCount] = useState(0);
  const t = copy[locale] ?? copy.en;

  useEffect(() => {
    const syncLocale = (event?: Event) => {
      const eventLocale =
        event instanceof CustomEvent && typeof event.detail?.locale === 'string'
          ? event.detail.locale
          : null;
      setLocale(normalizeLocale(eventLocale ?? window.localStorage.getItem(LOCALE_STORAGE_KEY)));
    };

    syncLocale();
    window.addEventListener('gratia:localechange', syncLocale);
    return () => window.removeEventListener('gratia:localechange', syncLocale);
  }, []);

  useEffect(() => {
    setItemCount(Object.keys(readLocalItems()).length);
  }, [status]);

  const backupName = useMemo(() => {
    const stamp = new Date().toISOString().slice(0, 10);
    return `gratia-ghost-backup-${stamp}.json`;
  }, []);

  const exportBackup = () => {
    const items = readLocalItems();
    const keys = Object.keys(items);

    if (keys.length === 0) {
      setStatus(t.empty);
      return;
    }

    const backup: GhostBackup = {
      schema: BACKUP_SCHEMA,
      app: 'gratia.space',
      exportedAt: new Date().toISOString(),
      origin: window.location.origin,
      items,
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = backupName;
    anchor.click();
    window.URL.revokeObjectURL(url);
    setStatus(t.exported(keys.length));
  };

  const importBackup = async (file: File | undefined) => {
    if (!file) return;

    try {
      const parsed = JSON.parse(await file.text()) as unknown;
      if (!isGhostBackup(parsed)) {
        setStatus(t.invalid);
        return;
      }

      if (mode === 'replace') {
        const keysToRemove: string[] = [];
        for (let index = 0; index < window.localStorage.length; index += 1) {
          const key = window.localStorage.key(index);
          if (key && isExportableKey(key)) keysToRemove.push(key);
        }
        keysToRemove.forEach((key) => window.localStorage.removeItem(key));
      }

      Object.entries(parsed.items).forEach(([key, value]) => {
        window.localStorage.setItem(key, value);
      });

      const importedLocale = parsed.items[LOCALE_STORAGE_KEY];
      if (importedLocale) {
        window.dispatchEvent(new CustomEvent('gratia:localechange', { detail: { locale: importedLocale } }));
      }
      window.dispatchEvent(new CustomEvent('gratia:ghostbackup:imported', { detail: { mode } }));
      setStatus(t.imported(Object.keys(parsed.items).length));
    } catch {
      setStatus(t.invalid);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16 sm:px-8">
        <header className="max-w-3xl space-y-5">
          <p className="text-xs tracking-[0.25em] text-[color:var(--color-muted)] uppercase">
            {t.eyebrow}
          </p>
          <h1 className="font-gratia text-4xl leading-tight font-semibold md:text-6xl">
            {t.title}
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[color:var(--color-muted)]">
            {t.subtitle}
          </p>
        </header>

        <section className="grid gap-5 md:grid-cols-2">
          <Card variant="plain" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{t.exportTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">
                {t.exportBody}
              </p>
            </div>
            <Button type="button" tone="accent" onClick={exportBackup}>
              {t.exportCta}
            </Button>
            <p className="text-xs text-[color:var(--color-muted)]">{t.localItems(itemCount)}</p>
          </Card>

          <Card variant="plain" className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">{t.importTitle}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">
                {t.importBody}
              </p>
            </div>

            <div className="grid gap-2 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="backup-mode"
                  checked={mode === 'merge'}
                  onChange={() => setMode('merge')}
                />
                {t.merge}
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="backup-mode"
                  checked={mode === 'replace'}
                  onChange={() => setMode('replace')}
                />
                {t.replace}
              </label>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(event) => {
                void importBackup(event.currentTarget.files?.[0]);
              }}
            />
            <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
              {t.importCta}
            </Button>
          </Card>
        </section>

        {status ? (
          <section className="flex flex-wrap items-center gap-3 border-t border-[color:var(--color-border)] pt-6">
            <p className="text-sm text-[color:var(--color-muted)]">{status}</p>
            <Button type="button" variant="ghost" density="snug" onClick={() => window.location.reload()}>
              {t.reloadCta}
            </Button>
          </section>
        ) : null}
      </div>
    </main>
  );
}

export default function BackupPageClient() {
  return (
    <Suspense fallback={null}>
      <BackupContent />
    </Suspense>
  );
}
