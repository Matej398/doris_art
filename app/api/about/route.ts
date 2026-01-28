import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'about.json');
    const content = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(content);
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    // Return default data if file doesn't exist
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
