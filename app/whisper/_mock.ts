import type { WhisperFeed } from './_types';

export const mockWhisperFeed: WhisperFeed = {
  kernelState: 'CALM',
  energy: {
    pulse: 'low',
    load: 'low',
    drift: 'stable',
  },
  timeline: [
    {
      id: '1',
      ts: '06:13',
      message: 'Mark a intrat în header. Build pornit.',
      level: 'info',
      tags: ['mark', 'build'],
    },
    {
      id: '2',
      ts: '06:14',
      message: 'import default → fixed. Metadata aliniată.',
      level: 'info',
      tags: ['build', 'fix'],
    },
    {
      id: '3',
      ts: '06:15',
      message: 'Câmp stabil. Corp relaxat. Niciun refresh forțat.',
      level: 'calm',
      tags: ['field'],
    },
    {
      id: '4',
      ts: '06:17',
      message: 'Whisper logat: Mark + securitate = stabilitate blândă.',
      level: 'ritual',
      tags: ['whisper', 'kernel'],
    },
  ],
};
