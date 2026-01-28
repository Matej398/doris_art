import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin/auth';
import { readDataFile, writeDataFile, getNextId } from '@/lib/admin/data';
import { workshopCreateSchema, type WorkshopsData, type Workshop } from '@/lib/admin/validation';

export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readDataFile<WorkshopsData>('workshops');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching workshops:', error);
    return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = workshopCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = await readDataFile<WorkshopsData>('workshops');
    const newWorkshop: Workshop = {
      ...parsed.data,
      id: getNextId(data.workshops),
    };

    data.workshops.push(newWorkshop);
    await writeDataFile('workshops', data);

    return NextResponse.json(newWorkshop, { status: 201 });
  } catch (error) {
    console.error('Error creating workshop:', error);
    return NextResponse.json({ error: 'Failed to create workshop' }, { status: 500 });
  }
}
