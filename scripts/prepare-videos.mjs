import { copyFile, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.resolve(projectDir, '..');
const targetDir = path.join(projectDir, 'public', 'videos');
const dataDir = path.join(projectDir, 'src', 'data');
await mkdir(targetDir, { recursive: true });
await mkdir(dataDir, { recursive: true });
const files = (await readdir(sourceDir, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && /^viddhi_0008-.*\.mp4$/i.test(entry.name))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, 'en'));
const clips = [];
for (const [index, name] of files.entries()) {
  const id = String(index + 1).padStart(2, '0');
  const output = `${id}-vidhi-film.mp4`;
  await copyFile(path.join(sourceDir, name), path.join(targetDir, output));
  clips.push({ id, src: `/videos/${output}`, title: `Film ${id}`, source: name });
}
await writeFile(path.join(dataDir, 'videos.json'), `${JSON.stringify(clips, null, 2)}\n`, 'utf8');
console.log(`Prepared ${clips.length} Vidhi video clips.`);
