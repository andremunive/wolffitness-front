import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from 'src/app/core/services/loader.service';
@Component({
  selector: 'app-loader',
  template: `<div class="overlay" *ngIf="_loader.isLoading | async">
    <mat-spinner></mat-spinner>
  </div>`,
  styles: [
    `
      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      }
    `,
  ],
  imports: [CommonModule, MatProgressSpinnerModule, NgIf],
  standalone: true,
})
export class LoaderComponent {
  constructor(public _loader: LoaderService) {}
}
