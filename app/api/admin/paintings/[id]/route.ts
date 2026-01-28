import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin/auth';
import { readDataFile, writeDataFile } from '@/lib/admin/data';
import { paintingUpdateSchema, type PaintingsData } from '@/lib/admin/validation';

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
    const paintingId = parseInt(id, 10);
    const data = await readDataFile<PaintingsData>('paintings');
    const painting = data.paintings.find((p) => p.id === paintingId);

    if (!painting) {
      return NextResponse.json({ error: 'Painting not found' }, { status: 404 });
    }

    return NextResponse.json(painting);
  } catch (error) {
    console.error('Error fetching painting:', error);
    return NextResponse.json({ error: 'Failed to fetch painting' }, { status: 500 });
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
    const paintingId = parseInt(id, 10);
    const body = await request.json();
    const parsed = paintingUpdateSchema.safeParse({ ...body, id: paintingId });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = await readDataFile<PaintingsData>('paintings');
    const index = data.paintings.findIndex((p) => p.id === paintingId);

    if (index === -1) {
      return NextResponse.json({ error: 'Painting not found' }, { status: 404 });
    }

    data.paintings[index] = { ...data.paintings[index], ...parsed.data };
    await writeDataFile('paintings', data);

    return NextResponse.json(data.paintings[index]);
  } catch (error) {
    console.error('Error updating painting:', error);
    return NextResponse.json({ error: 'Failed to update painting' }, { status: 500 });
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
    const paintingId = parseInt(id, 10);
    const data = await readDataFile<PaintingsData>('paintings');
    const index = data.paintings.findIndex((p) => p.id === paintingId);

    if (index === -1) {
      return NextResponse.json({ error: 'Painting not found' }, { status: 404 });
    }

    data.paintings.splice(index, 1);
    await writeDataFile('paintings', data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting painting:', error);
    return NextResponse.json({ error: 'Failed to delete painting' }, { status: 500 });
  }
}
