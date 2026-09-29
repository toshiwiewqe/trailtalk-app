import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent, IonIcon, IonButton } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { checkmark, arrowForward, warningOutline } from 'ionicons/icons';

import { Booking } from '../../models/booking.model';
import { BookingService } from '../../services/booking.service';

addIcons({ checkmark, arrowForward, warningOutline });

@Component({
  selector: 'app-booking-confirmed',
  standalone: true,
  templateUrl: './booking-confirmed.page.html',
  styleUrls: ['./booking-confirmed.page.scss'],
  imports: [CommonModule, IonContent, IonIcon, IonButton],
})
export class BookingConfirmedPage implements OnInit {
  booking = signal<Booking | undefined>(undefined);

  /** "September 15, 2026" — the long form, since this is the keepsake screen. */
  prettyDate = computed(() => {
    const b = this.booking();
    if (!b?.date) return '';
    return new Date(b.date + 'T00:00:00').toLocaleDateString('en-PH', {
      month: 'long', day: 'numeric', year: 'numeric',
    });
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookingService: BookingService,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.booking.set(this.bookingService.byId(id));
  }

  /**
   * `replaceUrl` so the back gesture cannot walk them into the checkout they
   * already paid, where a second tap would book the same hike twice.
   */
  goHome() {
    this.router.navigate(['/tabs/home'], { replaceUrl: true });
  }

  viewBookings() {
    this.router.navigate(['/tabs/planner'], { replaceUrl: true });
  }
}
