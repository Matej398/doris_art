/**
 * Migration script: Upload existing JSON data to Vercel Blob
 *
 * Run with: npx tsx scripts/migrate-to-blob.ts
 */

import { put } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

const files = [
  'workshops.json',
  'paintings.json',
  'rentals.json',
  'gallery.json',
  'photography.json',
  'settings.json',
  'about.json',
  'wall-paintings.json',
];

async function migrate() {
  console.log('Starting migration to Vercel Blob...\n');

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);

    try {
      const content = await fs.readFile(filePath, 'utf-8');

      // Validate JSON
      JSON.parse(content);

      const blob = await put(file, content, {
        access: 'public',
        addRandomSuffix: false,
      });

      console.log(`✓ ${file} → ${blob.url}`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        console.log(`⚠ ${file} - File not found, skipping`);
      } else {
        console.error(`✗ ${file} - Error:`, error);
      }
    }
  }

  console.log('\nMigration complete!');
}

migrate().catch(console.error);
