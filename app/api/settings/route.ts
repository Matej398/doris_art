import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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
    const filePath = path.join(process.cwd(), 'data', 'settings.json');
    const content = await fs.readFile(filePath, 'utf-8');
    const data: Settings = JSON.parse(content);

    // Only return pageVisibility (not admin-only settings)
    return NextResponse.json({
      pageVisibility: data.pageVisibility || {}
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    // Return default visibility (all pages visible)
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
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }
}
