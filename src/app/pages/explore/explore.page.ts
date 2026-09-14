import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar, IonSegment,
  IonSegmentButton, IonLabel,
} from '@ionic/angular/standalone';
import { TrailCardComponent } from '../../components/trail-card/trail-card.component';
import { TrailService } from '../../services/trail.service';
import { Trail, TrailCategory } from '../../models/trail.model';

@Component({
  selector: 'app-explore',
  standalone: true,
  templateUrl: './explore.page.html',
  styleUrls: ['./explore.page.scss'],
  imports: [
    CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonSearchbar,
    IonSegment, IonSegmentButton, IonLabel, TrailCardComponent,
  ],
})
export class ExplorePage {
  searchTerm = signal('');
  difficultyFilter = signal<'All' | 'Easy' | 'Moderate' | 'Hard'>('All');

  results = computed(() => {
    const all = this.trailService.search(this.searchTerm(), 'All');
    if (this.difficultyFilter() === 'All') return all;
    return all.filter(t => t.difficulty === this.difficultyFilter());
  });

  constructor(public trailService: TrailService, private router: Router) {}

  onSearch(ev: any) {
    this.searchTerm.set(ev.detail.value ?? '');
  }

  onSegmentChange(ev: any) {
    this.difficultyFilter.set(ev.detail.value);
  }

  openTrail(trail: Trail) {
    this.router.navigate(['/trail', trail.id]);
  }
}
