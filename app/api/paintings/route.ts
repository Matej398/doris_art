import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/admin/data';

interface PaintingsData {
  paintings: Array<{
    id: number;
    title: string;
    images?: Array<{ src: string; alt?: string }>;
    [key: string]: unknown;
  }>;
}

export async function GET() {
  try {
    const data = await readDataFile<PaintingsData>('paintings');
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json({ paintings: [] }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }
}
