import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin/auth';
import { readDataFile, writeDataFile } from '@/lib/admin/data';
import { workshopUpdateSchema, type WorkshopsData } from '@/lib/admin/validation';

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
    const workshopId = parseInt(id, 10);
    const data = await readDataFile<WorkshopsData>('workshops');
    const workshop = data.workshops.find((w) => w.id === workshopId);

    if (!workshop) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 });
    }

    return NextResponse.json(workshop);
  } catch (error) {
    console.error('Error fetching workshop:', error);
    return NextResponse.json({ error: 'Failed to fetch workshop' }, { status: 500 });
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
    const workshopId = parseInt(id, 10);
    const body = await request.json();
    const parsed = workshopUpdateSchema.safeParse({ ...body, id: workshopId });

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = await readDataFile<WorkshopsData>('workshops');
    const index = data.workshops.findIndex((w) => w.id === workshopId);

    if (index === -1) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 });
    }

    data.workshops[index] = { ...data.workshops[index], ...parsed.data };
    await writeDataFile('workshops', data);

    return NextResponse.json(data.workshops[index]);
  } catch (error) {
    console.error('Error updating workshop:', error);
    return NextResponse.json({ error: 'Failed to update workshop' }, { status: 500 });
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
    const workshopId = parseInt(id, 10);
    const data = await readDataFile<WorkshopsData>('workshops');
    const index = data.workshops.findIndex((w) => w.id === workshopId);

    if (index === -1) {
      return NextResponse.json({ error: 'Workshop not found' }, { status: 404 });
    }

    data.workshops.splice(index, 1);
    await writeDataFile('workshops', data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting workshop:', error);
    return NextResponse.json({ error: 'Failed to delete workshop' }, { status: 500 });
  }
}
