import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin/auth';
import { readDataFile, writeDataFile } from '@/lib/admin/data';
import { rentalUpdateSchema, type RentalsData } from '@/lib/admin/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const rentalId = parseInt(id, 10);
    const data = await readDataFile<RentalsData>('rentals');
    const rental = data.rentals.find((r) => r.id === rentalId);

    if (!rental) {
      return NextResponse.json({ error: 'Rental not found' }, { status: 404 });
    }

    return NextResponse.json(rental);
  } catch (error) {
    console.error('Error fetching rental:', error);
    return NextResponse.json({ error: 'Failed to fetch rental' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const rentalId = parseInt(id, 10);
    const body = await request.json();
    const parsed = rentalUpdateSchema.safeParse({ ...body, id: rentalId });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = await readDataFile<RentalsData>('rentals');
    const index = data.rentals.findIndex((r) => r.id === rentalId);

    if (index === -1) {
      return NextResponse.json({ error: 'Rental not found' }, { status: 404 });
    }

    data.rentals[index] = { ...data.rentals[index], ...parsed.data };
    await writeDataFile('rentals', data);

    return NextResponse.json(data.rentals[index]);
  } catch (error) {
    console.error('Error updating rental:', error);
    return NextResponse.json({ error: 'Failed to update rental' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const rentalId = parseInt(id, 10);
    const data = await readDataFile<RentalsData>('rentals');
    const index = data.rentals.findIndex((r) => r.id === rentalId);

    if (index === -1) {
      return NextResponse.json({ error: 'Rental not found' }, { status: 404 });
    }

    data.rentals.splice(index, 1);
    await writeDataFile('rentals', data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting rental:', error);
    return NextResponse.json({ error: 'Failed to delete rental' }, { status: 500 });
  }
}
