import type { Metadata } from 'next';
import './vortex.css';
import VortexPageClient from './VortexPageClient';

export const metadata: Metadata = {
  title: 'Vortex · Gratia',
  description: 'LightFrog Vortex — un portal ceremonios, cu puls blând și gif-ul din atelierul Gratia.',
};

export default function VortexPage() {
  return <VortexPageClient />;
}
