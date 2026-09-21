#!/usr/bin/env node
/**
 * gpx-to-path.mjs — one-off converter, NOT shipped with the app.
 *
 * Reads .gpx files and emits src/app/pages/explore/trail-paths.ts, a plain
 * TypeScript file of coordinate arrays keyed by trail id.
 *
 * USAGE
 *   1. Make a folder called `gpx/` in the project root.
 *   2. Drop your .gpx files in, named after the trail id they belong to:
 *        gpx/t1.gpx     gpx/T001.gpx    gpx/T016.gpx
 *      The filename (minus .gpx) becomes the key, so it must match the id in
 *      trail.service.ts exactly — case included.
 *   3. node tools/gpx-to-path.mjs
 *
 * OPTIONS
 *   --every=N     keep every Nth track point (default 5)
 *   --precision=N decimal places to round to (default 5, ~1m accuracy)
 *
 * Uses a regex rather than DOMParser, which does not exist in Node. GPX
 * track points are a flat, predictable element — this is the rare case where
 * regex over XML is genuinely fine, because we only read two attributes off
 * one tag name and never care about nesting.
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const GPX_DIR = 'gpx';
const OUT_FILE = join('src', 'app', 'pages', 'explore', 'trail-paths.ts');

const args = Object.fromEntries(
  process.argv.slice(2)
    .filter(a => a.startsWith('--'))
    .map(a => a.slice(2).split('=')),
);

const EVERY = Number(args.every ?? 5);
const PRECISION = Number(args.precision ?? 5);

if (!existsSync(GPX_DIR)) {
  console.error(`No "${GPX_DIR}/" folder found. Create it and add .gpx files.`);
  process.exit(1);
}

const files = readdirSync(GPX_DIR).filter(f => f.toLowerCase().endsWith('.gpx'));

if (!files.length) {
  console.error(`No .gpx files in "${GPX_DIR}/".`);
  process.exit(1);
}

/** Pulls [lat, lng] out of every <trkpt> in a GPX document. */
function gpxToPath(gpxText) {
  const re = /<trkpt\b[^>]*?\blat="([-\d.]+)"[^>]*?\blon="([-\d.]+)"/g;
  const points = [];
  let m;
  while ((m = re.exec(gpxText)) !== null) {
    points.push([Number(m[1]), Number(m[2])]);
  }
  return points;
}

/** Keeps every Nth point, always preserving the first and last. */
function thin(points, every) {
  if (points.length <= 2 || every <= 1) return points;
  const out = points.filter((_, i) => i % every === 0);
  const last = points[points.length - 1];
  if (out[out.length - 1] !== last) out.push(last);
  return out;
}

const round = n => Number(n.toFixed(PRECISION));

const entries = [];

for (const file of files) {
  const id = basename(file, '.gpx');
  const raw = readFileSync(join(GPX_DIR, file), 'utf8');
  const all = gpxToPath(raw);

  if (!all.length) {
    console.warn(`  ${file}: no <trkpt> elements found — skipped.`);
    continue;
  }

  const pts = thin(all, EVERY).map(([lat, lng]) => [round(lat), round(lng)]);
  const body = pts.map(([lat, lng]) => `    [${lat}, ${lng}],`).join('\n');

  entries.push(`  // ${file} — ${all.length} points, thinned to ${pts.length}\n` +
               `  ${id}: [\n${body}\n  ],`);

  console.log(`  ${file}: ${all.length} -> ${pts.length} points`);
}

const out = `// GENERATED FILE — DO NOT EDIT BY HAND.
// Produced by tools/gpx-to-path.mjs from the .gpx files in gpx/.
// Regenerate with: node tools/gpx-to-path.mjs
//
// Each entry is a recorded hiking track, keyed by Trail.id. These come from
// real GPX recordings — never hand-write or estimate a route here. A wrong
// line on a mountain is worse than no line at all.

/** Recorded trail routes, keyed by Trail.id. */
export const TRAIL_PATHS: Record<string, [number, number][]> = {
${entries.join('\n\n')}
};

/** The recorded route for a trail, or undefined if none exists yet. */
export function pathFor(id: string): [number, number][] | undefined {
  return TRAIL_PATHS[id];
}
`;

writeFileSync(OUT_FILE, out, 'utf8');
console.log(`\nWrote ${OUT_FILE} (${entries.length} route${entries.length === 1 ? '' : 's'}).`);
