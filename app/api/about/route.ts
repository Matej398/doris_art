import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/admin/data';

export const dynamic = 'force-dynamic';

interface AboutData {
  biography: { sl: string[]; en: string[] };
  image: string;
}

export async function GET() {
  try {
    const data = await readDataFile<AboutData>('about');
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({
      biography: { sl: [], en: [] },
      image: '/images/author/doris.jpeg',
    });
  }
}
