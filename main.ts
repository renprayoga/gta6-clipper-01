// gta6-clipper-01 — entry program (Node 22, standard library only).
//
// The video is the entry: this program only hands the house the video's
// address. It reads VIDEO.json from the repository root and copies it
// byte-for-byte to /output/VIDEO.json, where the gate picks it up and
// checks the video on YouTube. Nothing about the video is scored from
// what this program writes.
//
// The published video is the public Short at
// https://www.youtube.com/shorts/cstRsd6xAyU (channel Echo Nova,
// uploaded 2026-11-20, title "Jason Naik Motor, Pesawat Terbang di
// Atasnya — GTA 6 GILA! #GTA6 #Shorts").
//
// It validates before copying, so a broken VIDEO.json fails loudly
// instead of handing the gate a bad address:
//   - the file must parse as JSON,
//   - it must be an object with a string "url",
//   - the url must be a YouTube address (youtube.com/shorts/<id>,
//     youtube.com/watch?v=<id> or youtu.be/<id>).
// The copy is a raw byte copy, so the grader's two runs always write
// identical bytes.
//
// Local run (mirrors the grader):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Where the repository (input) and the grader output live. The harness
// sets these; the defaults match the sandbox layout.
const repoDir = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Accepted video addresses: a Short, a watch page, or a short link.
const YOUTUBE_ADDRESS =
  /^https:\/\/(www\.youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)[A-Za-z0-9_-]+/;

function reject(reason: string): never {
  console.error(`VIDEO.json rejected: ${reason}`);
  process.exit(1);
}

function readVideoFile(): Buffer {
  const videoPath = join(repoDir, 'VIDEO.json');
  try {
    return readFileSync(videoPath);
  } catch (err) {
    reject(`could not be read from ${videoPath}: ${(err as Error).message}`);
  }
}

function validateVideoJson(raw: Buffer): void {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw.toString('utf8'));
  } catch {
    reject('is not valid JSON');
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    reject('must be a JSON object like {"url": "https://www.youtube.com/shorts/<id>"}');
  }

  const url = (parsed as Record<string, unknown>).url;
  if (typeof url !== 'string' || !YOUTUBE_ADDRESS.test(url)) {
    reject(`"url" must be a YouTube video address, got: ${JSON.stringify(url)}`);
  }
}

function publish(raw: Buffer): void {
  // Raw byte copy on purpose: the gate runs the program twice and the
  // two outputs must be identical, so nothing here re-serializes JSON.
  mkdirSync(outputDir, { recursive: true });
  writeFileSync(join(outputDir, 'VIDEO.json'), raw);
}

const rawVideoJson = readVideoFile();
validateVideoJson(rawVideoJson);
publish(rawVideoJson);
