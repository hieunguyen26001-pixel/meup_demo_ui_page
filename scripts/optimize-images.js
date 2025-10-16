#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PUBLIC_DIR = path.join(__dirname, '../public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

// Check if sharp is available, if not install it
function ensureSharpInstalled() {
  try {
    require('sharp');
  } catch (error) {
    console.log('Installing sharp for image optimization...');
    execSync('npm install sharp --save-dev', { stdio: 'inherit' });
  }
}

// Optimize images
async function optimizeImages() {
  ensureSharpInstalled();
  const sharp = require('sharp');

  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
  const files = [];

  // Find all image files
  function findImages(dir) {
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        findImages(fullPath);
      } else if (imageExtensions.includes(path.extname(item).toLowerCase())) {
        files.push(fullPath);
      }
    }
  }

  findImages(IMAGES_DIR);

  console.log(`Found ${files.length} images to optimize...`);

  let totalSaved = 0;
  const originalSize = files.reduce((acc, file) => acc + fs.statSync(file).size, 0);

  for (const file of files) {
    try {
      const ext = path.extname(file).toLowerCase();
      const name = path.basename(file, ext);
      const dir = path.dirname(file);
      
      // Create backup
      const backupFile = path.join(dir, `${name}.backup${ext}`);
      if (!fs.existsSync(backupFile)) {
        fs.copyFileSync(file, backupFile);
      }

      // Optimize based on file type
      let pipeline = sharp(file);
      
      if (ext === '.png') {
        pipeline = pipeline.png({ 
          quality: 80, 
          compressionLevel: 9,
          progressive: true 
        });
      } else if (['.jpg', '.jpeg'].includes(ext)) {
        pipeline = pipeline.jpeg({ 
          quality: 80, 
          progressive: true,
          mozjpeg: true 
        });
      }

      const optimizedBuffer = await pipeline.toBuffer();
      const originalSize = fs.statSync(file).size;
      const optimizedSize = optimizedBuffer.length;
      
      if (optimizedSize < originalSize) {
        fs.writeFileSync(file, optimizedBuffer);
        const saved = originalSize - optimizedSize;
        totalSaved += saved;
        console.log(`✓ ${path.relative(PUBLIC_DIR, file)}: ${formatBytes(originalSize)} → ${formatBytes(optimizedSize)} (saved ${formatBytes(saved)})`);
      } else {
        console.log(`- ${path.relative(PUBLIC_DIR, file)}: already optimized`);
      }
    } catch (error) {
      console.error(`✗ Error optimizing ${file}:`, error.message);
    }
  }

  const finalSize = files.reduce((acc, file) => acc + fs.statSync(file).size, 0);
  const totalSavedPercent = ((totalSaved / originalSize) * 100).toFixed(1);

  console.log(`\n🎉 Image optimization complete!`);
  console.log(`📊 Total saved: ${formatBytes(totalSaved)} (${totalSavedPercent}%)`);
  console.log(`📁 Original size: ${formatBytes(originalSize)}`);
  console.log(`📁 Final size: ${formatBytes(finalSize)}`);
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run optimization
optimizeImages().catch(console.error);
