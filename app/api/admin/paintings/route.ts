import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin/auth';
import { readDataFile, writeDataFile, getNextId } from '@/lib/admin/data';
import { paintingCreateSchema, type PaintingsData, type Painting } from '@/lib/admin/validation';

export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readDataFile<PaintingsData>('paintings');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching paintings:', error);
    return NextResponse.json({ error: 'Failed to fetch paintings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = paintingCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = await readDataFile<PaintingsData>('paintings');
    const newPainting: Painting = {
      ...parsed.data,
      id: getNextId(data.paintings),
    };

    data.paintings.push(newPainting);
    await writeDataFile('paintings', data);

    return NextResponse.json(newPainting, { status: 201 });
  } catch (error) {
    console.error('Error creating painting:', error);
    return NextResponse.json({ error: 'Failed to create painting' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    // Handle reorder request
    if (body.paintings && Array.isArray(body.paintings)) {
      const data: PaintingsData = { paintings: body.paintings };
      await writeDataFile('paintings', data);
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  } catch (error) {
    console.error('Error updating paintings order:', error);
    return NextResponse.json({ error: 'Failed to update paintings order' }, { status: 500 });
  }
}
