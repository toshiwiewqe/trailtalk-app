import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon, IonButton } from '@ionic/angular/standalone';
import { Trail } from '../../models/trail.model';

@Component({
  selector: 'app-trail-card',
  standalone: true,
  templateUrl: './trail-card.component.html',
  styleUrls: ['./trail-card.component.scss'],
  imports: [CommonModule, IonIcon, IonButton],
})
export class TrailCardComponent {
  @Input({ required: true }) trail!: Trail;
  @Output() details = new EventEmitter<Trail>();
  @Output() cardTap = new EventEmitter<Trail>();

  onDetails(ev: Event) {
    ev.stopPropagation();
    this.details.emit(this.trail);
  }

  onTap() {
    this.cardTap.emit(this.trail);
  }
}
