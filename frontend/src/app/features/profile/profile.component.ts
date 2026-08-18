import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from '../../core/models/user.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container profile-page">
      <div class="page-header">
        <div>
          <div class="badge badge-rose"><i class="fa-solid fa-sliders"></i> Fashion Preferences</div>
          <h1 class="page-title">Personal Style Profile</h1>
          <p class="page-sub">Configure your aesthetic preferences, sizing, and brand alignments</p>
        </div>

        <button class="btn btn-primary" (click)="saveProfile()" [disabled]="isSaving">
          <span *ngIf="!isSaving"><i class="fa-solid fa-floppy-disk"></i> Save Profile</span>
          <span *ngIf="isSaving"><i class="fa-solid fa-spinner animate-spin"></i> Saving...</span>
        </button>
      </div>

      <div class="profile-grid">
        <!-- Left: Basic Details & Sizing -->
        <div class="col-stack">
          <!-- Account & Bio Card -->
          <div class="glass-card section-card">
            <h3 class="card-heading"><i class="fa-solid fa-user-circle text-rose"></i> Basic Information</h3>
            <div class="form-group">
              <label class="form-label">Full Name</label>
              <input type="text" [(ngModel)]="profile.name" class="form-control" placeholder="Alex Rivers" />
            </div>

            <div class="form-group">
              <label class="form-label">Email Address</label>
              <input type="email" [(ngModel)]="profile.email" class="form-control" readonly disabled />
            </div>

            <div class="form-group">
              <label class="form-label">Contact Phone</label>
              <input type="tel" [(ngModel)]="profile.phone" class="form-control" placeholder="+91 98765 43210" />
            </div>

            <div class="grid grid-cols-2">
              <div class="form-group">
                <label class="form-label">Gender</label>
                <select [(ngModel)]="profile.gender" class="form-control">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Age</label>
                <input type="number" [(ngModel)]="profile.age" class="form-control" min="12" max="100" />
              </div>
            </div>
          </div>

          <!-- Body Metrics (Voluntary & Sensitive) -->
          <div class="glass-card section-card">
            <h3 class="card-heading"><i class="fa-solid fa-ruler-combined text-gold"></i> Voluntary Measurements</h3>
            <p class="section-hint">Measurements assist AI in calculating vertical balance and garment proportions.</p>

            <div class="grid grid-cols-2">
              <div class="form-group">
                <label class="form-label">Height (cm)</label>
                <input type="number" [(ngModel)]="profile.height" class="form-control" placeholder="178" />
              </div>
              <div class="form-group">
                <label class="form-label">Weight (kg)</label>
                <input type="number" [(ngModel)]="profile.weight" class="form-control" placeholder="72" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Fit Preference</label>
              <select [(ngModel)]="profile.clothingPreferences!.fitPreference" class="form-control">
                <option value="slim">Slim / Tailored</option>
                <option value="regular">Regular Classic</option>
                <option value="relaxed">Relaxed Comfort</option>
                <option value="oversized">Oversized Streetwear</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Right: Color, Occasions & Budget Preferences -->
        <div class="col-stack">
          <!-- Budget Selection -->
          <div class="glass-card section-card">
            <h3 class="card-heading"><i class="fa-solid fa-indian-rupee-sign text-emerald"></i> Target Budget Range</h3>
            <div class="budget-options-grid">
              <button
                *ngFor="let b of budgetOptions"
                class="budget-pill"
                [class.active]="profile.budget === b"
                (click)="profile.budget = b"
              >
                {{ b }}
              </button>
            </div>
          </div>

          <!-- Preferred Color Palette Selection -->
          <div class="glass-card section-card">
            <h3 class="card-heading"><i class="fa-solid fa-palette text-violet"></i> Preferred Color Harmony</h3>
            <div class="chips-wrap">
              <button
                *ngFor="let color of availableColors"
                class="choice-chip"
                [class.selected]="hasColor(color)"
                (click)="toggleColor(color)"
              >
                <span class="color-dot" [style.background-color]="getColorHex(color)"></span>
                {{ color }}
              </button>
            </div>
          </div>

          <!-- Preferred Styles -->
          <div class="glass-card section-card">
            <h3 class="card-heading"><i class="fa-solid fa-vest text-rose"></i> Signature Aesthetics</h3>
            <div class="chips-wrap">
              <button
                *ngFor="let style of availableStyles"
                class="choice-chip"
                [class.selected]="hasStyle(style)"
                (click)="toggleStyle(style)"
              >
                {{ style }}
              </button>
            </div>
          </div>

          <!-- Preferred Occasions -->
          <div class="glass-card section-card">
            <h3 class="card-heading"><i class="fa-solid fa-calendar-star text-gold"></i> Key Occasions</h3>
            <div class="chips-wrap">
              <button
                *ngFor="let occ of availableOccasions"
                class="choice-chip"
                [class.selected]="hasOccasion(occ)"
                (click)="toggleOccasion(occ)"
              >
                {{ occ }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page { padding: 3rem 0; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2.5rem;
    }
    .page-title { font-size: 2.2rem; color: #FFFFFF; }
    .page-sub { font-size: 0.92rem; color: var(--text-secondary); }
    .profile-grid {
      display: grid;
      grid-template-columns: 1fr 1.25fr;
      gap: 2rem;
    }
    .col-stack { display: flex; flex-direction: column; gap: 1.75rem; }
    .section-card { padding: 2rem; }
    .card-heading {
      font-size: 1.15rem;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 1.25rem;
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .section-hint {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-top: -0.75rem;
      margin-bottom: 1rem;
    }
    .text-rose { color: var(--accent-rose); }
    .text-gold { color: var(--accent-gold); }
    .text-emerald { color: var(--accent-emerald); }
    .text-violet { color: var(--accent-violet); }
    .budget-options-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
    .budget-pill {
      padding: 0.85rem 1rem;
      border-radius: 0.85rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-weight: 700;
      font-size: 0.9rem;
      cursor: pointer;
      transition: var(--transition-fast);
    }
    .budget-pill:hover { border-color: var(--accent-emerald); color: #FFFFFF; }
    .budget-pill.active {
      background: rgba(16, 185, 129, 0.15);
      border-color: var(--accent-emerald);
      color: #6EE7B7;
    }
    .chips-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 0.6rem;
    }
    .choice-chip {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-fast);
    }
    .choice-chip:hover { border-color: rgba(255, 255, 255, 0.25); color: #FFFFFF; }
    .choice-chip.selected {
      background: rgba(244, 63, 94, 0.15);
      border-color: var(--accent-rose);
      color: #FDA4AF;
    }
    .color-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    @media (max-width: 900px) {
      .profile-grid { grid-template-columns: 1fr; }
      .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profile: Partial<UserProfile> = {
    name: '',
    email: '',
    phone: '',
    gender: 'prefer-not-to-say',
    age: 26,
    height: 178,
    weight: 70,
    budget: 'Under ₹5,000',
    preferredColors: ['Navy Blue', 'Black', 'White', 'Olive', 'Beige'],
    preferredStyles: ['Smart Casual', 'Streetwear'],
    preferredOccasions: ['Casual outings', 'College', 'Office', 'Parties'],
    clothingPreferences: {
      fitPreference: 'regular',
      modestyPreference: 'standard',
      materialPreferences: ['Cotton', 'Linen'],
    },
  };

  isSaving = false;

  budgetOptions: any[] = ['Under ₹1,000', 'Under ₹2,000', 'Under ₹5,000', '₹5,000+', 'Custom'];

  availableColors = ['Navy Blue', 'Black', 'White', 'Olive', 'Beige', 'Burgundy', 'Emerald Green', 'Charcoal', 'Terracotta', 'Mustard'];

  availableStyles = ['Smart Casual', 'Casual', 'Formal', 'Streetwear', 'Traditional', 'Minimalist', 'Trendy', 'Sporty'];

  availableOccasions = ['Casual outings', 'College', 'Office', 'Parties', 'Weddings', 'Dates', 'Travel', 'Festivals'];

  constructor(private authService: AuthService, private toast: ToastService) {}

  ngOnInit(): void {
    this.authService.userProfile$.subscribe((p: UserProfile | null) => {
      if (p) {
        this.profile = {
          ...p,
          clothingPreferences: p.clothingPreferences || {
            fitPreference: 'regular',
            modestyPreference: 'standard',
            materialPreferences: ['Cotton'],
          },
        };
      }
    });
  }

  getColorHex(colorName: string): string {
    const map: Record<string, string> = {
      'Navy Blue': '#1E3A8A',
      'Black': '#111827',
      'White': '#F9FAFB',
      'Olive': '#4D7C0F',
      'Beige': '#D6D3D1',
      'Burgundy': '#881337',
      'Emerald Green': '#047857',
      'Charcoal': '#374151',
      'Terracotta': '#C2410C',
      'Mustard': '#D97706',
    };
    return map[colorName] || '#64748B';
  }

  hasColor(c: string): boolean {
    return !!this.profile.preferredColors?.includes(c);
  }

  toggleColor(c: string): void {
    if (!this.profile.preferredColors) this.profile.preferredColors = [];
    if (this.hasColor(c)) {
      this.profile.preferredColors = this.profile.preferredColors.filter((item: string) => item !== c);
    } else {
      this.profile.preferredColors.push(c);
    }
  }

  hasStyle(s: string): boolean {
    return !!this.profile.preferredStyles?.includes(s);
  }

  toggleStyle(s: string): void {
    if (!this.profile.preferredStyles) this.profile.preferredStyles = [];
    if (this.hasStyle(s)) {
      this.profile.preferredStyles = this.profile.preferredStyles.filter((item: string) => item !== s);
    } else {
      this.profile.preferredStyles.push(s);
    }
  }

  hasOccasion(o: string): boolean {
    return !!this.profile.preferredOccasions?.includes(o);
  }

  toggleOccasion(o: string): void {
    if (!this.profile.preferredOccasions) this.profile.preferredOccasions = [];
    if (this.hasOccasion(o)) {
      this.profile.preferredOccasions = this.profile.preferredOccasions.filter((item: string) => item !== o);
    } else {
      this.profile.preferredOccasions.push(o);
    }
  }

  saveProfile(): void {
    this.isSaving = true;
    this.authService.updateProfile(this.profile).subscribe({
      next: () => {
        this.isSaving = false;
      },
      error: () => {
        this.isSaving = false;
      },
    });
  }
}
