import { NextResponse } from 'next/server';
import { scenes } from '@/lib/scenes';

export const dynamic = 'force-static';

export function GET() {
  return NextResponse.json({ scenes });
}
