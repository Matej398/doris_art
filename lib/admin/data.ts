import { put, list, del } from '@vercel/blob';

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

// Default data for each file type (used when blob doesn't exist yet)
const defaultData: Record<DataFile, unknown> = {
  workshops: { workshops: [], eventTypes: [] },
  paintings: { paintings: [] },
  rentals: { rentals: [] },
  gallery: { images: [] },
  photography: { images: [] },
  settings: { rentalCategories: [], pageVisibility: {} },
  about: { biography: { sl: [], en: [] }, image: '' },
  'wall-paintings': { images: [] },
};

export async function createBackup(file: DataFile): Promise<string> {
  const fileName = fileNames[file];
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `backups/${file}_${timestamp}.json`;

  try {
    // Read current data
    const data = await readDataFile(file);

    // Write backup to blob (always unique filename, no overwrite needed)
    const blob = await put(backupFileName, JSON.stringify(data, null, 2), {
      access: 'public',
      addRandomSuffix: true,
    });

    return blob.url;
  } catch (error) {
    console.error(`Error creating backup for ${file}:`, error);
    throw new Error(`Failed to create backup for ${file}`);
  }
}

// Blob store base URL
const BLOB_BASE_URL = 'https://djjywkecl3mz3lhj.public.blob.vercel-storage.com';

export async function readDataFile<T>(file: DataFile): Promise<T> {
  const fileName = fileNames[file];
  const blobUrl = `${BLOB_BASE_URL}/${fileName}`;

  try {
    // Fetch directly with cache busting
    const response = await fetch(`${blobUrl}?t=${Date.now()}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`Blob ${fileName} not found, returning default data`);
        return defaultData[file] as T;
      }
      throw new Error(`Failed to fetch blob: ${response.statusText}`);
    }

    const content = await response.text();
    return JSON.parse(content) as T;
  } catch (error) {
    const errorMessage = String(error);
    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      console.log(`Blob ${fileName} not found, returning default data`);
      return defaultData[file] as T;
    }

    console.error(`Error reading ${file}:`, error);
    throw new Error(`Failed to read ${file} data`);
  }
}

export async function writeDataFile<T>(file: DataFile, data: T): Promise<void> {
  const fileName = fileNames[file];

  // Skip backup for now - just write directly
  try {
    const content = JSON.stringify(data, null, 2);
    await put(fileName, content, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
    });
    console.log(`Successfully wrote ${file} to blob`);
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

// Clean up old backups (keep last 10 per file type)
export async function cleanupOldBackups(): Promise<void> {
  try {
    const { blobs } = await list({ prefix: 'backups/' });
    const filesByType: Record<string, typeof blobs> = {};

    for (const blob of blobs) {
      const match = blob.pathname.match(/backups\/(\w+)_\d{4}-\d{2}-\d{2}T/);
      if (match) {
        const type = match[1];
        if (!filesByType[type]) filesByType[type] = [];
        filesByType[type].push(blob);
      }
    }

    for (const [, typeBlobs] of Object.entries(filesByType)) {
      // Sort by uploadedAt descending (newest first)
      typeBlobs.sort((a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );

      // Delete blobs beyond the first 10
      for (let i = 10; i < typeBlobs.length; i++) {
        await del(typeBlobs[i].url);
      }
    }
  } catch (error) {
    console.error('Error cleaning up backups:', error);
  }
}
