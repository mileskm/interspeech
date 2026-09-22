# Guess the Australian Animal

A ten-round photo-and-sound identification game for the Interspeech 2026 booth in Sydney.

## Open the game

https://mileskm.github.io/interspeech/

This is a fully online static website, as requested. No installation, login, database or backend is needed. All photographs and MP3 excerpts are served with the website. There is no service worker or offline guarantee. Safari’s Add to Home Screen is optional; manifest and Apple icons are included.

## Play

Tap **Start**, then **Play sound**, and choose one of four photographs. Replay as often as you like. Each animal appears once per game, the order and answer positions are shuffled, and only the first answer counts. After the reveal, tap **Next animal**. Keyboard users can Tab through controls, use Enter/Space, or choose answers with 1–4. Credits are available throughout.

## GitHub Pages

In **Settings → Pages**, set **Source: Deploy from a branch**, **Branch: main**, **Folder: /(root)**, then Save. The site uses relative URLs and requires no build step. The `.nojekyll` file is included.

## Update the animals

Edit `js/animals.js`. Each item contains a stable ID, common/scientific name, audio path, image path, fact, and separate audio/image attribution records. Keep at least four animals and unique IDs. Add assets to `audio/` and `images/`; update `CREDITS.md` and `media-provenance/` for every change. Do not add media with unclear, NC or ND licences.

The first release mixes seven birds with three marsupials: koala, Tasmanian devil and common brushtail possum. Selection notes are in `CREDITS.md`.

## Media preparation and licensing

Audio excerpts are 3–8 seconds, mono MP3 at 160 kb/s, with constant gain and brief edge fades. No dynamic compression is applied. File-specific start times, gains and original SHA-256 hashes are in `media-provenance/audio-processing.json`. Photographs are resized JPEGs; the interface crops them for consistent cards. All media use public domain, CC BY 4.0 or CC BY-SA 4.0. Share-alike adaptations retain CC BY-SA 4.0.

Individual licence checks and original source records are in `CREDITS.md` and `media-provenance/`. Source recordings are not bundled because the short hosted excerpts are sufficient for play; original download URLs and hashes are retained.

## Verification

- `node tests/rules.mjs`: 600 simulated rounds covering correct/distractor mapping, unique choices, repeat-answer protection, score, progress and restart.
- Serve the repository over HTTP and open `tests/browser.html`, then **Run checks**: decodes all ten MP3s, loads all ten photos, runs a mixed-answer game, checks score/restart/credits, and checks 1024×768, 1180×820, 1366×1024, 768×1024 and 390×844 layouts.
- Test from a subdirectory such as `/interspeech/` to match GitHub Pages.

Browser checks passed in the Codex browser. A separate headless Chromium launch was blocked by the host sandbox; no standalone Chromium/WebKit pass is claimed. Final subjective sound selection and comfortable listening volume should be auditioned on the actual booth iPad/headphones. Automated decoding and signal-level checks cannot establish perceptual clarity in conference noise.

## Booth setup

Open the URL in Safari with a working internet connection. Set a comfortable device volume and try a complete round on the actual iPad before the booth opens. No participant data is collected or saved.
