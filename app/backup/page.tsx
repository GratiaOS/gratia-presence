import type { Metadata } from 'next';
import BackupPageClient from './BackupPageClient';

export const metadata: Metadata = {
  title: 'Ghost Backup',
  description: 'Export and import local Gratia data between browsers.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function BackupPage() {
  return <BackupPageClient />;
}
