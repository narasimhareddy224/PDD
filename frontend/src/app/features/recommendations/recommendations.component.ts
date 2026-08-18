import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecommendationService } from '../../core/services/recommendation.service';
import { Outfit } from '../../core/models/outfit.model';
import { OutfitCardComponent } from '../../shared/components/outfit-card/outfit-card.component';
import { PriceCompareModalComponent } from '../../shared/components/price-compare-modal/price-compare-modal.component';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, FormsModule, OutfitCardComponent, PriceCompareModalComponent],
  template: `
    <div class="container recs-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <div class="badge badge-emerald"><i class="fa-solid fa-sparkles"></i> AI Recommendation Engine</div>
          <h1 class="page-title">Personalized Fashion Curations</h1>
          <p class="page-sub">Explore tailored outfits calibrated for your skin tone, body symmetry, and events</p>
        </div>
      </div>

      <!-- Filters & Search Bar -->
      <div class="filters-bar glass-card">
        <!-- Occasions Chips Carousel -->
        <div class="occasions-scroll">
          <button
            *ngFor="let occ of occasions"
            class="filter-chip"
            [class.active]="selectedOccasion === occ"
            (click)="setOccasion(occ)"
          >
            {{ occ }}
          </button>
        </div>

        <div class="secondary-filters-row">
          <!-- Search Input -->
          <div class="search-wrap">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="applyLocalFilters()"
              placeholder="Search by color, fabric, or title..."
              class="search-input"
            />
          </div>

          <!-- Style Dropdown -->
          <select [(ngModel)]="selectedStyle" (ngModelChange)="loadRecommendations()" class="select-filter">
            <option value="all">All Styles</option>
            <option value="Smart Casual">Smart Casual</option>
            <option value="Formal">Formal</option>
            <option value="Streetwear">Streetwear</option>
            <option value="Traditional">Traditional</option>
            <option value="Trendy">Trendy</option>
          </select>

          <!-- Budget Dropdown -->
          <select [(ngModel)]="selectedBudget" (ngModelChange)="loadRecommendations()" class="select-filter">
            <option value="all">All Budgets</option>
            <option value="Under ₹1,000">Under ₹1,000</option>
            <option value="Under ₹2,000">Under ₹2,000</option>
            <option value="Under ₹5,000">Under ₹5,000</option>
            <option value="₹5,000+">₹5,000+</option>
          </select>
        </div>
      </div>

      <!-- Outfits Grid -->
      <div *ngIf="isLoading" class="loading-grid">
        <div class="spinner"></div>
        <p>Curating personalized fashion looks...</p>
      </div>

      <div *ngIf="!isLoading && filteredOutfits.length === 0" class="empty-state glass-card">
        <i class="fa-solid fa-shirt-rack empty-icon"></i>
        <h3>No Outfits Found</h3>
        <p>Try broadening your occasion, budget, or style filters.</p>
        <button class="btn btn-secondary btn-sm mt-3" (click)="resetFilters()">Reset All Filters</button>
      </div>

      <div *ngIf="!isLoading && filteredOutfits.length > 0" class="grid grid-cols-3">
        <app-outfit-card
          *ngFor="let outfit of filteredOutfits"
          [outfit]="outfit"
          (onCompare)="openCompare($event)"
        ></app-outfit-card>
      </div>

      <!-- Price Compare Modal -->
      <app-price-compare-modal
        *ngIf="selectedCompareOutfit"
        [outfit]="selectedCompareOutfit"
        (onClose)="selectedCompareOutfit = null"
      ></app-price-compare-modal>
    </div>
  `,
  styles: [`
    .recs-page { padding: 3rem 0 5rem; }
    .page-header { margin-bottom: 2rem; }
    .page-title { font-size: 2.2rem; color: #FFFFFF; }
    .page-sub { font-size: 0.92rem; color: var(--text-secondary); }
    .filters-bar {
      padding: 1.5rem;
      margin-bottom: 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .occasions-scroll {
      display: flex;
      gap: 0.6rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
    }
    .filter-chip {
      padding: 0.5rem 1.15rem;
      border-radius: 9999px;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      transition: var(--transition-fast);
    }
    .filter-chip:hover { border-color: rgba(255, 255, 255, 0.2); color: #FFFFFF; }
    .filter-chip.active {
      background: linear-gradient(135deg, var(--accent-rose), #BE123C);
      color: #FFFFFF;
      border-color: transparent;
      box-shadow: 0 4px 12px var(--accent-rose-glow);
    }
    .secondary-filters-row {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }
    .search-wrap {
      position: relative;
      flex: 1;
      min-width: 260px;
    }
    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    .search-input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: 0.85rem;
      color: #FFFFFF;
      font-size: 0.9rem;
    }
    .search-input:focus { outline: none; border-color: var(--accent-rose); }
    .select-filter {
      padding: 0.75rem 1.25rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: 0.85rem;
      color: #FFFFFF;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
    }
    .select-filter:focus { outline: none; border-color: var(--accent-rose); }
    .loading-grid, .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-secondary);
    }
    .empty-icon { font-size: 3rem; color: var(--accent-rose); margin-bottom: 1rem; }
    .spinner {
      width: 44px;
      height: 44px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: var(--accent-rose);
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 1s linear infinite;
    }
    .mt-3 { margin-top: 1rem; }
  `]
})
export class RecommendationsComponent implements OnInit {
  outfits: Outfit[] = [];
  filteredOutfits: Outfit[] = [];
  isLoading = false;

  occasions = [
    'All Occasions',
    'Weddings',
    'Parties',
    'Interviews',
    'College',
    'Office',
    'Festivals',
    'Casual outings',
    'Dates',
    'Travel',
    'Smart casual',
  ];

  selectedOccasion = 'All Occasions';
  selectedStyle = 'all';
  selectedBudget = 'all';
  searchQuery = '';

  selectedCompareOutfit: Outfit | null = null;

  constructor(private recService: RecommendationService) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  setOccasion(occ: string): void {
    this.selectedOccasion = occ;
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    this.isLoading = true;
    const occFilter = this.selectedOccasion === 'All Occasions' ? undefined : this.selectedOccasion;
    const styleFilter = this.selectedStyle === 'all' ? undefined : this.selectedStyle;
    const budgetFilter = this.selectedBudget === 'all' ? undefined : this.selectedBudget;

    this.recService
      .getRecommendations({
        occasion: occFilter,
        style: styleFilter,
        budget: budgetFilter,
      })
      .subscribe({
        next: (res: Outfit[]) => {
          this.outfits = res;
          this.applyLocalFilters();
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }

  applyLocalFilters(): void {
    if (!this.searchQuery.trim()) {
      this.filteredOutfits = [...this.outfits];
      return;
    }

    const q = this.searchQuery.toLowerCase();
    this.filteredOutfits = this.outfits.filter(
      (o: Outfit) =>
        o.title.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q) ||
        o.colors.some((c: string) => c.toLowerCase().includes(q)) ||
        o.top.name.toLowerCase().includes(q) ||
        o.bottom.name.toLowerCase().includes(q)
    );
  }

  resetFilters(): void {
    this.selectedOccasion = 'All Occasions';
    this.selectedStyle = 'all';
    this.selectedBudget = 'all';
    this.searchQuery = '';
    this.loadRecommendations();
  }

  openCompare(outfit: Outfit): void {
    this.selectedCompareOutfit = outfit;
  }
}
