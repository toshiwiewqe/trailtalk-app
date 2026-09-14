import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonIcon, IonButtons, IonButton,
  IonTitle, AlertController,
} from '@ionic/angular/standalone';
import { NotificationService } from '../../services/notification.service';
import { AppNotification } from '../../models/notification.model';

@Component({
  selector: 'app-notifications',
  standalone: true,
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
  imports: [
    CommonModule, IonContent, IonHeader, IonToolbar, IonIcon, IonButtons,
    IonButton, IonTitle,
  ],
})
export class NotificationsPage {
  constructor(
    public notificationService: NotificationService,
    private location: Location,
    private router: Router,
    private alertCtrl: AlertController,
  ) {}

  goBack() {
    this.location.back();
  }

  async onTapNotification(n: AppNotification) {
    this.notificationService.markAsRead(n.id);

    if (n.type === 'weather') {
      this.router.navigate(['/tabs/home']);
      return;
    }
    if (n.type === 'maintenance') {
      this.router.navigate(['/trail/t2']);
      return;
    }
    if (n.type === 'social') {
      this.router.navigate(['/tabs/community']);
      return;
    }
    const alert = await this.alertCtrl.create({
      header: n.title,
      message: n.message,
      buttons: ['Got it'],
    });
    alert.present();
  }

  markAllRead() {
    this.notificationService.markAllRead();
  }
}
