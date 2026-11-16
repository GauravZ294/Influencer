import sharp from 'sharp';
import { resolve } from 'node:path';

const root = process.cwd();
const width = 1200;
const height = 630;
const cards = [
  { path: 'public/site-media/025-2d6c7d4da78c4842a5af3141d9351476.webp', left: 552 },
  { path: 'public/site-media/003-03a951e211d2d1f9a2125b8db734a136.webp', left: 768 },
  { path: 'public/site-media/007-1727976493835.webp', left: 984 },
];
const overlays = await Promise.all(cards.map(async ({ path, left }) => ({
  input: await sharp(resolve(root, path)).rotate().resize(204, height, { fit: 'cover', position: 'attention' }).jpeg({ quality: 88 }).toBuffer(),
  left,
  top: 0,
})));
const artwork = Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="wash"><stop stop-color="#100d12" stop-opacity="1"/><stop offset=".54" stop-color="#100d12" stop-opacity=".96"/><stop offset=".78" stop-color="#100d12" stop-opacity=".22"/><stop offset="1" stop-color="#100d12" stop-opacity="0"/></linearGradient><linearGradient id="veil" x2="0" y2="1"><stop stop-color="#0b090c" stop-opacity=".14"/><stop offset="1" stop-color="#0b090c" stop-opacity=".5"/></linearGradient></defs><rect width="1200" height="630" fill="url(#veil)"/><rect x="0" y="0" width="860" height="630" fill="url(#wash)"/><path d="M78 120h54" stroke="#d1b58f" stroke-width="2"/><text x="78" y="166" fill="#d1b58f" font-family="Arial,sans-serif" font-size="17" letter-spacing="5">CREATOR · GUJARAT, INDIA</text><text x="72" y="300" fill="#f4eff1" font-family="Georgia,serif" font-size="105" letter-spacing="-5">Vidhuuu</text><text x="80" y="356" fill="#ddaeb9" font-family="Arial,sans-serif" font-size="19" letter-spacing="7">THE JOURNEY</text><text x="80" y="429" fill="#e0d6de" font-family="Arial,sans-serif" font-size="17" letter-spacing="2">CASUAL STYLE  ·  SAREE EDITORIALS</text><text x="80" y="462" fill="#e0d6de" font-family="Arial,sans-serif" font-size="17" letter-spacing="2">MODEL  ·  PHOTOSHOOTS  ·  CREATIVE LIFE</text><path d="M80 526h385" stroke="#ffffff" stroke-opacity=".3"/><text x="80" y="564" fill="#c2b7c0" font-family="Arial,sans-serif" font-size="13" letter-spacing="4">BUSINESS BY DAY · CREATIVE BY INSTINCT</text><rect x="548" y="15" width="208" height="600" fill="none" stroke="#f2dfe4" stroke-opacity=".48"/><rect x="764" y="15" width="208" height="600" fill="none" stroke="#f2dfe4" stroke-opacity=".3"/><rect x="980" y="15" width="208" height="600" fill="none" stroke="#f2dfe4" stroke-opacity=".48"/></svg>`);
await sharp({ create: { width, height, channels: 3, background: '#100d12' } })
  .composite([...overlays, { input: artwork, left: 0, top: 0 }])
  .jpeg({ quality: 90, mozjpeg: true })
  .toFile(resolve(root, 'public/social-preview.jpg'));

