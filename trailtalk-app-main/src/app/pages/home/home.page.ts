import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonSearchbar, IonIcon, IonButton,
  IonBadge, IonChip, IonLabel,
} from '@ionic/angular/standalone';
import { TrailCardComponent } from '../../components/trail-card/trail-card.component';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { TrailService } from '../../services/trail.service';
import { PostService } from '../../services/post.service';
import { WeatherService } from '../../services/weather.service';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { Trail, TrailCategory } from '../../models/trail.model';
import { ToastController } from '@ionic/angular/standalone';
import { AppLogoComponent } from '../../components/app-logo/app-logo.component';

// The same 30 Philippine trails the Explore map shows, with photos resolved.
import { searchAll } from '../explore/trail-lookup';

type Difficulty = 'All' | 'Easy' | 'Moderate' | 'Hard';
type SortKey = 'default' | 'name' | 'elevation' | 'distance';

import { addIcons } from 'ionicons';
import { optionsOutline } from 'ionicons/icons';
addIcons({ optionsOutline });

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule, IonContent, IonHeader, IonToolbar, IonSearchbar, IonIcon,
    IonButton, IonBadge, IonChip, IonLabel, TrailCardComponent, PostCardComponent, AppLogoComponent,
  ],
  
})
export class HomePage {
  searchTerm = signal('');
  activeCategory = signal<TrailCategory | 'All'>('All');
  categories: (TrailCategory)[] = ['Nearby', 'Popular', 'Scenic', 'Forest'];

  // ── filter panel ────────────────────────────────────────────────────────
  showFilters = signal(false);
  difficulty = signal<Difficulty>('All');
  sortBy = signal<SortKey>('default');

  readonly difficulties: Difficulty[] = ['All', 'Easy', 'Moderate', 'Hard'];
  readonly sorts: { key: SortKey; label: string }[] = [
    { key: 'default', label: 'Default' },
    { key: 'name', label: 'Name' },
    { key: 'elevation', label: 'Highest' },
    { key: 'distance', label: 'Shortest' },
  ];

  /** How many filters are narrowing the list — drives the button's dot. */
  activeFilterCount = computed(() => {
    let n = 0;
    if (this.difficulty() !== 'All') n++;
    if (this.sortBy() !== 'default') n++;
    return n;
  });

  /**
   * Reads the 30-trail dataset rather than TrailService, so Home and the
   * Explore map show the same mountains. TrailService keeps its 6 seeded
   * trails because user.service.ts points at t2 and t4 by id.
   */
  filteredTrails = computed(() => {
    let list = searchAll(this.searchTerm(), this.activeCategory());

    if (this.difficulty() !== 'All') {
      list = list.filter(t => t.difficulty === this.difficulty());
    }

    return this.sortTrails(list);
  });

  /** True while the user is searching, so the template can adapt. */
  isSearching = computed(() => this.searchTerm().trim().length > 0);

  /** Result count, shown while searching so an empty list is explained. */
  resultCount = computed(() => this.filteredTrails().length);

  latestPosts = computed(() => this.postService.posts().slice(0, 2));

  constructor(
    public trailService: TrailService,
    public postService: PostService,
    public weatherService: WeatherService,
    public notificationService: NotificationService,
    public userService: UserService,
    private router: Router,
    private toastCtrl: ToastController,
  ) {}

  // ── search + filters ────────────────────────────────────────────────────

  onSearch(ev: any) {
    const value = ev.detail.value ?? '';
    this.searchTerm.set(value);

    // A search has to reach every trail, wherever the user happens to be.
    // Searching "Binacayan" while the Popular chip is active used to return
    // nothing, because Binacayan is categorised Scenic — the query silently
    // ran inside the category instead of across all 30.
    //
    // Clearing the chip rather than just ignoring it keeps the UI honest: no
    // chip stays lit while the results are ignoring it.
    if (value.trim()) {
      this.activeCategory.set('All');
    }
  }

  /** Picking a category clears the search, so the chip means what it says. */
  selectCategory(cat: TrailCategory) {
    this.searchTerm.set('');
    this.activeCategory.set(this.activeCategory() === cat ? 'All' : cat);
  }

  toggleFilters() {
    this.showFilters.update(open => !open);
  }

  setDifficulty(d: Difficulty) {
    this.difficulty.set(d);
  }

  setSort(key: SortKey) {
    this.sortBy.set(key);
  }

  clearFilters() {
    this.difficulty.set('All');
    this.sortBy.set('default');
  }

  /**
   * Sorts by the numeric part of the display strings — elevation reads
   * "2,926 m" and distance "14 km", so strip commas and units before
   * comparing. Anything unparseable sorts last rather than throwing.
   */
  private sortTrails(list: Trail[]): Trail[] {
    const num = (s: string) => {
      const n = parseFloat(String(s).replace(/,/g, ''));
      return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
    };

    switch (this.sortBy()) {
      case 'name':
        return [...list].sort((a, b) => a.name.localeCompare(b.name));
      case 'elevation':
        return [...list].sort((a, b) => num(b.elevation) - num(a.elevation));
      case 'distance':
        return [...list].sort((a, b) => num(a.distance) - num(b.distance));
      default:
        return list;
    }
  }

  // ── navigation ──────────────────────────────────────────────────────────

  openTrail(trail: Trail) {
    this.router.navigate(['/trail', trail.id]);
  }

  /** "View all" on Top Suggestions — the Explore tab is the full list. */
  goExplore() {
    this.router.navigate(['/tabs/explore']);
  }

  goNotifications() {
    this.router.navigate(['/notifications']);
  }

  goCommunity() {
    this.router.navigate(['/tabs/community']);
  }

  async onWeatherTap() {
    const toast = await this.toastCtrl.create({
      message: this.weatherService.current().message,
      duration: 2200,
      position: 'top',
      color: 'dark',
    });
    toast.present();
  }
}