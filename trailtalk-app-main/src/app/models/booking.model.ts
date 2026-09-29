/**
 * ═══════════════════════════════════════════════════════════════════════════
 * BOOKING MODEL
 *
 * A NEW file. Nothing here edits trail.model.ts, trail.service.ts or
 * user.service.ts, so your teammates' work is untouched. Every booking points
 * at a trail by its id — the same side-table pattern the reviews and the map
 * coordinates already use.
 *
 * All prices are Philippine pesos, whole numbers. No decimals anywhere: the
 * rate sheet has none, and floating-point money is a bug waiting to happen.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export type PackageId = 'basic' | 'activity' | 'overnight' | 'private' | 'group';

export interface HikePackage {
  id: PackageId;
  name: string;
  price: number;
  /** Bullet list shown under the package name on the booking page. */
  includes: string[];
  /**
   * How many add-on activities this package price already covers. The hiker
   * still chooses WHICH ones — anything beyond this count is charged at the
   * activity's own rate.
   */
  includedActivities: number;
  /**
   * Which activities the package is allowed to cover. The rate sheet is
   * specific: the free slot is "waterfall stop OR tree planting", never
   * canyoneering. Encoding it here means nobody has to remember the rule.
   */
  coversActivityIds: string[];
}

export interface HikeActivity {
  id: string;
  name: string;
  price: number;
  /** Small print — e.g. canyoneering is a starting rate, not a fixed one. */
  note?: string;
  icon: string;
}

export interface MerchItem {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export interface Guide {
  id: string;
  name: string;
  years: number;
  summits: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  audience: string;
  pricePerMonth: number;
  perks: string[];
}

/** One merchandise row on the receipt. */
export interface MerchLine {
  id: string;
  name: string;
  qty: number;
  unitPrice: number;
  lineTotal: number;
}

/**
 * What the hiker has chosen so far. Lives in memory only, from the booking
 * page through to checkout — an abandoned draft should not linger in storage.
 */
export interface BookingDraft {
  trailId: string;
  trailName: string;
  trailImage: string;
  trailDuration: string;
  /** Local calendar date, yyyy-mm-dd. */
  date: string;
  packageId: PackageId;
  activityIds: string[];
  guideId: string | null;
  /** Item id -> quantity. Zero-quantity keys are pruned on write. */
  merch: Record<string, number>;
}

/** The priced breakdown of a draft. Computed, never stored. */
export interface BookingQuote {
  packageName: string;
  packagePrice: number;
  /** Activities the package price already covers — shown at ₱0. */
  coveredActivities: { id: string; name: string }[];
  /** Activities charged on top. */
  paidActivities: { id: string; name: string; price: number }[];
  merchLines: MerchLine[];
  activitiesTotal: number;
  merchTotal: number;
  subtotal: number;
  transactionFee: number;
  total: number;
}

/**
 * A confirmed booking. Persisted.
 *
 * Note what is NOT in here: no card number, no CVV, no expiry. Only the last
 * four digits and the method name, which is all a receipt ever needs. Storing
 * more would be storing a liability.
 */
export interface Booking {
  id: string;
  /** Human-facing code shown on the confirmation screen, e.g. HIK-98231. */
  reference: string;
  trailId: string;
  trailName: string;
  trailImage: string;
  date: string;
  packageId: PackageId;
  packageName: string;
  activityNames: string[];
  guideName: string | null;
  merch: MerchLine[];
  total: number;
  paymentMethod: string;
  cardLast4: string | null;
  createdAt: string;
  status: 'confirmed';
}
