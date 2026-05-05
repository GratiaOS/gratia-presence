export type SpiritMode = 'bear' | 'wolf' | 'lion';

export const SPIRIT_MODES: Record<
  SpiritMode,
  {
    id: SpiritMode;
    label: string;
    emoji: string;
    mood: 'soft' | 'focused' | 'celebratory';
    whisper: string;
  }
> = {
  bear: {
    id: 'bear',
    emoji: '🐻',
    label: 'Urs · Ground',
    mood: 'soft',
    whisper: 'Ursul ține spațiul. Rămâi aici, ești ținut.',
  },
  wolf: {
    id: 'wolf',
    emoji: '🐺',
    label: 'Lup · Path',
    mood: 'focused',
    whisper: 'Lupul știe când e timpul să pleci și când să rămâi.',
  },
  lion: {
    id: 'lion',
    emoji: '🦁',
    label: 'Leu · Flame',
    mood: 'celebratory',
    whisper: 'Leul aprinde vocea. Când vorbești, Gratia ascultă.',
  },
};
