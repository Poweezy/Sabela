const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertToWebP() {
  const imgDir = 'img';
  const supportedExtensions = ['.png', '.jpg', '.jpeg'];

  if (!fs.existsSync(imgDir)) {
    console.error('Image directory not found:', imgDir);
    return;
  }

  const files = fs.readdirSync(imgDir);

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (supportedExtensions.includes(ext)) {
      const inputPath = path.join(imgDir, file);
      const outputFileName = path.basename(file, ext) + '.webp';
      const outputPath = path.join(imgDir, outputFileName);

      if (fs.existsSync(outputPath)) {
        console.log(`WebP already exists: ${outputFileName}`);
        continue;
      }

      try {
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        console.log(`Converted ${file} to ${outputFileName} successfully.`);
      } catch (error) {
        console.error(`Error converting ${file}:`, error);
      }
    }
  }
}

convertToWebP();
