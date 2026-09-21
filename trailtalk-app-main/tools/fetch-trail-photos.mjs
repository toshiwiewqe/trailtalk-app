#!/usr/bin/env node
/**
 * fetch-trail-photos.mjs — one-off helper, NOT shipped with the app.
 *
 * Searches Wikimedia Commons for a photo of each of the 30 trails, downloads
 * the chosen images into src/assets/trails/, and rewrites
 * src/app/pages/explore/trail-photos.ts with proper attribution.
 *
 * WHY COMMONS: the photos are real pictures of the real mountains, and they
 * are licensed for reuse. Stock-photo sites give you a nice-looking alpine
 * scene that is not the mountain your user is about to climb.
 *
 * YOU MUST REVIEW WHAT THIS PICKS. Commons search matches filenames and
 * descriptions, so a query for "Mount Arayat" can return the view FROM Arayat,
 * a relief map, a church in Arayat town, or a different peak. Run in review
 * mode first (the default), open the candidate URLs, and only then commit.
 *
 * USAGE
 *   node tools/fetch-trail-photos.mjs                 # review: list candidates
 *   node tools/fetch-trail-photos.mjs --write         # download + write file
 *   node tools/fetch-trail-photos.mjs --only=T001,T004
 *   node tools/fetch-trail-photos.mjs --pick=T007:2   # use 2nd candidate
 *
 * Needs Node 18+ (built-in fetch). No dependencies.
 */

import { writeFileSync, mkdirSync, existsSync, createWriteStream } from 'node:fs';
import { join } from 'node:path';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';

const ASSET_DIR = join('src', 'assets', 'trails');
const OUT_FILE = join('src', 'app', 'pages', 'explore', 'trail-photos.ts');
const API = 'https://commons.wikimedia.org/w/api.php';

// Commons asks for a descriptive User-Agent identifying the app and a contact.
// Requests without one are rate-limited or refused. PUT YOUR OWN EMAIL HERE.
const USER_AGENT =
  'TrailTalk-photo-fetch/1.0 (student project; contact: you@example.com)';

/**
 * Search terms per trail. Deliberately the MOUNTAIN name, not the trail name —
 * Commons has photos of Mount Pulag, not of "Mt. Pulag Traverse".
 */
const QUERIES = {
  T001: 'Mount Pulag',
  T002: 'Mount Batulao',
  T003: 'Mount Ulap Benguet',
  T004: 'Mount Pinatubo crater lake',
  T005: 'Mount Tarak Mariveles Bataan',
  T006: 'Pico de Loro Cavite',
  T007: 'Mount Arayat Pampanga',
  T008: 'Mount Tapulao Zambales',
  T009: 'Mount Balingkilat Zambales',
  T010: 'Mount Maculot Cuenca Batangas',
  T011: 'Mount Manabu Batangas',
  T012: 'Mount Daguldol San Juan Batangas',
  T013: 'Mount Pamitinan Rodriguez Rizal',
  T014: 'Mount Binacayan Rizal',
  T015: 'Mount Hapunang Banoi Rizal',
  T016: 'Mount Daraitan Tanay Rizal',
  T017: 'Mount Kulis Tanay Rizal',
  T018: 'Mount Batolusong Tanay Rizal',
  T019: 'Mount Sembrano Rizal',
  T020: 'Mount Kalisungan Laguna',
  T021: 'Mount Makiling',
  T022: 'Mount Makiling',
  T023: 'Mount Cristobal Laguna',
  T024: 'Gulugod Baboy Mabini Batangas',
  T025: 'Mount Marami Cavite',
  T026: 'Mount Pigingan Benguet',
  T027: 'Mount Yangbew La Trinidad',
  T028: 'Mount Damas Tarlac',
  T029: 'Mount Labo Camarines Norte',
  T030: 'Mount Ugo Benguet',
};

const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }),
);

const WRITE = !!args.write;
const ONLY = typeof args.only === 'string' ? args.only.split(',') : null;

// --pick=T007:2,T012:3 -> choose the Nth candidate (1-based) for those ids.
const PICKS = {};
if (typeof args.pick === 'string') {
  for (const part of args.pick.split(',')) {
    const [id, n] = part.split(':');
    PICKS[id] = Math.max(1, Number(n) || 1);
  }
}

/** Strips the HTML Commons puts in its Artist field. */
function plain(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Obvious non-photographs. Cheap filter before a human looks. */
function looksUnusable(title) {
  return /\.(svg|pdf|tif|ogv|webm)$/i.test(title) ||
    /\b(map|diagram|logo|seal|chart|poster|sign|plaque|coat of arms)\b/i.test(title);
}

async function search(query) {
  const url = new URL(API);
  url.search = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '5',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size',
    iiurlwidth: '1000',
    format: 'json',
    origin: '*',
  }).toString();

  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`Commons returned ${res.status}`);
  const data = await res.json();

  const pages = Object.values(data?.query?.pages ?? {});
  return pages
    .map(p => {
      const info = p.imageinfo?.[0];
      if (!info) return null;
      const meta = info.extmetadata ?? {};
      return {
        title: p.title.replace(/^File:/, ''),
        thumb: info.thumburl || info.url,
        width: info.width,
        height: info.height,
        credit: plain(meta.Artist?.value) || 'Unknown',
        license: plain(meta.LicenseShortName?.value) || 'see source',
        source: info.descriptionurl,
      };
    })
    .filter(Boolean)
    // Landscape shots crop far better into a banner than portraits.
    .filter(c => !looksUnusable(c.title) && c.width >= c.height);
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

const ids = (ONLY ?? Object.keys(QUERIES)).filter(id => QUERIES[id]);
const chosen = {};

console.log(WRITE ? 'Fetching and writing...\n' : 'REVIEW MODE — nothing written.\n');

for (const id of ids) {
  const query = QUERIES[id];
  let candidates = [];

  try {
    candidates = await search(query);
  } catch (err) {
    console.warn(`${id}  "${query}" — search failed: ${err.message}`);
    continue;
  }

  if (!candidates.length) {
    console.log(`${id}  "${query}" — no usable results. Add your own photo.`);
    continue;
  }

  const pickIndex = Math.min((PICKS[id] ?? 1) - 1, candidates.length - 1);
  const pick = candidates[pickIndex];

  if (!WRITE) {
    console.log(`${id}  "${query}"`);
    candidates.forEach((c, i) => {
      const mark = i === pickIndex ? '>' : ' ';
      console.log(`   ${mark}${i + 1}. ${c.title}`);
      console.log(`      ${c.credit} · ${c.license}`);
      console.log(`      ${c.source}`);
    });
    console.log('');
    continue;
  }

  if (!existsSync(ASSET_DIR)) mkdirSync(ASSET_DIR, { recursive: true });
  const file = `${id}.jpg`;

  try {
    await download(pick.thumb, join(ASSET_DIR, file));
    chosen[id] = {
      url: `assets/trails/${file}`,
      credit: pick.credit,
      license: pick.license,
      source: pick.source,
    };
    console.log(`${id}  ${pick.title}  (${pick.credit}, ${pick.license})`);
  } catch (err) {
    console.warn(`${id}  download failed: ${err.message}`);
  }

  // Be polite to a free service.
  await new Promise(r => setTimeout(r, 300));
}

if (!WRITE) {
  console.log('Open the source links and check each photo is actually that');
  console.log('mountain. Then re-run with --write, using --pick=ID:N to');
  console.log('override any bad first choice.');
  process.exit(0);
}

const entries = Object.entries(chosen).map(([id, p]) =>
  `  ${id}: {\n` +
  `    url: ${JSON.stringify(p.url)},\n` +
  `    credit: ${JSON.stringify(p.credit)},\n` +
  `    license: ${JSON.stringify(p.license)},\n` +
  `    source: ${JSON.stringify(p.source)},\n` +
  `  },`
).join('\n');

const header = `// GENERATED by tools/fetch-trail-photos.mjs — but REVIEW BEFORE TRUSTING.
// Every photo below must actually be a picture of that mountain. Commons
// search can return the view FROM a peak, a map, or a different summit.
//
// The credit and license fields are a licence condition, not decoration. The
// trail sheet renders them over the photo — leave that in place.
`;

const body = `${header}
export interface TrailPhoto {
  url: string;
  credit?: string;
  license?: string;
  source?: string;
}

export const TRAIL_PHOTOS: Record<string, TrailPhoto> = {
${entries}
};

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    \`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="160" viewBox="0 0 400 160">
      <defs>
        <linearGradient id="s" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1b2a20"/>
          <stop offset="100%" stop-color="#0d1711"/>
        </linearGradient>
      </defs>
      <rect width="400" height="160" fill="url(#s)"/>
      <path d="M0 160 L95 70 L150 112 L225 44 L300 110 L350 82 L400 128 L400 160 Z" fill="#25382b"/>
      <path d="M0 160 L70 108 L135 140 L210 96 L280 138 L340 116 L400 152 L400 160 Z" fill="#3a5442"/>
    </svg>\`.replace(/\\s+/g, ' '),
  );

export function photoFor(id: string): TrailPhoto {
  return TRAIL_PHOTOS[id] ?? { url: PLACEHOLDER };
}

export function hasPhoto(id: string): boolean {
  return !!TRAIL_PHOTOS[id];
}
`;

writeFileSync(OUT_FILE, body, 'utf8');
console.log(`\nWrote ${OUT_FILE} (${Object.keys(chosen).length} photos).`);
console.log(`Images in ${ASSET_DIR}/`);
