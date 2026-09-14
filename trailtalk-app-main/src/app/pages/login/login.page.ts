import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonIcon, IonInput, ToastController } from '@ionic/angular/standalone';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [CommonModule, FormsModule, IonContent, IonIcon, IonInput],
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private userService: UserService,
    private router: Router,
    private toastCtrl: ToastController,
  ) {}

  async signIn() {
    this.userService.signIn();
    const toast = await this.toastCtrl.create({
      message: 'Welcome back!',
      duration: 1400,
      position: 'top',
      color: 'success',
    });
    toast.present();
    this.router.navigate(['/tabs/home']);
  }
}
