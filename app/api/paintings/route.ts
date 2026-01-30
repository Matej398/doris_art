import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/admin/data';

export const dynamic = 'force-dynamic';

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
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ paintings: [] });
  }
}
