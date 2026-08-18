import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CalendarService } from '../../core/services/calendar.service';
import { RecommendationService } from '../../core/services/recommendation.service';
import { ScheduleEvent, ReminderInterval } from '../../core/models/schedule.model';
import { Outfit } from '../../core/models/outfit.model';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container calendar-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <div class="badge badge-rose"><i class="fa-solid fa-calendar-days"></i> Event Stylist Planner</div>
          <h1 class="page-title">Outfit Calendar & Reminders</h1>
          <p class="page-sub">Schedule your looks in advance with automated push reminder notifications</p>
        </div>

        <button class="btn btn-primary" (click)="openScheduleModal()">
          <i class="fa-solid fa-plus"></i> Schedule New Outfit
        </button>
      </div>

      <!-- Calendar Month Banner & Grid -->
      <div class="calendar-layout">
        <!-- Left: Upcoming Events Timeline -->
        <div class="events-timeline-col">
          <h3 class="col-title"><i class="fa-solid fa-timeline text-gold"></i> Scheduled Event Lineup</h3>

          <div *ngIf="schedules.length === 0" class="empty-schedules glass-card">
            <i class="fa-regular fa-calendar-xmark"></i>
            <p>No outfits scheduled yet. Plan your next event below!</p>
          </div>

          <div class="schedule-cards-list">
            <div
              *ngFor="let s of schedules"
              class="schedule-item-card glass-card"
              [class.selected]="selectedSchedule?._id === s._id"
              (click)="selectedSchedule = s"
            >
              <div class="date-badge">
                <span class="m-txt">{{ s.scheduleDate | date:'MMM' }}</span>
                <span class="d-txt">{{ s.scheduleDate | date:'dd' }}</span>
              </div>

              <div class="s-info">
                <span class="s-occ">{{ s.occasion }}</span>
                <h4 class="s-title">{{ s.outfit.title }}</h4>
                <div class="s-meta">
                  <span><i class="fa-regular fa-clock"></i> {{ s.scheduleTime || '09:00 AM' }}</span>
                  <span><i class="fa-regular fa-bell"></i> {{ s.reminderInterval }}</span>
                </div>
              </div>

              <button class="btn-del" (click)="deleteSchedule(s._id!, $event)" title="Delete Event">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Right: Selected Event Outfit Spotlight -->
        <div class="spotlight-col">
          <div *ngIf="!selectedSchedule && schedules.length > 0" class="select-prompt glass-card">
            <p>Select any scheduled event to view outfit details</p>
          </div>

          <div *ngIf="selectedSchedule" class="spotlight-card glass-card">
            <div class="spotlight-hero">
              <img [src]="selectedSchedule.outfit.image" [alt]="selectedSchedule.outfit.title" class="spotlight-img" />
              <div class="spotlight-badge">{{ selectedSchedule.occasion }} Outfit</div>
            </div>

            <div class="spotlight-body">
              <span class="badge badge-emerald">Event Date: {{ selectedSchedule.scheduleDate | date:'fullDate' }}</span>
              <h2 class="spotlight-title">{{ selectedSchedule.outfit.title }}</h2>
              <p class="spotlight-reason">{{ selectedSchedule.outfit.reason }}</p>

              <div class="components-mini-grid">
                <div class="c-box">
                  <span class="c-lbl">Top</span>
                  <span class="c-val">{{ selectedSchedule.outfit.top.name }}</span>
                </div>
                <div class="c-box">
                  <span class="c-lbl">Bottom</span>
                  <span class="c-val">{{ selectedSchedule.outfit.bottom.name }}</span>
                </div>
                <div class="c-box">
                  <span class="c-lbl">Footwear</span>
                  <span class="c-val">{{ selectedSchedule.outfit.footwear.name }}</span>
                </div>
                <div class="c-box">
                  <span class="c-lbl">Accessories</span>
                  <span class="c-val">{{ selectedSchedule.outfit.accessories.name }}</span>
                </div>
              </div>

              <div *ngIf="selectedSchedule.notes" class="notes-callout">
                <i class="fa-solid fa-note-sticky text-gold"></i> Note: {{ selectedSchedule.notes }}
              </div>

              <div class="spotlight-actions">
                <a [routerLink]="['/outfits', selectedSchedule.outfit.outfitId || selectedSchedule.outfit._id]" class="btn btn-secondary btn-sm flex-1">
                  View Full Specs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Schedule Modal Dialog -->
      <div class="modal-overlay" *ngIf="isModalOpen" (click)="isModalOpen = false">
        <div class="modal-card glass-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3><i class="fa-solid fa-calendar-plus text-rose"></i> Schedule Outfit for Event</h3>
            <button class="btn-close" (click)="isModalOpen = false"><i class="fa-solid fa-xmark"></i></button>
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Select Outfit</label>
              <select [(ngModel)]="newSchedule.outfitId" class="form-control">
                <option *ngFor="let o of availableOutfits" [value]="o.outfitId || o._id">
                  {{ o.title }} ({{ o.occasion }})
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2">
              <div class="form-group">
                <label class="form-label">Event Occasion</label>
                <input type="text" [(ngModel)]="newSchedule.occasion" class="form-control" placeholder="e.g. Job Interview, Sangeet" />
              </div>
              <div class="form-group">
                <label class="form-label">Event Date</label>
                <input type="date" [(ngModel)]="newSchedule.scheduleDate" class="form-control" />
              </div>
            </div>

            <div class="grid grid-cols-2">
              <div class="form-group">
                <label class="form-label">Time</label>
                <input type="time" [(ngModel)]="newSchedule.scheduleTime" class="form-control" />
              </div>
              <div class="form-group">
                <label class="form-label">FCM Reminder Alert</label>
                <select [(ngModel)]="newSchedule.reminderInterval" class="form-control">
                  <option value="1 day before">1 day before</option>
                  <option value="12 hours before">12 hours before</option>
                  <option value="2 hours before">2 hours before</option>
                  <option value="At event time">At event time</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Personal Event Notes</label>
              <textarea [(ngModel)]="newSchedule.notes" class="form-control" rows="2" placeholder="e.g. Carry portfolio bag, iron shirt the night before"></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary btn-sm" (click)="isModalOpen = false">Cancel</button>
            <button class="btn btn-primary btn-sm" (click)="saveSchedule()" [disabled]="!newSchedule.scheduleDate || !newSchedule.occasion">
              Confirm Schedule
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .calendar-page { padding: 3rem 0 5rem; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2.5rem;
    }
    .page-title { font-size: 2.2rem; color: #FFFFFF; }
    .page-sub { font-size: 0.92rem; color: var(--text-secondary); }
    .calendar-layout {
      display: grid;
      grid-template-columns: 1fr 1.25fr;
      gap: 2.5rem;
    }
    .col-title { font-size: 1.25rem; font-weight: 700; color: #FFFFFF; margin-bottom: 1.25rem; display: flex; align-items: center; gap: 0.5rem; }
    .text-gold { color: var(--accent-gold); }
    .empty-schedules { text-align: center; padding: 3rem; color: var(--text-muted); }
    .empty-schedules i { font-size: 2.5rem; margin-bottom: 0.75rem; display: block; }
    .schedule-cards-list { display: flex; flex-direction: column; gap: 1rem; }
    .schedule-item-card {
      padding: 1.25rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      cursor: pointer;
      border: 1px solid var(--border-subtle);
    }
    .schedule-item-card.selected {
      border-color: var(--accent-rose);
      background: rgba(244, 63, 94, 0.08);
    }
    .date-badge {
      padding: 0.6rem 0.9rem;
      border-radius: 0.85rem;
      background: rgba(244, 63, 94, 0.15);
      border: 1px solid rgba(244, 63, 94, 0.3);
      text-align: center;
      min-width: 60px;
    }
    .m-txt { font-size: 0.72rem; font-weight: 700; color: var(--accent-rose); text-transform: uppercase; display: block; }
    .d-txt { font-size: 1.35rem; font-weight: 800; color: #FFFFFF; line-height: 1; }
    .s-info { flex: 1; }
    .s-occ { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: var(--accent-gold); }
    .s-title { font-size: 1.05rem; font-weight: 700; color: #FFFFFF; margin: 0.1rem 0; }
    .s-meta { display: flex; gap: 1rem; font-size: 0.78rem; color: var(--text-muted); }
    .btn-del {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0.4rem;
    }
    .btn-del:hover { color: #F87171; }
    .spotlight-card {
      border-radius: 1.5rem;
      overflow: hidden;
    }
    .spotlight-hero {
      position: relative;
      height: 280px;
      background: #0D111A;
    }
    .spotlight-img { width: 100%; height: 100%; object-fit: cover; }
    .spotlight-badge {
      position: absolute;
      top: 16px;
      left: 16px;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      background: rgba(9, 11, 16, 0.85);
      backdrop-filter: blur(10px);
      color: #FFFFFF;
      font-weight: 700;
      font-size: 0.8rem;
    }
    .spotlight-body {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .spotlight-title { font-size: 1.6rem; color: #FFFFFF; font-weight: 800; }
    .spotlight-reason { font-size: 0.88rem; color: var(--text-secondary); line-height: 1.5; }
    .components-mini-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    .c-box {
      padding: 0.75rem;
      border-radius: 0.75rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
    }
    .c-lbl { font-size: 0.68rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); display: block; }
    .c-val { font-size: 0.82rem; font-weight: 600; color: #FFFFFF; }
    .notes-callout {
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      background: rgba(245, 158, 11, 0.08);
      border: 1px solid rgba(245, 158, 11, 0.25);
      font-size: 0.85rem;
      color: #FDE68A;
    }
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
    }
    .modal-card { width: 100%; max-width: 580px; padding: 2rem; border-radius: 1.5rem; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
    .btn-close { background: transparent; border: none; color: #FFFFFF; font-size: 1.2rem; cursor: pointer; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; }
    .flex-1 { flex: 1; }
    @media (max-width: 900px) {
      .calendar-layout { grid-template-columns: 1fr; }
      .page-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
    }
  `]
})
export class CalendarComponent implements OnInit {
  schedules: ScheduleEvent[] = [];
  selectedSchedule: ScheduleEvent | null = null;
  availableOutfits: Outfit[] = [];

  isModalOpen = false;
  newSchedule = {
    outfitId: '',
    occasion: 'College',
    scheduleDate: '2026-08-17',
    scheduleTime: '09:00',
    notes: '',
    reminderInterval: '1 day before' as ReminderInterval,
  };

  constructor(
    private calendarService: CalendarService,
    private recService: RecommendationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadSchedules();
    this.recService.getRecommendations().subscribe((outfits: Outfit[]) => {
      this.availableOutfits = outfits;
      if (outfits.length > 0 && !this.newSchedule.outfitId) {
        this.newSchedule.outfitId = outfits[0].outfitId || outfits[0]._id!;
      }

      // Check if URL params contain outfitId to preselect
      const paramOutfitId = this.route.snapshot.queryParamMap.get('outfitId');
      if (paramOutfitId) {
        this.newSchedule.outfitId = paramOutfitId;
        this.openScheduleModal();
      }
    });
  }

  loadSchedules(): void {
    this.calendarService.getSchedules().subscribe((res: ScheduleEvent[]) => {
      this.schedules = res;
      if (res.length > 0 && !this.selectedSchedule) {
        this.selectedSchedule = res[0];
      }
    });
  }

  openScheduleModal(): void {
    this.isModalOpen = true;
  }

  saveSchedule(): void {
    this.calendarService.scheduleOutfit(this.newSchedule).subscribe((created: any) => {
      if (created) {
        this.isModalOpen = false;
        this.loadSchedules();
        this.selectedSchedule = created;
      }
    });
  }

  deleteSchedule(id: string, event: Event): void {
    event.stopPropagation();
    this.calendarService.deleteSchedule(id).subscribe(() => {
      this.schedules = this.schedules.filter((s: ScheduleEvent) => s._id !== id);
      if (this.selectedSchedule?._id === id) {
        this.selectedSchedule = this.schedules[0] || null;
      }
    });
  }
}
