import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page-container">
      <div class="auth-card glass-card">
        <div class="auth-header">
          <div class="brand-icon">
            <i class="fa-solid fa-sparkles"></i>
          </div>
          <h2 class="auth-title">Create Account</h2>
          <p class="auth-subtitle">Join NextFit AI to personalize your daily fashion journey</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input
              type="text"
              formControlName="name"
              class="form-control"
              placeholder="e.g. Alex Rivers"
              [class.is-invalid]="registerForm.get('name')?.touched && registerForm.get('name')?.invalid"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input
              type="email"
              formControlName="email"
              class="form-control"
              placeholder="alex@fashion.ai"
              [class.is-invalid]="registerForm.get('email')?.touched && registerForm.get('email')?.invalid"
            />
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <input
              type="password"
              formControlName="password"
              class="form-control"
              placeholder="At least 6 characters"
              [class.is-invalid]="registerForm.get('password')?.touched && registerForm.get('password')?.invalid"
            />
          </div>

          <button type="submit" class="btn btn-primary btn-block" [disabled]="registerForm.invalid || isLoading">
            <span *ngIf="!isLoading">Create Free Account</span>
            <span *ngIf="isLoading"><i class="fa-solid fa-spinner animate-spin"></i> Creating...</span>
          </button>
        </form>

        <p class="auth-footer">
          Already have an account?
          <a routerLink="/auth/login" class="link-rose">Sign In</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page-container { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 2rem 1.5rem; }
    .auth-card { width: 100%; max-width: 440px; padding: 2.5rem; border-radius: 1.5rem; }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .brand-icon { width: 52px; height: 52px; margin: 0 auto 1rem; border-radius: 1rem; background: linear-gradient(135deg, var(--accent-rose), var(--accent-violet)); display: flex; align-items: center; justify-content: center; color: #FFFFFF; font-size: 1.5rem; box-shadow: 0 8px 24px rgba(244, 63, 94, 0.4); }
    .auth-title { font-size: 1.8rem; font-weight: 800; color: #FFFFFF; margin-bottom: 0.35rem; }
    .auth-subtitle { font-size: 0.88rem; color: var(--text-secondary); }
    .auth-form { margin-bottom: 1.5rem; }
    .btn-block { width: 100%; }
    .auth-footer { text-align: center; margin-top: 1.5rem; font-size: 0.85rem; color: var(--text-secondary); }
    .link-rose { color: var(--accent-rose); font-weight: 700; }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;
    this.isLoading = true;
    const { name, email, password } = this.registerForm.value;

    this.authService.register(name, email, password).subscribe({
      next: (success: boolean) => {
        this.isLoading = false;
        if (success) {
          this.router.navigate(['/profile']);
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
