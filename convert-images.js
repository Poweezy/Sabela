const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function convertToWebP() {
  const inputPath = 'img/logo.png';
  const outputPath = 'img/logo.webp';

  if (!fs.existsSync(inputPath)) {
    console.error('Input file not found:', inputPath);
    return;
  }

  try {
    await sharp(inputPath)
      .webp({ quality: 80 })
      .toFile(outputPath);
    console.log('Converted logo.png to logo.webp successfully.');
  } catch (error) {
    console.error('Error converting image:', error);
  }
}

convertToWebP();
