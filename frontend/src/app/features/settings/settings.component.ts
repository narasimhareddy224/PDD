import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container settings-page">
      <div class="page-header">
        <div>
          <div class="badge badge-rose"><i class="fa-solid fa-gear"></i> System Preferences</div>
          <h1 class="page-title">Application Settings</h1>
          <p class="page-sub">Configure push notifications, automated reminders, and data preferences</p>
        </div>
      </div>

      <div class="settings-grid">
        <!-- FCM Push Notifications -->
        <div class="settings-card glass-card">
          <div class="card-head">
            <i class="fa-solid fa-bell text-gold"></i>
            <div>
              <h3>Push Notification Alerts</h3>
              <p>Receive scheduled outfit reminders directly on your mobile and desktop</p>
            </div>
          </div>

          <div class="toggle-row">
            <div>
              <span class="toggle-title">Event Reminder Alerts (1 Day & 2 Hours Before)</span>
              <span class="toggle-desc">Sent via Firebase Cloud Messaging</span>
            </div>
            <input type="checkbox" [(ngModel)]="fcmEnabled" (change)="toggleFCM()" class="toggle-switch" />
          </div>

          <div class="toggle-row">
            <div>
              <span class="toggle-title">Daily Morning Weather Styling Tip</span>
              <span class="toggle-desc">Curated forecast and fabric suggestions</span>
            </div>
            <input type="checkbox" [(ngModel)]="weatherAlertsEnabled" class="toggle-switch" />
          </div>
        </div>

        <!-- Privacy & Security -->
        <div class="settings-card glass-card">
          <div class="card-head">
            <i class="fa-solid fa-shield-halved text-emerald"></i>
            <div>
              <h3>Privacy & Data Controls</h3>
              <p>Manage your biometric styling data and photo privacy</p>
            </div>
          </div>

          <div class="toggle-row">
            <div>
              <span class="toggle-title">Save Conversational Chat History</span>
              <span class="toggle-desc">Enable NextFit AI assistant memory across sessions</span>
            </div>
            <input type="checkbox" [(ngModel)]="chatHistoryEnabled" class="toggle-switch" />
          </div>

          <div class="danger-zone">
            <h4>Account Management</h4>
            <p>Permanently remove your fashion profile, saved favorites, and photo analysis history.</p>
            <button class="btn btn-outline text-danger mt-2" (click)="deleteAccount()">
              <i class="fa-solid fa-trash"></i> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-page { padding: 3rem 0 5rem; }
    .page-header { margin-bottom: 2.5rem; }
    .page-title { font-size: 2.2rem; color: #FFFFFF; }
    .page-sub { font-size: 0.92rem; color: var(--text-secondary); }
    .settings-grid { display: flex; flex-direction: column; gap: 2rem; max-width: 840px; }
    .settings-card { padding: 2rem; }
    .card-head { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.5rem; }
    .card-head i { font-size: 1.75rem; margin-top: 0.2rem; }
    .card-head h3 { font-size: 1.25rem; color: #FFFFFF; }
    .card-head p { font-size: 0.85rem; color: var(--text-secondary); }
    .toggle-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 0;
      border-bottom: 1px solid var(--border-subtle);
    }
    .toggle-title { font-weight: 700; color: #FFFFFF; font-size: 0.95rem; display: block; }
    .toggle-desc { font-size: 0.8rem; color: var(--text-muted); display: block; margin-top: 0.15rem; }
    .toggle-switch {
      width: 44px;
      height: 24px;
      accent-color: var(--accent-rose);
      cursor: pointer;
    }
    .danger-zone {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(248, 113, 113, 0.2);
    }
    .danger-zone h4 { color: #F87171; font-size: 1rem; margin-bottom: 0.25rem; }
    .danger-zone p { font-size: 0.82rem; color: var(--text-secondary); }
    .text-danger { color: #F87171 !important; border-color: rgba(248, 113, 113, 0.5) !important; }
    .text-gold { color: var(--accent-gold); }
    .text-emerald { color: var(--accent-emerald); }
    .mt-2 { margin-top: 0.75rem; }
  `]
})
export class SettingsComponent implements OnInit {
  fcmEnabled = true;
  weatherAlertsEnabled = true;
  chatHistoryEnabled = true;

  constructor(private authService: AuthService, private toast: ToastService) {}

  ngOnInit(): void {}

  toggleFCM(): void {
    if (this.fcmEnabled) {
      this.authService.updateFcmToken('fcm_token_' + Date.now()).subscribe(() => {
        this.toast.success('FCM Enabled', 'You will receive scheduled reminders before events.');
      });
    } else {
      this.toast.info('Notifications Muted', 'Push reminders have been turned off.');
    }
  }

  deleteAccount(): void {
    if (confirm('Are you sure you wish to delete your NextFit AI account? This action is irreversible.')) {
      this.authService.logout();
      this.toast.info('Account Cleared', 'Your account data has been removed.');
    }
  }
}
