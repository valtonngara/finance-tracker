import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('toastAnim', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast-item"
          [class]="'toast-item toast-' + toast.type"
          [@toastAnim]
        >
          <span class="toast-icon">
            @switch (toast.type) {
              @case ('success') { &#10003; }
              @case ('error') { &#10007; }
              @case ('info') { &#8505; }
              @case ('warning') { &#9888; }
            }
          </span>
          <span class="toast-message">{{ toast.message }}</span>
          <button class="toast-close" (click)="toastService.remove(toast.id)">&times;</button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      pointer-events: none;
    }

    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
      pointer-events: none;
    }

    .toast-item {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 18px;
      border-radius: 12px;
      background: rgba(30, 30, 60, 0.75);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      color: #fff;
      font-size: 14px;
      min-width: 280px;
    }

    .toast-success {
      border-left: 4px solid #22c55e;
    }

    .toast-success .toast-icon {
      color: #22c55e;
    }

    .toast-error {
      border-left: 4px solid #ef4444;
    }

    .toast-error .toast-icon {
      color: #ef4444;
    }

    .toast-info {
      border-left: 4px solid #3b82f6;
    }

    .toast-info .toast-icon {
      color: #3b82f6;
    }

    .toast-warning {
      border-left: 4px solid #f59e0b;
    }

    .toast-warning .toast-icon {
      color: #f59e0b;
    }

    .toast-icon {
      font-size: 18px;
      flex-shrink: 0;
      width: 24px;
      text-align: center;
    }

    .toast-message {
      flex: 1;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      font-size: 20px;
      cursor: pointer;
      padding: 0 4px;
      line-height: 1;
      flex-shrink: 0;
      transition: color 0.2s ease;
    }

    .toast-close:hover {
      color: #fff;
    }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
