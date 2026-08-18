import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Outfit } from '../../../core/models/outfit.model';
import { ShoppingService } from '../../../core/services/shopping.service';
import { ProductComparisonResult } from '../../../core/models/shopping.model';

@Component({
  selector: 'app-price-compare-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="close()">
      <div class="modal-card glass-card" (click)="$event.stopPropagation()">
        <!-- Header -->
        <div class="modal-header">
          <div class="header-left">
            <div class="header-icon">
              <i class="fa-solid fa-tags"></i>
            </div>
            <div>
              <h3 class="modal-title">Live Shopping Price Comparison</h3>
              <p class="modal-subtitle">Real-time verified pricing across connected authorized stores</p>
            </div>
          </div>
          <button class="btn-close" (click)="close()">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Selected Component Selector Tabs -->
        <div class="component-tabs" *ngIf="outfit">
          <button
            class="tab-btn"
            [class.active]="selectedTab === 'top'"
            (click)="selectTab('top', outfit.top.name, 'Top')"
          >
            <i class="fa-solid fa-shirt"></i> Top
          </button>
          <button
            class="tab-btn"
            [class.active]="selectedTab === 'bottom'"
            (click)="selectTab('bottom', outfit.bottom.name, 'Bottom')"
          >
            <i class="fa-solid fa-person"></i> Bottom
          </button>
          <button
            class="tab-btn"
            [class.active]="selectedTab === 'footwear'"
            (click)="selectTab('footwear', outfit.footwear.name, 'Footwear')"
          >
            <i class="fa-solid fa-shoe-prints"></i> Footwear
          </button>
          <button
            class="tab-btn"
            [class.active]="selectedTab === 'accessories'"
            (click)="selectTab('accessories', outfit.accessories.name, 'Accessories')"
          >
            <i class="fa-solid fa-clock"></i> Accessories
          </button>
        </div>

        <!-- Content Area -->
        <div class="modal-body">
          <div *ngIf="isLoading" class="loading-state">
            <div class="spinner"></div>
            <p>Fetching authorized live store feeds...</p>
          </div>

          <div *ngIf="!isLoading && comparison" class="comparison-content">
            <!-- Active Item Banner -->
            <div class="item-summary-card">
              <div>
                <span class="category-chip">{{ comparison.category }}</span>
                <h4 class="comparison-item-name">{{ comparison.productTitle }}</h4>
                <p class="color-match"><i class="fa-solid fa-palette"></i> Matched Color: {{ comparison.targetColor }}</p>
              </div>

              <div class="best-price-badge-box" *ngIf="comparison.lowestVerifiedPrice">
                <div class="badge badge-emerald">
                  <i class="fa-solid fa-trophy"></i> Best Verified Price
                </div>
                <div class="lowest-price-val">₹{{ comparison.lowestVerifiedPrice.price | number }}</div>
                <div class="lowest-platform">on {{ comparison.lowestVerifiedPrice.platform }}</div>
              </div>
            </div>

            <!-- Multi-Platform Store Grid -->
            <div class="store-grid">
              <!-- Amazon -->
              <div class="store-card" [class.best-store]="isBestPlatform('Amazon')">
                <div class="store-head">
                  <span class="store-name amazon"><i class="fa-brands fa-amazon"></i> Amazon</span>
                  <span class="status-indicator" [class.available]="comparison.platformPrices.Amazon.available">
                    {{ comparison.platformPrices.Amazon.available ? 'In Stock' : 'Unavailable' }}
                  </span>
                </div>
                <div class="store-details" *ngIf="comparison.platformPrices.Amazon.available; else amazonUnavailable">
                  <div class="price-row">
                    <span class="curr-price">₹{{ comparison.platformPrices.Amazon.price | number }}</span>
                    <span class="orig-price" *ngIf="comparison.platformPrices.Amazon.originalPrice">₹{{ comparison.platformPrices.Amazon.originalPrice | number }}</span>
                  </div>
                  <p class="product-snippet">{{ comparison.platformPrices.Amazon.productName }}</p>
                  <a [href]="comparison.platformPrices.Amazon.productUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm btn-buy">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Buy on Amazon
                  </a>
                </div>
                <ng-template #amazonUnavailable>
                  <p class="unavailable-msg">{{ comparison.platformPrices.Amazon.statusMessage }}</p>
                </ng-template>
              </div>

              <!-- Flipkart -->
              <div class="store-card" [class.best-store]="isBestPlatform('Flipkart')">
                <div class="store-head">
                  <span class="store-name flipkart"><i class="fa-solid fa-bolt"></i> Flipkart</span>
                  <span class="status-indicator" [class.available]="comparison.platformPrices.Flipkart.available">
                    {{ comparison.platformPrices.Flipkart.available ? 'In Stock' : 'Unavailable' }}
                  </span>
                </div>
                <div class="store-details" *ngIf="comparison.platformPrices.Flipkart.available; else flipkartUnavailable">
                  <div class="price-row">
                    <span class="curr-price">₹{{ comparison.platformPrices.Flipkart.price | number }}</span>
                    <span class="orig-price" *ngIf="comparison.platformPrices.Flipkart.originalPrice">₹{{ comparison.platformPrices.Flipkart.originalPrice | number }}</span>
                  </div>
                  <p class="product-snippet">{{ comparison.platformPrices.Flipkart.productName }}</p>
                  <a [href]="comparison.platformPrices.Flipkart.productUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm btn-buy">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Buy on Flipkart
                  </a>
                </div>
                <ng-template #flipkartUnavailable>
                  <p class="unavailable-msg">{{ comparison.platformPrices.Flipkart.statusMessage }}</p>
                </ng-template>
              </div>

              <!-- Myntra -->
              <div class="store-card" [class.best-store]="isBestPlatform('Myntra')">
                <div class="store-head">
                  <span class="store-name myntra"><i class="fa-solid fa-bag-shopping"></i> Myntra</span>
                  <span class="status-indicator" [class.available]="comparison.platformPrices.Myntra.available">
                    {{ comparison.platformPrices.Myntra.available ? 'In Stock' : 'Unavailable' }}
                  </span>
                </div>
                <div class="store-details" *ngIf="comparison.platformPrices.Myntra.available; else myntraUnavailable">
                  <div class="price-row">
                    <span class="curr-price">₹{{ comparison.platformPrices.Myntra.price | number }}</span>
                    <span class="orig-price" *ngIf="comparison.platformPrices.Myntra.originalPrice">₹{{ comparison.platformPrices.Myntra.originalPrice | number }}</span>
                  </div>
                  <p class="product-snippet">{{ comparison.platformPrices.Myntra.productName }}</p>
                  <a [href]="comparison.platformPrices.Myntra.productUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm btn-buy">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Buy on Myntra
                  </a>
                </div>
                <ng-template #myntraUnavailable>
                  <p class="unavailable-msg">{{ comparison.platformPrices.Myntra.statusMessage }}</p>
                </ng-template>
              </div>

              <!-- Ajio -->
              <div class="store-card" [class.best-store]="isBestPlatform('Ajio')">
                <div class="store-head">
                  <span class="store-name ajio"><i class="fa-solid fa-gem"></i> Ajio</span>
                  <span class="status-indicator" [class.available]="comparison.platformPrices.Ajio.available">
                    {{ comparison.platformPrices.Ajio.available ? 'In Stock' : 'Unavailable' }}
                  </span>
                </div>
                <div class="store-details" *ngIf="comparison.platformPrices.Ajio.available; else ajioUnavailable">
                  <div class="price-row">
                    <span class="curr-price">₹{{ comparison.platformPrices.Ajio.price | number }}</span>
                    <span class="orig-price" *ngIf="comparison.platformPrices.Ajio.originalPrice">₹{{ comparison.platformPrices.Ajio.originalPrice | number }}</span>
                  </div>
                  <p class="product-snippet">{{ comparison.platformPrices.Ajio.productName }}</p>
                  <a [href]="comparison.platformPrices.Ajio.productUrl" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm btn-buy">
                    <i class="fa-solid fa-arrow-up-right-from-square"></i> Buy on Ajio
                  </a>
                </div>
                <ng-template #ajioUnavailable>
                  <p class="unavailable-msg">{{ comparison.platformPrices.Ajio.statusMessage }}</p>
                </ng-template>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <span class="legal-tag">
            <i class="fa-solid fa-shield-halved"></i> Only genuine verified merchant feeds. No simulated prices.
          </span>
          <button class="btn btn-secondary btn-sm" (click)="close()">Close</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
      background: rgba(4, 6, 10, 0.85);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      animation: fadeIn 0.2s ease-out;
    }
    .modal-card {
      width: 100%;
      max-width: 860px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      background: var(--bg-surface);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 1.5rem;
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8);
      overflow: hidden;
    }
    .modal-header {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
    }
    .header-left { display: flex; align-items: center; gap: 1rem; }
    .header-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(244, 63, 94, 0.15);
      color: var(--accent-rose);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
    }
    .modal-title { font-size: 1.3rem; font-weight: 700; color: #FFFFFF; }
    .modal-subtitle { font-size: 0.82rem; color: var(--text-secondary); }
    .btn-close {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .btn-close:hover { color: #FFFFFF; background: rgba(244, 63, 94, 0.2); }
    .component-tabs {
      display: flex;
      padding: 0.75rem 1.5rem;
      background: rgba(0, 0, 0, 0.2);
      gap: 0.5rem;
      overflow-x: auto;
      border-bottom: 1px solid var(--border-subtle);
    }
    .tab-btn {
      padding: 0.5rem 1rem;
      border-radius: 0.75rem;
      background: transparent;
      border: 1px solid transparent;
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
      white-space: nowrap;
      transition: var(--transition-fast);
    }
    .tab-btn.active {
      background: var(--bg-surface-elevated);
      color: var(--accent-rose);
      border-color: rgba(244, 63, 94, 0.3);
    }
    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }
    .loading-state {
      padding: 3rem;
      text-align: center;
      color: var(--text-secondary);
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: var(--accent-rose);
      border-radius: 50%;
      margin: 0 auto 1rem;
      animation: spin 1s linear infinite;
    }
    .item-summary-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem;
      border-radius: 1rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      margin-bottom: 1.5rem;
    }
    .category-chip {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--accent-rose);
    }
    .comparison-item-name { font-size: 1.15rem; color: #FFFFFF; font-weight: 700; }
    .color-match { font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.2rem; }
    .best-price-badge-box {
      text-align: right;
    }
    .lowest-price-val {
      font-size: 1.75rem;
      font-weight: 800;
      color: #6EE7B7;
      line-height: 1.2;
    }
    .lowest-platform {
      font-size: 0.78rem;
      color: var(--text-muted);
    }
    .store-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
    .store-card {
      background: rgba(18, 22, 32, 0.7);
      border: 1px solid var(--border-subtle);
      border-radius: 1rem;
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: var(--transition-fast);
    }
    .store-card.best-store {
      border-color: rgba(16, 185, 129, 0.6);
      background: rgba(16, 185, 129, 0.06);
    }
    .store-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .store-name {
      font-weight: 700;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .store-name.amazon { color: #FF9900; }
    .store-name.flipkart { color: #2874F0; }
    .store-name.myntra { color: #FF3F6C; }
    .store-name.ajio { color: #2C4152; }
    .status-indicator {
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.15rem 0.5rem;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-muted);
    }
    .status-indicator.available {
      background: rgba(16, 185, 129, 0.15);
      color: #6EE7B7;
    }
    .price-row {
      display: flex;
      align-items: baseline;
      gap: 0.5rem;
    }
    .curr-price { font-size: 1.35rem; font-weight: 800; color: #FFFFFF; }
    .orig-price { font-size: 0.85rem; color: var(--text-muted); text-decoration: line-through; }
    .product-snippet { font-size: 0.82rem; color: var(--text-secondary); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .unavailable-msg { font-size: 0.85rem; color: var(--text-muted); font-style: italic; }
    .btn-buy { width: 100%; margin-top: auto; }
    .modal-footer {
      padding: 1rem 1.5rem;
      background: rgba(0, 0, 0, 0.2);
      border-top: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .legal-tag { font-size: 0.78rem; color: var(--text-muted); }
    @media (max-width: 640px) {
      .store-grid { grid-template-columns: 1fr; }
      .item-summary-card { flex-direction: column; align-items: flex-start; gap: 1rem; }
      .best-price-badge-box { text-align: left; }
    }
  `]
})
export class PriceCompareModalComponent implements OnInit {
  @Input() outfit: Outfit | null = null;
  @Output() onClose = new EventEmitter<void>();

  selectedTab: 'top' | 'bottom' | 'footwear' | 'accessories' = 'top';
  comparison: ProductComparisonResult | null = null;
  isLoading = false;

  constructor(private shoppingService: ShoppingService) {}

  ngOnInit(): void {
    if (this.outfit) {
      this.selectTab('top', this.outfit.top.name, 'Top');
    }
  }

  selectTab(tab: 'top' | 'bottom' | 'footwear' | 'accessories', query: string, category: string): void {
    this.selectedTab = tab;
    this.isLoading = true;
    this.shoppingService.comparePrices(query, category).subscribe({
      next: (res: ProductComparisonResult | null) => {
        this.comparison = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  isBestPlatform(platformName: string): boolean {
    return this.comparison?.lowestVerifiedPrice?.platform === platformName;
  }

  close(): void {
    this.onClose.emit();
  }
}
