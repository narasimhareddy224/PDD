import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrapper">
      <div
        *ngFor="let toast of toasts"
        class="toast-item"
        [ngClass]="'toast-' + toast.type"
      >
        <div class="toast-icon">
          <i
            class="fa-solid"
            [ngClass]="{
              'fa-circle-check': toast.type === 'success',
              'fa-circle-exclamation': toast.type === 'error',
              'fa-triangle-exclamation': toast.type === 'warning',
              'fa-circle-info': toast.type === 'info'
            }"
          ></i>
        </div>
        <div class="toast-body">
          <h5 class="toast-title">{{ toast.title }}</h5>
          <p class="toast-message">{{ toast.message }}</p>
        </div>
        <button class="toast-close" (click)="toastService.remove(toast.id)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-wrapper {
      position: fixed;
      top: 90px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      pointer-events: none;
      max-width: 380px;
      width: calc(100vw - 48px);
    }
    .toast-item {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      padding: 1rem 1.25rem;
      border-radius: 1rem;
      background: rgba(18, 22, 32, 0.95);
      backdrop-filter: blur(16px);
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6);
      border: 1px solid var(--border-subtle);
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .toast-success { border-color: rgba(16, 185, 129, 0.5); }
    .toast-success .toast-icon { color: var(--accent-emerald); }
    .toast-error { border-color: rgba(244, 63, 94, 0.5); }
    .toast-error .toast-icon { color: var(--accent-rose); }
    .toast-warning { border-color: rgba(245, 158, 11, 0.5); }
    .toast-warning .toast-icon { color: var(--accent-gold); }
    .toast-info { border-color: rgba(139, 92, 246, 0.5); }
    .toast-info .toast-icon { color: var(--accent-violet); }
    .toast-icon { font-size: 1.25rem; margin-top: 0.15rem; }
    .toast-body { flex: 1; }
    .toast-title { font-size: 0.92rem; font-weight: 700; color: #FFFFFF; margin-bottom: 0.2rem; }
    .toast-message { font-size: 0.82rem; color: var(--text-secondary); line-height: 1.4; }
    .toast-close {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0.2rem;
    }
    .toast-close:hover { color: #FFFFFF; }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class ToastComponent implements OnInit {
  toasts: ToastMessage[] = [];

  constructor(public toastService: ToastService) {}

  ngOnInit(): void {
    this.toastService.getToasts().subscribe((t: ToastMessage[]) => (this.toasts = t));
  }
}
