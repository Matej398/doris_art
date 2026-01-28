import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin/auth';
import { readDataFile, writeDataFile, getNextId } from '@/lib/admin/data';
import { rentalCreateSchema, type RentalsData, type Rental } from '@/lib/admin/validation';

export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readDataFile<RentalsData>('rentals');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching rentals:', error);
    return NextResponse.json({ error: 'Failed to fetch rentals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = rentalCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = await readDataFile<RentalsData>('rentals');
    const newRental: Rental = {
      ...parsed.data,
      id: getNextId(data.rentals),
    };

    data.rentals.push(newRental);
    await writeDataFile('rentals', data);

    return NextResponse.json(newRental, { status: 201 });
  } catch (error) {
    console.error('Error creating rental:', error);
    return NextResponse.json({ error: 'Failed to create rental' }, { status: 500 });
  }
}
