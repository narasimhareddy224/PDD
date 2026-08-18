import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FavoriteService } from '../../core/services/favorite.service';
import { FavoriteOutfit, Outfit } from '../../core/models/outfit.model';
import { OutfitCardComponent } from '../../shared/components/outfit-card/outfit-card.component';
import { PriceCompareModalComponent } from '../../shared/components/price-compare-modal/price-compare-modal.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, OutfitCardComponent, PriceCompareModalComponent],
  template: `
    <div class="container favorites-page">
      <div class="page-header">
        <div>
          <div class="badge badge-rose"><i class="fa-solid fa-heart"></i> Saved Collections</div>
          <h1 class="page-title">My Favorite Outfits</h1>
          <p class="page-sub">Your personal curated closet of bookmarked looks and style inspiration</p>
        </div>
      </div>

      <div *ngIf="isLoading" class="loading-grid">
        <div class="spinner"></div>
        <p>Loading your saved looks...</p>
      </div>

      <div *ngIf="!isLoading && favorites.length === 0" class="empty-state glass-card">
        <i class="fa-solid fa-heart-crack empty-icon"></i>
        <h3>No Saved Outfits Yet</h3>
        <p>Browse personalized recommendations and tap the heart icon to save looks to your wardrobe.</p>
        <a routerLink="/recommendations" class="btn btn-primary mt-3">Discover Outfits</a>
      </div>

      <div *ngIf="!isLoading && favorites.length > 0" class="grid grid-cols-3">
        <app-outfit-card
          *ngFor="let fav of favorites"
          [outfit]="fav.outfit"
          [isFavorited]="true"
          (onCompare)="selectedCompareOutfit = $event"
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
    .favorites-page { padding: 3rem 0 5rem; }
    .page-header { margin-bottom: 2.5rem; }
    .page-title { font-size: 2.2rem; color: #FFFFFF; }
    .page-sub { font-size: 0.92rem; color: var(--text-secondary); }
    .loading-grid, .empty-state { text-align: center; padding: 4rem 2rem; }
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
export class FavoritesComponent implements OnInit {
  favorites: FavoriteOutfit[] = [];
  isLoading = false;
  selectedCompareOutfit: Outfit | null = null;

  constructor(private favoriteService: FavoriteService) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.favoriteService.getFavorites().subscribe({
      next: (res: FavoriteOutfit[]) => {
        this.favorites = res;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
