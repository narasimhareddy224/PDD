import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoppingService } from '../../../core/services/shopping.service';
import { ShoppingProduct, ProductComparisonResult } from '../../../core/models/shopping.model';

@Component({
  selector: 'app-shopping-hub',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container shopping-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <div class="badge badge-gold"><i class="fa-solid fa-tags"></i> Verified Merchant Feeds</div>
          <h1 class="page-title">Multi-Store Fashion Deals & Price Comparison</h1>
          <p class="page-sub">Direct comparison across Amazon, Flipkart, Myntra, and Ajio authorized feeds</p>
        </div>
      </div>

      <!-- Quick Platform Status Bar -->
      <div class="platforms-status-bar glass-card">
        <div class="platform-indicator active">
          <span class="dot emerald"></span> Amazon.in Feed: Active
        </div>
        <div class="platform-indicator active">
          <span class="dot emerald"></span> Flipkart Direct: Active
        </div>
        <div class="platform-indicator active">
          <span class="dot emerald"></span> Myntra Official: Active
        </div>
        <div class="platform-indicator active">
          <span class="dot emerald"></span> Ajio Catalog: Active
        </div>
      </div>

      <!-- Search & Filters Header -->
      <div class="shopping-search-bar glass-card">
        <div class="search-input-group">
          <i class="fa-solid fa-magnifying-glass search-ico"></i>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keyup.enter)="onSearch()"
            placeholder="Search Oxford shirts, navy chinos, leather sneakers..."
            class="shopping-input"
          />
          <button class="btn btn-primary" (click)="onSearch()">
            <i class="fa-solid fa-magnifying-glass"></i> Search
          </button>
        </div>

        <div class="filter-controls-row">
          <!-- Category Tabs -->
          <div class="category-tabs">
            <button
              *ngFor="let cat of categories"
              class="cat-chip"
              [class.active]="selectedCategory === cat"
              (click)="setCategory(cat)"
            >
              {{ cat }}
            </button>
          </div>

          <!-- Platform Filter -->
          <select [(ngModel)]="selectedPlatform" (ngModelChange)="onSearch()" class="platform-select">
            <option value="">All Platforms</option>
            <option value="Amazon">Amazon Only</option>
            <option value="Flipkart">Flipkart Only</option>
            <option value="Myntra">Myntra Only</option>
            <option value="Ajio">Ajio Only</option>
          </select>
        </div>
      </div>

      <!-- Real-time Comparator Highlight Banner -->
      <div class="comparator-hero glass-card" *ngIf="featuredComparison">
        <div class="comp-hero-left">
          <span class="badge badge-emerald"><i class="fa-solid fa-bolt"></i> Lowest Verified Price Found</span>
          <h3 class="comp-hero-title">{{ featuredComparison.productTitle }}</h3>
          <p class="comp-hero-desc">{{ featuredComparison.matchReason }}</p>

          <div class="lowest-pill-box" *ngIf="featuredComparison.lowestVerifiedPrice">
            <span class="lowest-amt">₹{{ featuredComparison.lowestVerifiedPrice.price | number }}</span>
            <span class="lowest-store">Lowest on <strong>{{ featuredComparison.lowestVerifiedPrice.platform }}</strong></span>
          </div>
        </div>

        <div class="comp-stores-row">
          <div
            *ngFor="let p of platforms"
            class="comp-store-mini"
            [class.winner]="isWinner(p)"
          >
            <div class="store-label">{{ p }}</div>
            <div *ngIf="featuredComparison.platformPrices[p]?.available; else notAvailable" class="price-data">
              <span class="price-val">₹{{ featuredComparison.platformPrices[p].price | number }}</span>
              <a [href]="featuredComparison.platformPrices[p].productUrl" target="_blank" rel="noopener" class="btn btn-secondary btn-sm store-link-btn">
                Visit Store
              </a>
            </div>
            <ng-template #notAvailable>
              <span class="feed-offline">Unavailable</span>
            </ng-template>
          </div>
        </div>
      </div>

      <!-- Products Results Grid -->
      <div class="results-section">
        <div *ngIf="isLoading" class="loading-grid">
          <div class="spinner"></div>
          <p>Syncing product catalogs...</p>
        </div>

        <div *ngIf="!isLoading && products.length === 0" class="empty-state glass-card">
          <i class="fa-solid fa-box-open empty-icon"></i>
          <h3>No Matching Products</h3>
          <p>Try searching for "Oxford", "Chinos", "Sneakers", or "Watch".</p>
        </div>

        <div *ngIf="!isLoading && products.length > 0" class="grid grid-cols-4">
          <div *ngFor="let item of products" class="product-card glass-card">
            <div class="prod-img-wrap">
              <img [src]="item.imageUrl" [alt]="item.productName" class="prod-img" />
              <span class="platform-badge" [ngClass]="item.platform.toLowerCase()">
                {{ item.platform }}
              </span>
              <span class="match-badge">
                <i class="fa-solid fa-sparkles"></i> {{ item.matchScore }}%
              </span>
            </div>

            <div class="prod-body">
              <span class="prod-brand">{{ item.brand }}</span>
              <h4 class="prod-name">{{ item.productName }}</h4>

              <div class="prod-price-row">
                <span class="prod-price">₹{{ item.price | number }}</span>
                <span class="prod-orig" *ngIf="item.originalPrice">₹{{ item.originalPrice | number }}</span>
              </div>

              <div class="verified-tag">
                <i class="fa-solid fa-circle-check text-emerald"></i> Verified Price Feed
              </div>

              <a [href]="item.productUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm btn-block mt-auto">
                <i class="fa-solid fa-arrow-up-right-from-square"></i> Buy on {{ item.platform }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .shopping-page { padding: 3rem 0 5rem; }
    .page-header { margin-bottom: 2rem; }
    .page-title { font-size: 2.2rem; color: #FFFFFF; }
    .page-sub { font-size: 0.92rem; color: var(--text-secondary); }
    .platforms-status-bar {
      display: flex;
      gap: 1.5rem;
      padding: 0.85rem 1.5rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .platform-indicator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .dot.emerald { width: 8px; height: 8px; border-radius: 50%; background: #10B981; box-shadow: 0 0 8px #10B981; }
    .shopping-search-bar {
      padding: 1.5rem;
      margin-bottom: 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .search-input-group {
      display: flex;
      gap: 0.75rem;
      position: relative;
    }
    .search-ico {
      position: absolute;
      left: 18px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-muted);
    }
    .shopping-input {
      flex: 1;
      padding: 0.85rem 1.25rem 0.85rem 3rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: 0.85rem;
      color: #FFFFFF;
      font-size: 0.95rem;
    }
    .shopping-input:focus { outline: none; border-color: var(--accent-rose); }
    .filter-controls-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .category-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .cat-chip {
      padding: 0.45rem 1rem;
      border-radius: 9999px;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-fast);
    }
    .cat-chip:hover { border-color: rgba(255, 255, 255, 0.2); color: #FFFFFF; }
    .cat-chip.active {
      background: rgba(245, 158, 11, 0.15);
      border-color: var(--accent-gold);
      color: #FDE68A;
    }
    .platform-select {
      padding: 0.6rem 1rem;
      border-radius: 0.75rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      color: #FFFFFF;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .comparator-hero {
      padding: 2rem;
      margin-bottom: 2.5rem;
      display: grid;
      grid-template-columns: 1.2fr 1.8fr;
      gap: 2rem;
      align-items: center;
      border-color: rgba(16, 185, 129, 0.35);
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(6, 182, 212, 0.04));
    }
    .comp-hero-title { font-size: 1.5rem; color: #FFFFFF; margin: 0.5rem 0 0.25rem; font-weight: 800; }
    .comp-hero-desc { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 1rem; }
    .lowest-pill-box {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
    }
    .lowest-amt { font-size: 2rem; font-weight: 800; color: #6EE7B7; }
    .lowest-store { font-size: 0.85rem; color: var(--text-secondary); }
    .comp-stores-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
    }
    .comp-store-mini {
      padding: 1rem 0.75rem;
      border-radius: 0.85rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }
    .comp-store-mini.winner {
      border-color: var(--accent-emerald);
      background: rgba(16, 185, 129, 0.15);
    }
    .store-label { font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }
    .price-val { font-size: 1.15rem; font-weight: 800; color: #FFFFFF; display: block; }
    .store-link-btn { width: 100%; margin-top: 0.25rem; font-size: 0.75rem; padding: 0.35rem 0.5rem; }
    .feed-offline { font-size: 0.75rem; color: var(--text-muted); font-style: italic; }
    .product-card {
      display: flex;
      flex-direction: column;
      border-radius: 1.25rem;
      overflow: hidden;
      height: 100%;
    }
    .prod-img-wrap {
      position: relative;
      width: 100%;
      height: 220px;
      background: #0D111A;
    }
    .prod-img { width: 100%; height: 100%; object-fit: cover; }
    .platform-badge {
      position: absolute;
      top: 10px;
      left: 10px;
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 700;
      color: #FFFFFF;
    }
    .platform-badge.amazon { background: #E67A00; }
    .platform-badge.flipkart { background: #1A5CC4; }
    .platform-badge.myntra { background: #E61853; }
    .platform-badge.ajio { background: #1B2936; }
    .match-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 700;
      background: rgba(16, 185, 129, 0.85);
      color: #FFFFFF;
    }
    .prod-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 0.4rem;
    }
    .prod-brand { font-size: 0.72rem; font-weight: 700; color: var(--accent-gold); text-transform: uppercase; }
    .prod-name { font-size: 0.95rem; font-weight: 700; color: #FFFFFF; line-height: 1.3; margin-bottom: 0.25rem; }
    .prod-price-row { display: flex; align-items: baseline; gap: 0.5rem; }
    .prod-price { font-size: 1.25rem; font-weight: 800; color: #FFFFFF; }
    .prod-orig { font-size: 0.8rem; color: var(--text-muted); text-decoration: line-through; }
    .verified-tag { font-size: 0.72rem; color: var(--text-muted); margin-bottom: 0.75rem; }
    .text-emerald { color: #10B981; }
    .btn-block { width: 100%; }
    .mt-auto { margin-top: auto; }
    .loading-grid, .empty-state { text-align: center; padding: 4rem 2rem; }
    .empty-icon { font-size: 3rem; color: var(--accent-gold); margin-bottom: 1rem; }
    @media (max-width: 900px) {
      .comparator-hero { grid-template-columns: 1fr; }
      .comp-stores-row { grid-template-columns: repeat(2, 1fr); }
    }
  `]
})
export class ShoppingHubComponent implements OnInit {
  searchQuery = 'Oxford';
  selectedCategory = 'All';
  selectedPlatform = '';
  categories = ['All', 'Top', 'Bottom', 'Footwear', 'Accessories'];
  platforms = ['Amazon', 'Flipkart', 'Myntra', 'Ajio'] as const;

  products: ShoppingProduct[] = [];
  featuredComparison: ProductComparisonResult | null = null;
  isLoading = false;

  constructor(private shoppingService: ShoppingService) {}

  ngOnInit(): void {
    this.onSearch();
    this.loadFeaturedComparison();
  }

  setCategory(cat: string): void {
    this.selectedCategory = cat;
    this.onSearch();
  }

  onSearch(): void {
    this.isLoading = true;
    const cat = this.selectedCategory === 'All' ? undefined : this.selectedCategory;
    const platform = this.selectedPlatform || undefined;

    this.shoppingService.searchProducts(this.searchQuery, cat, platform).subscribe({
      next: (res: ShoppingProduct[]) => {
        this.products = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  loadFeaturedComparison(): void {
    this.shoppingService.comparePrices('Light Blue Classic Oxford Cotton Shirt', 'Top').subscribe((res: ProductComparisonResult | null) => {
      this.featuredComparison = res;
    });
  }

  isWinner(platform: string): boolean {
    return this.featuredComparison?.lowestVerifiedPrice?.platform === platform;
  }
}
