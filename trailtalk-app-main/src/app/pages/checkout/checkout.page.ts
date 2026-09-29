import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
  IonInput, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowBackOutline, arrowForward, cardOutline, qrCodeOutline, walletOutline,
  logoApple, lockClosedOutline, warningOutline, personCircleOutline,
} from 'ionicons/icons';

import { BookingService } from '../../services/booking.service';
import { UserService } from '../../services/user.service';
import { guideById } from '../booking/booking-catalog';

addIcons({
  arrowBackOutline, arrowForward, cardOutline, qrCodeOutline, walletOutline,
  logoApple, lockClosedOutline, warningOutline, personCircleOutline,
});

interface PayMethod {
  id: string;
  label: string;
  icon: string;
  available: boolean;
}

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonTitle,
    IonButtons, IonButton, IonIcon, IonInput,
  ],
})
export class CheckoutPage implements OnInit {
  /**
   * Only Card is wired up. The other three are in the design but have no
   * integration behind them, so they are shown disabled rather than as
   * buttons that silently do nothing — a dead button is worse than an
   * honest "coming soon".
   */
  readonly methods: PayMethod[] = [
    { id: 'card', label: 'Card', icon: 'card-outline', available: true },
    { id: 'qrph', label: 'QRPh', icon: 'qr-code-outline', available: false },
    { id: 'apple', label: 'Apple Pay', icon: 'logo-apple', available: false },
    { id: 'maya', label: 'Maya', icon: 'wallet-outline', available: false },
  ];

  method = signal('card');
  processing = signal(false);

  cardNumber = '';
  expiry = '';
  cvv = '';
  cardName = '';

  draft = computed(() => this.bookingService.draft());

  quote = computed(() => {
    const d = this.draft();
    return d ? this.bookingService.quote(d) : null;
  });

  guideName = computed(() => guideById(this.draft()?.guideId ?? null)?.name ?? null);

  /** "Tue, Sep 15, 2026" for the order summary. */
  prettyDate = computed(() => {
    const d = this.draft();
    if (!d?.date) return '';
    return new Date(d.date + 'T00:00:00').toLocaleDateString('en-PH', {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
  });

  constructor(
    private router: Router,
    private location: Location,
    private bookingService: BookingService,
    private userService: UserService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    // Landing here with no draft means a refresh or a stray link. The draft
    // lives in memory by design, so there is nothing to recover — send them
    // back rather than showing an empty receipt.
    if (!this.bookingService.draft()) {
      this.router.navigate(['/tabs/home'], { replaceUrl: true });
      return;
    }
    this.cardName = this.userService.profile().name;
  }

  goBack() {
    this.location.back();
  }

  selectMethod(m: PayMethod) {
    if (!m.available) {
      this.toast(`${m.label} is not connected yet`);
      return;
    }
    this.method.set(m.id);
  }

  // ── card input formatting ───────────────────────────────────────────────

  /** Groups the number in fours as it is typed. Digits only. */
  onCardNumber(ev: any) {
    const digits = String(ev.detail.value ?? '').replace(/\D/g, '').slice(0, 16);
    this.cardNumber = digits.replace(/(.{4})/g, '$1 ').trim();
  }

  /** Inserts the slash in MM/YY. */
  onExpiry(ev: any) {
    const digits = String(ev.detail.value ?? '').replace(/\D/g, '').slice(0, 4);
    this.expiry = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
  }

  onCvv(ev: any) {
    this.cvv = String(ev.detail.value ?? '').replace(/\D/g, '').slice(0, 4);
  }

  // ── pay ─────────────────────────────────────────────────────────────────

  async pay() {
    const d = this.draft();
    if (!d || this.processing()) return;

    const digits = this.cardNumber.replace(/\s/g, '');

    if (digits.length !== 16) {
      this.toast('Enter a 16-digit card number');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(this.expiry)) {
      this.toast('Enter the expiry as MM/YY');
      return;
    }
    if (this.cvv.length < 3) {
      this.toast('Enter the CVV');
      return;
    }
    if (!this.cardName.trim()) {
      this.toast('Enter the cardholder name');
      return;
    }

    this.processing.set(true);

    // Stands in for the payment gateway round-trip. Replace this with the real
    // call when one exists; the rest of the flow does not change.
    await new Promise(resolve => setTimeout(resolve, 900));

    // Only the last four digits are handed to the service. The full number,
    // expiry and CVV stay in this component and die with it.
    const booking = this.bookingService.confirm(d, 'Card', digits.slice(-4));

    // Mirror it into the shared upcoming list so it shows on the Profile tab
    // alongside everything else the user has planned.
    this.userService.addUpcoming({
      id: 'u' + Date.now(),
      trailId: d.trailId,
      name: d.trailName,
      image: d.trailImage,
      date: this.prettyDate(),
      duration: d.trailDuration,
    });

    this.processing.set(false);
    this.router.navigate(['/booking-confirmed', booking.id], { replaceUrl: true });
  }

  private async toast(message: string) {
    const t = await this.toastCtrl.create({
      message, duration: 1800, position: 'top', color: 'dark',
    });
    t.present();
  }
}
