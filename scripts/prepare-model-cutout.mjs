import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const input = path.join(root, 'assets', 'showcase-source', 'showcase-01.png');
const outputDir = path.join(root, 'public', 'model');
await mkdir(outputDir, { recursive: true });

// Crop centered precisely on the front-facing Vidhi model from the 3-pose studio composite.
const crop = { left: 432, top: 25, width: 390, height: 1190 };
const { data, info } = await sharp(input).extract(crop).removeAlpha().raw().toBuffer({ resolveWithObject: true });

function getP(x, y) {
  const i = (y * info.width + x) * 3;
  return [data[i], data[i + 1], data[i + 2]];
}

const total = info.width * info.height;
const isBg = new Uint8Array(total);

// Trace and smooth the organic saree hem line across the pedestal floor
const rawHem = new Int32Array(info.width);
for (let x = 0; x < info.width; x++) {
  let endY = 1175;
  for (let y = 1130; y < info.height; y++) {
    const [r, g, b] = getP(x, y);
    const luma = r * 0.2126 + g * 0.7152 + b * 0.0722;
    if (y > 1145 && luma > 58 && r > 62) {
      endY = y;
      break;
    }
  }
  rawHem[x] = Math.min(1175, Math.max(1145, endY));
}

const smoothHem = new Int32Array(info.width);
const radius = 8;
for (let x = 0; x < info.width; x++) {
  let sum = 0, count = 0;
  for (let dx = -radius; dx <= radius; dx++) {
    const nx = x + dx;
    if (nx >= 0 && nx < info.width) {
      sum += rawHem[nx];
      count++;
    }
  }
  smoothHem[x] = Math.round(sum / count);
}

for (let y = 0; y < info.height; y++) {
  const yg = crop.top + y;
  for (let x = 0; x < info.width; x++) {
    const xg = crop.left + x;
    const idx = y * info.width + x;
    const [r, g, b] = getP(x, y);
    const luma = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const high = Math.max(r, g, b), low = Math.min(r, g, b);
    const sat = high ? (high - low) / high : 0;
    const diffRB = r - b, diffRG = r - g;

    // 1. Definite outer bounds
    if (yg <= 36 || yg >= 1205) { isBg[idx] = 1; continue; }
    if (xg <= 441 || xg >= 814) { isBg[idx] = 1; continue; }

    // 2. Clear adjacent Model 1 arm on upper left
    if (xg <= 462 && yg <= 460) { isBg[idx] = 1; continue; }

    // 3. Clear adjacent Model 3 shoulder on upper right
    if (xg >= 715 && yg <= 120) { isBg[idx] = 1; continue; }

    // 4. Exact lower flare bounds to isolate Vidhi's saree from adjacent models and floor reflections
    if (yg >= 1050) {
      const minVidhiX = Math.round(448 + Math.max(0, 1170 - yg) * 0.45);
      const maxVidhiX = Math.round(804 - Math.max(0, 1170 - yg) * 0.32);
      if (xg <= minVidhiX || xg >= maxVidhiX) { isBg[idx] = 1; continue; }
    }

    // 5. Pedestal floor reflection under saree hem
    if (y >= smoothHem[x] - 1) { isBg[idx] = 1; continue; }

    // 6. Studio wall everywhere (neutral grey backdrop)
    if (luma > 115 && sat < 0.16 && Math.abs(diffRB) < 16 && diffRG < 24) {
      isBg[idx] = 1; continue;
    }

    // 7. Glowing neon ring / halo outside the figure
    if (luma > 200 && sat < 0.25 && diffRB <= 24) {
      isBg[idx] = 1; continue;
    }
  }
}

// Flood fill from all 4 borders to mark contiguous background
const visited = new Uint8Array(total);
const queue = new Uint32Array(total);
let head = 0, tail = 0;

function seed(x, y) {
  const idx = y * info.width + x;
  if (!visited[idx] && isBg[idx]) { visited[idx] = 1; queue[tail++] = idx; }
}

for (let x = 0; x < info.width; x++) { seed(x, 0); seed(x, info.height - 1); }
for (let y = 0; y < info.height; y++) { seed(0, y); seed(info.width - 1, y); }

while (head < tail) {
  const curr = queue[head++];
  const cx = curr % info.width;
  const cy = Math.floor(curr / info.width);
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (!dx && !dy) continue;
      const nx = cx + dx, ny = cy + dy;
      if (nx < 0 || nx >= info.width || ny < 0 || ny >= info.height) continue;
      const nIdx = ny * info.width + nx;
      if (!visited[nIdx] && isBg[nIdx]) { visited[nIdx] = 1; queue[tail++] = nIdx; }
    }
  }
}

// Clear unvisited studio wall or floor reflection pockets
for (let i = 0; i < total; i++) {
  if (!visited[i] && isBg[i]) {
    const off = i * 3;
    const r = data[off], g = data[off + 1], b = data[off + 2];
    const luma = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const high = Math.max(r, g, b), low = Math.min(r, g, b);
    const sat = high ? (high - low) / high : 0;
    const y = Math.floor(i / info.width);
    const yg = crop.top + y;
    if ((luma > 130 && sat < 0.14 && Math.abs(r - b) < 14) || (yg > 1140 && luma > 58 && r > 62)) {
      visited[i] = 1;
    }
  }
}

const mask = Buffer.alloc(total);
for (let i = 0; i < total; i++) {
  mask[i] = visited[i] ? 0 : 255;
}

const { data: softMask, info: maskInfo } = await sharp(mask, { raw: { width: info.width, height: info.height, channels: 1 } })
  .greyscale()
  .blur(0.5)
  .raw()
  .toBuffer({ resolveWithObject: true });

const rgba = Buffer.alloc(total * 4);
for (let i = 0; i < total; i++) {
  const s = i * 3, d = i * 4;
  rgba[d] = data[s];
  rgba[d + 1] = data[s + 1];
  rgba[d + 2] = data[s + 2];
  rgba[d + 3] = softMask[i * maskInfo.channels];
}

const outputPath = path.join(outputDir, 'vidhi-saree-cutout.webp');
await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
  .webp({ quality: 95, alphaQuality: 100, effort: 5 })
  .toFile(outputPath);

console.log(`Prepared photographic cutout ${info.width}x${info.height} -> ${outputPath}`);
