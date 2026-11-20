// gta6-clipper-01 — entry program (Node 22, standard library only).
//
// The video is the entry. This program only hands the house the video's
// address: it reads VIDEO.json from the repository root and copies it
// byte-for-byte to /output/VIDEO.json, where the gate picks it up and
// checks the video on YouTube. The program scores nothing about the
// video itself — the views do that.
//
// Clip v2 (2026-11-20): a reaction compilation — IShowSpeed screaming at
// the GTA 6 trailer, Kai Cenat speechless after it, penguinz0 laughing,
// then Rockstar Trailer 2 action (jetski, Jason on a motorbike under a
// low plane) and the make.fun pitch. Indonesian voiceover comments on
// each reaction. The new Short's URL goes into VIDEO.json after upload;
// this program does not know or care what the URL is, only that it is
// a real YouTube video address.
//
// Validation is deliberately loud: a bad VIDEO.json exits 1 with the
// reason, instead of handing the gate a broken address.
//   - the file must exist and parse as JSON,
//   - it must be an object with a string "url",
//   - the url must be a YouTube video address: youtube.com/shorts/<id>,
//     youtube.com/watch?v=<id>, or youtu.be/<id>.
// The copy is a raw byte copy, so the grader's two runs always write
// identical bytes.
//
// Local run (mirrors the grader):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// A YouTube video id is only letters, digits, "-" and "_". The checks
// below reject anything else, so a mistyped or placeholder id fails
// here instead of reaching the gate.
const VIDEO_ID = /^[A-Za-z0-9_-]+$/;

function die(message: string): never {
  console.error(`VIDEO.json rejected: ${message}`);
  process.exit(1);
}

function isYouTubeVideo(href: string): boolean {
  let parsed: URL;
  try {
    parsed = new URL(href);
  } catch {
    return false;
  }
  const host = parsed.hostname.replace(/^www\./, '');
  if (host === 'youtu.be') {
    return VIDEO_ID.test(parsed.pathname.slice(1));
  }
  if (host === 'youtube.com') {
    if (/^\/shorts\/[A-Za-z0-9_-]+\/?$/.test(parsed.pathname)) {
      return true;
    }
    if (parsed.pathname === '/watch') {
      const id = parsed.searchParams.get('v');
      return id !== null && VIDEO_ID.test(id);
    }
  }
  return false;
}

function main(): void {
  const videoJsonPath = join(BOT_DIR, 'VIDEO.json');
  if (!existsSync(videoJsonPath)) {
    die(`not found at ${videoJsonPath}`);
  }
  const bytes = readFileSync(videoJsonPath);

  let data: unknown;
  try {
    data = JSON.parse(bytes.toString('utf8'));
  } catch {
    die('is not valid JSON');
  }
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    die('must be a JSON object like {"url": "https://www.youtube.com/shorts/<id>"}');
  }

  const url = (data as { url?: unknown }).url;
  if (typeof url !== 'string' || !isYouTubeVideo(url)) {
    die(`"url" must be a YouTube video address, got: ${JSON.stringify(url)}`);
  }

  // Raw byte copy on purpose: the gate runs the program twice and the
  // two outputs must be identical, so nothing here re-serializes JSON.
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(join(OUT_DIR, 'VIDEO.json'), bytes);
}

main();
