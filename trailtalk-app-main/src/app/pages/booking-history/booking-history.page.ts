import { Component, computed, inject, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonModal,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowForward,
  bagHandleOutline,
  calendarOutline,
  cardOutline,
  closeOutline,
  compassOutline,
  imageOutline,
  personOutline,
  receiptOutline,
  sparklesOutline,
  ticketOutline,
  warning,
} from 'ionicons/icons';

import { Booking } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';

/**
 * BOOKING HISTORY — replaces the Planner tab.
 *
 * Read-only. Everything comes from BookingService.bookings(), the same list
 * checkout writes to, so a booking shows up here the moment it is confirmed.
 * Nothing in the booking service or model was changed for this page.
 */

type HistoryTab = 'upcoming' | 'past';

const DAY_MS = 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-booking-history',
  standalone: true,
  templateUrl: './booking-history.page.html',
  styleUrls: ['./booking-history.page.scss'],
  imports: [
    DatePipe,
    DecimalPipe,
    IonHeader,
    IonToolbar,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonIcon,
    IonModal,
  ],
})
export class BookingHistoryPage {
  private readonly bookingService = inject(BookingService);
  private readonly router = inject(Router);

  readonly tab = signal<HistoryTab>('upcoming');

  /** Booking shown in the Details sheet */
  readonly selected = signal<Booking | null>(null);
  readonly detailsOpen = signal(false);

  /** Trail photo URLs that failed to load (shows an icon instead) */
  readonly brokenImages = signal<ReadonlySet<string>>(new Set());

  /** Hike date is today or later — soonest first */
  readonly upcoming = computed(() => {
    const today = todayKey();
    return this.bookingService
      .bookings()
      .filter((b) => b.date >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
  });

  /** Hike date already passed — most recent first */
  readonly past = computed(() => {
    const today = todayKey();
    return this.bookingService
      .bookings()
      .filter((b) => b.date < today)
      .sort((a, b) => b.date.localeCompare(a.date));
  });

  readonly visible = computed(() =>
    this.tab() === 'upcoming' ? this.upcoming() : this.past(),
  );

  /** Upcoming hikes in the next 30 days — drives the reminder banner */
  readonly soonCount = computed(() => {
    const limit = Date.now() + 30 * DAY_MS;
    return this.upcoming().filter((b) => toDate(b.date).getTime() <= limit).length;
  });

  constructor() {
    addIcons({
      arrowForward,
      bagHandleOutline,
      calendarOutline,
      cardOutline,
      closeOutline,
      compassOutline,
      imageOutline,
      personOutline,
      receiptOutline,
      sparklesOutline,
      ticketOutline,
      warning,
    });
  }

  onTabChange(value: unknown): void {
    if (value === 'upcoming' || value === 'past') {
      this.tab.set(value);
    }
  }

  /** Booking.date is a local "yyyy-mm-dd" string; DatePipe needs a Date. */
  toDate(key: string): Date {
    return toDate(key);
  }

  isPast(b: Booking): boolean {
    return b.date < todayKey();
  }

  markBroken(url: string): void {
    this.brokenImages.update((set) => new Set(set).add(url));
  }

  openDetails(b: Booking): void {
    this.selected.set(b);
    this.detailsOpen.set(true);
  }

  closeDetails(): void {
    this.detailsOpen.set(false);
  }

  findTrail(): void {
    this.router.navigate(['/tabs/explore']);
  }
}

/** Parse "yyyy-mm-dd" as local midnight (same approach as booking-confirmed). */
function toDate(key: string): Date {
  return new Date(key + 'T00:00:00');
}

/** Today's local date as "yyyy-mm-dd", so it compares directly with Booking.date. */
function todayKey(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}
