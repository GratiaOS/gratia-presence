'use client';
import { PropsWithChildren } from 'react';
export default function Aside({ children }: PropsWithChildren) {
  return <aside className="text-muted text-sm">{children}</aside>;
}
