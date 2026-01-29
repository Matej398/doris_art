import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/admin/data';

export const dynamic = 'force-dynamic';

interface Settings {
  pageVisibility?: {
    workshops?: boolean;
    paintings?: boolean;
    rentals?: boolean;
    gallery?: boolean;
    photography?: boolean;
    wallPaintings?: boolean;
    about?: boolean;
    other?: boolean;
  };
}

export async function GET() {
  try {
    const data = await readDataFile<Settings>('settings');

    return NextResponse.json({
      pageVisibility: data.pageVisibility || {}
    });
  } catch {
    return NextResponse.json({
      pageVisibility: {
        wallPaintings: true,
        workshops: true,
        paintings: true,
        rentals: true,
        photography: true,
        gallery: true,
        about: true,
        other: true,
      }
    });
  }
}
