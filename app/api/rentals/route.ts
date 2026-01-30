import { NextResponse } from 'next/server';
import { readDataFile } from '@/lib/admin/data';
import type { RentalItem } from '@/lib/rentals';

export const dynamic = 'force-dynamic';

interface RentalsData {
  rentals: RentalItem[];
}

export async function GET() {
  try {
    const data = await readDataFile<RentalsData>('rentals');
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ rentals: [] });
  }
}
