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

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [
    CommonModule, IonContent, IonHeader, IonToolbar, IonSearchbar, IonIcon,
    IonButton, IonBadge, IonChip, IonLabel, TrailCardComponent, PostCardComponent,
  ],
})
export class HomePage {
  searchTerm = signal('');
  activeCategory = signal<TrailCategory | 'All'>('All');
  categories: (TrailCategory)[] = ['Nearby', 'Popular', 'Scenic', 'Forest'];

  filteredTrails = computed(() =>
    this.trailService.search(this.searchTerm(), this.activeCategory())
  );

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

  onSearch(ev: any) {
    this.searchTerm.set(ev.detail.value ?? '');
  }

  selectCategory(cat: TrailCategory) {
    this.activeCategory.set(this.activeCategory() === cat ? 'All' : cat);
  }

  openTrail(trail: Trail) {
    this.router.navigate(['/trail', trail.id]);
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
