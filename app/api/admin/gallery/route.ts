import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin/auth';
import { readDataFile, writeDataFile, getNextId } from '@/lib/admin/data';
import { galleryImageCreateSchema, type GalleryData, type GalleryImage } from '@/lib/admin/validation';

export async function GET() {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await readDataFile<GalleryData>('gallery');
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching gallery:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery' }, { status: 500 });
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

    const data = await readDataFile<GalleryData>('gallery');
    const newImage: GalleryImage = {
      ...parsed.data,
      id: getNextId(data.images),
    };

    data.images.push(newImage);
    await writeDataFile('gallery', data);

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('Error adding gallery image:', error);
    return NextResponse.json({ error: 'Failed to add gallery image' }, { status: 500 });
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

    const data: GalleryData = { images };
    await writeDataFile('gallery', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating gallery:', error);
    return NextResponse.json({ error: 'Failed to update gallery' }, { status: 500 });
  }
}
