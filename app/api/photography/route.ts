import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/admin/data';

export const dynamic = 'force-dynamic';

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
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ images: [] });
  }
}
