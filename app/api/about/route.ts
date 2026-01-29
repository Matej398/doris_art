import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/admin/data';

interface AboutData {
  biography: { sl: string[]; en: string[] };
  image: string;
}

export async function GET() {
  try {
    const data = await readDataFile<AboutData>('about');
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json({
      biography: { sl: [], en: [] },
      image: '/images/author/doris.jpeg',
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }
}
