import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Configuration
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_WIDTH = 3840;
const MAX_HEIGHT = 3840;
const QUALITY = 85;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;
    const folder = formData.get('folder') as string || 'gallery';
    const maxWidth = parseInt(formData.get('maxWidth') as string) || MAX_WIDTH;
    const maxHeight = parseInt(formData.get('maxHeight') as string) || MAX_HEIGHT;

    if (!file) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get image metadata
    const image = sharp(buffer);
    const metadata = await image.metadata();
    
    // Calculate new dimensions
    let width = metadata.width || maxWidth;
    let height = metadata.height || maxHeight;

    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    // Generate filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/\s+/g, '-').toLowerCase();
    const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
    const ext = file.type === 'image/png' ? 'png' : 'jpg';
    const filename = `${nameWithoutExt}-${timestamp}.${ext}`;

    // Create directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'images', folder);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const filepath = join(uploadDir, filename);

    // Optimize and save image
    if (file.type === 'image/png') {
      await image
        .resize(width, height, { fit: 'inside', withoutEnlargement: true })
        .png({ quality: QUALITY, compressionLevel: 9 })
        .toFile(filepath);
    } else {
      await image
        .resize(width, height, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(filepath);
    }

    // Get file stats
    const stats = await import('fs').then(fs => fs.promises.stat(filepath));
    const optimizedSize = stats.size;
    const originalSize = file.size;
    const compressionRatio = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

    return NextResponse.json({
      success: true,
      filename,
      path: `/images/${folder}/${filename}`,
      originalSize,
      optimizedSize,
      compressionRatio: `${compressionRatio}%`,
      dimensions: { width, height },
    });
  } catch (error) {
    console.error('Image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}

