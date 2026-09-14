import {
  Component, AfterViewInit, OnDestroy, ElementRef, ViewChild,
  computed, signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar,
  IonIcon, IonButton, ViewDidEnter,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  cloudOutline, close, bookmarkOutline, navigateOutline, layersOutline,
} from 'ionicons/icons';
import * as L from 'leaflet';
import { TrailService } from '../../services/trail.service';
import { Trail } from '../../models/trail.model';

addIcons({ cloudOutline, close, bookmarkOutline, navigateOutline, layersOutline });

@Component({
  selector: 'app-explore',
  standalone: true,
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  imports: [
    CommonModule, IonContent, IonHeader, IonToolbar, IonTitle,
    IonSearchbar, IonIcon, IonButton,
  ],
})
export class ExplorePage implements AfterViewInit, ViewDidEnter, OnDestroy {
  @ViewChild('mapEl') mapEl!: ElementRef<HTMLDivElement>;

  searchTerm = signal('');
  selectedTrail = signal<Trail | null>(null);
  showWeatherAlert = signal(true);
  weatherAlertHours = signal(2);

  private map!: L.Map;
  private markers = new Map<string, L.Marker>();

  results = computed(() => this.trailService.search(this.searchTerm(), 'All'));

  constructor(public trailService: TrailService, private router: Router) {}

  ngAfterViewInit() {
    this.initMap();
  }

  // Ionic keeps pages in the DOM; the container may report zero height
  // at ngAfterViewInit time if the page hasn't finished its enter transition.
  // Re-measure once the page is actually visible.
  ionViewDidEnter() {
    requestAnimationFrame(() => {
      this.map?.invalidateSize();
    });
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  private initMap() {
    const rect = this.mapEl.nativeElement.getBoundingClientRect();
    console.log('[ExplorePage] map container size at init:', rect.width, rect.height);

    this.map = L.map(this.mapEl.nativeElement, {
      zoomControl: false,
      attributionControl: true,
    }).setView([8.1706, 124.9067], 13); // default center — swap for your region

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        attribution: '&copy; OpenStreetMap &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19,
      }
    ).addTo(this.map);

    this.renderMarkers(this.results());

    // Safety net: re-check size shortly after init in case the
    // enter-transition wasn't finished even by ionViewDidEnter.
    setTimeout(() => this.map.invalidateSize(), 300);
  }

  private renderMarkers(trails: Trail[]) {
    this.markers.forEach(m => m.remove());
    this.markers.clear();

    trails.forEach(trail => {
      const icon = L.divIcon({
        className: '',
        html: `<div class="trail-marker ${trail.status === 'closed' ? 'closed' : ''}"></div>`,
        iconSize: [26, 26],
      });

      const marker = L.marker([trail.lat, trail.lng], { icon })
        .addTo(this.map)
        .on('click', () => this.selectTrail(trail));

      this.markers.set(trail.id, marker);
    });
  }

  selectTrail(trail: Trail) {
    this.selectedTrail.set(trail);
    this.map.flyTo([trail.lat, trail.lng], 14, { duration: 0.6 });
  }

  onSearch(ev: any) {
    this.searchTerm.set(ev.detail.value ?? '');
    this.renderMarkers(this.results());
  }

  dismissWeatherAlert() {
    this.showWeatherAlert.set(false);
  }

  centerOnUser() {
    this.map.locate({ setView: true, maxZoom: 15 });
  }

  toggleLayers() {
    // hook up a satellite/terrain tile-layer swap here later
  }

  toggleBookmark() {
    // hook up saved-trails state here
  }

  openTrail(trail: Trail) {
    this.router.navigate(['/trail', trail.id]);
  }
}