"use client";

import { useMemo } from 'react';
import { mockWhisperFeed } from './_mock';

export function useWhisper() {
  return useMemo(() => mockWhisperFeed, []);
}
