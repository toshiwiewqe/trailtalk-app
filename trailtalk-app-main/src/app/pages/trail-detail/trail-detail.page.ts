import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon,
  IonTextarea, IonInput, ToastController,
} from '@ionic/angular/standalone';
import { TrailService } from '../../services/trail.service';
import { UserService } from '../../services/user.service';
import { ReviewService } from '../../services/review.service';
import { Trail } from '../../models/trail.model';

// Falls back to the 30-trail dataset for ids TrailService does not hold.
import { trailById } from '../explore/trail-lookup';
import { storyFor } from '../explore/trail-stories';

@Component({
  selector: 'app-trail-detail',
  standalone: true,
  templateUrl: './trail-detail.page.html',
  styleUrls: ['./trail-detail.page.scss'],
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonButtons,
    IonButton, IonIcon, IonTextarea, IonInput,
  ],
})
export class TrailDetailPage implements OnInit {
  trail = signal<Trail | undefined>(undefined);
  saved = signal(false);

  /** Editorial content — tagline, why-hike bullets, long-form story. */
  story = computed(() => {
    const t = this.trail();
    return t ? storyFor(t.id) : undefined;
  });

  // ── reviews ─────────────────────────────────────────────────────────────

  /** Bumped after each write so the computed values below re-read the store. */
  private reviewTick = signal(0);

  reviews = computed(() => {
    this.reviewTick();
    const t = this.trail();
    return t ? this.reviewService.forTrail(t.id) : [];
  });

  averageRating = computed(() => {
    this.reviewTick();
    const t = this.trail();
    return t ? this.reviewService.averageFor(t.id) : 0;
  });

  reviewCount = computed(() => this.reviews().length);

  /** Whole stars to fill in the summary row. */
  readonly starSlots = [1, 2, 3, 4, 5];

  showReviewForm = signal(false);
  draftAuthor = '';
  draftRating = signal(0);
  draftText = '';

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private trailService: TrailService,
    private userService: UserService,
    private reviewService: ReviewService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // TrailService holds the 6 seeded trails (t1-t6); the Explore dataset
      // holds the 30 Philippine trails (T001-T030). Check both, or every card
      // on Home and every marker on the map lands on "Trail not found".
      this.trail.set(this.trailService.getById(id) ?? trailById(id));
      this.saved.set(this.userService.upcoming().some(u => u.trailId === id));

      // Pre-fill the reviewer name from the profile, since we know it.
      this.draftAuthor = this.userService.profile().name;
    }
  }

  // ── review form ─────────────────────────────────────────────────────────

  toggleReviewForm() {
    this.showReviewForm.update(open => !open);
  }

  setDraftRating(n: number) {
    this.draftRating.set(n);
  }

  async submitReview() {
    const t = this.trail();
    if (!t) return;

    if (this.draftRating() < 1) {
      this.toast('Pick a star rating first');
      return;
    }
    if (!this.draftText.trim()) {
      this.toast('Add a few words about your hike');
      return;
    }

    this.reviewService.add(t.id, this.draftAuthor, this.draftRating(), this.draftText);
    this.reviewTick.update(n => n + 1);

    this.draftText = '';
    this.draftRating.set(0);
    this.showReviewForm.set(false);
    this.toast('Review posted');
  }

  deleteReview(id: string) {
    this.reviewService.remove(id);
    this.reviewTick.update(n => n + 1);
  }

  timeAgo(iso: string): string {
    return this.reviewService.timeAgo(iso);
  }

  // ── existing behaviour ──────────────────────────────────────────────────

  goBack() {
    this.location.back();
  }

  toggleSave() {
    const t = this.trail();
    if (!t) return;
    if (this.saved()) {
      const existing = this.userService.upcoming().find(u => u.trailId === t.id);
      if (existing) this.userService.removeUpcoming(existing.id);
      this.saved.set(false);
      return;
    }
    this.userService.addUpcoming({
      id: 'u' + Date.now(),
      trailId: t.id,
      name: t.name,
      image: t.image,
      date: 'To be scheduled',
      duration: t.duration,
    });
    this.saved.set(true);
  }

  async startHike() {
    this.toast('Hike started! Stay safe on the trails. 🥾', 'success');
  }

  bookNow() {
    const t = this.trail();
    if (t) this.router.navigate(['/booking', t.id]);
  }

  private async toast(message: string, color: string = 'dark') {
    const t = await this.toastCtrl.create({
      message, duration: 1800, position: 'top', color,
    });
    t.present();
  }
}