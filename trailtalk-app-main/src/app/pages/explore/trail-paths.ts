// GENERATED FILE — DO NOT EDIT BY HAND.
// Produced by tools/gpx-to-path.mjs from the .gpx files in gpx/.
// Regenerate with: node tools/gpx-to-path.mjs
//
// Each entry is a recorded hiking track, keyed by Trail.id. These come from
// real GPX recordings — never hand-write or estimate a route here. A wrong
// line on a mountain is worse than no line at all.
//
// Currently empty: no GPX files have been converted yet. The Trail map button
// falls back to a "not available" message for any trail with no entry here,
// so an empty file is a valid state and nothing breaks.

/** Recorded trail routes, keyed by Trail.id. */
export const TRAIL_PATHS: Record<string, [number, number][]> = {
  // Example of the shape the generator produces:
  //
  // t1: [
  //   [16.38971, 120.69244],
  //   [16.38954, 120.69301],
  //   ...
  // ],
};

/** The recorded route for a trail, or undefined if none exists yet. */
export function pathFor(id: string): [number, number][] | undefined {
  return TRAIL_PATHS[id];
}