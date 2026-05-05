import type { Locale } from '../../i18n/resources';

export type LunarPhase = 'new-moon' | 'waxing-moon' | 'full-moon' | 'waning-moon';
export type LunarTemplate =
  | 'T3_prompt_led'
  | 'T4_somatic'
  | 'T5_field_note'
  | 'T6_dream_notes'
  | 'T7_symbol_tracker'
  | 'T8_lined_reflection';

export type LunarPage = {
  key: string;
  printPage: number;
  template: LunarTemplate;
  title: string;
  intro: string[];
  prompts: string[];
};

export type LunarContent = {
  ui: {
    eyebrow: string;
    dateLabel: string;
    phaseLabel: string;
    todayPage: string;
    companionPages: string;
    writingLabel: string;
    writingPlaceholder: string;
    save: string;
    saved: string;
    delete: string;
    empty: string;
    community: string;
    language: string;
  };
  phases: Record<LunarPhase, { title: string; mark: string; pages: LunarPage[] }>;
};

const sharedPrintPages = {
  somatic: 16,
  field: 18,
  dream: 23,
  symbol: 22,
  free: 24,
};

export const lunarContent: Record<Locale, LunarContent> = {
  en: {
    ui: {
      eyebrow: 'The Lunar Journal',
      dateLabel: 'Today',
      phaseLabel: 'Moon phase',
      todayPage: "Today's page",
      companionPages: 'Also nearby',
      writingLabel: 'Write here',
      writingPlaceholder: 'A few lines are enough.',
      save: 'Save locally',
      saved: 'Saved locally',
      delete: 'Delete',
      empty: 'Your local journal entries will appear here.',
      community: 'Lunar Community LIVE',
      language: 'Language',
    },
    phases: {
      'new-moon': {
        title: 'New Moon',
        mark: '🌑',
        pages: [
          {
            key: 'new-moon',
            printPage: 14,
            template: 'T3_prompt_led',
            title: 'New Moon',
            intro: [
              'The New Moon arrives in darkness. There is nothing to see yet.',
              'This is a moment for listening before deciding, for planting before pushing. Notice what wants to begin before you try to shape it.',
            ],
            prompts: [
              'What do I want to plant in this cycle?',
              'What feels true enough to begin with?',
              'What am I willing to protect while it is still small?',
              'What needs quiet before it can grow?',
              'What do I want this cycle to move toward?',
            ],
          },
          {
            key: 'seed-intention',
            printPage: 15,
            template: 'T3_prompt_led',
            title: 'Seed Intention',
            intro: [
              'An intention is not a goal. It is a direction, a thread you are willing to return to.',
              'Name it simply. Let it be honest.',
            ],
            prompts: [
              'What do I want to carry as an intention through this cycle?',
              'What direction feels true enough to begin?',
              'What am I willing to return to, even when it is difficult?',
              'What small act would keep this intention alive?',
            ],
          },
          {
            key: 'somatic-notes',
            printPage: sharedPrintPages.somatic,
            template: 'T4_somatic',
            title: 'Somatic Notes',
            intro: [
              'Use this page to track what the body is carrying.',
              'Note any tension, ease, fatigue, aliveness, resistance, or relief. Body signals do not need to be explained, just recorded.',
            ],
            prompts: [],
          },
          {
            key: 'new-moon-reflection',
            printPage: 17,
            template: 'T8_lined_reflection',
            title: 'New Moon Reflection',
            intro: [],
            prompts: [
              'What feels quiet but alive?',
              'What needs protection at the beginning?',
              'What am I not ready to rush?',
            ],
          },
          {
            key: 'field-note',
            printPage: sharedPrintPages.field,
            template: 'T5_field_note',
            title: 'Field Note',
            intro: [
              'The field around you is part of the record. Mark the sky, the weather, the light, and the feeling in the air simply, before meaning rushes in.',
            ],
            prompts: [
              'What did the sky look like?',
              'What was the atmosphere of the day or hour?',
              'What stood out in the outer world?',
              'What did the field seem to mirror in me?',
              'What is worth marking from this moment?',
            ],
          },
        ],
      },
      'waxing-moon': {
        title: 'Waxing Moon',
        mark: '🌓',
        pages: [
          {
            key: 'waxing-moon',
            printPage: 19,
            template: 'T3_prompt_led',
            title: 'Waxing Moon',
            intro: [
              'Light is returning. Energy often begins to gather here.',
              'This is a phase for steady attention, not urgency, not force. Notice what is building, and what it needs to keep moving.',
            ],
            prompts: [
              'What is gaining momentum in this cycle?',
              'What deserves more of my time and attention?',
              'What small act would keep the thread alive?',
              'What is asking for consistency, not intensity?',
              'What do I want to keep building, slowly and with care?',
            ],
          },
          {
            key: 'steady-movement',
            printPage: 20,
            template: 'T3_prompt_led',
            title: 'Steady Movement',
            intro: [
              'Not every day will feel alive with momentum.',
              'Steady movement is not speed. It is returning to the thread, to the intention, to the small act that keeps things in motion.',
            ],
            prompts: [
              'What does steady look like for me right now?',
              'What am I willing to return to today?',
              'What would keep me moving without burning out?',
            ],
          },
          {
            key: 'symbol-tracker',
            printPage: sharedPrintPages.symbol,
            template: 'T7_symbol_tracker',
            title: 'Symbol Tracker',
            intro: ['Notice what repeats.', 'Use this page to record what returns more than once.'],
            prompts: [],
          },
          {
            key: 'dream-notes',
            printPage: sharedPrintPages.dream,
            template: 'T6_dream_notes',
            title: 'Dream Notes',
            intro: ['Record what stayed with you on waking. A fragment is enough.'],
            prompts: [
              'What do I remember?',
              'What image or scene stayed with me?',
              'What feeling followed me into waking?',
              'Did anything repeat?',
              'What feels worth keeping, even if I do not understand it yet?',
            ],
          },
          {
            key: 'waxing-moon-reflection',
            printPage: 25,
            template: 'T8_lined_reflection',
            title: 'Waxing Moon Reflection',
            intro: [],
            prompts: [
              'What is gaining momentum?',
              'What is helping me stay with the thread?',
              'What keeps scattering my energy?',
            ],
          },
          {
            key: 'field-note',
            printPage: 26,
            template: 'T5_field_note',
            title: 'Field Note',
            intro: [
              'The field around you is part of the record. Mark the sky, the weather, the light, and the feeling in the air simply, before meaning rushes in.',
            ],
            prompts: [
              'What did the sky look like?',
              'What was the atmosphere of the day or hour?',
              'What stood out in the outer world?',
              'What did the field seem to mirror in me?',
              'What is worth marking from this moment?',
            ],
          },
        ],
      },
      'full-moon': {
        title: 'Full Moon',
        mark: '🌕',
        pages: [
          {
            key: 'full-moon',
            printPage: 27,
            template: 'T3_prompt_led',
            title: 'Full Moon',
            intro: [
              'The Full Moon arrives with full light. What has grown since the New Moon is now easier to see.',
              'Hold it honestly. Not everything that grew is what you meant to grow. This is a time for seeing before deciding.',
            ],
            prompts: [
              'What has become clear in this cycle?',
              'What have I built or moved toward?',
              'What surprised me about what actually grew?',
              'What feels complete or ready to be acknowledged?',
              'What am I most proud of from the last two weeks?',
            ],
          },
          {
            key: 'release',
            printPage: 28,
            template: 'T3_prompt_led',
            title: 'Release',
            intro: [
              'Not everything needs to continue into the next cycle.',
              'Some things have done their work. Some things never took root. Releasing is not failure, it is discernment.',
            ],
            prompts: [
              'What am I ready to release from this cycle?',
              'What has been heavier than it is worth?',
              'What would feel lighter to set down?',
              'What am I releasing with honesty, not shame?',
            ],
          },
          {
            key: 'somatic-notes',
            printPage: 29,
            template: 'T4_somatic',
            title: 'Somatic Notes',
            intro: [
              'Use this page to track what the body is carrying.',
              'Note any tension, ease, fatigue, aliveness, resistance, or relief. Body signals do not need to be explained, just recorded.',
            ],
            prompts: [],
          },
          {
            key: 'full-moon-reflection',
            printPage: 30,
            template: 'T8_lined_reflection',
            title: 'Full Moon Reflection',
            intro: [],
            prompts: [
              'What has come into full view?',
              'What feels illuminated now?',
              'What is asking to be acknowledged before it changes?',
            ],
          },
          {
            key: 'dream-notes',
            printPage: 31,
            template: 'T6_dream_notes',
            title: 'Dream Notes',
            intro: ['Record what stayed with you on waking. A fragment is enough.'],
            prompts: [
              'What do I remember?',
              'What image or scene stayed with me?',
              'What feeling followed me into waking?',
              'Did anything repeat?',
              'What feels worth keeping, even if I do not understand it yet?',
            ],
          },
          {
            key: 'symbol-tracker',
            printPage: 32,
            template: 'T7_symbol_tracker',
            title: 'Symbol Tracker',
            intro: ['Notice what repeats.', 'Use this page to record what returns more than once.'],
            prompts: [],
          },
          {
            key: 'field-note',
            printPage: 33,
            template: 'T5_field_note',
            title: 'Field Note',
            intro: [
              'The field around you is part of the record. Mark the sky, the weather, the light, and the feeling in the air simply, before meaning rushes in.',
            ],
            prompts: [
              'What did the sky look like?',
              'What was the atmosphere of the day or hour?',
              'What stood out in the outer world?',
              'What did the field seem to mirror in me?',
              'What is worth marking from this moment?',
            ],
          },
        ],
      },
      'waning-moon': {
        title: 'Waning Moon',
        mark: '🌗',
        pages: [
          {
            key: 'waning-moon',
            printPage: 34,
            template: 'T3_prompt_led',
            title: 'Waning Moon',
            intro: [
              'The light begins to soften. What was bright starts to settle.',
              'This is a phase for slowing, listening, and letting the cycle come back toward the body. Notice what wants less, what wants rest, and what no longer needs to be held so tightly.',
            ],
            prompts: [
              'What is beginning to quiet down?',
              'What feels ready for rest or less effort?',
              'What am I no longer being asked to carry in the same way?',
              'What is softening as this cycle begins to close?',
              'What would it mean to end this phase gently?',
            ],
          },
          {
            key: 'rest-and-repair',
            printPage: 35,
            template: 'T3_prompt_led',
            title: 'Rest & Repair',
            intro: [
              'Not everything is meant to be pushed through.',
              'Some things return through softness, quiet, sleep, nourishment, and less effort. Let this page hold what needs gentleness now.',
            ],
            prompts: [
              'What in me is asking for rest?',
              'What feels strained, tender, or overused?',
              'What would support repair right now?',
              'What can be softened instead of forced?',
              'What kind of care feels honest and possible right now?',
            ],
          },
          {
            key: 'waning-moon-reflection',
            printPage: 37,
            template: 'T8_lined_reflection',
            title: 'Waning Moon Reflection',
            intro: [],
            prompts: [
              'What is releasing without effort?',
              'What did I learn by slowing down?',
              'What do I want to carry gently into what comes next?',
            ],
          },
          {
            key: 'integration',
            printPage: 40,
            template: 'T3_prompt_led',
            title: 'Integration',
            intro: [
              'A cycle closes by revealing what remains.',
              'This is not a performance review. It is a place to notice what repeated, what changed, what became clearer, and what you want to carry into the next arc.',
            ],
            prompts: [
              'What repeated in this cycle?',
              'What surprised me?',
              'What became clearer over time?',
              'What did my body keep trying to tell me?',
              'What am I carrying forward, and what am I leaving here?',
            ],
          },
          {
            key: 'carrying-forward',
            printPage: 41,
            template: 'T3_prompt_led',
            title: 'Carrying Forward',
            intro: [
              'Not everything from this cycle needs to be left behind.',
              'Some things are worth keeping close: a truth, a practice, a boundary, a rhythm, a way of listening. Let this page name what you want to carry with care.',
            ],
            prompts: [
              'What do I want to carry forward from this cycle?',
              'What felt true enough to keep?',
              'What supported me in a real way?',
              'What do I want to remember when the next cycle begins?',
            ],
          },
        ],
      },
    },
  },
  es: {
    ui: {
      eyebrow: 'Diario Lunar',
      dateLabel: 'Hoy',
      phaseLabel: 'Fase lunar',
      todayPage: 'Página de hoy',
      companionPages: 'También cerca',
      writingLabel: 'Escribe aquí',
      writingPlaceholder: 'Unas pocas líneas bastan.',
      save: 'Guardar localmente',
      saved: 'Guardado localmente',
      delete: 'Eliminar',
      empty: 'Tus entradas locales aparecerán aquí.',
      community: 'Lunar Community LIVE',
      language: 'Idioma',
    },
    phases: {
      'new-moon': {
        title: 'Luna Nueva',
        mark: '🌑',
        pages: [
          {
            key: 'new-moon',
            printPage: 14,
            template: 'T3_prompt_led',
            title: 'Luna Nueva',
            intro: [
              'La Luna Nueva llega en oscuridad. Todavía no hay nada que ver.',
              'Este es un momento para escuchar antes de decidir, para sembrar antes de empujar. Observa qué quiere comenzar antes de intentar darle forma.',
            ],
            prompts: [
              '¿Qué quiero sembrar en este ciclo?',
              '¿Qué se siente lo bastante verdadero para empezar?',
              '¿Qué estoy dispuesto a proteger mientras aún es pequeño?',
              '¿Qué necesita quietud antes de poder crecer?',
              '¿Hacia dónde quiero que se mueva este ciclo?',
            ],
          },
          {
            key: 'seed-intention',
            printPage: 15,
            template: 'T3_prompt_led',
            title: 'Intención Semilla',
            intro: [
              'Una intención no es una meta. Es una dirección, un hilo al que estás dispuesto a volver.',
              'Nómbrala con sencillez. Deja que sea honesta.',
            ],
            prompts: [
              '¿Qué intención quiero llevar a través de este ciclo?',
              '¿Qué dirección se siente lo bastante verdadera para empezar?',
              '¿A qué estoy dispuesto a volver, incluso cuando sea difícil?',
              '¿Qué pequeño acto mantendría viva esta intención?',
            ],
          },
          {
            key: 'somatic-notes',
            printPage: sharedPrintPages.somatic,
            template: 'T4_somatic',
            title: 'Notas Somáticas',
            intro: [
              'Usa esta página para registrar lo que el cuerpo está llevando.',
              'Anota tensión, calma, fatiga, vitalidad, resistencia o alivio. Las señales del cuerpo no necesitan explicación, solo registro.',
            ],
            prompts: [],
          },
          {
            key: 'new-moon-reflection',
            printPage: 17,
            template: 'T8_lined_reflection',
            title: 'Reflexión de Luna Nueva',
            intro: [],
            prompts: [
              '¿Qué se siente quieto pero vivo?',
              '¿Qué necesita protección al comienzo?',
              '¿Qué no estoy listo para apresurar?',
            ],
          },
          {
            key: 'field-note',
            printPage: sharedPrintPages.field,
            template: 'T5_field_note',
            title: 'Nota de Campo',
            intro: [
              'El campo a tu alrededor es parte del registro. Marca el cielo, el clima, la luz y la sensación en el aire, con sencillez, antes de que el significado se apresure.',
            ],
            prompts: [
              '¿Cómo se veía el cielo?',
              '¿Cuál era la atmósfera del día o de la hora?',
              '¿Qué destacó en el mundo exterior?',
              '¿Qué parecía reflejar el campo en mí?',
              '¿Qué vale la pena marcar de este momento?',
            ],
          },
        ],
      },
      'waxing-moon': {
        title: 'Luna Creciente',
        mark: '🌓',
        pages: [
          {
            key: 'waxing-moon',
            printPage: 19,
            template: 'T3_prompt_led',
            title: 'Luna Creciente',
            intro: [
              'La luz regresa. La energía suele empezar a reunirse aquí.',
              'Esta fase pide atención constante, no urgencia ni fuerza. Observa qué se está construyendo y qué necesita para seguir moviéndose.',
            ],
            prompts: [
              '¿Qué está ganando impulso en este ciclo?',
              '¿Qué merece más de mi tiempo y atención?',
              '¿Qué pequeño acto mantendría vivo el hilo?',
              '¿Qué está pidiendo constancia, no intensidad?',
              '¿Qué quiero seguir construyendo, despacio y con cuidado?',
            ],
          },
          {
            key: 'steady-movement',
            printPage: 20,
            template: 'T3_prompt_led',
            title: 'Movimiento Constante',
            intro: [
              'No todos los días se sentirán vivos con impulso.',
              'El movimiento constante no es velocidad. Es volver al hilo, a la intención, al pequeño acto que mantiene las cosas en marcha.',
            ],
            prompts: [
              '¿Cómo se ve lo constante para mí ahora?',
              '¿A qué estoy dispuesto a volver hoy?',
              '¿Qué me mantendría en movimiento sin agotarme?',
            ],
          },
          {
            key: 'symbol-tracker',
            printPage: sharedPrintPages.symbol,
            template: 'T7_symbol_tracker',
            title: 'Registro de Símbolos',
            intro: [
              'Observa lo que se repite.',
              'Usa esta página para registrar lo que vuelve más de una vez.',
            ],
            prompts: [],
          },
          {
            key: 'dream-notes',
            printPage: sharedPrintPages.dream,
            template: 'T6_dream_notes',
            title: 'Notas de Sueños',
            intro: ['Registra lo que permaneció contigo al despertar. Un fragmento basta.'],
            prompts: [
              '¿Qué recuerdo?',
              '¿Qué imagen o escena permaneció conmigo?',
              '¿Qué sensación me siguió al despertar?',
              '¿Algo se repitió?',
              '¿Qué vale la pena conservar, aunque aún no lo entienda?',
            ],
          },
          {
            key: 'waxing-moon-reflection',
            printPage: 25,
            template: 'T8_lined_reflection',
            title: 'Reflexión de Luna Creciente',
            intro: [],
            prompts: [
              '¿Qué está ganando impulso?',
              '¿Qué me ayuda a permanecer con el hilo?',
              '¿Qué dispersa mi energía?',
            ],
          },
          {
            key: 'field-note',
            printPage: 26,
            template: 'T5_field_note',
            title: 'Nota de Campo',
            intro: [
              'El campo a tu alrededor es parte del registro. Marca el cielo, el clima, la luz y la sensación en el aire, con sencillez, antes de que el significado se apresure.',
            ],
            prompts: [
              '¿Cómo se veía el cielo?',
              '¿Cuál era la atmósfera del día o de la hora?',
              '¿Qué destacó en el mundo exterior?',
              '¿Qué parecía reflejar el campo en mí?',
              '¿Qué vale la pena marcar de este momento?',
            ],
          },
        ],
      },
      'full-moon': {
        title: 'Luna Llena',
        mark: '🌕',
        pages: [
          {
            key: 'full-moon',
            printPage: 27,
            template: 'T3_prompt_led',
            title: 'Luna Llena',
            intro: [
              'La Luna Llena llega con luz completa. Lo que ha crecido desde la Luna Nueva ahora es más fácil de ver.',
              'Sosténlo con honestidad. No todo lo que creció es lo que querías cultivar. Este es un tiempo para ver antes de decidir.',
            ],
            prompts: [
              '¿Qué se ha vuelto claro en este ciclo?',
              '¿Qué he construido o hacia qué me he movido?',
              '¿Qué me sorprendió de lo que realmente creció?',
              '¿Qué se siente completo o listo para ser reconocido?',
              '¿De qué me siento más orgulloso de las últimas dos semanas?',
            ],
          },
          {
            key: 'release',
            printPage: 28,
            template: 'T3_prompt_led',
            title: 'Soltar',
            intro: [
              'No todo necesita continuar hacia el siguiente ciclo.',
              'Algunas cosas ya hicieron su trabajo. Algunas nunca echaron raíz. Soltar no es fracasar, es discernir.',
            ],
            prompts: [
              '¿Qué estoy listo para soltar de este ciclo?',
              '¿Qué ha sido más pesado de lo que vale?',
              '¿Qué se sentiría más liviano al dejarlo?',
              '¿Qué estoy soltando con honestidad, no con vergüenza?',
            ],
          },
          {
            key: 'somatic-notes',
            printPage: 29,
            template: 'T4_somatic',
            title: 'Notas Somáticas',
            intro: [
              'Usa esta página para registrar lo que el cuerpo está llevando.',
              'Anota tensión, calma, fatiga, vitalidad, resistencia o alivio. Las señales del cuerpo no necesitan explicación, solo registro.',
            ],
            prompts: [],
          },
          {
            key: 'full-moon-reflection',
            printPage: 30,
            template: 'T8_lined_reflection',
            title: 'Reflexión de Luna Llena',
            intro: [],
            prompts: [
              '¿Qué ha entrado completamente en vista?',
              '¿Qué se siente iluminado ahora?',
              '¿Qué pide ser reconocido antes de cambiar?',
            ],
          },
          {
            key: 'dream-notes',
            printPage: 31,
            template: 'T6_dream_notes',
            title: 'Notas de Sueños',
            intro: ['Registra lo que permaneció contigo al despertar. Un fragmento es suficiente.'],
            prompts: [
              '¿Qué recuerdo?',
              '¿Qué imagen o escena permaneció conmigo?',
              '¿Qué sensación me siguió al despertar?',
              '¿Algo se repitió?',
              '¿Qué se siente digno de guardar, aunque todavía no lo entienda?',
            ],
          },
          {
            key: 'symbol-tracker',
            printPage: 32,
            template: 'T7_symbol_tracker',
            title: 'Registro de Símbolos',
            intro: [
              'Observa lo que se repite.',
              'Usa esta página para registrar lo que vuelve más de una vez.',
            ],
            prompts: [],
          },
          {
            key: 'field-note',
            printPage: 33,
            template: 'T5_field_note',
            title: 'Nota de Campo',
            intro: [
              'El campo a tu alrededor es parte del registro. Marca el cielo, el clima, la luz y la sensación en el aire, con sencillez, antes de que el significado se apresure.',
            ],
            prompts: [
              '¿Cómo se veía el cielo?',
              '¿Cuál era la atmósfera del día o de la hora?',
              '¿Qué destacó en el mundo exterior?',
              '¿Qué parecía reflejar el campo en mí?',
              '¿Qué vale la pena marcar de este momento?',
            ],
          },
        ],
      },
      'waning-moon': {
        title: 'Luna Menguante',
        mark: '🌗',
        pages: [
          {
            key: 'waning-moon',
            printPage: 34,
            template: 'T3_prompt_led',
            title: 'Luna Menguante',
            intro: [
              'La luz empieza a suavizarse. Lo que estaba brillante comienza a asentarse.',
              'Esta fase es para bajar el ritmo, escuchar y dejar que el ciclo vuelva hacia el cuerpo. Observa qué quiere menos, qué quiere descanso y qué ya no necesita sostenerse tan fuerte.',
            ],
            prompts: [
              '¿Qué está empezando a aquietarse?',
              '¿Qué se siente listo para descansar o requerir menos esfuerzo?',
              '¿Qué ya no se me pide cargar del mismo modo?',
              '¿Qué se está suavizando mientras este ciclo empieza a cerrar?',
              '¿Qué significaría terminar esta fase con suavidad?',
            ],
          },
          {
            key: 'rest-and-repair',
            printPage: 35,
            template: 'T3_prompt_led',
            title: 'Descanso y Reparación',
            intro: [
              'No todo está destinado a ser empujado hasta el final.',
              'Algunas cosas regresan mediante suavidad, silencio, sueño, nutrición y menos esfuerzo. Deja que esta página sostenga lo que necesita gentileza ahora.',
            ],
            prompts: [
              '¿Qué en mí pide descanso?',
              '¿Qué se siente tenso, sensible o usado en exceso?',
              '¿Qué apoyaría la reparación ahora?',
              '¿Qué puede suavizarse en lugar de forzarse?',
              '¿Qué tipo de cuidado se siente honesto y posible ahora?',
            ],
          },
          {
            key: 'waning-moon-reflection',
            printPage: 37,
            template: 'T8_lined_reflection',
            title: 'Reflexión de Luna Menguante',
            intro: [],
            prompts: [
              '¿Qué se está liberando sin esfuerzo?',
              '¿Qué aprendí al bajar el ritmo?',
              '¿Qué quiero llevar con suavidad hacia lo que viene?',
            ],
          },
          {
            key: 'integration',
            printPage: 40,
            template: 'T3_prompt_led',
            title: 'Integración',
            intro: [
              'Un ciclo se cierra revelando lo que permanece.',
              'Esto no es una evaluación de rendimiento. Es un lugar para notar qué se repitió, qué cambió, qué se volvió más claro y qué quieres llevar al siguiente arco.',
            ],
            prompts: [
              '¿Qué se repitió en este ciclo?',
              '¿Qué me sorprendió?',
              '¿Qué se volvió más claro con el tiempo?',
              '¿Qué intentó decirme mi cuerpo una y otra vez?',
              '¿Qué llevo hacia adelante y qué dejo aquí?',
            ],
          },
          {
            key: 'carrying-forward',
            printPage: 41,
            template: 'T3_prompt_led',
            title: 'Llevar Adelante',
            intro: [
              'No todo lo de este ciclo necesita quedarse atrás.',
              'Algunas cosas vale la pena mantener cerca: una verdad, una práctica, un límite, un ritmo, una forma de escuchar. Deja que esta página nombre lo que quieres llevar con cuidado.',
            ],
            prompts: [
              '¿Qué quiero llevar adelante de este ciclo?',
              '¿Qué se sintió lo bastante verdadero para conservar?',
              '¿Qué me sostuvo de una manera real?',
              '¿Qué quiero recordar cuando empiece el próximo ciclo?',
            ],
          },
        ],
      },
    },
  },
  ro: {
    ui: {
      eyebrow: 'Jurnalul Lunar',
      dateLabel: 'Astăzi',
      phaseLabel: 'Faza lunii',
      todayPage: 'Pagina de azi',
      companionPages: 'Aproape de azi',
      writingLabel: 'Scrie aici',
      writingPlaceholder: 'Câteva rânduri sunt suficiente.',
      save: 'Salvează local',
      saved: 'Salvat local',
      delete: 'Șterge',
      empty: 'Însemnările tale locale vor apărea aici.',
      community: 'Lunar Community LIVE',
      language: 'Limbă',
    },
    phases: {
      'new-moon': {
        title: 'Lună Nouă',
        mark: '🌑',
        pages: [
          {
            key: 'new-moon',
            printPage: 14,
            template: 'T3_prompt_led',
            title: 'Lună Nouă',
            intro: [
              'Luna Nouă sosește în întuneric. Încă nu este nimic de văzut.',
              'Acesta este un moment pentru a asculta înainte de a decide, pentru a planta înainte de a împinge. Observă ce vrea să înceapă înainte să încerci să-i dai formă.',
            ],
            prompts: [
              'Ce vreau să plantez în acest ciclu?',
              'Ce se simte suficient de adevărat ca să încep?',
              'Ce sunt dispus să protejez cât timp este încă mic?',
              'Ce are nevoie de liniște înainte să poată crește?',
              'Spre ce vreau să se miște acest ciclu?',
            ],
          },
          {
            key: 'seed-intention',
            printPage: 15,
            template: 'T3_prompt_led',
            title: 'Intenție Sămânță',
            intro: [
              'O intenție nu este un obiectiv. Este o direcție, un fir la care ești dispus să te întorci.',
              'Numește-o simplu. Las-o să fie sinceră.',
            ],
            prompts: [
              'Ce intenție vreau să port prin acest ciclu?',
              'Ce direcție se simte suficient de adevărată ca să încep?',
              'La ce sunt dispus să mă întorc, chiar și când este dificil?',
              'Ce gest mic ar ține această intenție vie?',
            ],
          },
          {
            key: 'somatic-notes',
            printPage: sharedPrintPages.somatic,
            template: 'T4_somatic',
            title: 'Note Somatice',
            intro: [
              'Folosește această pagină ca să observi ce poartă corpul.',
              'Notează tensiune, ușurință, oboseală, vitalitate, rezistență sau alinare. Semnalele corpului nu trebuie explicate, doar înregistrate.',
            ],
            prompts: [],
          },
          {
            key: 'new-moon-reflection',
            printPage: 17,
            template: 'T8_lined_reflection',
            title: 'Reflecție de Lună Nouă',
            intro: [],
            prompts: [
              'Ce se simte liniștit, dar viu?',
              'Ce are nevoie de protecție la început?',
              'Ce nu sunt pregătit să grăbesc?',
            ],
          },
          {
            key: 'field-note',
            printPage: sharedPrintPages.field,
            template: 'T5_field_note',
            title: 'Notă de Câmp',
            intro: [
              'Câmpul din jurul tău face parte din înregistrare. Marchează cerul, vremea, lumina și senzația din aer, simplu, înainte ca sensul să se grăbească.',
            ],
            prompts: [
              'Cum arăta cerul?',
              'Care era atmosfera zilei sau a orei?',
              'Ce a ieșit în evidență în lumea exterioară?',
              'Ce părea câmpul să oglindească în mine?',
              'Ce merită marcat din acest moment?',
            ],
          },
        ],
      },
      'waxing-moon': {
        title: 'Lună în Creștere',
        mark: '🌓',
        pages: [
          {
            key: 'waxing-moon',
            printPage: 19,
            template: 'T3_prompt_led',
            title: 'Lună în Creștere',
            intro: [
              'Lumina se întoarce. Energia începe adesea să se adune aici.',
              'Această fază este pentru atenție constantă, nu urgență, nu forță. Observă ce se construiește și de ce are nevoie ca să continue.',
            ],
            prompts: [
              'Ce câștigă avânt în acest ciclu?',
              'Ce merită mai mult din timpul și atenția mea?',
              'Ce gest mic ar ține firul viu?',
              'Ce cere consecvență, nu intensitate?',
              'Ce vreau să continui să construiesc, încet și cu grijă?',
            ],
          },
          {
            key: 'steady-movement',
            printPage: 20,
            template: 'T3_prompt_led',
            title: 'Mișcare Constantă',
            intro: [
              'Nu fiecare zi va avea senzația de avânt viu.',
              'Mișcarea constantă nu înseamnă viteză. Înseamnă întoarcere la fir, la intenție, la gestul mic care ține lucrurile în mișcare.',
            ],
            prompts: [
              'Cum arată constanța pentru mine acum?',
              'La ce sunt dispus să mă întorc azi?',
              'Ce m-ar ține în mișcare fără să mă ard?',
            ],
          },
          {
            key: 'symbol-tracker',
            printPage: sharedPrintPages.symbol,
            template: 'T7_symbol_tracker',
            title: 'Urmărirea Simbolurilor',
            intro: [
              'Observă ce se repetă.',
              'Folosește această pagină ca să înregistrezi ce revine mai mult de o dată.',
            ],
            prompts: [],
          },
          {
            key: 'dream-notes',
            printPage: sharedPrintPages.dream,
            template: 'T6_dream_notes',
            title: 'Note de Vise',
            intro: ['Înregistrează ce a rămas cu tine la trezire. Un fragment este suficient.'],
            prompts: [
              'Ce îmi amintesc?',
              'Ce imagine sau scenă a rămas cu mine?',
              'Ce sentiment m-a urmat în starea de veghe?',
              'S-a repetat ceva?',
              'Ce merită păstrat, chiar dacă încă nu înțeleg?',
            ],
          },
          {
            key: 'waxing-moon-reflection',
            printPage: 25,
            template: 'T8_lined_reflection',
            title: 'Reflecție de Lună în Creștere',
            intro: [],
            prompts: [
              'Ce câștigă avânt?',
              'Ce mă ajută să rămân cu firul?',
              'Ce îmi împrăștie energia?',
            ],
          },
          {
            key: 'field-note',
            printPage: 26,
            template: 'T5_field_note',
            title: 'Notă de Câmp',
            intro: [
              'Câmpul din jurul tău face parte din înregistrare. Marchează cerul, vremea, lumina și senzația din aer, simplu, înainte ca sensul să se grăbească.',
            ],
            prompts: [
              'Cum arăta cerul?',
              'Care era atmosfera zilei sau a orei?',
              'Ce a ieșit în evidență în lumea exterioară?',
              'Ce părea câmpul să oglindească în mine?',
              'Ce merită marcat din acest moment?',
            ],
          },
        ],
      },
      'full-moon': {
        title: 'Lună Plină',
        mark: '🌕',
        pages: [
          {
            key: 'full-moon',
            printPage: 27,
            template: 'T3_prompt_led',
            title: 'Lună Plină',
            intro: [
              'Luna Plină sosește cu lumină întreagă. Ce a crescut de la Luna Nouă este acum mai ușor de văzut.',
              'Ține asta cu sinceritate. Nu tot ce a crescut este ceea ce ai intenționat să crești. Acesta este un timp pentru a vedea înainte de a decide.',
            ],
            prompts: [
              'Ce a devenit clar în acest ciclu?',
              'Ce am construit sau spre ce m-am mișcat?',
              'Ce m-a surprins la ceea ce chiar a crescut?',
              'Ce se simte complet sau gata să fie recunoscut?',
              'De ce sunt cel mai mândru din ultimele două săptămâni?',
            ],
          },
          {
            key: 'release',
            printPage: 28,
            template: 'T3_prompt_led',
            title: 'Eliberare',
            intro: [
              'Nu totul trebuie să continue în următorul ciclu.',
              'Unele lucruri și-au făcut treaba. Unele nu au prins rădăcină. A elibera nu este eșec, este discernământ.',
            ],
            prompts: [
              'Ce sunt gata să eliberez din acest ciclu?',
              'Ce a fost mai greu decât merita?',
              'Ce s-ar simți mai ușor dacă aș pune jos?',
              'Ce eliberez cu sinceritate, nu cu rușine?',
            ],
          },
          {
            key: 'somatic-notes',
            printPage: 29,
            template: 'T4_somatic',
            title: 'Note Somatice',
            intro: [
              'Folosește această pagină ca să observi ce poartă corpul.',
              'Notează tensiune, ușurință, oboseală, vitalitate, rezistență sau alinare. Semnalele corpului nu trebuie explicate, doar înregistrate.',
            ],
            prompts: [],
          },
          {
            key: 'full-moon-reflection',
            printPage: 30,
            template: 'T8_lined_reflection',
            title: 'Reflecție de Lună Plină',
            intro: [],
            prompts: [
              'Ce a intrat complet în vedere?',
              'Ce se simte luminat acum?',
              'Ce cere să fie recunoscut înainte să se schimbe?',
            ],
          },
          {
            key: 'dream-notes',
            printPage: 31,
            template: 'T6_dream_notes',
            title: 'Note de Vise',
            intro: ['Înregistrează ce a rămas cu tine la trezire. Un fragment este suficient.'],
            prompts: [
              'Ce îmi amintesc?',
              'Ce imagine sau scenă a rămas cu mine?',
              'Ce senzație m-a urmat în starea de veghe?',
              'S-a repetat ceva?',
              'Ce se simte demn de păstrat, chiar dacă nu înțeleg încă?',
            ],
          },
          {
            key: 'symbol-tracker',
            printPage: 32,
            template: 'T7_symbol_tracker',
            title: 'Urmărirea Simbolurilor',
            intro: [
              'Observă ce se repetă.',
              'Folosește această pagină ca să înregistrezi ce revine mai mult de o dată.',
            ],
            prompts: [],
          },
          {
            key: 'field-note',
            printPage: 33,
            template: 'T5_field_note',
            title: 'Notă de Câmp',
            intro: [
              'Câmpul din jurul tău face parte din înregistrare. Marchează cerul, vremea, lumina și senzația din aer, simplu, înainte ca sensul să se grăbească.',
            ],
            prompts: [
              'Cum arăta cerul?',
              'Care era atmosfera zilei sau a orei?',
              'Ce a ieșit în evidență în lumea exterioară?',
              'Ce părea câmpul să oglindească în mine?',
              'Ce merită marcat din acest moment?',
            ],
          },
        ],
      },
      'waning-moon': {
        title: 'Lună în Descreștere',
        mark: '🌗',
        pages: [
          {
            key: 'waning-moon',
            printPage: 34,
            template: 'T3_prompt_led',
            title: 'Lună în Descreștere',
            intro: [
              'Lumina începe să se înmoaie. Ce era luminos începe să se așeze.',
              'Această fază este pentru încetinire, ascultare și lăsarea ciclului să revină spre corp. Observă ce vrea mai puțin, ce vrea odihnă și ce nu mai trebuie ținut atât de strâns.',
            ],
            prompts: [
              'Ce începe să se liniștească?',
              'Ce se simte gata pentru odihnă sau mai puțin efort?',
              'Ce nu mi se mai cere să port în același fel?',
              'Ce se înmoaie pe măsură ce acest ciclu începe să se închidă?',
              'Ce ar însemna să închei această fază cu blândețe?',
            ],
          },
          {
            key: 'rest-and-repair',
            printPage: 35,
            template: 'T3_prompt_led',
            title: 'Odihnă și Reparare',
            intro: [
              'Nu totul este făcut ca să fie împins până la capăt.',
              'Unele lucruri se întorc prin moliciune, liniște, somn, hrănire și mai puțin efort. Lasă această pagină să țină ce are nevoie de blândețe acum.',
            ],
            prompts: [
              'Ce din mine cere odihnă?',
              'Ce se simte tensionat, sensibil sau suprasolicitat?',
              'Ce ar susține repararea acum?',
              'Ce poate fi înmuiat în loc să fie forțat?',
              'Ce fel de grijă se simte sinceră și posibilă acum?',
            ],
          },
          {
            key: 'waning-moon-reflection',
            printPage: 37,
            template: 'T8_lined_reflection',
            title: 'Reflecție de Lună în Descreștere',
            intro: [],
            prompts: [
              'Ce se eliberează fără efort?',
              'Ce am învățat încetinind?',
              'Ce vreau să port cu blândețe în ceea ce urmează?',
            ],
          },
          {
            key: 'integration',
            printPage: 40,
            template: 'T3_prompt_led',
            title: 'Integrare',
            intro: [
              'Un ciclu se închide dezvăluind ce rămâne.',
              'Aceasta nu este o evaluare a performanței. Este un loc pentru a observa ce s-a repetat, ce s-a schimbat, ce a devenit mai clar și ce vrei să porți în următorul arc.',
            ],
            prompts: [
              'Ce s-a repetat în acest ciclu?',
              'Ce m-a surprins?',
              'Ce a devenit mai clar în timp?',
              'Ce a încercat corpul meu să-mi spună din nou și din nou?',
              'Ce port mai departe și ce las aici?',
            ],
          },
          {
            key: 'carrying-forward',
            printPage: 41,
            template: 'T3_prompt_led',
            title: 'De Dus Mai Departe',
            intro: [
              'Nu totul din acest ciclu trebuie lăsat în urmă.',
              'Unele lucruri merită ținute aproape: un adevăr, o practică, o limită, un ritm, un fel de a asculta. Lasă această pagină să numească ce vrei să porți cu grijă.',
            ],
            prompts: [
              'Ce vreau să duc mai departe din acest ciclu?',
              'Ce s-a simțit suficient de adevărat ca să păstrez?',
              'Ce m-a susținut într-un mod real?',
              'Ce vreau să-mi amintesc când începe următorul ciclu?',
            ],
          },
        ],
      },
    },
  },
};

export function getContent(locale: Locale) {
  return lunarContent[locale] ?? lunarContent.en;
}
