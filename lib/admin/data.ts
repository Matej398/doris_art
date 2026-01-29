import fs from 'fs/promises';
import path from 'path';

// Data directory outside git repo - persists across deploys
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');

export type DataFile = 'workshops' | 'paintings' | 'rentals' | 'gallery' | 'photography' | 'settings' | 'about' | 'wall-paintings';

const fileNames: Record<DataFile, string> = {
  workshops: 'workshops.json',
  paintings: 'paintings.json',
  rentals: 'rentals.json',
  gallery: 'gallery.json',
  photography: 'photography.json',
  settings: 'settings.json',
  about: 'about.json',
  'wall-paintings': 'wall-paintings.json',
};

export async function readDataFile<T>(file: DataFile): Promise<T> {
  const fileName = fileNames[file];
  const filePath = path.join(DATA_DIR, fileName);

  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    console.error(`Error reading ${file}:`, error);
    throw new Error(`Failed to read ${file} data`);
  }
}

export async function writeDataFile<T>(file: DataFile, data: T): Promise<void> {
  const fileName = fileNames[file];
  const filePath = path.join(DATA_DIR, fileName);

  try {
    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content + '\n', 'utf-8');
  } catch (error) {
    console.error(`Error writing ${file}:`, error);
    throw new Error(`Failed to write ${file} data`);
  }
}

// Helper to get the next ID for an array of items with numeric IDs
export function getNextId<T extends { id: number }>(items: T[]): number {
  if (items.length === 0) return 1;
  return Math.max(...items.map((item) => item.id)) + 1;
}
