import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonButtons, IonButton,
  AlertController, ToastController,
} from '@ionic/angular/standalone';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { UpcomingAdventure } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [
    CommonModule, IonContent, IonHeader, IonToolbar, IonTitle, IonIcon,
    IonButtons, IonButton,
  ],
})
export class ProfilePage {
  constructor(
    public userService: UserService,
    public notificationService: NotificationService,
    private router: Router,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  goPersonalInfo() {
    this.router.navigate(['/personal-info']);
  }

  goNotifications() {
    this.router.navigate(['/notifications']);
  }

  goPlanner() {
    this.router.navigate(['/tabs/planner']);
  }

  openAdventure(adv: UpcomingAdventure) {
    this.router.navigate(['/trail', adv.trailId]);
  }

  async showComingSoon(feature: string) {
    const toast = await this.toastCtrl.create({
      message: `${feature} is coming soon!`,
      duration: 1600,
      position: 'top',
      color: 'dark',
    });
    toast.present();
  }

  async confirmSignOut() {
    const alert = await this.alertCtrl.create({
      header: 'Sign Out',
      message: 'Are you sure you want to sign out of TrailTalk?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Sign Out',
          role: 'destructive',
          handler: () => {
            this.userService.signOut();
            this.router.navigate(['/login']);
          },
        },
      ],
    });
    alert.present();
  }
}
