const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = 'public/Projects/AuctionSoftware';

function getProjectFiles() {
  if (!fs.existsSync(projectDir)) {
    return { images: [], videos: [] };
  }

  const files = fs.readdirSync(projectDir).map(file => path.join(projectDir, file));
  const images = files.filter(file => /\.(png|jpg|jpeg)$/i.test(file));
  const videos = files.filter(file => /\.mov$/i.test(file));

  return { images, videos };
}

async function optimizeImages(images) {
  console.log('Starting Auction Software image optimization...\n');

  for (const imagePath of images) {
    const outputPath = imagePath.replace(/\.(png|jpg|jpeg)$/i, '.webp');

    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipping ${imagePath} - already optimized`);
      continue;
    }

    const stats = fs.statSync(imagePath);
    const originalSize = (stats.size / 1024).toFixed(2);

    try {
      await sharp(imagePath)
        .webp({ quality: 85 })
        .toFile(outputPath);

      const newStats = fs.statSync(outputPath);
      const newSize = (newStats.size / 1024).toFixed(2);
      const savings = (((stats.size - newStats.size) / stats.size) * 100).toFixed(1);

      console.log(`✓ ${imagePath}`);
      console.log(`  ${originalSize}KB → ${newSize}KB (${savings}% reduction)\n`);
    } catch (error) {
      console.error(`✗ Failed to optimize ${imagePath}:`, error.message);
    }
  }
}

function convertVideos(videos) {
  console.log('Starting Auction Software video conversion...\n');

  for (const videoPath of videos) {
    const outputPath = videoPath.replace(/\.mov$/i, '.mp4');

    if (fs.existsSync(outputPath)) {
      console.log(`⏭️  Skipping ${videoPath} - already converted`);
      continue;
    }

    const stats = fs.statSync(videoPath);
    const originalSize = (stats.size / 1024 / 1024).toFixed(2);

    try {
      execSync(
        `ffmpeg -i "${videoPath}" -vcodec h264 -acodec aac -movflags +faststart "${outputPath}"`,
        { stdio: 'inherit' }
      );

      const newStats = fs.statSync(outputPath);
      const newSize = (newStats.size / 1024 / 1024).toFixed(2);
      const savings = (((stats.size - newStats.size) / stats.size) * 100).toFixed(1);

      console.log(`✓ ${videoPath}`);
      console.log(`  ${originalSize}MB → ${newSize}MB (${savings}% reduction)\n`);
    } catch (error) {
      console.error(`✗ Failed to convert ${videoPath}:`, error.message);
    }
  }
}

async function main() {
  const { images, videos } = getProjectFiles();

  if (!images.length && !videos.length) {
    console.log(`⚠️  No supported media files found in ${projectDir}`);
    return;
  }

  await optimizeImages(images);
  convertVideos(videos);
  console.log('Auction Software optimization complete!');
}

main().catch(console.error);
