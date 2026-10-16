// Turns a video into the image sequence used by the scroll animation.
// Usage: npm run frames -- path/to/video.mp4 [fps]
import { spawnSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';

const [video, fps = '30'] = process.argv.slice(2);
if (!video) {
  console.error('Usage: npm run frames -- path/to/video.mp4 [fps]');
  process.exit(1);
}

const out = 'public/frames';
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const r = spawnSync('ffmpeg', ['-i', video, '-vf', `fps=${fps},scale=1920:-2`, '-q:v', '4', `${out}/frame_%04d.jpg`], { stdio: 'inherit' });
if (r.status !== 0) {
  console.error('ffmpeg failed. Install it with: brew install ffmpeg');
  process.exit(1);
}

const count = readdirSync(out).filter(f => f.endsWith('.jpg')).length;
writeFileSync(`${out}/manifest.json`, JSON.stringify({ count, pattern: 'frame_{n}.jpg', pad: 4 }));
console.log(`Wrote ${count} frames to ${out}`);
