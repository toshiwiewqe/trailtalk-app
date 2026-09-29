import { Injectable, computed, signal } from '@angular/core';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * REVIEW SERVICE
 *
 * Real reviews written by whoever is using the app, persisted to
 * localStorage. Starts empty on a fresh install.
 *
 * WHY THERE IS NO SEED DATA HERE
 * These are real mountains. Inventing "Sofia Vergara gave Mt. Pulag five
 * stars" puts words in a real person's mouth and gives users a rating no one
 * actually awarded — the same problem as a fabricated trail route, just
 * quieter. A working review flow with an honest empty state demos better than
 * fake testimonials, and it is one less thing to strip out before release.
 *
 * When the team wires up Firestore, swap the two localStorage calls for reads
 * and writes against a `reviews` collection. Nothing else needs to change,
 * because every page reads through the signals below.
 * ═══════════════════════════════════════════════════════════════════════════
 */

export interface TrailReview {
  id: string;
  trailId: string;
  author: string;
  /** Whole stars, 1 to 5. */
  rating: number;
  text: string;
  /** ISO timestamp, so it can be sorted and formatted per locale. */
  createdAt: string;
}

const STORAGE_KEY = 'trailtalk.reviews.v1';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly _reviews = signal<TrailReview[]>(this.load());

  readonly reviews = computed(() => this._reviews());

  /** Reviews for one trail, newest first. */
  forTrail(trailId: string): TrailReview[] {
    return this._reviews()
      .filter(r => r.trailId === trailId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  /** Average rating for a trail, or 0 when it has none yet. */
  averageFor(trailId: string): number {
    const list = this.forTrail(trailId);
    if (!list.length) return 0;
    const sum = list.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / list.length) * 10) / 10;
  }

  countFor(trailId: string): number {
    return this.forTrail(trailId).length;
  }

  add(trailId: string, author: string, rating: number, text: string) {
    const review: TrailReview = {
      id: 'r' + Date.now(),
      trailId,
      author: author.trim() || 'Anonymous',
      // Clamp rather than trust the caller — a 7-star review would quietly
      // skew every average that reads it.
      rating: Math.min(5, Math.max(1, Math.round(rating))),
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    this._reviews.update(list => [review, ...list]);
    this.save();
  }

  remove(id: string) {
    this._reviews.update(list => list.filter(r => r.id !== id));
    this.save();
  }

  /** Relative time for display: "2 days ago". */
  timeAgo(iso: string): string {
    const then = new Date(iso).getTime();
    const mins = Math.floor((Date.now() - then) / 60000);

    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;

    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;

    const days = Math.floor(hours / 24);
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days} days ago`;

    const months = Math.floor(days / 30);
    return months === 1 ? 'a month ago' : `${months} months ago`;
  }

  // ── persistence ─────────────────────────────────────────────────────────

  /**
   * localStorage throws in private browsing and when site data is blocked,
   * so both ends are wrapped. A failed read or write costs the reviews, not
   * the page.
   */
  private load(): TrailReview[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this._reviews()));
    } catch {
      // Storage unavailable — reviews stay for this session only.
    }
  }
}
