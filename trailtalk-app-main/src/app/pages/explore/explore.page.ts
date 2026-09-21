import { Component, ViewChild, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar, IonSegment,
  IonSegmentButton, IonLabel, IonIcon, IonButton, ViewDidEnter, ToastController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cloudOutline, close, bookmark, bookmarkOutline, navigateOutline,
  layersOutline, locationOutline, mapOutline, star, navigate,
  playCircleOutline, videocamOutline, informationCircleOutline, imageOutline,
} from 'ionicons/icons';

import { TrailMapComponent } from './trail-map/trail-map.component';
import { isClosed, geoFor } from './trail-geo';
import { photoFor, hasPhoto as hasPhotoFor, TrailPhoto } from './trail-photos';
import { searchTrails, TRAILS_30 } from './explore-trails.data';
import { TrailService } from '../../services/trail.service';
import { UserService } from '../../services/user.service';
import { WeatherService } from '../../services/weather.service';
import { Trail } from '../../models/trail.model';

addIcons({
  cloudOutline, close, bookmark, bookmarkOutline, navigateOutline,
  layersOutline, locationOutline, mapOutline, star, navigate,
  playCircleOutline, videocamOutline, informationCircleOutline, imageOutline,
});

@Component({
  selector: 'app-explore',
  standalone: true,
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  imports: [
    CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar,
    IonSegment, IonSegmentButton, IonLabel, IonIcon, IonButton,
    TrailMapComponent,
  ],
})
export class ExplorePage implements ViewDidEnter {
  @ViewChild(TrailMapComponent) private trailMap?: TrailMapComponent;
  searchTerm = signal('');
  difficultyFilter = signal<'All' | 'Easy' | 'Moderate' | 'Hard'>('All');
  selectedTrail = signal<Trail | null>(null);
  showWeatherAlert = signal(true);
  routeShown = signal(false);
  showSavedPanel = signal(false);

  /** Re-exported so the template can call them. */
  readonly isClosed = isClosed;

  /** Photo for a trail, or the illustrative placeholder when none exists. */
  photo(trail: Trail): TrailPhoto {
    return photoFor(trail.id);
  }

  /** True only when a real photograph of this mountain is on file. */
  hasPhoto(trail: Trail): boolean {
    return hasPhotoFor(trail.id);
  }

  /**
   * Reads the Explore module's own 30-trail dataset, not TrailService. The
   * shared service holds demo seed data that other pages depend on by id.
   */
  results = computed(() => {
    const all = searchTrails(this.searchTerm());
    if (this.difficultyFilter() === 'All') return all;
    return all.filter(t => t.difficulty === this.difficultyFilter());
  });

  weather = computed(() => this.weatherService.current());

  /**
   * Saved trails, resolved from UserService.upcoming() back to the Explore
   * dataset. Saving writes to the shared UserService, so a trail saved here
   * also appears in the Profile tab — same store the detail page writes to.
   *
   * Entries whose trailId is not in this dataset are dropped rather than
   * rendered as blanks; the shared seed data uses different ids.
   */
  savedTrails = computed(() => {
    const ids = new Set(this.userService.upcoming().map(u => u.trailId));
    return TRAILS_30.filter(t => ids.has(t.id));
  });

  constructor(
    public trailService: TrailService,
    private userService: UserService,
    private weatherService: WeatherService,
    private router: Router,
    private toastCtrl: ToastController,
  ) {}

  /**
   * Ionic keeps pages mounted, so the map container can measure zero until the
   * enter transition finishes. The component self-heals via ResizeObserver,
   * but nudging it here avoids a visible reflow on first paint.
   */
  ionViewDidEnter() {
    requestAnimationFrame(() => this.trailMap?.refreshSize());
  }

  onSearch(ev: any) {
    this.searchTerm.set(ev.detail.value ?? '');
    this.clearSelectionIfFiltered();
  }

  onSegmentChange(ev: any) {
    this.difficultyFilter.set(ev.detail.value);
    this.clearSelectionIfFiltered();
  }

  onMapSelect(trail: Trail) {
    this.selectedTrail.set(trail);
    // A route belongs to the trail it was drawn for.
    this.trailMap?.clearRoute();
    this.routeShown.set(false);
  }

  closeSheet() {
    this.selectedTrail.set(null);
    this.trailMap?.clearRoute();
    this.routeShown.set(false);
  }

  centerOnUser() {
    this.trailMap?.centerOnUser().then(coords => {
      if (!coords) this.toast('Location unavailable. Check permissions.');
    });
  }

  /**
   * Cycles Dark -> Satellite -> Street -> Light. With four styles the button
   * alone no longer tells you where you are in the cycle, so name the result.
   */
  toggleLayers() {
    const label = this.trailMap?.cycleBasemap();
    if (label) this.toast(label);
  }

  async toggleBookmark(trail: Trail) {
    if (this.isSaved(trail)) {
      const existing = this.userService.upcoming().find(u => u.trailId === trail.id);
      if (existing) this.userService.removeUpcoming(existing.id);
      this.toast('Removed from saved trails');
      return;
    }

    this.userService.addUpcoming({
      id: 'u' + Date.now(),
      trailId: trail.id,
      name: trail.name,
      image: trail.image,
      date: 'To be scheduled',
      duration: trail.duration,
    });
    this.toast('Saved — find it under the bookmark icon');
  }

  /** Whether this trail is in the user's saved list. */
  isSaved(trail: Trail): boolean {
    return this.userService.upcoming().some(u => u.trailId === trail.id);
  }

  toggleSavedPanel() {
    this.showSavedPanel.update(open => !open);
  }

  /** Opens a saved trail: closes the panel, selects it, flies the map to it. */
  selectFromSaved(trail: Trail) {
    this.showSavedPanel.set(false);
    this.onMapSelect(trail);
    this.trailMap?.focusTrail(trail);
  }

  /** Removes from the panel without opening the trail. */
  removeSaved(trail: Trail, ev: Event) {
    ev.stopPropagation();
    const existing = this.userService.upcoming().find(u => u.trailId === trail.id);
    if (existing) this.userService.removeUpcoming(existing.id);
  }

  dismissWeatherAlert() {
    this.showWeatherAlert.set(false);
  }

  /**
   * The detail page reads from TrailService, which does not know about the
   * Explore dataset's ids. Check before navigating rather than dropping the
   * user on a "Trail not found" screen.
   */
  openTrail(trail: Trail) {
    if (!this.trailService.getById(trail.id)) {
      this.toast('Full details for this trail are not available yet');
      return;
    }
    this.router.navigate(['/trail', trail.id]);
  }

  /**
   * Hands off to whatever map app the device uses, with the trail as
   * destination. No routing service, no API key, no quota.
   *
   * Worth being honest with users about in the UI copy: this navigates to the
   * trail's coordinates, which is the jump-off point. No consumer routing
   * service has the hiking trail itself, so this stops where the road does.
   */
  openDirections(trail: Trail) {
    const geo = geoFor(trail.id);
    if (!geo) {
      this.toast('No coordinates recorded for this trail');
      return;
    }
    const url =
      'https://www.google.com/maps/dir/?api=1' +
      `&destination=${geo.lat},${geo.lng}` +
      '&travelmode=driving';
    window.open(url, '_blank');
  }

  /**
   * Placeholder until there are real trail videos. When there are, add a
   * `videoUrl` to the trail-photos record (or a trail-videos.ts alongside it)
   * and open it here — the shared model still does not change.
   */
  onVideoTap() {
    this.toast('No trail video for this one yet');
  }

  /**
   * Toggles the recorded route for the selected trail. Routes come from real
   * GPX tracks converted by tools/gpx-to-path.mjs — if a trail has no track
   * yet, say so rather than drawing an approximation.
   */
  onTrailMapTap() {
    const trail = this.selectedTrail();
    if (!trail || !this.trailMap) return;

    if (this.trailMap.hasRoute()) {
      this.trailMap.clearRoute();
      this.routeShown.set(false);
      return;
    }

    const drawn = this.trailMap.showRoute(trail.id);
    this.routeShown.set(drawn);

    if (!drawn) {
      this.toast('No recorded route for this trail yet');
    }
  }

  /** Drop the open sheet if its trail is no longer in the filtered set. */
  private clearSelectionIfFiltered() {
    const trail = this.selectedTrail();
    if (trail && !this.results().some(t => t.id === trail.id)) {
      this.selectedTrail.set(null);
    }
  }

  private async toast(message: string) {
    const t = await this.toastCtrl.create({
      message, duration: 1600, position: 'top', color: 'dark',
    });
    t.present();
  }
}