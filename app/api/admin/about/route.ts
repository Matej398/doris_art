import { NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/admin/data';

export interface AboutData {
  biography: {
    sl: string[];
    en: string[];
  };
  image: string;
}

export async function GET() {
  try {
    const data = await readDataFile<AboutData>('about');
    return NextResponse.json(data);
  } catch {
    // Return default data if file doesn't exist
    const defaultData: AboutData = {
      biography: {
        sl: [''],
        en: [''],
      },
      image: '/images/author/doris.jpeg',
    };
    return NextResponse.json(defaultData);
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    await writeDataFile('about', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error saving about data:', error);
    return NextResponse.json({ error: 'Failed to save about data' }, { status: 500 });
  }
}
