import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Outfit } from '../../../core/models/outfit.model';
import { FavoriteService } from '../../../core/services/favorite.service';

@Component({
  selector: 'app-outfit-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="outfit-card glass-card">
      <div class="card-image-wrap">
        <img [src]="outfit.image" [alt]="outfit.title" class="outfit-image" loading="lazy" />
        
        <div class="score-badge" [ngClass]="getScoreClass(outfit.matchScore)">
          <i class="fa-solid fa-sparkles"></i>
          <span>{{ outfit.matchScore }}% Match</span>
        </div>

        <button
          class="favorite-btn"
          [class.favorited]="isFavorited"
          (click)="toggleFavorite($event)"
          title="Save Outfit"
        >
          <i class="fa-solid fa-heart"></i>
        </button>

        <div class="occasion-tag">
          {{ outfit.occasion }}
        </div>
      </div>

      <div class="card-body">
        <div class="card-meta">
          <span class="style-badge">{{ outfit.style }}</span>
          <span class="price-tag">Est. ₹{{ outfit.estimatedTotalPrice | number }}</span>
        </div>

        <h3 class="outfit-title">{{ outfit.title }}</h3>
        <p class="outfit-reason">{{ outfit.reason }}</p>

        <!-- Components Mini Breakdown -->
        <div class="components-preview">
          <div class="comp-chip" title="Top: {{ outfit.top.name }}">
            <i class="fa-solid fa-shirt"></i> {{ outfit.top.name }}
          </div>
          <div class="comp-chip" title="Bottom: {{ outfit.bottom.name }}">
            <i class="fa-solid fa-person"></i> {{ outfit.bottom.name }}
          </div>
        </div>

        <div class="card-actions">
          <a [routerLink]="['/outfits', outfit.outfitId || outfit._id]" class="btn btn-secondary btn-sm flex-1">
            View Details
          </a>
          <button class="btn btn-primary btn-sm flex-1" (click)="onCompare.emit(outfit)">
            <i class="fa-solid fa-tags"></i> Compare Prices
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .outfit-card {
      display: flex;
      flex-direction: column;
      height: 100%;
      border-radius: 1.25rem;
      overflow: hidden;
      background: var(--bg-glass-card);
      border: 1px solid var(--border-subtle);
    }
    .card-image-wrap {
      position: relative;
      width: 100%;
      height: 280px;
      overflow: hidden;
      background: #0E121B;
    }
    .outfit-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .outfit-card:hover .outfit-image {
      transform: scale(1.04);
    }
    .score-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.78rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      backdrop-filter: blur(12px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    }
    .score-high {
      background: rgba(16, 185, 129, 0.25);
      color: #6EE7B7;
      border: 1px solid rgba(16, 185, 129, 0.5);
    }
    .score-mid {
      background: rgba(245, 158, 11, 0.25);
      color: #FDE68A;
      border: 1px solid rgba(245, 158, 11, 0.5);
    }
    .favorite-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(9, 11, 16, 0.7);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: var(--transition-fast);
    }
    .favorite-btn:hover, .favorite-btn.favorited {
      background: rgba(244, 63, 94, 0.85);
      color: #FFFFFF;
      border-color: var(--accent-rose);
      transform: scale(1.1);
    }
    .occasion-tag {
      position: absolute;
      bottom: 12px;
      left: 12px;
      padding: 0.25rem 0.7rem;
      border-radius: 8px;
      background: rgba(9, 11, 16, 0.8);
      backdrop-filter: blur(10px);
      color: #FFFFFF;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .card-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 0.75rem;
    }
    .card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .style-badge {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--accent-rose);
    }
    .price-tag {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--accent-gold);
    }
    .outfit-title {
      font-size: 1.15rem;
      font-weight: 700;
      color: #FFFFFF;
      line-height: 1.3;
    }
    .outfit-reason {
      font-size: 0.83rem;
      color: var(--text-secondary);
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .components-preview {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-top: auto;
      padding-top: 0.5rem;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
    }
    .comp-chip {
      font-size: 0.78rem;
      color: var(--text-muted);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .card-actions {
      display: flex;
      gap: 0.6rem;
      margin-top: 0.5rem;
    }
    .flex-1 { flex: 1; }
  `]
})
export class OutfitCardComponent {
  @Input() outfit!: Outfit;
  @Input() isFavorited = false;
  @Output() onCompare = new EventEmitter<Outfit>();

  constructor(private favoriteService: FavoriteService) {}

  getScoreClass(score: number): string {
    return score >= 90 ? 'score-high' : 'score-mid';
  }

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.isFavorited) {
      this.favoriteService.removeFavorite(this.outfit.outfitId || this.outfit._id!).subscribe(() => {
        this.isFavorited = false;
      });
    } else {
      this.favoriteService.addFavorite(this.outfit.outfitId || this.outfit._id!).subscribe(() => {
        this.isFavorited = true;
      });
    }
  }
}
