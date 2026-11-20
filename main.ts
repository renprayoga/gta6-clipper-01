// gta6-clipper-01 — entry program (Node 22, standard library only).
//
// The entry is the video itself: this program's only job is to hand the
// house the video's address. It reads VIDEO.json from the repository root
// and writes it byte-for-byte to /output/VIDEO.json, where the gate reads
// it and checks the video on YouTube. Nothing about the video is scored
// from what this program writes.
//
// The published video is the public Short at
// https://www.youtube.com/shorts/cstRsd6xAyU (channel Echo Nova,
// uploaded 2026-11-20, title "Jason Naik Motor, Pesawat Terbang di
// Atasnya — GTA 6 GILA! #GTA6 #Shorts").
//
// It validates before it copies, so a broken VIDEO.json fails loudly
// instead of handing the gate a bad address:
//   - the file must parse as JSON,
//   - it must be an object with a string "url",
//   - the url must be a YouTube address (youtube.com/shorts/<id>,
//     youtube.com/watch?v=<id> or youtu.be/<id>).
// The copy itself is a raw byte copy, so the grader's two runs always
// write identical bytes.
//
// Local run (mirrors the grader):
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const YOUTUBE_URL =
  /^https:\/\/(www\.youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)[A-Za-z0-9_-]+/;

function fail(message: string): never {
  console.error(`VIDEO.json rejected: ${message}`);
  process.exit(1);
}

const sourcePath = join(BOT_DIR, 'VIDEO.json');

let raw: Buffer;
try {
  raw = readFileSync(sourcePath);
} catch (err) {
  fail(`could not be read from ${sourcePath}: ${(err as Error).message}`);
}

let parsed: unknown;
try {
  parsed = JSON.parse(raw.toString('utf8'));
} catch {
  fail('is not valid JSON');
}

if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
  fail('must be a JSON object like {"url": "https://www.youtube.com/shorts/<id>"}');
}

const url = (parsed as Record<string, unknown>).url;
if (typeof url !== 'string' || !YOUTUBE_URL.test(url)) {
  fail(`"url" must be a YouTube video address, got: ${JSON.stringify(url)}`);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(join(OUTPUT_DIR, 'VIDEO.json'), raw);
