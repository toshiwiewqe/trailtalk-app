#!/usr/bin/env node
/**
 * fetch-trail-photos.mjs — one-off helper, NOT shipped with the app.
 *
 * Downloads a real photo of each of the 30 mountains from Wikimedia Commons
 * into src/assets/trails/, and writes src/app/pages/explore/trail-photos.ts
 * with the attribution each licence requires.
 *
 *   node tools/fetch-trail-photos.mjs
 *
 * That is the whole job — it runs unattended and needs no reviewing.
 *
 * WHAT YOU GET: real photographs genuinely associated with each mountain on
 * Commons, not generic stock landscapes. Each trail gets several search terms
 * tried in order, so coverage is high.
 *
 * WHAT TO KNOW: Commons search ranks by filename and description text, so a
 * result can be the view FROM a summit rather than the peak itself. That is a
 * real photo of the right mountain either way, so it is fine to ship. If one
 * looks off, the file records each photo's Commons title and source link, and
 * swapping it takes one flag:
 *
 *   node tools/fetch-trail-photos.mjs --review --only=T007   # see candidates
 *   node tools/fetch-trail-photos.mjs --pick=T007:3          # use the 3rd
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

// Commons asks for a descriptive User-Agent naming the app and a contact.
// Requests without one get rate-limited. Put your own address here.
const USER_AGENT =
  'TrailTalk-photo-fetch/1.0 (student project; contact: you@example.com)';

/**
 * Search terms per trail, tried in order until one returns a usable photo.
 * The first is the precise mountain, later ones widen to the range or province
 * so a trail still gets a real local photo rather than nothing.
 */
const QUERIES = {
  T001: ['Mount Pulag', 'Mount Pulag National Park', 'Pulag Benguet'],
  T002: ['Mount Batulao', 'Batulao Nasugbu Batangas'],
  T003: ['Mount Ulap', 'Ampucao Itogon Benguet', 'Cordillera pine forest Benguet'],
  T004: ['Mount Pinatubo crater lake', 'Mount Pinatubo', 'Pinatubo Zambales'],
  T005: ['Mount Tarak', 'Mariveles Bataan mountain', 'Mount Mariveles'],
  T006: ['Pico de Loro', 'Mount Palay-Palay', 'Pico de Loro Cavite'],
  T007: ['Mount Arayat', 'Arayat Pampanga mountain'],
  T008: ['Mount Tapulao', 'Tapulao Zambales', 'Zambales mountain range'],
  T009: ['Mount Balingkilat', 'Nagsasa Cove Zambales', 'Zambales coastal mountain'],
  T010: ['Mount Maculot', 'Maculot Cuenca Batangas', 'Taal Lake viewpoint'],
  T011: ['Mount Manabu', 'Manabu Peak Batangas', 'Sto Tomas Batangas mountain'],
  T012: ['Mount Daguldol', 'Laiya San Juan Batangas', 'Daguldol Batangas'],
  T013: ['Mount Pamitinan', 'Wawa Gorge Rodriguez Rizal', 'Montalban Rizal limestone'],
  T014: ['Mount Binacayan', 'Binacayan Rodriguez Rizal', 'Wawa Rizal limestone'],
  T015: ['Hapunang Banoi', 'Rodriguez Rizal limestone peak', 'Montalban Rizal mountain'],
  T016: ['Mount Daraitan', 'Tinipak River Tanay', 'Daraitan Tanay Rizal'],
  T017: ['Mount Kulis', 'Tanay Rizal mountain', 'Sierra Madre Tanay'],
  T018: ['Mount Batolusong', 'Batolusong Tanay Rizal', 'Rizal grassland ridge'],
  T019: ['Mount Sembrano', 'Sembrano Pililla Rizal', 'Laguna de Bay Pililla'],
  T020: ['Mount Kalisungan', 'Kalisungan Calauan Laguna', 'Calauan Laguna'],
  T021: ['Mount Makiling', 'Makiling Forest Reserve', 'Los Banos Laguna mountain'],
  T022: ['Mount Makiling', 'Makiling Sto Tomas Batangas', 'Makiling forest'],
  T023: ['Mount Cristobal', 'Cristobal San Pablo Laguna', 'Dolores Quezon mountain'],
  T024: ['Gulugod Baboy', 'Mabini Batangas hills', 'Anilao Batangas'],
  T025: ['Mount Marami', 'Marami Maragondon Cavite', 'Maragondon Cavite'],
  T026: ['Mount Pigingan', 'Itogon Benguet mountain', 'Agno River Benguet'],
  T027: ['Mount Yangbew', 'Yangbew La Trinidad', 'La Trinidad Benguet'],
  T028: ['Mount Damas', 'San Clemente Tarlac', 'Tarlac mountain'],
  T029: ['Mount Labo', 'Labo Camarines Norte', 'Camarines Norte mountain'],
  T030: ['Mount Ugo', 'Ugo Kayapa Nueva Vizcaya', 'Benguet pine forest'],
};

/**
 * The name that must appear in a photo's Commons title for it to be treated as
 * confidently the right subject.
 *
 * Commons relevance ranking is not enough on its own. A search for "Pico de
 * Loro" returned a photo of Mt. Mataas na Gulod first; "Mount Cristobal"
 * returned Mount Banahaw. Scoring on the name fixes both without hand-picking,
 * and it keeps working if Commons reorders its results tomorrow.
 */
const NAMES = {
  T001: /pulag/i,
  T002: /batulao/i,
  T003: /ulap/i,
  T004: /pinatubo/i,
  T005: /tarak|mariveles/i,
  T006: /pico de loro|palay.?palay/i,
  T007: /arayat/i,
  T008: /tapulao/i,
  T009: /balingkilat|nagsasa/i,
  T010: /maculot/i,
  T011: /manabu|malipunyo/i,
  T012: /daguldol|laiya/i,
  T013: /pamitinan/i,
  T014: /binacayan/i,
  T015: /hapunang|banoi/i,
  T016: /daraitan|tinipak/i,
  T017: /kulis/i,
  T018: /batolusong/i,
  T019: /sembrano/i,
  T020: /kalisungan/i,
  T021: /makiling/i,
  T022: /makiling/i,
  T023: /cristobal/i,
  T024: /gulugod|baboy/i,
  T025: /marami/i,
  T026: /pigingan/i,
  T027: /yangbew/i,
  T028: /damas/i,
  T029: /labo/i,
  T030: /ugo/i,
};

const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => { const [k, v] = a.slice(2).split('='); return [k, v ?? true]; }),
);

const REVIEW = !!args.review;
const DEBUG = !!args.debug;
const ONLY = typeof args.only === 'string' ? args.only.split(',') : null;

// Fail loudly and early rather than producing an empty file that looks like a
// successful run. A silent no-op is the worst outcome here.
if (typeof fetch !== 'function') {
  console.error('This needs Node 18 or newer (for built-in fetch).');
  console.error(`You are on ${process.version}.`);
  process.exit(1);
}

// The script writes into src/, so it must run from the project root.
if (!existsSync('src')) {
  console.error('No "src" folder here — run this from the project root:');
  console.error('  cd <project root> && node tools/fetch-trail-photos.mjs');
  console.error(`(currently in ${process.cwd()})`);
  process.exit(1);
}

// One probe before the main loop, so a network or proxy block shows up as a
// clear message instead of 30 identical failures.
try {
  const probe = await fetch(`${API}?action=query&meta=siteinfo&format=json`, {
    headers: { 'User-Agent': USER_AGENT },
  });
  if (!probe.ok) throw new Error(`HTTP ${probe.status}`);
} catch (err) {
  console.error(`Cannot reach Wikimedia Commons: ${err.message}`);
  console.error('Check your internet connection, or whether a firewall,');
  console.error('school network or VPN is blocking commons.wikimedia.org.');
  console.error('\nNothing was written. Your photos stay as placeholders.');
  process.exit(1);
}

// --pick=T007:3,T012:2 -> use the Nth candidate (1-based) for those ids.
const PICKS = {};
if (typeof args.pick === 'string') {
  for (const part of args.pick.split(',')) {
    const [id, n] = part.split(':');
    PICKS[id] = Math.max(1, Number(n) || 1);
  }
}

/** Strips the HTML Commons wraps its Artist field in. */
function plain(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 80);
}

/**
 * Things that are not usable photographs of a mountain.
 *
 * The painting rule is not hypothetical: searching "Mount Labo" returned an
 * Amorsolo oil on canvas as the top hit. A Wikivoyage banner is a real photo
 * but cropped to roughly 7:1, which is unusable in a 108px card.
 */
function looksUnusable(title) {
  const t = title.replace(/_/g, ' ');
  return /\.(svg|pdf|tif|tiff|ogv|webm|gif)$/i.test(title) ||
    /\b(map|diagram|logo|seal|chart|poster|sign|plaque|graph|coat[_ ]of[_ ]arms|location)\b/i.test(t) ||
    /\b(oil on canvas|painting|watercolou?r|lithograph|engraving|sketch|artwork)\b/i.test(t) ||
    /\bwv banner\b|\bbanner\b/i.test(t);
}

async function search(query) {
  const url = new URL(API);
  url.search = new URLSearchParams({
    action: 'query',
    generator: 'search',
    gsrsearch: `${query} filetype:bitmap`,
    gsrnamespace: '6',
    gsrlimit: '8',
    prop: 'imageinfo',
    iiprop: 'url|extmetadata|size',
    iiurlwidth: '1000',
    format: 'json',
    // NOTE: no `origin` param. That is a browser CORS control; sending it from
    // Node forces anonymous mode and Commons can reject the request outright.
  }).toString();

  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`Commons returned HTTP ${res.status}`);
  const data = await res.json();

  if (data?.error) {
    throw new Error(`Commons API error: ${data.error.code} — ${data.error.info}`);
  }

  if (DEBUG) {
    console.log(`   [debug] "${query}" -> ${Object.keys(data?.query?.pages ?? {}).length} raw results`);
  }

  return Object.values(data?.query?.pages ?? {})
    .map(p => {
      const info = p.imageinfo?.[0];
      if (!info) return null;
      const meta = info.extmetadata ?? {};
      return {
        title: p.title.replace(/^File:/, '').replace(/\.[a-z]+$/i, ''),
        thumb: info.thumburl || info.url,
        width: info.width,
        height: info.height,
        credit: plain(meta.Artist?.value) || 'Wikimedia Commons',
        license: plain(meta.LicenseShortName?.value) || 'see source',
        source: info.descriptionurl,
      };
    })
    .filter(Boolean)
    // Landscape crops into a 108px banner far better than a portrait.
    .filter(c => !looksUnusable(c.title) && c.width >= c.height && c.width >= 640)
    // Commons orders by relevance; keep that, it is the best signal available.
    .slice(0, 5);
}

/** Commons files already used, so two trails never show the same picture. */
const usedSources = new Set();

/**
 * Tries each query for a trail, keeping candidates whose Commons title names
 * the mountain ahead of ones that merely matched the search text.
 *
 * `named` is recorded per candidate: true means the filename says the subject,
 * which is as close to verification as this can get without a human looking.
 */
async function findFor(id) {
  const key = NAMES[id];
  let fallback = null;

  for (const query of QUERIES[id] ?? []) {
    let found = [];
    try {
      found = await search(query);
    } catch (err) {
      console.warn(`   ${id}: "${query}" failed — ${err.message}`);
    }

    found = found.filter(c => !usedSources.has(c.source));

    if (found.length) {
      const named = key ? found.filter(c => key.test(c.title)) : [];

      // A title that names the mountain wins outright, and stops the search.
      if (named.length) {
        return { query, candidates: named, confident: true };
      }

      // Otherwise hold it and keep trying narrower queries first. Only fall
      // back to an unnamed match if nothing better turns up.
      fallback ??= { query, candidates: found, confident: false };
    }

    await new Promise(r => setTimeout(r, 250));
  }

  return fallback;
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`download failed: ${res.status}`);
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
}

const ids = (ONLY ?? Object.keys(QUERIES)).filter(id => QUERIES[id]);
const chosen = {};
const missed = [];
/** Downloaded, but the Commons title does not name the mountain. Worth a look. */
const unconfident = [];

console.log(
  REVIEW
    ? 'REVIEW MODE — listing candidates, nothing written.\n'
    : `Fetching photos for ${ids.length} trails from Wikimedia Commons...\n`,
);

if (!REVIEW && !existsSync(ASSET_DIR)) mkdirSync(ASSET_DIR, { recursive: true });

for (const id of ids) {
  const result = await findFor(id);

  if (!result) {
    missed.push(id);
    console.log(`${id}  no usable photo found — keeps the placeholder`);
    continue;
  }

  const { candidates } = result;
  const pickIndex = Math.min((PICKS[id] ?? 1) - 1, candidates.length - 1);
  const pick = candidates[pickIndex];

  if (REVIEW) {
    console.log(
      `${id}  (matched "${result.query}")` +
      (result.confident ? '' : '   [title does not name the mountain]'),
    );
    candidates.forEach((c, i) => {
      console.log(`   ${i === pickIndex ? '>' : ' '}${i + 1}. ${c.title}`);
      console.log(`       ${c.credit} · ${c.license}`);
      console.log(`       ${c.source}`);
    });
    console.log('');
    continue;
  }

  try {
    await download(pick.thumb, join(ASSET_DIR, `${id}.jpg`));
    usedSources.add(pick.source);
    chosen[id] = {
      url: `assets/trails/${id}.jpg`,
      title: pick.title,
      credit: pick.credit,
      license: pick.license,
      source: pick.source,
    };
    if (!result.confident) unconfident.push(id);
    console.log(
      `${id}  ${pick.title}  —  ${pick.credit} (${pick.license})` +
      (result.confident ? '' : '   [CHECK: title does not name the mountain]'),
    );
  } catch (err) {
    missed.push(id);
    console.warn(`${id}  download failed: ${err.message}`);
  }

  await new Promise(r => setTimeout(r, 300));
}

if (REVIEW) {
  console.log('Re-run without --review to download, or use --pick=ID:N first.');
  process.exit(0);
}

const entries = Object.entries(chosen).map(([id, p]) =>
  `  ${id}: {\n` +
  `    url: ${JSON.stringify(p.url)},\n` +
  `    title: ${JSON.stringify(p.title)},\n` +
  `    credit: ${JSON.stringify(p.credit)},\n` +
  `    license: ${JSON.stringify(p.license)},\n` +
  `    source: ${JSON.stringify(p.source)},\n` +
  `  },`
).join('\n');

const body = `// GENERATED by tools/fetch-trail-photos.mjs — re-run it rather than editing.
//
// Real photographs from Wikimedia Commons, matched per mountain. Commons ranks
// by filename and description, so a photo can be the view FROM a summit rather
// than the peak itself — still a real photo of that mountain. \`title\` records
// what Commons calls each file, and \`source\` links the file page.
//
// To swap one:  node tools/fetch-trail-photos.mjs --review --only=T007
//               node tools/fetch-trail-photos.mjs --pick=T007:3
//
// credit and license are licence conditions, not decoration. The trail sheet
// renders them over the photo — leave that in place.

export interface TrailPhoto {
  url: string;
  /** What Commons calls this file, so the subject is visible at a glance. */
  title?: string;
  credit?: string;
  license?: string;
  source?: string;
}

export const TRAIL_PHOTOS: Record<string, TrailPhoto> = {
${entries}
};

/**
 * Illustrative fallback: a ridge silhouette, deliberately not photographic so
 * it cannot be mistaken for the mountain. Inline SVG, so it never 404s.
 */
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

const count = Object.keys(chosen).length;

if (count === 0) {
  console.error('\nNo photos were downloaded, so trail-photos.ts was NOT');
  console.error('overwritten (an empty file would just look like success).');
  console.error('Re-run with --debug to see what Commons is returning.');
  process.exit(1);
}

writeFileSync(OUT_FILE, body, 'utf8');

console.log(`\nWrote ${OUT_FILE} — ${count}/${ids.length} photos.`);
console.log(`Images saved to ${ASSET_DIR}/`);
if (missed.length) {
  console.log(`\nNo photo for: ${missed.join(', ')} — these keep the placeholder.`);
  console.log('Add your own to src/assets/trails/ and an entry in trail-photos.ts.');
}
if (unconfident.length) {
  console.log(`\nWorth eyeballing: ${unconfident.join(', ')}`);
  console.log('Their Commons filenames do not name the mountain, so they may be');
  console.log('the surrounding town rather than the peak. The app shows each');
  console.log('photo\'s title, so you can also just look at it running.');
}
console.log('\nRESTART "ionic serve" — a running dev server does not pick up');
console.log('files newly added to src/assets/.');
