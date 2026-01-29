import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/admin/data';
import type { GalleryData } from '@/lib/admin/validation';

export async function GET() {
  try {
    const data = await readDataFile<GalleryData>('wall-paintings');
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
