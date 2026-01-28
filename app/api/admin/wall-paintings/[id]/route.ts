import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/admin/auth';
import { readDataFile, writeDataFile } from '@/lib/admin/data';
import type { GalleryData } from '@/lib/admin/validation';

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
    const imageId = parseInt(id, 10);
    const data = await readDataFile<GalleryData>('wall-paintings');
    const index = data.images.findIndex((img) => img.id === imageId);

    if (index === -1) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    data.images.splice(index, 1);
    await writeDataFile('wall-paintings', data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting wall painting image:', error);
    return NextResponse.json({ error: 'Failed to delete image' }, { status: 500 });
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
    const imageId = parseInt(id, 10);
    const body = await request.json();
    const data = await readDataFile<GalleryData>('wall-paintings');
    const index = data.images.findIndex((img) => img.id === imageId);

    if (index === -1) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    data.images[index] = { ...data.images[index], ...body, id: imageId };
    await writeDataFile('wall-paintings', data);

    return NextResponse.json(data.images[index]);
  } catch (error) {
    console.error('Error updating wall painting image:', error);
    return NextResponse.json({ error: 'Failed to update image' }, { status: 500 });
  }
}
