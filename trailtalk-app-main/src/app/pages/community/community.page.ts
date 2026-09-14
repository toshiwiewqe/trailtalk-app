import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonContent, IonHeader, IonToolbar, IonIcon, IonBadge, IonModal,
  IonTextarea, IonInput, ToastController,
} from '@ionic/angular/standalone';
import { PostCardComponent } from '../../components/post-card/post-card.component';
import { PostService } from '../../services/post.service';
import { NotificationService } from '../../services/notification.service';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-community',
  standalone: true,
  templateUrl: './community.page.html',
  styleUrls: ['./community.page.scss'],
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, IonIcon, IonBadge,
    IonModal, IonTextarea, IonInput, PostCardComponent,
  ],
})
export class CommunityPage {
  showComposer = false;
  showComments = false;
  newPostText = '';
  newPostImage = '';
  activePost: Post | null = null;
  newComment = '';

  constructor(
    public postService: PostService,
    public notificationService: NotificationService,
    private router: Router,
    private toastCtrl: ToastController,
  ) {}

  goNotifications() {
    this.router.navigate(['/notifications']);
  }

  onLike(post: Post) {
    this.postService.toggleLike(post.id);
  }

  openComments(post: Post) {
    this.activePost = post;
    this.showComments = true;
  }

  submitComment() {
    if (!this.activePost || !this.newComment.trim()) return;
    this.postService.addComment(this.activePost.id, this.newComment.trim());
    this.newComment = '';
  }

  async onShare(post: Post) {
    const shareData = {
      title: post.author + ' on TrailTalk',
      text: post.content,
      url: 'https://trailtalk.app/posts/' + post.id,
    };
    if ((navigator as any).share) {
      try {
        await (navigator as any).share(shareData);
        return;
      } catch {
        // user cancelled, fall through silently
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(shareData.url);
    } catch {
      // clipboard may be unavailable
    }
    const toast = await this.toastCtrl.create({
      message: 'Link copied to clipboard',
      duration: 1800,
      position: 'top',
      color: 'dark',
    });
    toast.present();
  }

  openComposer() {
    this.showComposer = true;
  }

  cancelComposer() {
    this.showComposer = false;
    this.newPostText = '';
    this.newPostImage = '';
  }

  async publishPost() {
    if (!this.newPostText.trim()) return;
    this.postService.addPost(this.newPostText.trim(), this.newPostImage.trim() || undefined);
    this.showComposer = false;
    this.newPostText = '';
    this.newPostImage = '';
    const toast = await this.toastCtrl.create({
      message: 'Your post is live!',
      duration: 1800,
      position: 'top',
      color: 'success',
    });
    toast.present();
  }
}
