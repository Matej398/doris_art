import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin/auth';
import { readDataFile, writeDataFile, getNextId } from '@/lib/admin/data';
import { galleryImageCreateSchema, type PhotographyData, type GalleryImage } from '@/lib/admin/validation';

export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readDataFile<PhotographyData>('photography');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching photography:', error);
    return NextResponse.json({ error: 'Failed to fetch photography' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const parsed = galleryImageCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = await readDataFile<PhotographyData>('photography');
    const newImage: GalleryImage = {
      ...parsed.data,
      id: getNextId(data.images),
    };

    data.images.push(newImage);
    await writeDataFile('photography', data);

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Error adding photography image:', error);
    return NextResponse.json({ error: 'Failed to add photography image' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { images } = body;

    if (!Array.isArray(images)) {
      return NextResponse.json({ error: 'Images array required' }, { status: 400 });
    }

    const data: PhotographyData = { images };
    await writeDataFile('photography', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating photography:', error);
    return NextResponse.json({ error: 'Failed to update photography' }, { status: 500 });
  }
}
