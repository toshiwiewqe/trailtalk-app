import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon,
  ToastController,
} from '@ionic/angular/standalone';
import { TrailService } from '../../services/trail.service';
import { UserService } from '../../services/user.service';
import { Trail } from '../../models/trail.model';

@Component({
  selector: 'app-trail-detail',
  standalone: true,
  templateUrl: './trail-detail.page.html',
  styleUrls: ['./trail-detail.page.scss'],
  imports: [CommonModule, IonContent, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon],
})
export class TrailDetailPage implements OnInit {
  trail = signal<Trail | undefined>(undefined);
  saved = signal(false);

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private trailService: TrailService,
    private userService: UserService,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.trail.set(this.trailService.getById(id));
      this.saved.set(this.userService.upcoming().some(u => u.trailId === id));
    }
  }

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

  async bookAdventure() {
    const toast = await this.toastCtrl.create({
      message: 'Adventure booked! Stay safe on the trails. 🥾',
      duration: 2000,
      position: 'top',
      color: 'success',
    });
    toast.present();
  }
}