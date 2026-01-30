import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/admin/data';
import type { RentalItem } from '@/lib/rentals';

interface RentalsData {
  rentals: RentalItem[];
}

export async function GET() {
  try {
    const data = await readDataFile<RentalsData>('rentals');
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json({ rentals: [] }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  }
}
