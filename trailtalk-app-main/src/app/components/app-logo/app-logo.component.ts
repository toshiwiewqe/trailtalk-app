import { Component, Input, booleanAttribute } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ═══════════════════════════════════════════════════════════════════════════
 * APP LOGO
 *
 * One standalone component, template and styles inline, so there is a single
 * file to drop in and a single line to add per page.
 *
 * Two ways to use it:
 *
 *   Inside an existing <ion-toolbar> — the normal case. An ion-header does not
 *   scroll away, so the logo is persistent for free:
 *
 *     <ion-buttons slot="start"><app-logo></app-logo></ion-buttons>
 *
 *   Pinned over the page, for a screen with no header of its own:
 *
 *     <app-logo floating></app-logo>
 *
 * Add `AppLogoComponent` to the page's `imports: [...]` array either way.
 * ═══════════════════════════════════════════════════════════════════════════
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <img
      class="tb-logo"
      [class.floating]="floating"
      [src]="src"
      [style.height.px]="height"
      alt="TrailBound"
      draggable="false"
    />
  `,
  styles: [`
    :host { display: inline-flex; align-items: center; }

    .tb-logo {
      width: auto;
      /* The artwork is fine-lined. Without this it turns to mush on a
         low-DPI screen when the browser downscales it. */
      image-rendering: -webkit-optimize-contrast;
      -webkit-user-select: none;
      user-select: none;
    }

    /* Pinned above the page. z-index 500 clears Leaflet's panes, which top out
       around 400 — otherwise the Explore map paints straight over it. */
    .tb-logo.floating {
      position: fixed;
      top: calc(10px + env(safe-area-inset-top));
      left: 16px;
      z-index: 500;
      pointer-events: none;
      filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.55));
    }
  `],
})
export class AppLogoComponent {
  /** Emblem only, no wordmark. Better in a cramped toolbar. */
  @Input({ transform: booleanAttribute }) badgeOnly = false;

  /** Pins the logo to the top-left of the viewport instead of flowing inline. */
  @Input({ transform: booleanAttribute }) floating = false;

  /** Rendered height in px. 28–34 suits a toolbar; 40+ suits a floating mark. */
  @Input() height = 30;

  get src(): string {
    return this.badgeOnly
      ? 'assets/logo/trailbound-badge.png'
      : 'assets/logo/trailbound-lockup.png';
  }
}
