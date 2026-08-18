import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { RecommendationService } from '../../core/services/recommendation.service';
import { CalendarService } from '../../core/services/calendar.service';
import { WeatherService, WeatherInfo } from '../../core/services/weather.service';
import { AnalysisService } from '../../core/services/analysis.service';
import { Outfit } from '../../core/models/outfit.model';
import { ScheduleEvent } from '../../core/models/schedule.model';
import { UserAnalysis } from '../../core/models/analysis.model';
import { OutfitCardComponent } from '../../shared/components/outfit-card/outfit-card.component';
import { PriceCompareModalComponent } from '../../shared/components/price-compare-modal/price-compare-modal.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, OutfitCardComponent, PriceCompareModalComponent],
  template: `
    <div class="dashboard-page">
      <!-- Hero Welcome Banner -->
      <section class="hero-section">
        <div class="container hero-container">
          <div class="hero-text-content">
            <div class="greeting-badge">
              <i class="fa-solid fa-sparkles text-gold"></i>
              <span>NextFit Fashion Intelligence</span>
            </div>
            <h1 class="hero-title">
              Hello, <span class="gradient-text">{{ userName }}</span>
            </h1>
            <p class="hero-subtitle">
              Your AI personal stylist has analyzed your style profile and curated today's top personalized fashion lineup.
            </p>

            <div class="hero-cta-group">
              <a routerLink="/analysis" class="btn btn-primary">
                <i class="fa-solid fa-camera"></i> Analyze New Photo
              </a>
              <a routerLink="/assistant" class="btn btn-secondary">
                <i class="fa-solid fa-robot text-violet"></i> Ask AI Stylist
              </a>
            </div>
          </div>

          <!-- Weather & Climate Card -->
          <div class="weather-card glass-card" *ngIf="weather">
            <div class="weather-header">
              <div class="weather-temp-box">
                <span class="weather-temp">{{ weather.temperature }}°C</span>
                <span class="weather-condition">{{ weather.condition }}</span>
              </div>
              <div class="weather-icon-box">
                <i class="fa-solid fa-cloud-sun text-gold"></i>
              </div>
            </div>
            <div class="weather-city"><i class="fa-solid fa-location-dot"></i> {{ weather.city }}</div>
            <p class="weather-advice">{{ weather.stylingAdvice }}</p>
            <div class="fabric-tags">
              <span *ngFor="let fabric of weather.recommendedFabrics" class="badge badge-rose">
                {{ fabric }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Analysis Status Banner (if no analysis done yet) -->
      <section class="container" *ngIf="!analysis">
        <div class="analysis-prompt-card glass-card animate-pulse-glow">
          <div class="prompt-icon">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <div class="prompt-text">
            <h3>Unlock Deep Silhouette & Skin-Tone Tailoring</h3>
            <p>Upload a full-length photo to let NextFit AI detect your precise skin undertones, silhouette lines, and custom color harmonies.</p>
          </div>
          <a routerLink="/analysis" class="btn btn-primary btn-sm">Scan Now</a>
        </div>
      </section>

      <!-- Today's Top Recommendation Highlight -->
      <section class="container section-padding" *ngIf="todayPick">
        <div class="section-head">
          <div>
            <div class="badge badge-emerald"><i class="fa-solid fa-star"></i> Stylist Daily Pick</div>
            <h2 class="section-title">Today's Perfect Match</h2>
          </div>
          <a [routerLink]="['/outfits', todayPick.outfitId || todayPick._id]" class="link-more">
            View Breakdown <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>

        <div class="today-hero-grid glass-card">
          <div class="today-image-col">
            <img [src]="todayPick.image" [alt]="todayPick.title" class="today-hero-img" />
            <div class="match-indicator">
              <div class="match-num">{{ todayPick.matchScore }}%</div>
              <div class="match-lbl">Stylist Match</div>
            </div>
          </div>

          <div class="today-info-col">
            <div class="occasion-pill">{{ todayPick.occasion }} • {{ todayPick.style }}</div>
            <h3 class="today-title">{{ todayPick.title }}</h3>
            <p class="today-reason">{{ todayPick.reason }}</p>

            <div class="components-grid">
              <div class="comp-box">
                <span class="comp-lbl">Top</span>
                <span class="comp-val">{{ todayPick.top.name }}</span>
              </div>
              <div class="comp-box">
                <span class="comp-lbl">Bottom</span>
                <span class="comp-val">{{ todayPick.bottom.name }}</span>
              </div>
              <div class="comp-box">
                <span class="comp-lbl">Footwear</span>
                <span class="comp-val">{{ todayPick.footwear.name }}</span>
              </div>
              <div class="comp-box">
                <span class="comp-lbl">Accessories</span>
                <span class="comp-val">{{ todayPick.accessories.name }}</span>
              </div>
            </div>

            <div class="today-footer-actions">
              <button class="btn btn-primary" (click)="openCompare(todayPick)">
                <i class="fa-solid fa-tags"></i> Compare Best Prices
              </button>
              <a [routerLink]="['/calendar']" [queryParams]="{ outfitId: todayPick.outfitId || todayPick._id }" class="btn btn-secondary">
                <i class="fa-solid fa-calendar-plus"></i> Schedule for Event
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Trending Recommendations Grid -->
      <section class="container section-padding">
        <div class="section-head">
          <div>
            <h2 class="section-title">Personalized Occasion Outfits</h2>
            <p class="section-sub">Calibrated to your skin tone, preferred palette, and current weather</p>
          </div>
          <a routerLink="/recommendations" class="link-more">
            Browse All <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>

        <div class="grid grid-cols-3">
          <app-outfit-card
            *ngFor="let outfit of recommendations"
            [outfit]="outfit"
            (onCompare)="openCompare($event)"
          ></app-outfit-card>
        </div>
      </section>

      <!-- Upcoming Scheduled Outfits Glimpse -->
      <section class="container section-padding" *ngIf="upcomingSchedules.length > 0">
        <div class="section-head">
          <div>
            <h2 class="section-title">Upcoming Fashion Calendar</h2>
            <p class="section-sub">Outfits prepared for your scheduled events</p>
          </div>
          <a routerLink="/calendar" class="link-more">Open Calendar <i class="fa-solid fa-arrow-right"></i></a>
        </div>

        <div class="grid grid-cols-2">
          <div *ngFor="let event of upcomingSchedules" class="schedule-glimpse-card glass-card">
            <div class="event-date-box">
              <span class="date-month">{{ event.scheduleDate | date:'MMM' }}</span>
              <span class="date-day">{{ event.scheduleDate | date:'dd' }}</span>
            </div>
            <div class="event-details">
              <span class="event-occasion-tag">{{ event.occasion }}</span>
              <h4 class="event-outfit-title">{{ event.outfit.title }}</h4>
              <p class="event-time"><i class="fa-regular fa-clock"></i> {{ event.scheduleTime || '09:00 AM' }} ({{ event.reminderInterval }})</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Price Compare Modal -->
      <app-price-compare-modal
        *ngIf="selectedCompareOutfit"
        [outfit]="selectedCompareOutfit"
        (onClose)="selectedCompareOutfit = null"
      ></app-price-compare-modal>
    </div>
  `,
  styles: [`
    .dashboard-page {
      min-height: 100vh;
      padding-bottom: 4rem;
    }
    .hero-section {
      padding: 3.5rem 0 2.5rem;
      background: radial-gradient(circle at 80% 20%, rgba(244, 63, 94, 0.07) 0%, transparent 50%);
    }
    .hero-container {
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      align-items: center;
      gap: 3rem;
    }
    .greeting-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.25);
      color: #FDE68A;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 1rem;
    }
    .hero-title {
      font-size: 2.75rem;
      font-weight: 800;
      color: #FFFFFF;
      margin-bottom: 1rem;
      line-height: 1.15;
    }
    .gradient-text {
      background: linear-gradient(135deg, #FFFFFF, var(--accent-rose));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-subtitle {
      font-size: 1.05rem;
      color: var(--text-secondary);
      margin-bottom: 1.75rem;
      max-width: 540px;
    }
    .hero-cta-group {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .text-violet { color: #A78BFA; }
    .text-gold { color: #FBBF24; }
    .weather-card {
      padding: 1.75rem;
      border-radius: 1.25rem;
      background: rgba(24, 29, 43, 0.85);
      border: 1px solid var(--border-subtle);
    }
    .weather-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }
    .weather-temp {
      font-size: 2.25rem;
      font-weight: 800;
      color: #FFFFFF;
      display: block;
      line-height: 1;
    }
    .weather-condition {
      font-size: 0.88rem;
      color: var(--text-secondary);
      font-weight: 600;
    }
    .weather-icon-box {
      font-size: 2.25rem;
    }
    .weather-city {
      font-size: 0.85rem;
      color: var(--text-muted);
      margin-bottom: 0.85rem;
    }
    .weather-advice {
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin-bottom: 1rem;
    }
    .fabric-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .analysis-prompt-card {
      margin-top: 1.5rem;
      padding: 1.5rem 2rem;
      border-radius: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1.5rem;
      background: linear-gradient(135deg, rgba(244, 63, 94, 0.12), rgba(139, 92, 246, 0.12));
      border: 1px solid rgba(244, 63, 94, 0.3);
    }
    .prompt-icon {
      font-size: 2.25rem;
      color: var(--accent-rose);
    }
    .prompt-text h3 {
      font-size: 1.2rem;
      color: #FFFFFF;
      margin-bottom: 0.25rem;
    }
    .prompt-text p {
      font-size: 0.88rem;
      color: var(--text-secondary);
    }
    .section-padding {
      padding: 3.5rem 0 1rem;
    }
    .section-head {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 2rem;
    }
    .section-title {
      font-size: 1.85rem;
      color: #FFFFFF;
    }
    .section-sub {
      font-size: 0.88rem;
      color: var(--text-secondary);
      margin-top: 0.25rem;
    }
    .link-more {
      color: var(--accent-rose);
      font-weight: 700;
      font-size: 0.9rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }
    .link-more:hover {
      transform: translateX(3px);
    }
    .today-hero-grid {
      display: grid;
      grid-template-columns: 1fr 1.3fr;
      border-radius: 1.5rem;
      overflow: hidden;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
    }
    .today-image-col {
      position: relative;
      min-height: 380px;
      background: #0E121B;
    }
    .today-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .match-indicator {
      position: absolute;
      top: 20px;
      left: 20px;
      padding: 0.6rem 1rem;
      border-radius: 1rem;
      background: rgba(16, 185, 129, 0.9);
      backdrop-filter: blur(12px);
      text-align: center;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    }
    .match-num {
      font-size: 1.35rem;
      font-weight: 800;
      color: #FFFFFF;
      line-height: 1;
    }
    .match-lbl {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      color: #E6FFFA;
      letter-spacing: 0.05em;
    }
    .today-info-col {
      padding: 2.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 1rem;
    }
    .occasion-pill {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--accent-rose);
    }
    .today-title {
      font-size: 1.75rem;
      color: #FFFFFF;
      font-weight: 800;
    }
    .today-reason {
      font-size: 0.92rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }
    .components-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
      margin: 0.5rem 0 1rem;
    }
    .comp-box {
      padding: 0.75rem 1rem;
      border-radius: 0.85rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
    }
    .comp-lbl {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      color: var(--text-muted);
      display: block;
      margin-bottom: 0.2rem;
    }
    .comp-val {
      font-size: 0.85rem;
      font-weight: 600;
      color: #FFFFFF;
    }
    .today-footer-actions {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .schedule-glimpse-card {
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      border-radius: 1rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
    }
    .event-date-box {
      padding: 0.75rem 1rem;
      border-radius: 0.85rem;
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.3);
      text-align: center;
      min-width: 65px;
    }
    .date-month {
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--accent-rose);
      text-transform: uppercase;
      display: block;
    }
    .date-day {
      font-size: 1.4rem;
      font-weight: 800;
      color: #FFFFFF;
      line-height: 1;
    }
    .event-details {
      flex: 1;
    }
    .event-occasion-tag {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--accent-gold);
      text-transform: uppercase;
    }
    .event-outfit-title {
      font-size: 1.05rem;
      color: #FFFFFF;
      font-weight: 700;
      margin: 0.15rem 0;
    }
    .event-time {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    @media (max-width: 900px) {
      .hero-container { grid-template-columns: 1fr; }
      .today-hero-grid { grid-template-columns: 1fr; }
      .today-image-col { min-height: 280px; }
      .analysis-prompt-card { flex-direction: column; text-align: center; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  userName = 'Fashionista';
  recommendations: Outfit[] = [];
  todayPick: Outfit | null = null;
  weather: WeatherInfo | null = null;
  analysis: UserAnalysis | null = null;
  upcomingSchedules: ScheduleEvent[] = [];
  selectedCompareOutfit: Outfit | null = null;

  constructor(
    private authService: AuthService,
    private recService: RecommendationService,
    private weatherService: WeatherService,
    private analysisService: AnalysisService,
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.authService.userProfile$.subscribe((p: any) => {
      if (p?.name) this.userName = p.name;
    });

    this.weatherService.getWeather().subscribe((w: WeatherInfo | null) => (this.weather = w));

    this.analysisService.getLatestAnalysis().subscribe((a: UserAnalysis | null) => (this.analysis = a));

    this.recService.getRecommendations().subscribe((recs: Outfit[]) => {
      this.recommendations = recs;
      if (recs.length > 0) {
        this.todayPick = recs[0];
      }
    });

    this.calendarService.getSchedules(true).subscribe((s: ScheduleEvent[]) => {
      this.upcomingSchedules = s.slice(0, 2);
    });
  }

  openCompare(outfit: Outfit): void {
    this.selectedCompareOutfit = outfit;
  }
}
