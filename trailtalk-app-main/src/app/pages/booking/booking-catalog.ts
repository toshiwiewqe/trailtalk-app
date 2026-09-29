import {
  Guide, HikeActivity, HikePackage, MerchItem, PackageId, SubscriptionPlan,
} from '../../models/booking.model';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BOOKING CATALOG — the price list, in one place
 *
 * Every peso figure in the app comes from here. When the rate sheet changes,
 * this is the only file anyone edits.
 * ═══════════════════════════════════════════════════════════════════════════
 */

/**
 * Flat fee per booking.
 *
 * From the rate sheet: "₱1,440 + ₱50 transaction fee = ₱1,490".
 *
 * Heads-up on a conflict in your own materials: the checkout mockup shows
 * Subtotal ₱1,800 and Total ₱1,800 — no fee line. The rate sheet says there
 * is one. I went with the rate sheet, since it is the more explicit document.
 * Set this to 0 if the mockup is the one that is right.
 */
export const TRANSACTION_FEE = 50;

export const PACKAGES: HikePackage[] = [
  {
    id: 'basic',
    name: 'Basic Day Hike',
    price: 1440,
    includes: [
      'Tour guide',
      'Barangay registration / certification',
      'Environmental fee',
      'Trail / entrance fee',
      'Digital itinerary',
    ],
    includedActivities: 0,
    coversActivityIds: [],
  },
  {
    id: 'activity',
    name: 'Day Hike + Activity',
    price: 1800,
    includes: [
      'Everything in Basic Day Hike',
      '1 selected activity — waterfall stop or tree planting',
    ],
    includedActivities: 1,
    coversActivityIds: ['waterfall', 'tree-planting'],
  },
  {
    id: 'overnight',
    name: 'Overnight Hike',
    price: 2400,
    includes: [
      'Everything in Basic Day Hike',
      '1 selected activity — waterfall stop or tree planting',
      '1-night accommodation',
      'Overnight itinerary',
    ],
    includedActivities: 1,
    coversActivityIds: ['waterfall', 'tree-planting'],
  },
  {
    id: 'private',
    name: 'Private Hike',
    price: 3000,
    includes: [
      'Private tour guide',
      'Everything in Basic Day Hike',
      'Personalised itinerary',
    ],
    includedActivities: 0,
    coversActivityIds: [],
  },
  {
    id: 'group',
    name: 'Group Hike',
    price: 4200,
    includes: [
      'Group tour guide',
      'Everything in Day Hike + Activity',
      '1 selected activity — waterfall stop or tree planting',
      'Group itinerary',
    ],
    includedActivities: 1,
    coversActivityIds: ['waterfall', 'tree-planting'],
  },
];

export const ACTIVITIES: HikeActivity[] = [
  { id: 'tree-planting', name: 'Tree planting', price: 250, icon: 'leaf-outline' },
  { id: 'waterfall', name: 'Waterfall rest stop', price: 350, icon: 'water-outline' },
  {
    id: 'canyoneering',
    name: 'Canyoneering',
    price: 2500,
    // The rate sheet says "depends on location" and "per person". Say so in
    // the UI rather than quoting ₱2,500 as though it were final.
    note: 'From ₱2,500 per person — final rate depends on the location.',
    icon: 'trail-sign-outline',
  },
];

export const MERCH: MerchItem[] = [
  { id: 'keychain', name: 'Keychains', price: 55, icon: 'key-outline' },
  { id: 'magnet', name: 'Magnets', price: 45, icon: 'magnet-outline' },
  { id: 'sticker', name: 'Stickers', price: 15, icon: 'pricetag-outline' },
  { id: 'patch', name: 'Patches', price: 25, icon: 'shield-outline' },
  { id: 'mug', name: 'Mugs', price: 60, icon: 'cafe-outline' },
];

/**
 * SAMPLE GUIDE ROSTER.
 *
 * Placeholders so the flow can be demonstrated end to end. These are not real
 * accredited guides, and deliberately no photographs of real people are used —
 * the UI draws an initial in a circle, the same as the review avatars.
 *
 * Swap this for the real roster (or a Firestore `guides` collection) before
 * anyone can actually book a hike through this.
 */
export const GUIDES: Guide[] = [
  { id: 'g1', name: 'Rico Santos', years: 8, summits: 150 },
  { id: 'g2', name: 'Maria Clara', years: 5, summits: 90 },
];

/**
 * Subscription tiers from the rate sheet.
 *
 * Nothing reads this yet — there is no upgrade screen. It lives here so the
 * numbers are recorded in one place, and so whoever builds that screen does
 * not have to go hunting for the rate sheet again.
 */
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'TrailBound Basic',
    audience: 'For users',
    pricePerMonth: 79,
    perks: [
      'Trail navigation',
      'Packing checklist',
      'Weather forecast for your booked hike date',
      'Mountain suggestions by skill level',
      'Real-time budget tracker during booking',
      'Save itineraries',
    ],
  },
  {
    id: 'pro',
    name: 'TrailBound Pro',
    audience: 'For frequent users',
    pricePerMonth: 149,
    perks: [
      'Real-time weather monitoring',
      'Unlimited saved itineraries and planning',
      'Priority booking on high-demand trails',
      'Advanced trip management — multi-day trips, group coordination',
      'Exclusive merchandise discounts',
    ],
  },
  {
    id: 'facilitator',
    name: 'TrailBound Facilitator',
    audience: 'For managing clients',
    pricePerMonth: 999,
    perks: [
      'Booking dashboard',
      'Capacity management',
      'Guide scheduling',
      'Customer management',
      'Digital certification / document tracking',
      'Analytics',
    ],
  },
];

// ── lookups ────────────────────────────────────────────────────────────────

export function packageById(id: PackageId): HikePackage {
  // Falls back to Basic rather than returning undefined: a booking page with
  // no package selected has nothing to price, and Basic is the floor.
  return PACKAGES.find(p => p.id === id) ?? PACKAGES[0];
}

export function activityById(id: string): HikeActivity | undefined {
  return ACTIVITIES.find(a => a.id === id);
}

export function merchById(id: string): MerchItem | undefined {
  return MERCH.find(m => m.id === id);
}

export function guideById(id: string | null): Guide | undefined {
  return id ? GUIDES.find(g => g.id === id) : undefined;
}
