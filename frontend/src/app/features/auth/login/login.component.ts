import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page-container">
      <div class="auth-card glass-card">
        <div class="auth-header">
          <div class="brand-icon">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <h2 class="auth-title">Welcome Back</h2>
          <p class="auth-subtitle">Sign in to access your AI fashion recommendations & calendar</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input
              type="email"
              formControlName="email"
              class="form-control"
              placeholder="alex@fashion.ai"
              [class.is-invalid]="loginForm.get('email')?.touched && loginForm.get('email')?.invalid"
            />
            <span *ngIf="loginForm.get('email')?.touched && loginForm.get('email')?.invalid" class="field-error">
              Please enter a valid email.
            </span>
          </div>

          <div class="form-group">
            <div class="password-label-row">
              <label class="form-label">Password</label>
              <a routerLink="/auth/forgot-password" class="forgot-link">Forgot password?</a>
            </div>
            <input
              type="password"
              formControlName="password"
              class="form-control"
              placeholder="••••••••"
              [class.is-invalid]="loginForm.get('password')?.touched && loginForm.get('password')?.invalid"
            />
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="loginForm.invalid || isLoading">
            <span *ngIf="!isLoading">Sign In</span>
            <span *ngIf="isLoading"><i class="fa-solid fa-spinner animate-spin"></i> Authenticating...</span>
          </button>
        </form>

        <div class="auth-divider">
          <span>OR QUICK ACCESS</span>
        </div>

        <button class="btn btn-secondary btn-block" (click)="quickDemoLogin()">
          <i class="fa-solid fa-user-astronaut"></i> Demo Fashionista Sign In
        </button>

        <p class="auth-footer">
          Don't have an account?
          <a routerLink="/auth/register" class="link-rose">Create Account</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page-container {
      min-height: 80vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
    }
    .auth-card {
      width: 100%;
      max-width: 440px;
      padding: 2.5rem;
      border-radius: 1.5rem;
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .brand-icon {
      width: 52px;
      height: 52px;
      margin: 0 auto 1rem;
      border-radius: 1rem;
      background: linear-gradient(135deg, var(--accent-rose), var(--accent-violet));
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-size: 1.5rem;
      box-shadow: 0 8px 24px rgba(244, 63, 94, 0.4);
    }
    .auth-title { font-size: 1.8rem; font-weight: 800; color: #FFFFFF; margin-bottom: 0.35rem; }
    .auth-subtitle { font-size: 0.88rem; color: var(--text-secondary); }
    .auth-form { margin-bottom: 1.5rem; }
    .password-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .forgot-link { font-size: 0.78rem; color: var(--accent-rose); }
    .forgot-link:hover { text-decoration: underline; }
    .field-error { font-size: 0.75rem; color: #F87171; margin-top: 0.25rem; display: block; }
    .btn-block { width: 100%; }
    .auth-divider {
      text-align: center;
      margin: 1.5rem 0;
      position: relative;
    }
    .auth-divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: var(--border-subtle);
    }
    .auth-divider span {
      position: relative;
      background: var(--bg-surface);
      padding: 0 0.75rem;
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--text-muted);
      letter-spacing: 0.08em;
    }
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .link-rose { color: var(--accent-rose); font-weight: 700; }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['alex.rivers@fashion.ai', [Validators.required, Validators.email]],
      password: ['Password123!', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (success: boolean) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/dashboard']);
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  quickDemoLogin(): void {
    this.authService.login('alex.rivers@fashion.ai', 'Password123!').subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}
