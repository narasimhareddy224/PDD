import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RecommendationService } from '../../../core/services/recommendation.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { Outfit } from '../../../core/models/outfit.model';
import { PriceCompareModalComponent } from '../../../shared/components/price-compare-modal/price-compare-modal.component';

@Component({
  selector: 'app-outfit-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PriceCompareModalComponent],
  template: `
    <div class="container outfit-detail-page" *ngIf="outfit">
      <!-- Breadcrumb & Back Action -->
      <div class="detail-nav">
        <a routerLink="/recommendations" class="back-link">
          <i class="fa-solid fa-arrow-left"></i> Back to Outfits
        </a>
        <div class="meta-tags">
          <span class="badge badge-rose">{{ outfit.occasion }}</span>
          <span class="badge badge-violet">{{ outfit.style }}</span>
        </div>
      </div>

      <!-- Main Showcase Grid -->
      <div class="detail-grid">
        <!-- Left: Image Showcase -->
        <div class="image-showcase glass-card">
          <img [src]="outfit.image" [alt]="outfit.title" class="main-image" />
          <div class="match-score-pill">
            <i class="fa-solid fa-sparkles"></i> {{ outfit.matchScore }}% Stylist Score
          </div>
          <div class="image-disclaimer">
            <i class="fa-solid fa-camera-rotate"></i> High-fidelity styling representation
          </div>
        </div>

        <!-- Right: Outfit Rationale & Component Deep Dive -->
        <div class="detail-content">
          <h1 class="outfit-title">{{ outfit.title }}</h1>
          <p class="outfit-desc">{{ outfit.description }}</p>

          <!-- Why this outfit suits you -->
          <div class="rationale-card glass-card">
            <h4 class="rationale-title">
              <i class="fa-solid fa-circle-check text-emerald"></i> Why this outfit suits your profile
            </h4>
            <p class="rationale-text">{{ outfit.reason }}</p>

            <div class="compatibility-pills">
              <div class="comp-item">
                <span class="comp-title">Skin Complexion</span>
                <span class="comp-val">Harmonizes with {{ outfit.skinToneSuitability.join(', ') }} tones</span>
              </div>
              <div class="comp-item">
                <span class="comp-title">Silhouette Geometry</span>
                <span class="comp-val">Flattering for {{ outfit.bodyTypeSuitability.join(', ') }} builds</span>
              </div>
            </div>
          </div>

          <!-- Components Breakdown Grid -->
          <div class="components-breakdown">
            <h3 class="breakdown-heading">Ensemble Breakdown</h3>

            <div class="components-list">
              <!-- Top -->
              <div class="component-card glass-card">
                <div class="comp-icon"><i class="fa-solid fa-shirt"></i></div>
                <div class="comp-info">
                  <span class="comp-type">Top</span>
                  <h4 class="comp-name">{{ outfit.top.name }}</h4>
                  <span class="comp-meta">Color: {{ outfit.top.color }} • {{ outfit.top.material }}</span>
                </div>
              </div>

              <!-- Bottom -->
              <div class="component-card glass-card">
                <div class="comp-icon"><i class="fa-solid fa-person"></i></div>
                <div class="comp-info">
                  <span class="comp-type">Bottom</span>
                  <h4 class="comp-name">{{ outfit.bottom.name }}</h4>
                  <span class="comp-meta">Color: {{ outfit.bottom.color }} • {{ outfit.bottom.material }}</span>
                </div>
              </div>

              <!-- Footwear -->
              <div class="component-card glass-card">
                <div class="comp-icon"><i class="fa-solid fa-shoe-prints"></i></div>
                <div class="comp-info">
                  <span class="comp-type">Footwear</span>
                  <h4 class="comp-name">{{ outfit.footwear.name }}</h4>
                  <span class="comp-meta">Color: {{ outfit.footwear.color }} • {{ outfit.footwear.material }}</span>
                </div>
              </div>

              <!-- Accessories -->
              <div class="component-card glass-card">
                <div class="comp-icon"><i class="fa-solid fa-clock"></i></div>
                <div class="comp-info">
                  <span class="comp-type">Accessories</span>
                  <h4 class="comp-name">{{ outfit.accessories.name }}</h4>
                  <span class="comp-meta">Color: {{ outfit.accessories.color }} • {{ outfit.accessories.material }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Price & Action Bar -->
          <div class="action-footer glass-card">
            <div class="price-box">
              <span class="price-label">Estimated Total Ensemble</span>
              <span class="total-price">₹{{ outfit.estimatedTotalPrice | number }}</span>
            </div>

            <div class="action-buttons">
              <button class="btn btn-secondary" (click)="toggleFavorite()">
                <i class="fa-solid fa-heart" [class.text-rose]="isFavorited"></i>
                {{ isFavorited ? 'Saved' : 'Favorite' }}
              </button>

              <a [routerLink]="['/calendar']" [queryParams]="{ outfitId: outfit.outfitId || outfit._id }" class="btn btn-secondary">
                <i class="fa-solid fa-calendar-plus"></i> Schedule
              </a>

              <button class="btn btn-primary" (click)="isCompareOpen = true">
                <i class="fa-solid fa-tags"></i> Compare Live Store Prices
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Price Compare Modal -->
      <app-price-compare-modal
        *ngIf="isCompareOpen"
        [outfit]="outfit"
        (onClose)="isCompareOpen = false"
      ></app-price-compare-modal>
    </div>
  `,
  styles: [`
    .outfit-detail-page { padding: 2.5rem 0 5rem; }
    .detail-nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }
    .back-link {
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .back-link:hover { color: var(--accent-rose); transform: translateX(-2px); }
    .meta-tags { display: flex; gap: 0.5rem; }
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1.35fr;
      gap: 3rem;
    }
    .image-showcase {
      position: relative;
      border-radius: 1.5rem;
      overflow: hidden;
      height: 580px;
      background: #0E121B;
    }
    .main-image { width: 100%; height: 100%; object-fit: cover; }
    .match-score-pill {
      position: absolute;
      top: 20px;
      left: 20px;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.9);
      backdrop-filter: blur(12px);
      color: #FFFFFF;
      font-weight: 700;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
    }
    .image-disclaimer {
      position: absolute;
      bottom: 16px;
      left: 16px;
      right: 16px;
      padding: 0.4rem 0.85rem;
      border-radius: 8px;
      background: rgba(9, 11, 16, 0.75);
      backdrop-filter: blur(8px);
      font-size: 0.72rem;
      color: var(--text-muted);
      text-align: center;
    }
    .detail-content { display: flex; flex-direction: column; gap: 1.5rem; }
    .outfit-title { font-size: 2.2rem; font-weight: 800; color: #FFFFFF; }
    .outfit-desc { font-size: 1rem; color: var(--text-secondary); line-height: 1.6; }
    .rationale-card { padding: 1.5rem; }
    .rationale-title {
      font-size: 1rem;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .rationale-text { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem; }
    .compatibility-pills { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .comp-item {
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
    }
    .comp-title { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block; margin-bottom: 0.2rem; }
    .comp-val { font-size: 0.82rem; color: #FFFFFF; font-weight: 600; }
    .breakdown-heading { font-size: 1.25rem; font-weight: 700; color: #FFFFFF; margin-bottom: 1rem; }
    .components-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .component-card {
      padding: 1rem 1.25rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .comp-icon {
      width: 42px;
      height: 42px;
      border-radius: 10px;
      background: rgba(244, 63, 94, 0.15);
      color: var(--accent-rose);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.15rem;
    }
    .comp-info { flex: 1; }
    .comp-type { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
    .comp-name { font-size: 0.98rem; font-weight: 700; color: #FFFFFF; margin: 0.1rem 0; }
    .comp-meta { font-size: 0.8rem; color: var(--text-secondary); }
    .action-footer {
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
      flex-wrap: wrap;
    }
    .price-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block; }
    .total-price { font-size: 1.75rem; font-weight: 800; color: var(--accent-gold); }
    .action-buttons { display: flex; gap: 0.75rem; flex-wrap: wrap; }
    .text-rose { color: var(--accent-rose); }
    .text-emerald { color: var(--accent-emerald); }
    @media (max-width: 900px) {
      .detail-grid { grid-template-columns: 1fr; }
      .image-showcase { height: 380px; }
      .action-footer { flex-direction: column; align-items: flex-start; }
    }
  `]
})
export class OutfitDetailComponent implements OnInit {
  outfit: Outfit | null = null;
  isFavorited = false;
  isCompareOpen = false;

  constructor(
    private route: ActivatedRoute,
    private recService: RecommendationService,
    private favoriteService: FavoriteService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.recService.getRecommendationById(id).subscribe((res: Outfit | null) => {
        this.outfit = res;
      });
    }
  }

  toggleFavorite(): void {
    if (!this.outfit) return;
    const outfitId = this.outfit.outfitId || this.outfit._id!;
    if (this.isFavorited) {
      this.favoriteService.removeFavorite(outfitId).subscribe(() => {
        this.isFavorited = false;
      });
    } else {
      this.favoriteService.addFavorite(outfitId).subscribe(() => {
        this.isFavorited = true;
      });
    }
  }
}
