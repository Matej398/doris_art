import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const BACKUP_DIR = path.join(process.cwd(), 'data', 'backups');

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

async function ensureBackupDir(): Promise<void> {
  try {
    await fs.access(BACKUP_DIR);
  } catch {
    await fs.mkdir(BACKUP_DIR, { recursive: true });
  }
}

export async function createBackup(file: DataFile): Promise<string> {
  await ensureBackupDir();

  const fileName = fileNames[file];
  const sourcePath = path.join(DATA_DIR, fileName);
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFileName = `${file}_${timestamp}.json`;
  const backupPath = path.join(BACKUP_DIR, backupFileName);

  try {
    const content = await fs.readFile(sourcePath, 'utf-8');
    await fs.writeFile(backupPath, content, 'utf-8');
    return backupPath;
  } catch (error) {
    console.error(`Error creating backup for ${file}:`, error);
    throw new Error(`Failed to create backup for ${file}`);
  }
}

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

  // Create backup before writing
  await createBackup(file);

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

// Clean up old backups (keep last 10 per file type)
export async function cleanupOldBackups(): Promise<void> {
  await ensureBackupDir();

  try {
    const files = await fs.readdir(BACKUP_DIR);
    const filesByType: Record<string, string[]> = {};

    for (const file of files) {
      const match = file.match(/^(\w+)_\d{4}-\d{2}-\d{2}T/);
      if (match) {
        const type = match[1];
        if (!filesByType[type]) filesByType[type] = [];
        filesByType[type].push(file);
      }
    }

    for (const [, typeFiles] of Object.entries(filesByType)) {
      // Sort by name (which includes timestamp) descending
      typeFiles.sort().reverse();

      // Delete files beyond the first 10
      for (let i = 10; i < typeFiles.length; i++) {
        await fs.unlink(path.join(BACKUP_DIR, typeFiles[i]));
      }
    }
  } catch (error) {
    console.error('Error cleaning up backups:', error);
  }
}
