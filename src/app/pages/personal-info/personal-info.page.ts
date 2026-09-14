import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonTitle, IonIcon, IonButtons, IonButton,
  IonItem, IonInput, IonLabel, IonSelect, IonSelectOption, ToastController,
} from '@ionic/angular/standalone';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  templateUrl: './personal-info.page.html',
  styleUrls: ['./personal-info.page.scss'],
  imports: [
    CommonModule, ReactiveFormsModule, IonContent, IonHeader, IonToolbar,
    IonTitle, IonIcon, IonButtons, IonButton, IonItem, IonInput, IonLabel,
    IonSelect, IonSelectOption,
  ],
})
export class PersonalInfoPage implements OnInit {
  form!: FormGroup;
  avatarPreview = '';

  constructor(
    private fb: FormBuilder,
    public userService: UserService,
    private location: Location,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {
    const p = this.userService.profile();
    this.avatarPreview = p.avatar;
    this.form = this.fb.group({
      name: [p.name, [Validators.required, Validators.minLength(2)]],
      email: [p.email, [Validators.required, Validators.email]],
      phone: [p.phone, [Validators.required]],
      dob: [p.dob, [Validators.required]],
      gender: [p.gender, [Validators.required]],
      emergencyContactName: [p.emergencyContactName],
      emergencyContactPhone: [p.emergencyContactPhone],
    });
  }

  goBack() {
    this.location.back();
  }

  onAvatarFileChange(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  triggerFileInput() {
    const el = document.getElementById('avatarFileInput') as HTMLInputElement | null;
    el?.click();
  }

  field(name: string) {
    return this.form.get(name);
  }

  isInvalid(name: string) {
    const f = this.field(name);
    return !!f && f.invalid && (f.dirty || f.touched);
  }

  async save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      const toast = await this.toastCtrl.create({
        message: 'Please fix the highlighted fields.',
        duration: 1800,
        position: 'top',
        color: 'danger',
      });
      toast.present();
      return;
    }
    this.userService.updateProfile(this.form.value);
    this.userService.updateAvatar(this.avatarPreview);
    const toast = await this.toastCtrl.create({
      message: 'Profile updated successfully!',
      duration: 1600,
      position: 'top',
      color: 'success',
    });
    await toast.present();
    this.location.back();
  }
}
