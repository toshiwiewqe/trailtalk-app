import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, arrowForward, locationOutline, checkmarkCircle, add, remove,
  leafOutline, waterOutline, trailSignOutline, keyOutline, magnetOutline,
  pricetagOutline, shieldOutline, cafeOutline, personCircleOutline, calendarOutline,
} from 'ionicons/icons';

import { Trail } from '../../models/trail.model';
import { BookingDraft, PackageId } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';
import { ACTIVITIES, GUIDES, MERCH, PACKAGES } from './booking-catalog';

// Same lookup the Home page and the detail page use, so any of the 30 trails
// (or the seeded t1-t6) resolves here.
import { trailById } from '../explore/trail-lookup';
import { isClosed } from '../explore/trail-geo';

addIcons({
  arrowBackOutline, arrowForward, locationOutline, checkmarkCircle, add, remove,
  leafOutline, waterOutline, trailSignOutline, keyOutline, magnetOutline,
  pricetagOutline, shieldOutline, cafeOutline, personCircleOutline, calendarOutline,
});

/** yyyy-mm-dd from a Date, using LOCAL parts (not toISOString, which is UTC). */
function isoDate(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

interface DateOption {
  iso: string;
  weekday: string;
  day: number;
  monthLabel: string;
}

@Component({
  selector: 'app-booking',
  standalone: true,
  templateUrl: './booking.page.html',
  styleUrls: ['./booking.page.scss'],
  imports: [
    CommonModule, IonContent, IonHeader, IonToolbar, IonButtons, IonButton,
    IonIcon,
  ],
})
export class BookingPage implements OnInit {
  trail = signal<Trail | undefined>(undefined);

  /** Selections. */
  date = signal<string>('');
  packageId = signal<PackageId>('basic');
  activityIds = signal<string[]>([]);
  guideId = signal<string | null>(null);
  merch = signal<Record<string, number>>({});

  readonly packages = PACKAGES;
  readonly activities = ACTIVITIES;
  readonly guides = GUIDES;
  readonly merchItems = MERCH;
  readonly isClosed = isClosed;

  /**
   * The next 14 days, starting tomorrow.
   *
   * Tomorrow, not today: a guided hike needs a permit and a guide assigned,
   * and same-day is not a promise this app can keep.
   */
  readonly dateOptions: DateOption[] = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return {
      iso: isoDate(d),
      weekday: d.toLocaleDateString('en-PH', { weekday: 'short' }).toUpperCase(),
      day: d.getDate(),
      monthLabel: d.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' }),
    };
  });

  /** Month caption above the date strip, following the selected day. */
  monthCaption = computed(() => {
    const chosen = this.dateOptions.find(d => d.iso === this.date());
    return (chosen ?? this.dateOptions[0]).monthLabel;
  });

  /** The live draft, rebuilt whenever any selection changes. */
  private draft = computed<BookingDraft | null>(() => {
    const t = this.trail();
    if (!t) return null;
    return {
      trailId: t.id,
      trailName: t.name,
      trailImage: t.image,
      trailDuration: t.duration,
      date: this.date(),
      packageId: this.packageId(),
      activityIds: this.activityIds(),
      guideId: this.guideId(),
      merch: this.merch(),
    };
  });

  quote = computed(() => {
    const d = this.draft();
    return d ? this.bookingService.quote(d) : null;
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private bookingService: BookingService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.trail.set(trailById(id));
    this.date.set(this.dateOptions[0].iso);
  }

  goBack() {
    this.location.back();
  }

  // ── date ────────────────────────────────────────────────────────────────

  selectDate(iso: string) {
    this.date.set(iso);
  }

  // ── package ─────────────────────────────────────────────────────────────

  selectPackage(id: PackageId) {
    this.packageId.set(id);
  }

  // ── activities ──────────────────────────────────────────────────────────

  toggleActivity(id: string) {
    this.activityIds.update(list =>
      list.includes(id) ? list.filter(a => a !== id) : [...list, id],
    );
  }

  isActivityOn(id: string): boolean {
    return this.activityIds().includes(id);
  }

  /** True when the package price already covers this one — shown as "Included". */
  isActivityCovered(id: string): boolean {
    return this.quote()?.coveredActivities.some(a => a.id === id) ?? false;
  }

  // ── guide ───────────────────────────────────────────────────────────────

  selectGuide(id: string) {
    // Tapping the selected guide again clears it, back to "no preference".
    this.guideId.update(current => (current === id ? null : id));
  }

  // ── merchandise ─────────────────────────────────────────────────────────

  merchQty(id: string): number {
    return this.merch()[id] ?? 0;
  }

  addMerch(id: string) {
    this.merch.update(m => ({ ...m, [id]: (m[id] ?? 0) + 1 }));
  }

  removeMerch(id: string) {
    this.merch.update(m => {
      const next = { ...m };
      const qty = (next[id] ?? 0) - 1;
      if (qty > 0) next[id] = qty;
      else delete next[id];
      return next;
    });
  }

  merchCount = computed(() =>
    Object.values(this.merch()).reduce((sum, n) => sum + n, 0),
  );

  // ── continue ────────────────────────────────────────────────────────────

  proceed() {
    const t = this.trail();
    const d = this.draft();
    if (!t || !d) return;

    if (this.isClosed(t)) {
      this.toast('This trail is closed — booking is unavailable.');
      return;
    }
    if (!d.date) {
      this.toast('Pick a date first');
      return;
    }

    this.bookingService.setDraft(d);
    this.router.navigate(['/checkout']);
  }

  private async toast(message: string) {
    const t = await this.toastCtrl.create({
      message, duration: 1800, position: 'top', color: 'dark',
    });
    t.present();
  }
}
