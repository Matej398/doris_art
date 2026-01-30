import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/admin/data';
import type { GalleryData } from '@/lib/admin/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await readDataFile<GalleryData>('gallery');
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ images: [] });
  }
}
