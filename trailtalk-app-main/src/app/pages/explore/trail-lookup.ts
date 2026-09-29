import { Trail, TrailCategory } from '../../models/trail.model';
import { TRAILS_30 } from './explore-trails.data';
import { photoFor } from './trail-photos';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * SHARED TRAIL LOOKUP
 *
 * One place for any page that wants the 30-trail dataset with photos already
 * resolved. Home, Explore and Trail Detail all read through here, so they can
 * never disagree about which trails exist or what they look like.
 *
 * Nothing here modifies trail.model.ts or trail.service.ts. The shared
 * TrailService still holds its 6 seeded trails, which user.service.ts depends
 * on by id (t2, t4) for the Profile tab's upcoming adventures.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Illustrative fallback for trails with no photograph.
 *
 * Deliberately built with NO parentheses — trail-card sets this via
 * `background-image: url(...)`, and a bare `(` inside a data URI closes the
 * CSS function early and silently kills the image. That rules out an SVG
 * gradient, which needs `fill="url(#id)"`, so this uses flat fills instead.
 */
const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">' +
      '<rect width="400" height="200" fill="#16211a"/>' +
      '<path d="M0 200 L95 88 L150 140 L225 55 L300 138 L350 103 L400 160 L400 200 Z" fill="#25382b"/>' +
      '<path d="M0 200 L70 135 L135 175 L210 120 L280 172 L340 145 L400 190 L400 200 Z" fill="#3a5442"/>' +
    '</svg>',
  );

/** A trail with its `image` pointing at a real photo, or the placeholder. */
export type TrailWithPhoto = Trail;

/** Resolves one trail's image through the photo table. */
function withPhoto(t: Trail): TrailWithPhoto {
  const photo = photoFor(t.id);
  const isPlaceholder = photo.url.startsWith('data:');
  return { ...t, image: isPlaceholder ? PLACEHOLDER : photo.url };
}

/** All 30 trails, photos resolved. Safe to bind straight to app-trail-card. */
export function allTrails(): TrailWithPhoto[] {
  return TRAILS_30.map(withPhoto);
}

/** One trail by id, or undefined. Used by the detail page as a fallback. */
export function trailById(id: string): TrailWithPhoto | undefined {
  const found = TRAILS_30.find(t => t.id === id);
  return found ? withPhoto(found) : undefined;
}

/** Great-circle distance in kilometres. */
export function distanceKm(
  aLat: number, aLng: number, bLat: number, bLng: number,
): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Where "Nearby" is measured from.
 *
 * The 30 trails carry no 'Nearby' category, because whether a mountain is
 * nearby depends on where you are standing — it is not a property of the
 * mountain. UserService says the profile lives in Manila, so that is the
 * reference point until the app asks for a real device location.
 */
const HOME_LAT = 14.5995;
const HOME_LNG = 120.9842;
const NEARBY_RADIUS_KM = 130;

/** Trails within NEARBY_RADIUS_KM of the profile's city, closest first. */
export function nearbyTrails(): TrailWithPhoto[] {
  return TRAILS_30
    .map(t => ({ t, d: distanceKm(HOME_LAT, HOME_LNG, t.lat, t.lng) }))
    .filter(x => x.d <= NEARBY_RADIUS_KM)
    .sort((a, b) => a.d - b.d)
    .map(x => withPhoto(x.t));
}

/**
 * Search + category filter over all 30 trails.
 *
 * Mirrors TrailService.search so pages can swap to it without changing shape,
 * except that 'Nearby' filters by distance rather than by a stored field.
 */
export function searchAll(
  query: string,
  category: TrailCategory | 'All' = 'All',
): TrailWithPhoto[] {
  const q = query.trim().toLowerCase();
  const pool = category === 'Nearby' ? nearbyTrails() : allTrails();

  return pool.filter(t => {
    const matchesQuery =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.region.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q);

    const matchesCategory =
      category === 'All' || category === 'Nearby' || t.category === category;

    return matchesQuery && matchesCategory;
  });
}