const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const IMAGES_DIR = path.join(__dirname, '../public/images');
const MAX_WIDTH = 1920; // Max width in pixels
const MAX_HEIGHT = 1920; // Max height in pixels
const MAX_FILE_SIZE = 1024 * 1024; // 1MB in bytes
const QUALITY = 85; // JPEG quality (1-100)

async function compressImage(filePath) {
  const stats = fs.statSync(filePath);
  const fileSize = stats.size;
  
  // Skip if already small enough
  if (fileSize <= MAX_FILE_SIZE) {
    console.log(`✓ ${path.basename(filePath)} already optimized (${(fileSize / 1024).toFixed(1)}KB)`);
    return;
  }

  try {
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    // Calculate new dimensions if needed
    let width = metadata.width;
    let height = metadata.height;
    
    if (width > MAX_WIDTH || height > MAX_HEIGHT) {
      const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    // Compress the image to a temporary file first
    const tempPath = filePath + '.tmp';
    const ext = path.extname(filePath).toLowerCase();
    
    if (ext === '.jpg' || ext === '.jpeg') {
      await image
        .resize(width, height, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: QUALITY, mozjpeg: true })
        .toFile(tempPath);
    } else if (ext === '.png') {
      await image
        .resize(width, height, { fit: 'inside', withoutEnlargement: true })
        .png({ quality: QUALITY, compressionLevel: 9 })
        .toFile(tempPath);
    } else {
      console.log(`⚠ Skipping ${path.basename(filePath)} - unsupported format`);
      return;
    }

    // Replace original with compressed version
    fs.renameSync(tempPath, filePath);
    
    const newStats = fs.statSync(filePath);
    const newSize = newStats.size;
    const savings = ((fileSize - newSize) / fileSize * 100).toFixed(1);
    
    console.log(`✓ ${path.basename(filePath)}: ${(fileSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024 / 1024).toFixed(2)}MB (${savings}% reduction)`);
  } catch (error) {
    console.error(`✗ Error compressing ${path.basename(filePath)}:`, error.message);
  }
}

function getAllImageFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      getAllImageFiles(filePath, fileList);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp', '.jfif'].includes(ext)) {
        fileList.push(filePath);
      }
    }
  });

  return fileList;
}

async function compressAllImages() {
  if (!fs.existsSync(IMAGES_DIR)) {
    console.log(`Directory ${IMAGES_DIR} does not exist`);
    return;
  }

  const imageFiles = getAllImageFiles(IMAGES_DIR);

  if (imageFiles.length === 0) {
    console.log('No images found to compress');
    return;
  }

  console.log(`Found ${imageFiles.length} image(s) to process...\n`);

  for (const filePath of imageFiles) {
    await compressImage(filePath);
  }

  console.log('\n✓ Image compression complete!');
}

compressAllImages().catch(console.error);

