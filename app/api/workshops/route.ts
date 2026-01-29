import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/admin/data';
import type { WorkshopsData } from '@/lib/admin/validation';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await readDataFile<WorkshopsData>('workshops');

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching workshops:', error);
    return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 });
  }
}
