import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer-container">
      <div class="container footer-content">
        <div class="footer-brand">
          <div class="brand-title">
            <i class="fa-solid fa-wand-magic-sparkles text-rose"></i> NextFit AI
          </div>
          <p class="brand-desc">
            Personal AI Fashion Stylist offering computer-vision skin tone and silhouette analysis,
            event outfit coordination, and verified multi-store price comparisons.
          </p>
          <div class="platforms-banner">
            <span>Verified Feeds:</span>
            <span class="platform-tag">Amazon</span>
            <span class="platform-tag">Flipkart</span>
            <span class="platform-tag">Myntra</span>
            <span class="platform-tag">Ajio</span>
          </div>
        </div>

        <div class="footer-nav">
          <div class="nav-column">
            <h4>Features</h4>
            <a routerLink="/analysis">AI Visual Analysis</a>
            <a routerLink="/recommendations">Occasion Outfits</a>
            <a routerLink="/shopping">Price Comparator</a>
            <a routerLink="/calendar">Outfit Calendar</a>
          </div>

          <div class="nav-column">
            <h4>AI Stylist</h4>
            <a routerLink="/assistant">Chat Stylist</a>
            <a routerLink="/favorites">Saved Looks</a>
            <a routerLink="/profile">Style Profile</a>
            <a routerLink="/settings">Push Notifications</a>
          </div>

          <div class="nav-column">
            <h4>Legal & Safety</h4>
            <span class="disclaimer-note">
              AI analysis provides approximate stylistic suggestions and is not a medical or scientifically definitive conclusion.
              Prices verified from authorized feeds.
            </span>
          </div>
        </div>
      </div>

      <div class="container footer-bottom">
        <p>© 2026 NextFit AI. All rights reserved. Crafted with precision for fashion enthusiasts.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer-container {
      background: #06080C;
      border-top: 1px solid var(--border-subtle);
      padding: 4rem 0 2rem;
      margin-top: 5rem;
    }
    .footer-content {
      display: grid;
      grid-template-columns: 1.5fr 2fr;
      gap: 3rem;
      margin-bottom: 3rem;
    }
    .brand-title {
      font-family: var(--font-heading);
      font-size: 1.4rem;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .text-rose { color: var(--accent-rose); }
    .brand-desc {
      font-size: 0.88rem;
      line-height: 1.6;
      color: var(--text-secondary);
      margin-bottom: 1.25rem;
    }
    .platforms-banner {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .platform-tag {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      padding: 0.2rem 0.6rem;
      border-radius: 6px;
      color: #FFFFFF;
      font-weight: 600;
      font-size: 0.75rem;
    }
    .footer-nav {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }
    .nav-column h4 {
      font-size: 0.95rem;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 1rem;
    }
    .nav-column a {
      display: block;
      font-size: 0.85rem;
      color: var(--text-secondary);
      margin-bottom: 0.6rem;
    }
    .nav-column a:hover {
      color: var(--accent-rose);
      transform: translateX(2px);
    }
    .disclaimer-note {
      font-size: 0.78rem;
      line-height: 1.5;
      color: var(--text-muted);
      display: block;
    }
    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 1.5rem;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    @media (max-width: 850px) {
      .footer-content {
        grid-template-columns: 1fr;
      }
      .footer-nav {
        grid-template-columns: 1fr 1fr;
      }
    }
  `]
})
export class FooterComponent {}
