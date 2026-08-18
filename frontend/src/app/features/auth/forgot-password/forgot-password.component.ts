import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page-container">
      <div class="auth-card glass-card">
        <div class="auth-header">
          <div class="brand-icon">
            <i class="fa-solid fa-key"></i>
          </div>
          <h2 class="auth-title">Reset Password</h2>
          <p class="auth-subtitle">Enter your registered email to receive a recovery link</p>
        </div>

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input
              type="email"
              [(ngModel)]="email"
              name="email"
              class="form-control"
              placeholder="alex@fashion.ai"
              required
            />
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="!email || isLoading">
            <span *ngIf="!isLoading">Send Recovery Link</span>
            <span *ngIf="isLoading"><i class="fa-solid fa-spinner animate-spin"></i> Processing...</span>
          </button>
        </form>

        <p class="auth-footer">
          Remembered your password?
          <a routerLink="/auth/login" class="link-rose">Sign In</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page-container { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1.5rem; }
    .auth-card { width: 100%; max-width: 440px; padding: 2.5rem; border-radius: 1.5rem; }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .brand-icon { width: 52px; height: 52px; margin: 0 auto 1rem; border-radius: 1rem; background: linear-gradient(135deg, var(--accent-gold), var(--accent-rose)); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 1.5rem; }
    .auth-title { font-size: 1.8rem; font-weight: 800; color: #FFFFFF; margin-bottom: 0.35rem; }
    .auth-subtitle { font-size: 0.88rem; color: var(--text-secondary); }
    .auth-form { margin-bottom: 1.5rem; }
    .btn-block { width: 100%; }
    .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-secondary); }
    .link-rose { color: var(--accent-rose); font-weight: 700; }
  `]
})
export class ForgotPasswordComponent {
  email = '';
  isLoading = false;

  constructor(private toast: ToastService) {}

  onSubmit(): void {
    if (!this.email) return;
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.toast.success('Recovery Email Dispatched', 'Please check your inbox for password reset instructions.');
    }, 1000);
  }
}
