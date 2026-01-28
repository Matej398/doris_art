import { NextResponse } from 'next/server';
import { readDataFile, writeDataFile } from '@/lib/admin/data';

export interface SettingsData {
  rentalCategories: string[];
  pageVisibility: {
    workshops: boolean;
    paintings: boolean;
    rentals: boolean;
    gallery: boolean;
    photography: boolean;
    wallPaintings: boolean;
    about: boolean;
  };
}

export async function GET() {
  try {
    const data = await readDataFile<SettingsData>('settings');
    return NextResponse.json(data);
  } catch {
    // Return default settings if file doesn't exist
    const defaultSettings: SettingsData = {
      rentalCategories: ['Dekoracija', 'Pohištvo', 'Razsvetljava', 'Tekstil', 'Drugo'],
      pageVisibility: {
        workshops: true,
        paintings: true,
        rentals: true,
        gallery: true,
        photography: true,
        wallPaintings: true,
        about: true,
      },
    };
    return NextResponse.json(defaultSettings);
  }
}

export async function PUT(request: Request) {
  try {
    const data = await request.json();
    await writeDataFile('settings', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
