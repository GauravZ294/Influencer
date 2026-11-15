import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'assets', 'showcase-source');
const outputDir = path.join(root, 'public', 'showcase');
await mkdir(outputDir, { recursive: true });
const files = (await readdir(sourceDir)).filter((file) => file.toLowerCase().endsWith('.png')).sort();
for (const [index, file] of files.entries()) {
  await sharp(path.join(sourceDir, file)).resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 84, effort: 5 }).toFile(path.join(outputDir, `showcase-${String(index + 1).padStart(2, '0')}.webp`));
}
console.log(`Prepared ${files.length} central showcase images.`);
