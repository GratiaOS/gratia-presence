'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Button, Card } from '@gratiaos/ui';
import { useLocale } from '../../i18n/useLocale';
import type { Locale } from '../../i18n/resources';
import {
  checkM3EdgeWriteAuth,
  checkM3EdgeHealth,
  clearM3EdgeToken,
  M3_EDGE_DEFAULT_URL,
  readM3EdgeToken,
  readM3EdgeUrl,
  saveM3EdgeConfig,
  syncLatestEnergyMarkWithM3Edge,
} from '../../lib/m3-edge';

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
    edgeTitle: string;
    edgeBody: string;
    edgeUrl: string;
    edgeToken: string;
    edgeTokenPlaceholder: string;
    edgeSave: string;
    edgeTest: string;
    edgeSync: string;
    edgeClear: string;
    edgeConfigured: string;
    edgeNotConfigured: string;
    edgeSaved: string;
    edgeCleared: string;
    edgeOnline: (storage?: string) => string;
    edgeAuthFailed: string;
    edgeSynced: string;
    edgeFailed: string;
    edgeSyncMissing: string;
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
    edgeTitle: 'M3 Edge',
    edgeBody:
      'Optional cross-browser mirror for energy marks. Ghost Mode still saves locally first; Edge sync runs quietly in the background.',
    edgeUrl: 'Worker URL',
    edgeToken: 'Write token',
    edgeTokenPlaceholder: 'Paste M3_WRITE_TOKEN',
    edgeSave: 'Save Edge config',
    edgeTest: 'Test Edge',
    edgeSync: 'Sync energy now',
    edgeClear: 'Clear token',
    edgeConfigured: 'M3 Edge token is saved in this browser.',
    edgeNotConfigured: 'No M3 Edge token saved here yet.',
    edgeSaved: 'M3 Edge config saved locally.',
    edgeCleared: 'M3 Edge token cleared.',
    edgeOnline: (storage) => `M3 Edge online${storage ? ` · ${storage}` : ''}.`,
    edgeAuthFailed: 'M3 Edge is online, but the write token is not accepted.',
    edgeSynced: 'Latest local energy mark synced to M3 Edge.',
    edgeFailed: 'Could not reach M3 Edge from this browser.',
    edgeSyncMissing: 'No local energy mark or token found for sync.',
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
    edgeTitle: 'M3 Edge',
    edgeBody:
      'Espejo opcional entre navegadores para marcas de energía. Ghost Mode guarda local primero; Edge sincroniza en silencio en segundo plano.',
    edgeUrl: 'URL del Worker',
    edgeToken: 'Token de escritura',
    edgeTokenPlaceholder: 'Pega M3_WRITE_TOKEN',
    edgeSave: 'Guardar configuración Edge',
    edgeTest: 'Probar Edge',
    edgeSync: 'Sincronizar energía ahora',
    edgeClear: 'Borrar token',
    edgeConfigured: 'El token de M3 Edge está guardado en este navegador.',
    edgeNotConfigured: 'Todavía no hay token de M3 Edge guardado aquí.',
    edgeSaved: 'Configuración de M3 Edge guardada localmente.',
    edgeCleared: 'Token de M3 Edge borrado.',
    edgeOnline: (storage) => `M3 Edge online${storage ? ` · ${storage}` : ''}.`,
    edgeAuthFailed: 'M3 Edge está online, pero el token de escritura no es aceptado.',
    edgeSynced: 'La última marca local de energía se sincronizó con M3 Edge.',
    edgeFailed: 'No se pudo contactar M3 Edge desde este navegador.',
    edgeSyncMissing: 'No hay marca local de energía o token para sincronizar.',
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
    edgeTitle: 'M3 Edge',
    edgeBody:
      'Mirror opțional între browsere pentru marcajele de energie. Ghost Mode salvează local primul; Edge sync rulează discret în fundal.',
    edgeUrl: 'URL Worker',
    edgeToken: 'Token de scriere',
    edgeTokenPlaceholder: 'Lipește M3_WRITE_TOKEN',
    edgeSave: 'Salvează config Edge',
    edgeTest: 'Testează Edge',
    edgeSync: 'Sincronizează energia acum',
    edgeClear: 'Șterge token',
    edgeConfigured: 'Tokenul M3 Edge este salvat în browserul acesta.',
    edgeNotConfigured: 'Nu există încă token M3 Edge salvat aici.',
    edgeSaved: 'Configurația M3 Edge a fost salvată local.',
    edgeCleared: 'Tokenul M3 Edge a fost șters.',
    edgeOnline: (storage) => `M3 Edge online${storage ? ` · ${storage}` : ''}.`,
    edgeAuthFailed: 'M3 Edge este online, dar tokenul de scriere nu este acceptat.',
    edgeSynced: 'Ultimul marcaj local de energie a fost sincronizat cu M3 Edge.',
    edgeFailed: 'Nu am putut contacta M3 Edge din browserul acesta.',
    edgeSyncMissing: 'Nu există marcaj local de energie sau token pentru sync.',
  },
};

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
  const locale = useLocale();
  const [mode, setMode] = useState<BackupMode>('merge');
  const [status, setStatus] = useState<string>('');
  const [edgeStatus, setEdgeStatus] = useState<string>('');
  const [edgeUrl, setEdgeUrl] = useState(M3_EDGE_DEFAULT_URL);
  const [edgeToken, setEdgeToken] = useState('');
  const [edgeHasToken, setEdgeHasToken] = useState(false);
  const [itemCount, setItemCount] = useState(0);
  const t = copy[locale] ?? copy.en;

  useEffect(() => {
    setItemCount(Object.keys(readLocalItems()).length);
  }, [status]);

  useEffect(() => {
    const syncEdgeConfig = () => {
      const savedToken = readM3EdgeToken();
      setEdgeUrl(readM3EdgeUrl());
      setEdgeHasToken(Boolean(savedToken));
    };

    syncEdgeConfig();
    window.addEventListener('gratia:m3edge:change', syncEdgeConfig);
    return () => window.removeEventListener('gratia:m3edge:change', syncEdgeConfig);
  }, [edgeStatus]);

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

  const saveEdge = () => {
    saveM3EdgeConfig({ url: edgeUrl, token: edgeToken });
    setEdgeToken('');
    setEdgeStatus(t.edgeSaved);
  };

  const clearEdge = () => {
    clearM3EdgeToken();
    setEdgeToken('');
    setEdgeStatus(t.edgeCleared);
  };

  const testEdge = async () => {
    try {
      const health = await checkM3EdgeHealth(edgeUrl);
      if (!health.ok) {
        setEdgeStatus(t.edgeFailed);
        return;
      }
      const authOk = edgeHasToken ? await checkM3EdgeWriteAuth() : false;
      setEdgeStatus(authOk ? t.edgeOnline(health.storage) : t.edgeAuthFailed);
    } catch {
      setEdgeStatus(t.edgeFailed);
    }
  };

  const syncEnergyNow = async () => {
    const result = await syncLatestEnergyMarkWithM3Edge();
    setEdgeStatus(result.ok ? t.edgeSynced : result.error === 'missing_local_mark' || result.error === 'missing_token' ? t.edgeSyncMissing : t.edgeFailed);
  };

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16 sm:px-8">
        <header className="max-w-3xl space-y-5">
          <p className="text-xs tracking-[0.25em] text-[color:var(--color-muted)] uppercase">
            {t.eyebrow}
          </p>
          <h1 className="font-gratia text-4xl leading-tight font-semibold tracking-tight md:text-5xl">
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

        <Card variant="plain" className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{t.edgeTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-muted)]">
              {t.edgeBody}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <label className="grid gap-2 text-sm">
              <span className="font-medium">{t.edgeUrl}</span>
              <input
                type="url"
                value={edgeUrl}
                onChange={(event) => setEdgeUrl(event.target.value)}
                className="min-h-10 rounded-md border border-[color:var(--color-border)] bg-transparent px-3 text-sm outline-none focus:border-[color:var(--color-accent)]"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="font-medium">{t.edgeToken}</span>
              <input
                type="password"
                value={edgeToken}
                onChange={(event) => setEdgeToken(event.target.value)}
                placeholder={edgeHasToken ? '••••••••••••••••' : t.edgeTokenPlaceholder}
                className="min-h-10 rounded-md border border-[color:var(--color-border)] bg-transparent px-3 text-sm outline-none focus:border-[color:var(--color-accent)]"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" tone="accent" onClick={saveEdge}>
              {t.edgeSave}
            </Button>
            <Button type="button" variant="outline" onClick={() => void testEdge()}>
              {t.edgeTest}
            </Button>
            <Button type="button" variant="outline" onClick={() => void syncEnergyNow()}>
              {t.edgeSync}
            </Button>
            <Button type="button" variant="ghost" onClick={clearEdge}>
              {t.edgeClear}
            </Button>
          </div>

          <p className="text-xs text-[color:var(--color-muted)]">
            {edgeStatus || (edgeHasToken ? t.edgeConfigured : t.edgeNotConfigured)}
          </p>
        </Card>

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
