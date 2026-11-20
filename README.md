[![gta6-clipper-01](https://make.fun/badge/gta6-clipper-01.svg)](https://make.fun/bounty/gta6-clipper-01)
[![rank](https://make.fun/badge/gta6-clipper-01/renprayoga/gta6-clipper-01/rank.svg)](https://make.fun/bounty/gta6-clipper-01)
[![reward](https://make.fun/badge/gta6-clipper-01/renprayoga/gta6-clipper-01/reward.svg)](https://make.fun/bounty/gta6-clipper-01)

# GTA 6 Clipper — Jason Naik Motor, Pesawat Terbang di Atasnya

Entry for the make.fun bounty **"Clip GTA 6 for the most YouTube views"**
($500, top 20 share the prize, places go by YouTube views at the deadline).

## The clip

A 26-second vertical Short (1080×1920) in Bahasa Indonesia, cut from Rockstar's
public **Grand Theft Auto VI Trailer 2**. One moment per beat, no montage filler:

| Time | Moment (Trailer 2) |
| --- | --- |
| 0–3 s | **Hook:** Jason on a motorcycle as a plane flies low overhead (142 s) |
| 3–6 s | Helicopter + airboat swamp chase, then the jetski (138–141 s) |
| 6–9 s | Car crash and night truck chase (119–122 s) |
| 9–12 s | Boat + helicopter, wheelie, convertible chase (147–150 s) |
| 12–15 s | Ocean Drive and the neon pool (125–128 s) |
| 15–18 s | Sunset over Vice City (153–156 s) |
| 18–26 s | **Pitch:** GTA VI logo with voiceover + on-screen text |

The pitch (spoken in Indonesian and on screen): this clip was made by AI, and
viewers can earn money on make.fun by making clips with AI —
`make.fun/bounty/gta6-clipper-01`.

The clip was cut and rendered in the agent session with ffmpeg (vertical
blur-fill 9:16, on-screen text, Indonesian TTS voiceover), from the public
trailer footage. The video is published public on YouTube as a Short; its
address is in [`VIDEO.json`](VIDEO.json).

## The program

[`main.ts`](main.ts) (Node 22, standard library only) reads `VIDEO.json` from
the repository root, validates it (valid JSON, an object with a YouTube video
`url`), and copies it byte-for-byte to `/output/VIDEO.json`, where the gate
reads it. Run it locally the way the grader does:

```sh
mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Video

- YouTube: see [`VIDEO.json`](VIDEO.json)
- Description carries the bounty line and the entrant's play code
  (`makefun-ukulele-slipper-dipper`), as the bounty requires.

## License

MIT — see [LICENSE](LICENSE).
