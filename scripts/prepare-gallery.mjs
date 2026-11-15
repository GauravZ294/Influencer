import { readdir, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const imageDir = path.resolve(projectDir, '..');
const outputDir = path.join(projectDir, 'public', 'gallery');
const manifestDir = path.join(projectDir, 'src', 'data');
const imageExts = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.gif', '.bmp']);
const entries = (await readdir(imageDir, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && imageExts.has(path.extname(entry.name).toLowerCase()))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, 'en'));

await mkdir(outputDir, { recursive: true });
await mkdir(manifestDir, { recursive: true });
const manifest = [];
for (const [index, source] of entries.entries()) {
  const id = String(index + 1).padStart(3, '0');
  const safeBase = path.basename(source, path.extname(source)).replace(/[^\p{L}\p{N}_-]+/gu, '-').slice(0, 64);
  const output = `${id}-${safeBase || 'image'}.webp`;
  const inputPath = path.join(imageDir, source);
  const outputPath = path.join(outputDir, output);
  try {
    await sharp(inputPath, { failOn: 'none', animated: false })
      .rotate()
      .resize({ width: 2000, height: 2400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 84, effort: 5 })
      .toFile(outputPath);
    manifest.push({ id, src: `/gallery/${output}`, alt: `Creator photo archive ${id}`, source });
  } catch (error) {
    console.warn(`Skipped unreadable image ${source}: ${error.message}`);
  }
}
await writeFile(path.join(manifestDir, 'gallery.json'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log(`Prepared ${manifest.length} of ${entries.length} images in public/gallery.`);
