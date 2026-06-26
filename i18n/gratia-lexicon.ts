import type { Locale } from './resources';

export type GratiaLexicon = {
  orientation: {
    youMightWonder: string;
    quietDirection: string;
    somethingMayBeAsking: string;
    softPointOfOrientation: string;
  };
  writingSpace: {
    leaveItHere: string;
    placeForYourWords: string;
    itCanStayHere: string;
    noNeedToShapeIt: string;
  };
  systemState: {
    nothingToCompleteHere: string;
    youMayBegin: string;
    youMaySitWithThis: string;
    youMayLeaveAtAnyTime: string;
  };
  journal: {
    eyebrow: string;
    savedEntries: string;
    emptyEntries: string;
  };
  actions: {
    keep: string;
    delete: string;
  };
  feedback: {
    keptLocally: string;
    nothingWasLost: string;
    staysWithYou: string;
  };
};

const lexicon: Record<Locale, GratiaLexicon> = {
  en: {
    orientation: {
      youMightWonder: 'You might wonder:',
      quietDirection: 'A quiet direction:',
      somethingMayBeAsking: 'Something may be emerging here:',
      softPointOfOrientation: 'A soft point of orientation:',
    },
    writingSpace: {
      leaveItHere: 'Leave it here',
      placeForYourWords: 'A place for what arrives',
      itCanStayHere: 'It can stay here',
      noNeedToShapeIt: 'No need to shape it',
    },
    systemState: {
      nothingToCompleteHere: 'There is nothing to complete here',
      youMayBegin: 'You may begin',
      youMaySitWithThis: 'You may sit with this',
      youMayLeaveAtAnyTime: 'You may leave at any time',
    },
    journal: {
      eyebrow: 'The Lunar Journal',
      savedEntries: 'Kept reflections',
      emptyEntries: 'Your local reflections will appear here.',
    },
    actions: {
      keep: 'Keep it',
      delete: 'Delete',
    },
    feedback: {
      keptLocally: 'Kept here',
      nothingWasLost: 'Nothing was lost',
      staysWithYou: 'This stays with you',
    },
  },
  es: {
    orientation: {
      youMightWonder: 'Puede que te preguntes:',
      quietDirection: 'Una dirección suave:',
      somethingMayBeAsking: 'Algo está emergiendo aquí:',
      softPointOfOrientation: 'Un punto de orientación:',
    },
    writingSpace: {
      leaveItHere: 'Déjalo aquí',
      placeForYourWords: 'Un lugar para lo que llega',
      itCanStayHere: 'Puede quedarse aquí',
      noNeedToShapeIt: 'No necesitas darle forma',
    },
    systemState: {
      nothingToCompleteHere: 'No hay nada que completar aquí',
      youMayBegin: 'Puedes empezar',
      youMaySitWithThis: 'Puedes quedarte con esto',
      youMayLeaveAtAnyTime: 'Puedes irte en cualquier momento',
    },
    journal: {
      eyebrow: 'El Diario Lunar',
      savedEntries: 'Reflexiones guardadas',
      emptyEntries: 'Tus reflexiones locales aparecerán aquí.',
    },
    actions: {
      keep: 'Guárdalo',
      delete: 'Eliminar',
    },
    feedback: {
      keptLocally: 'Guardado aquí',
      nothingWasLost: 'Nada se perdió',
      staysWithYou: 'Esto se queda contigo',
    },
  },
  ro: {
    orientation: {
      youMightWonder: 'Poate te întrebi:',
      quietDirection: 'O direcție liniștită:',
      somethingMayBeAsking: 'Ceva poate aparea aici:',
      softPointOfOrientation: 'Un punct de orientare:',
    },
    writingSpace: {
      leaveItHere: 'Lasă-l aici',
      placeForYourWords: 'Un loc pentru ce apare',
      itCanStayHere: 'Poate rămâne aici',
      noNeedToShapeIt: 'Nu e nevoie să-i dai formă',
    },
    systemState: {
      nothingToCompleteHere: 'Nu ai nimic de completat aici',
      youMayBegin: 'Poți începe',
      youMaySitWithThis: 'Poți sta cu asta',
      youMayLeaveAtAnyTime: 'Poți pleca oricând',
    },
    journal: {
      eyebrow: 'Jurnalul lunar',
      savedEntries: 'Reflecții păstrate',
      emptyEntries: 'Reflecțiile tale locale vor apărea aici.',
    },
    actions: {
      keep: 'Păstreaz-o',
      delete: 'Șterge',
    },
    feedback: {
      keptLocally: 'Păstrat aici',
      nothingWasLost: 'Nimic nu s-a pierdut',
      staysWithYou: 'A rămas aici cu tine',
    },
  },
};

export function getGratiaLexicon(locale: Locale): GratiaLexicon {
  return lexicon[locale] ?? lexicon.en;
}
