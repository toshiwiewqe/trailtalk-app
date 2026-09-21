import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone,
  OnDestroy, Output, ViewChild, ViewEncapsulation,
} from '@angular/core';
import * as L from 'leaflet';
import { Trail } from '../../../models/trail.model';
import { withGeo, missingGeo, isClosed, MappedTrail } from '../trail-geo';
import { pathFor } from '../trail-paths';

type CartoKey = 'dark' | 'voyager' | 'light';
type BasemapKey = CartoKey | 'satellite';

/** Order the layers FAB cycles through. */
const BASEMAP_ORDER: BasemapKey[] = ['dark', 'satellite', 'voyager', 'light'];

const BASEMAPS: Record<CartoKey, string> = {
  dark: 'dark_all',
  voyager: 'rastertiles/voyager',
  light: 'light_all',
};

/**
 * Esri World Imagery — satellite / aerial photography.
 *
 * ARCGIS_TOKEN left empty uses the classic keyless endpoint. That still serves
 * tiles, but Esri's terms say it is licensed only for use with an ArcGIS
 * account and not for commercial use, and the endpoint is in "mature" status
 * with no guarantee it stays up. Fine for coursework and demos.
 *
 * Before this ships, create a free ArcGIS Location Platform account at
 * https://location.arcgis.com, make an API key with basemap access, and paste
 * it below. The code then switches to the supported endpoint automatically.
 */
const ARCGIS_TOKEN = '';

const SATELLITE_URL = ARCGIS_TOKEN
  ? `https://ibasemaps-api.arcgis.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?token=${ARCGIS_TOKEN}`
  : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

/** Place names and borders drawn over the imagery, like Google's hybrid view. */
const SATELLITE_LABELS_URL = ARCGIS_TOKEN
  ? `https://ibasemaps-api.arcgis.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}?token=${ARCGIS_TOKEN}`
  : 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';

const ESRI_ATTRIBUTION =
  'Imagery &copy; <a href="https://www.esri.com">Esri</a>, Maxar, Earthstar Geographics, and the GIS User Community';

/** Shown in a toast when the layers button cycles. */
const BASEMAP_LABELS: Record<BasemapKey, string> = {
  dark: 'Dark map',
  satellite: 'Satellite',
  voyager: 'Street map',
  light: 'Light map',
};

const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
  '&copy; <a href="https://carto.com/attributions">CARTO</a>';

/**
 * CARTO basemap API key. PASTE YOURS BELOW.
 *
 * Since late August 2026 CARTO serves keyless raster tiles with an
 * "API KEY REQUIRED" watermark across them. The key is free within the fair
 * use limit (5M tile requests/month), takes about a minute, needs no CARTO
 * account, and is emailed immediately:
 *
 *     https://carto.com/basemaps/apikey
 *
 * You can restrict the key to specific sites or apps later from the same page
 * — worth doing before this ships, since a key in a client bundle is public.
 *
 * Note: CARTO is retiring these raster (PNG) basemaps in favour of vector
 * basemaps. Fine for this project, but not the choice for a long-lived app.
 */
const CARTO_API_KEY = 'cb1_3rcx_1_1b19d566ff6f23f63ab03470';

/**
 * Self-contained Leaflet + CARTO map for the Explore module.
 *
 * Owns no shared state. Takes trails in, emits selections out. Coordinates are
 * joined on internally from trail-geo.ts, so the shared Trail model does not
 * need a lat/lng field.
 *
 * encapsulation: None is required, not stylistic — Leaflet builds marker and
 * control elements outside Angular's view, so they never receive the
 * _ngcontent attribute that scoped styles key off. Every selector below is
 * either Leaflet's own or prefixed, so the global leak is contained.
 */
@Component({
  selector: 'app-trail-map',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  template: `<div #host class="trailmap__host"></div>`,
  styleUrls: ['./trail-map.component.scss'],
})
export class TrailMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('host', { static: true }) host!: ElementRef<HTMLDivElement>;

  private _trails: MappedTrail[] = [];

  /** Shared trails from TrailService. Coordinates are joined on internally. */
  @Input() set trails(value: readonly Trail[] | null) {
    this._trails = withGeo(value ?? []);

    const missing = missingGeo(value ?? []);
    if (missing.length) {
      console.warn('[TrailMap] no coordinates for trail ids:', missing);
    }

    if (this.map) {
      this.renderMarkers();
      this.fitToTrails();
    }
  }

  /** Highlights a marker without re-centering. */
  @Input() set selectedId(id: string | null) {
    this._selectedId = id;
    this.applySelectionStyles();
  }

  @Output() trailSelect = new EventEmitter<Trail>();

  private _selectedId: string | null = null;
  private map?: L.Map;
  private baseLayer?: L.TileLayer;
  /** Only used by the satellite basemap — place names drawn over the imagery. */
  private labelLayer?: L.TileLayer;
  private basemap: BasemapKey = 'dark';
  private markers = new Map<string, L.Marker>();
  private userMarker?: L.CircleMarker;
  private routeLine?: L.Polyline;
  private routeCasing?: L.Polyline;
  private resizeObserver?: ResizeObserver;

  /**
   * Whether fitToTrails() has run against a container with real dimensions.
   * The first call happens during initMap(), before Ionic has finished laying
   * out ion-content, so Leaflet fits against a 0-size box and lands on an
   * arbitrary zoom. This flag lets the ResizeObserver redo the fit once the
   * container has actually been measured.
   */
  private fittedOnce = false;

  constructor(private zone: NgZone) {}

  ngAfterViewInit() {
    // Leaflet fires a lot of events; keeping init outside Angular avoids
    // hundreds of pointless change-detection cycles while panning.
    this.zone.runOutsideAngular(() => this.initMap());
  }

  ngOnDestroy() {
    this.resizeObserver?.disconnect();
    this.clearRoute();
    this.baseLayer?.remove();
    this.labelLayer?.remove();
    this.map?.remove();
    this.map = undefined;
  }

  // ── public API for the host page ────────────────────────────────────────

  /**
   * Cycles dark -> satellite -> voyager -> light. Wire to your layers button.
   * Returns the label of the style now showing, so the page can name it.
   */
  cycleBasemap(): string {
    const i = BASEMAP_ORDER.indexOf(this.basemap);
    const next = BASEMAP_ORDER[(i + 1) % BASEMAP_ORDER.length];
    this.setBasemap(next);
    return BASEMAP_LABELS[next];
  }

  /** Current basemap key, e.g. for an active-state style on the button. */
  get currentBasemap(): BasemapKey {
    return this.basemap;
  }

  /** Pans to a trail and opens it. Safe to call before the map exists. */
  focusTrail(trail: Trail) {
    const mapped = this._trails.find(t => t.id === trail.id);
    if (!mapped || !this.map) return;
    this.map.flyTo([mapped.lat, mapped.lng], 13, { duration: 0.6 });
  }

  /** Centers on the device position. Returns coords so the page can reuse them. */
  async centerOnUser(): Promise<{ lat: number; lng: number } | null> {
    if (!this.map) return null;

    const coords = await this.readPosition();
    if (!coords) return null;

    const { lat, lng } = coords;
    this.map.flyTo([lat, lng], 12, { duration: 0.8 });

    this.userMarker?.remove();
    this.userMarker = L.circleMarker([lat, lng], {
      radius: 7,
      color: '#ffffff',
      weight: 3,
      fillColor: '#5FD97A',
      fillOpacity: 1,
    }).addTo(this.map);

    return coords;
  }

  /** Call after the map becomes visible (tab switch, segment toggle). */
  refreshSize() {
    this.map?.invalidateSize();
  }

  /**
   * Draws the recorded route for a trail and zooms to fit it.
   * Returns false when no GPX track has been converted for that trail yet,
   * so the page can tell the user rather than silently doing nothing.
   */
  showRoute(trailId: string): boolean {
    if (!this.map) return false;

    const path = pathFor(trailId);
    if (!path?.length) return false;

    this.clearRoute();

    // Two lines: a dark casing underneath so the route stays legible over
    // both light and dark basemaps, and the green route on top.
    this.routeCasing = L.polyline(path, {
      color: '#08110a',
      weight: 7,
      opacity: 0.6,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(this.map);

    this.routeLine = L.polyline(path, {
      color: '#5FD97A',
      weight: 3.5,
      opacity: 1,
      lineCap: 'round',
      lineJoin: 'round',
    }).addTo(this.map);

    this.map.fitBounds(this.routeLine.getBounds(), {
      paddingTopLeft: [40, 40],
      paddingBottomRight: [40, 220],
    });

    return true;
  }

  /** Removes any drawn route. Safe to call when none exists. */
  clearRoute() {
    this.routeCasing?.remove();
    this.routeLine?.remove();
    this.routeCasing = undefined;
    this.routeLine = undefined;
  }

  /** Whether a route is currently drawn. */
  hasRoute(): boolean {
    return !!this.routeLine;
  }

  // ── internals ───────────────────────────────────────────────────────────

  private initMap() {
    this.map = L.map(this.host.nativeElement, {
      zoomControl: false,
      attributionControl: true,
    });

    this.setBasemap(this.basemap);
    this.renderMarkers();
    this.fitToTrails();

    // Ionic keeps pages mounted and the container can report zero height until
    // the enter transition finishes. A ResizeObserver handles that plus tab
    // switches and rotation, without the page needing to call in.
    this.resizeObserver = new ResizeObserver(() => {
      this.map?.invalidateSize();
      // Redo the initial fit the first time the container reports real
      // dimensions — otherwise the map opens at whatever zoom it guessed
      // against a zero-size box, and only corrects when a filter changes.
      if (!this.fittedOnce) this.fitToTrails();
    });
    this.resizeObserver.observe(this.host.nativeElement);
  }

  private setBasemap(key: BasemapKey) {
    if (!this.map) return;

    // Both providers' layers come off first — switching away from satellite has
    // to drop the label overlay too, or it stays pinned over the CARTO tiles.
    this.baseLayer?.remove();
    this.labelLayer?.remove();
    this.baseLayer = undefined;
    this.labelLayer = undefined;

    if (key === 'satellite') {
      // Esri serves z/y/x — ROW BEFORE COLUMN, the opposite of CARTO and OSM.
      // Swapping these silently shows the wrong part of the world rather than
      // failing, so leave the placeholder order in SATELLITE_URL alone.
      this.baseLayer = L.tileLayer(SATELLITE_URL, {
        attribution: ESRI_ATTRIBUTION,
        maxZoom: 19,
        // No detectRetina: Esri has no @2x variant, and asking for one doubles
        // the tile requests for tiles it then has to upscale anyway.
      }).addTo(this.map);

      // Imagery alone has no place names, so Luzon reads as anonymous green.
      // This is the same pair Google calls "hybrid".
      this.labelLayer = L.tileLayer(SATELLITE_LABELS_URL, {
        maxZoom: 19,
      }).addTo(this.map);

      this.basemap = key;
      return;
    }

    if (!CARTO_API_KEY) {
      console.warn(
        '[TrailMap] No CARTO_API_KEY set — tiles will render with an ' +
        '"API KEY REQUIRED" watermark. Get a free key at ' +
        'https://carto.com/basemaps/apikey and paste it into ' +
        'trail-map.component.ts.',
      );
    }

    const suffix = CARTO_API_KEY ? `?key=${CARTO_API_KEY}` : '';

    this.baseLayer = L.tileLayer(
      `https://{s}.basemaps.cartocdn.com/${BASEMAPS[key]}/{z}/{x}/{y}{r}.png${suffix}`,
      {
        attribution: CARTO_ATTRIBUTION,
        subdomains: 'abcd',
        maxZoom: 20,
        // Activates the {r} placeholder -> "@2x" tiles on high-DPI phones.
        // Without this, {r} always resolves empty and tiles look soft.
        detectRetina: true,
      },
    ).addTo(this.map);
    this.basemap = key;
  }

  private renderMarkers() {
    if (!this.map) return;

    this.markers.forEach(m => m.remove());
    this.markers.clear();

    for (const trail of this._trails) {
      const marker = L.marker([trail.lat, trail.lng], {
        icon: this.buildIcon(trail),
        title: trail.name,
      }).addTo(this.map);

      marker.on('click', () => {
        // Back into Angular so the host page's bindings actually update.
        this.zone.run(() => this.trailSelect.emit(trail));
      });

      this.markers.set(trail.id, marker);
    }
  }

  private buildIcon(trail: MappedTrail): L.DivIcon {
    const classes = [
      'trailmap-marker',
      isClosed(trail) ? 'trailmap-marker--closed' : '',
      trail.id === this._selectedId ? 'trailmap-marker--selected' : '',
    ].filter(Boolean).join(' ');

    return L.divIcon({
      className: '',
      html: `<div class="${classes}"></div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });
  }

  private applySelectionStyles() {
    if (!this.map) return;
    for (const trail of this._trails) {
      this.markers.get(trail.id)?.setIcon(this.buildIcon(trail));
    }
  }

  private fitToTrails() {
    if (!this.map) return;

    // A container with no size makes fitBounds meaningless — skip and let the
    // ResizeObserver call again once Ionic has laid the page out.
    const size = this.map.getSize();
    const measured = size.x > 0 && size.y > 0;

    if (!this._trails.length) {
      this.map.setView([12.8797, 121.7740], 5); // Philippines
      if (measured) this.fittedOnce = true;
      return;
    }

    if (this._trails.length === 1) {
      const only = this._trails[0];
      this.map.setView([only.lat, only.lng], 12);
      if (measured) this.fittedOnce = true;
      return;
    }

    const bounds = L.latLngBounds(
      this._trails.map(t => [t.lat, t.lng] as L.LatLngTuple),
    );

    // Top padding clears the weather banner; bottom clears the trail sheet.
    this.map.fitBounds(bounds, {
      paddingTopLeft: [40, 95],
      paddingBottomRight: [40, 200],
      maxZoom: 12,
    });

    if (measured) this.fittedOnce = true;
  }

  /**
   * Browser geolocation. Sufficient while the project is web-only — no native
   * platforms are added yet (package.json has no @capacitor/android or /ios).
   *
   * WHEN YOU ADD A NATIVE PLATFORM this stops being reliable: Android's
   * WebView will not prompt for location on its own. At that point run
   *
   *     npm install @capacitor/geolocation@6   # must match @capacitor/core 6
   *     npx cap sync
   *
   * then add a static import at the top of this file
   *
   *     import { Geolocation } from '@capacitor/geolocation';
   *
   * and replace the body below with
   *
   *     const perm = await Geolocation.requestPermissions();
   *     if (perm.location === 'denied') return null;
   *     const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
   *     return { lat: pos.coords.latitude, lng: pos.coords.longitude };
   *
   * Use a STATIC import, not a dynamic one. Angular 18's esbuild resolves
   * dynamic imports at build time, so `await import('@capacitor/geolocation')`
   * fails the build when the package is absent — try/catch does not help.
   */
  private readPosition(): Promise<{ lat: number; lng: number } | null> {
    return new Promise(resolve => {
      if (!navigator.geolocation) return resolve(null);
      navigator.geolocation.getCurrentPosition(
        p => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        err => {
          console.warn('[TrailMap] geolocation failed', err.message);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000 },
      );
    });
  }
}