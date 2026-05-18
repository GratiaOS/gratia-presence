'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  createEnergyClient,
  createLocalStorageEnergyAdapter,
  type EnergyBand,
  type EnergyPrediction,
  type ExitRitual,
  type EnergyState,
} from '@gratiaos/energy-core';
import {
  EnergyCapsule,
  EnergyHeader,
  TransitionGate,
  type EnergyHeaderCopy,
  type TransitionGateCopy,
} from '@gratiaos/ui';
import { defaultLocale, supportedLocales } from '../../../i18n/config';
import type { Locale } from '../../../i18n/resources';
import { pullEnergyStateFromM3Edge, syncEnergyMarkWithM3Edge } from '../../../lib/m3-edge';

const LOCALE_STORAGE_KEY = 'gratia.locale';
const LOCALE_QUERY_KEY = 'lang';

type EnergyLocaleCopy = {
  header: EnergyHeaderCopy;
  gate: TransitionGateCopy;
  rituals: Record<string, ExitRitual>;
};

type EnergySystemClientProps = {
  variant?: 'header' | 'capsule';
};

const copy: Record<Locale, EnergyLocaleCopy> = {
  en: {
    header: {
      ariaLabel: 'Energy management',
      marksLabel: 'Silent energy marks',
      markSilently: (label) => `Mark ${label} silently`,
      startRitual: (title) => `Start ${title}`,
      changeBand: 'Change energy band',
      ritualCta: '30s',
      bands: {
        crown: { label: 'Crown (E4)', shortLabel: 'Crown' },
        dragon: { label: 'Dragon (E3)', shortLabel: 'Dragon' },
        play: { label: 'Play (E2)', shortLabel: 'Play' },
        life: { label: 'Life Force (E1)', shortLabel: 'Life' },
        void: { label: 'Void (E0)', shortLabel: 'Void' },
      },
    },
    gate: {
      secondsRemaining: (seconds) => `${seconds} seconds remaining`,
      close: 'Close',
    },
    rituals: {
      'low-battery-shutter': {
        id: 'low-battery-shutter',
        title: '30-second low-battery shutter',
        durationSeconds: 30,
        steps: ['Close the next input.', 'Exhale longer than you inhale.', 'Choose one tiny body need.'],
        whisper: 'Ten percent is enough information. Protect the battery.',
      },
      'dragon-shutter': {
        id: 'dragon-shutter',
        title: '30-second exit from high gear',
        durationSeconds: 30,
        steps: ['Unclench jaw and hands.', 'Look away from the screen.', 'Name what is finished enough.'],
        whisper: 'Seal the thread before the thread spends you.',
      },
      'soft-reset': {
        id: 'soft-reset',
        title: '30-second soft reset',
        durationSeconds: 30,
        steps: ['Put both feet down.', 'Let the shoulders drop.', 'Return to one next true thing.'],
        whisper: 'Small reset, clean signal.',
      },
    },
  },
  es: {
    header: {
      ariaLabel: 'Gestión de energía',
      marksLabel: 'Marcas silenciosas de energía',
      markSilently: (label) => `Marcar ${label} en silencio`,
      startRitual: (title) => `Iniciar ${title}`,
      changeBand: 'Cambiar banda de energía',
      ritualCta: '30s',
      bands: {
        crown: { label: 'Corona (E4)', shortLabel: 'Corona' },
        dragon: { label: 'Dragón (E3)', shortLabel: 'Dragón' },
        play: { label: 'Juego (E2)', shortLabel: 'Juego' },
        life: { label: 'Fuerza vital (E1)', shortLabel: 'Vida' },
        void: { label: 'Vacío (E0)', shortLabel: 'Vacío' },
      },
    },
    gate: {
      secondsRemaining: (seconds) => `Quedan ${seconds} segundos`,
      close: 'Cerrar',
    },
    rituals: {
      'low-battery-shutter': {
        id: 'low-battery-shutter',
        title: 'Persiana de 30 segundos para batería baja',
        durationSeconds: 30,
        steps: ['Cierra la próxima entrada.', 'Exhala más largo de lo que inhalas.', 'Elige una necesidad pequeña del cuerpo.'],
        whisper: 'Diez por ciento ya es suficiente información. Protege la batería.',
      },
      'dragon-shutter': {
        id: 'dragon-shutter',
        title: 'Salida de 30 segundos de la marcha alta',
        durationSeconds: 30,
        steps: ['Suelta mandíbula y manos.', 'Mira fuera de la pantalla.', 'Nombra lo que ya está suficientemente terminado.'],
        whisper: 'Sella el hilo antes de que el hilo te gaste.',
      },
      'soft-reset': {
        id: 'soft-reset',
        title: 'Reinicio suave de 30 segundos',
        durationSeconds: 30,
        steps: ['Pon ambos pies en el suelo.', 'Deja caer los hombros.', 'Vuelve a una sola cosa verdadera siguiente.'],
        whisper: 'Reinicio pequeño, señal limpia.',
      },
    },
  },
  ro: {
    header: {
      ariaLabel: 'Managementul energiei',
      marksLabel: 'Marcaje silențios al energiei',
      markSilently: (label) => `Marchează ${label} în liniște`,
      startRitual: (title) => `Pornește ${title}`,
      changeBand: 'Schimbă banda de energie',
      ritualCta: '30s',
      bands: {
        crown: { label: 'Coroană (E4)', shortLabel: 'Coroană' },
        dragon: { label: 'Dragon (E3)', shortLabel: 'Dragon' },
        play: { label: 'Joacă (E2)', shortLabel: 'Joacă' },
        life: { label: 'Forță de viață (E1)', shortLabel: 'Viață' },
        void: { label: 'Vid (E0)', shortLabel: 'Vid' },
      },
    },
    gate: {
      secondsRemaining: (seconds) => `${seconds} secunde rămase`,
      close: 'Închide',
    },
    rituals: {
      'low-battery-shutter': {
        id: 'low-battery-shutter',
        title: 'Shutter de 30 de secunde pentru baterie joasă',
        durationSeconds: 30,
        steps: ['Închide următorul input.', 'Expiră mai lung decât inspiri.', 'Alege o nevoie mică a corpului.'],
        whisper: 'Zece la sută e destulă informație. Protejează bateria.',
      },
      'dragon-shutter': {
        id: 'dragon-shutter',
        title: 'Ieșire de 30 de secunde din treapta înaltă',
        durationSeconds: 30,
        steps: ['Relaxează maxilarul și mâinile.', 'Privește în afara ecranului.', 'Numește ce este suficient de terminat.'],
        whisper: 'Sigilează firul înainte ca firul să te consume.',
      },
      'soft-reset': {
        id: 'soft-reset',
        title: 'Resetare blândă de 30 de secunde',
        durationSeconds: 30,
        steps: ['Pune ambele tălpi jos.', 'Lasă umerii să cadă.', 'Întoarce-te la un singur următor lucru adevărat.'],
        whisper: 'Resetare mică, semnal curat.',
      },
    },
  },
};

function normalizeLocale(value?: string | null): Locale {
  if (value && supportedLocales.includes(value)) return value as Locale;
  return defaultLocale as Locale;
}

function readLocale(queryLocale?: string | null) {
  if (typeof window === 'undefined') return defaultLocale as Locale;
  const params = new URLSearchParams(window.location.search);
  return normalizeLocale(queryLocale ?? params.get(LOCALE_QUERY_KEY) ?? window.localStorage.getItem(LOCALE_STORAGE_KEY));
}

function readLocaleEvent(event?: Event) {
  const detail = event && 'detail' in event ? (event as CustomEvent<{ locale?: unknown }>).detail : null;
  const eventLocale = typeof detail?.locale === 'string' ? detail.locale : null;
  return eventLocale ? normalizeLocale(eventLocale) : null;
}

function localizePrediction(prediction: EnergyPrediction, locale: Locale): EnergyPrediction {
  const localized = copy[locale]?.rituals[prediction.exit.ritual.id] ?? prediction.exit.ritual;
  return {
    ...prediction,
    exit: {
      ...prediction.exit,
      ritual: localized,
    },
  };
}

const fallbackClient = createEnergyClient(createLocalStorageEnergyAdapter('__gratia.energy.ssr.fallback__'));
const fallbackState = fallbackClient.state();
const fallbackPrediction = fallbackClient.predict();

function createBrowserSnapshot() {
  const client = createEnergyClient(createLocalStorageEnergyAdapter());
  return {
    client,
    state: client.state(),
    prediction: client.predict(),
  };
}

export default function EnergySystemClient({ variant = 'header' }: EnergySystemClientProps) {
  const searchParams = useSearchParams();
  const queryLocale = searchParams?.get(LOCALE_QUERY_KEY);
  const client = useMemo(() => createEnergyClient(createLocalStorageEnergyAdapter()), []);
  const [state, setState] = useState<EnergyState>(fallbackState);
  const [prediction, setPrediction] = useState<EnergyPrediction>(fallbackPrediction);
  const [locale, setLocale] = useState<Locale>(() => normalizeLocale(queryLocale));
  const [gateOpen, setGateOpen] = useState(false);

  const refresh = useCallback(() => {
    const nextState = client.state();
    setState(nextState);
    setPrediction(client.predict({ kind: nextState.currentBand }));
  }, [client]);

  const pullRemoteEnergy = useCallback(() => {
    void pullEnergyStateFromM3Edge().then((result) => {
      if (result.ok && result.imported > 0) refresh();
    });
  }, [refresh]);

  useEffect(() => {
    const snapshot = createBrowserSnapshot();
    setState(snapshot.state);
    setPrediction(snapshot.prediction);
    setLocale(readLocale(queryLocale));
    pullRemoteEnergy();
    const refreshFromFocus = () => {
      refresh();
      pullRemoteEnergy();
    };
    window.addEventListener('storage', refreshFromFocus);
    window.addEventListener('focus', refreshFromFocus);
    const syncLocale = (event?: Event) => {
      setLocale(readLocaleEvent(event) ?? readLocale(queryLocale));
    };
    syncLocale();
    window.addEventListener('gratia:localechange', syncLocale);
    window.addEventListener('gratia:m3edge:change', pullRemoteEnergy);
    window.addEventListener('gratia:energy:remote-sync', refresh);
    return () => {
      window.removeEventListener('storage', refreshFromFocus);
      window.removeEventListener('focus', refreshFromFocus);
      window.removeEventListener('gratia:localechange', syncLocale);
      window.removeEventListener('gratia:m3edge:change', pullRemoteEnergy);
      window.removeEventListener('gratia:energy:remote-sync', refresh);
    };
  }, [pullRemoteEnergy, queryLocale, refresh]);

  useEffect(() => {
    document.documentElement.dataset.energyBand = state.currentBand;
  }, [state.currentBand]);

  const mark = (band: EnergyBand, level: number) => {
    const input = { kind: band, level, who: 'self' };
    client.mark(input);
    syncEnergyMarkWithM3Edge(input);
    refresh();
  };

  const localizedPrediction = localizePrediction(prediction, locale);
  const localizedCopy = copy[locale] ?? copy.en;

  return (
    <>
      {variant === 'capsule' ? (
        <EnergyCapsule
          state={state}
          prediction={localizedPrediction}
          copy={localizedCopy.header}
          pulseOnChange
          onMark={mark}
          onStartRitual={() => setGateOpen(true)}
        />
      ) : (
        <EnergyHeader
          state={state}
          prediction={localizedPrediction}
          copy={localizedCopy.header}
          pulseOnChange
          onMark={mark}
          onStartRitual={() => setGateOpen(true)}
        />
      )}
      <TransitionGate
        open={gateOpen}
        ritual={localizedPrediction.exit.ritual}
        copy={localizedCopy.gate}
        onClose={() => setGateOpen(false)}
      />
    </>
  );
}
