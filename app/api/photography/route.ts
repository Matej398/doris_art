import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/admin/data';

interface PhotographyData {
  images: Array<{
    id: number;
    src: string;
    alt: string;
  }>;
}

export async function GET() {
  try {
    const data = await readDataFile<PhotographyData>('photography');
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json({ images: [] }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }
}
