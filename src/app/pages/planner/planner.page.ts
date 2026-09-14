import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonButtons, IonButton,
  AlertController, ToastController,
} from '@ionic/angular/standalone';
import { UserService } from '../../services/user.service';
import { TrailService } from '../../services/trail.service';
import { UpcomingAdventure } from '../../models/user.model';

@Component({
  selector: 'app-planner',
  standalone: true,
  templateUrl: './planner.page.html',
  styleUrls: ['./planner.page.scss'],
  imports: [
    CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
    IonButtons, IonButton,
  ],
})
export class PlannerPage {
  constructor(
    public userService: UserService,
    public trailService: TrailService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  openTrail(adv: UpcomingAdventure) {
    this.router.navigate(['/trail', adv.trailId]);
  }

  async removeAdventure(adv: UpcomingAdventure, ev: Event) {
    ev.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Remove Adventure',
      message: `Remove "${adv.name}" from your planner?`,
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Remove',
          role: 'destructive',
          handler: () => this.userService.removeUpcoming(adv.id),
        },
      ],
    });
    alert.present();
  }

  async addRandomTrail() {
    const trails = this.trailService.trails();
    const existingIds = this.userService.upcoming().map(u => u.trailId);
    const candidate = trails.find(t => !existingIds.includes(t.id)) ?? trails[0];
    this.userService.addUpcoming({
      id: 'u' + Date.now(),
      trailId: candidate.id,
      name: candidate.name,
      image: candidate.image,
      date: 'To be scheduled',
      duration: candidate.duration,
    });
    const toast = await this.toastCtrl.create({
      message: `${candidate.name} added to your planner!`,
      duration: 1800,
      position: 'top',
      color: 'success',
    });
    toast.present();
  }
}
