import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AnalysisService } from '../../core/services/analysis.service';
import { UserAnalysis, SkinTone, BodyType, FitnessLevel, FashionStyle } from '../../core/models/analysis.model';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-image-analysis',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container analysis-page">
      <div class="page-header">
        <div>
          <div class="badge badge-violet"><i class="fa-solid fa-wand-magic-sparkles"></i> Computer Vision</div>
          <h1 class="page-title">AI Silhouette & Skin Tone Analysis</h1>
          <p class="page-sub">Upload or capture a photo to calculate skin undertones, silhouette symmetry, and color palettes</p>
        </div>
      </div>

      <!-- Main Analysis View Grid -->
      <div class="analysis-grid">
        <!-- Left: Upload / Camera Capture Panel -->
        <div class="upload-panel glass-card">
          <!-- Preview Box / Live Camera -->
          <div class="image-preview-area" [class.is-scanning]="isAnalyzing">
            <!-- Scan laser animation line -->
            <div class="scan-laser" *ngIf="isAnalyzing"></div>

            <!-- Preview Image -->
            <img
              *ngIf="previewUrl && !isCameraActive"
              [src]="previewUrl"
              alt="Uploaded Fashion Preview"
              class="preview-img"
            />

            <!-- Live Camera Stream -->
            <video
              #videoElement
              *ngIf="isCameraActive"
              autoplay
              playsinline
              class="camera-stream"
            ></video>

            <!-- Empty Dropzone State -->
            <div *ngIf="!previewUrl && !isCameraActive" class="dropzone-empty" (click)="fileInput.click()">
              <div class="drop-icon">
                <i class="fa-solid fa-cloud-arrow-up"></i>
              </div>
              <h4>Upload or Snap a Photo</h4>
              <p>Supports JPG, JPEG, PNG, WEBP (Max 10MB)</p>
              <button type="button" class="btn btn-secondary btn-sm mt-2">
                <i class="fa-regular fa-folder-open"></i> Select File
              </button>
            </div>
          </div>

          <!-- Hidden native file input -->
          <input
            #fileInput
            type="file"
            accept="image/jpeg,image/png,image/webp,image/jpg"
            (change)="onFileSelected($event)"
            class="hidden-file-input"
          />

          <!-- Action Buttons -->
          <div class="upload-actions">
            <button class="btn btn-secondary flex-1" (click)="fileInput.click()" [disabled]="isAnalyzing">
              <i class="fa-solid fa-image"></i> Gallery
            </button>

            <button
              class="btn btn-secondary flex-1"
              *ngIf="!isCameraActive"
              (click)="startCamera()"
              [disabled]="isAnalyzing"
            >
              <i class="fa-solid fa-camera"></i> Camera
            </button>

            <button
              class="btn btn-primary flex-1"
              *ngIf="isCameraActive"
              (click)="capturePhoto()"
            >
              <i class="fa-solid fa-circle-dot"></i> Capture
            </button>

            <button
              class="btn btn-primary flex-1"
              *ngIf="previewUrl && !isCameraActive"
              (click)="runAnalysis()"
              [disabled]="isAnalyzing"
            >
              <span *ngIf="!isAnalyzing"><i class="fa-solid fa-wand-sparkles"></i> Analyze AI</span>
              <span *ngIf="isAnalyzing"><i class="fa-solid fa-spinner animate-spin"></i> Scanning...</span>
            </button>
          </div>

          <!-- Progress Bar -->
          <div class="progress-bar-wrap" *ngIf="isAnalyzing">
            <div class="progress-fill"></div>
          </div>
        </div>

        <!-- Right: AI Results & Interactive Manual Corrections -->
        <div class="results-panel">
          <div *ngIf="!analysis && !isAnalyzing" class="glass-card empty-results-card">
            <div class="empty-icon"><i class="fa-solid fa-microchip text-violet"></i></div>
            <h3>No Analysis Record Yet</h3>
            <p>Upload a full-length portrait or mirror selfie on the left to extract your personalized fashion geometry.</p>
          </div>

          <div *ngIf="isAnalyzing" class="glass-card scanning-card">
            <div class="spinner-large"></div>
            <h3>Analyzing Visual Complexion & Form...</h3>
            <p class="scanning-step">{{ scanningStepText }}</p>
          </div>

          <div *ngIf="analysis && !isAnalyzing" class="glass-card results-card">
            <!-- Header Result -->
            <div class="results-header">
              <div>
                <span class="confidence-badge">
                  <i class="fa-solid fa-shield-check"></i> {{ (analysis.confidence * 100) | number:'1.0-0' }}% AI Confidence
                </span>
                <h2 class="results-title">Fashion Profile Detected</h2>
              </div>
              <button
                class="btn btn-secondary btn-sm"
                (click)="toggleEditMode()"
              >
                <i class="fa-solid" [ngClass]="isEditMode ? 'fa-check' : 'fa-pen-to-square'"></i>
                {{ isEditMode ? 'Save Edits' : 'Edit Results' }}
              </button>
            </div>

            <!-- 4 Core Metrics Grid -->
            <div class="metrics-grid">
              <!-- Skin Tone -->
              <div class="metric-card">
                <span class="metric-lbl">Skin Tone</span>
                <div *ngIf="!isEditMode" class="metric-val text-rose">{{ analysis.skinTone }}</div>
                <select *ngIf="isEditMode" [(ngModel)]="editableAnalysis.skinTone" class="form-control form-control-sm">
                  <option *ngFor="let st of availableSkinTones" [value]="st">{{ st }}</option>
                </select>
                <span class="metric-sub">Undertone: {{ analysis.undertone || 'Warm Neutral' }}</span>
              </div>

              <!-- Body Type -->
              <div class="metric-card">
                <span class="metric-lbl">Body Type</span>
                <div *ngIf="!isEditMode" class="metric-val text-gold">{{ analysis.bodyType }}</div>
                <select *ngIf="isEditMode" [(ngModel)]="editableAnalysis.bodyType" class="form-control form-control-sm">
                  <option *ngFor="let bt of availableBodyTypes" [value]="bt">{{ bt }}</option>
                </select>
                <span class="metric-sub">Silhouette Structure</span>
              </div>

              <!-- Fitness Level -->
              <div class="metric-card">
                <span class="metric-lbl">Fitness Category</span>
                <div *ngIf="!isEditMode" class="metric-val text-emerald">{{ analysis.fitnessLevel }}</div>
                <select *ngIf="isEditMode" [(ngModel)]="editableAnalysis.fitnessLevel" class="form-control form-control-sm">
                  <option *ngFor="let fl of availableFitnessLevels" [value]="fl">{{ fl }}</option>
                </select>
                <span class="metric-sub">Proportions</span>
              </div>

              <!-- Style Aesthetic -->
              <div class="metric-card">
                <span class="metric-lbl">Fashion Style</span>
                <div *ngIf="!isEditMode" class="metric-val text-violet">{{ analysis.style }}</div>
                <select *ngIf="isEditMode" [(ngModel)]="editableAnalysis.style" class="form-control form-control-sm">
                  <option *ngFor="let st of availableStyles" [value]="st">{{ st }}</option>
                </select>
                <span class="metric-sub">Signature Vibe</span>
              </div>
            </div>

            <!-- Recommended Color Palette -->
            <div class="palette-section" *ngIf="analysis.recommendedColorPalette?.length">
              <h4 class="palette-title"><i class="fa-solid fa-palette text-gold"></i> Harmonic Color Palette</h4>
              <div class="palette-swatches">
                <div *ngFor="let col of analysis.recommendedColorPalette" class="palette-pill">
                  <span class="swatch-circle" [style.background-color]="getColorHex(col)"></span>
                  <span class="swatch-name">{{ col }}</span>
                </div>
              </div>
              <p class="contrast-advice"><i class="fa-solid fa-lightbulb text-gold"></i> {{ analysis.contrastRecommendation }}</p>
            </div>

            <!-- Body Styling Tips -->
            <div class="tips-section" *ngIf="analysis.bodyTypeStylingTips?.length">
              <h4 class="palette-title"><i class="fa-solid fa-sparkles text-rose"></i> Silhouette Tailoring Tips</h4>
              <ul class="tips-list">
                <li *ngFor="let tip of analysis.bodyTypeStylingTips">{{ tip }}</li>
              </ul>
            </div>

            <!-- Medical & Scientific Disclaimer -->
            <div class="disclaimer-box">
              <i class="fa-solid fa-circle-info"></i>
              <span>{{ analysis.disclaimer }}</span>
            </div>

            <!-- CTA -->
            <div class="results-cta">
              <a routerLink="/recommendations" class="btn btn-primary btn-block">
                <i class="fa-solid fa-shirt"></i> View Personalized Outfits
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .analysis-page { padding: 3rem 0; }
    .page-header { margin-bottom: 2.5rem; }
    .page-title { font-size: 2.2rem; color: #FFFFFF; }
    .page-sub { font-size: 0.92rem; color: var(--text-secondary); }
    .analysis-grid {
      display: grid;
      grid-template-columns: 1fr 1.35fr;
      gap: 2rem;
    }
    .upload-panel {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .image-preview-area {
      position: relative;
      width: 100%;
      height: 380px;
      border-radius: 1rem;
      background: #0D111A;
      border: 2px dashed rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .image-preview-area.is-scanning {
      border-color: var(--accent-rose);
    }
    .preview-img, .camera-stream {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .dropzone-empty {
      text-align: center;
      padding: 2rem;
      cursor: pointer;
    }
    .drop-icon {
      font-size: 3rem;
      color: var(--accent-rose);
      margin-bottom: 1rem;
    }
    .dropzone-empty h4 { font-size: 1.15rem; color: #FFFFFF; margin-bottom: 0.35rem; }
    .dropzone-empty p { font-size: 0.8rem; color: var(--text-muted); }
    .hidden-file-input { display: none; }
    .scan-laser {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: linear-gradient(90deg, transparent, var(--accent-rose), transparent);
      box-shadow: 0 0 15px var(--accent-rose);
      z-index: 10;
      animation: laserScan 2s infinite ease-in-out;
    }
    @keyframes laserScan {
      0% { top: 0%; }
      50% { top: 100%; }
      100% { top: 0%; }
    }
    .upload-actions {
      display: flex;
      gap: 0.75rem;
    }
    .flex-1 { flex: 1; }
    .progress-bar-wrap {
      height: 6px;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 3px;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent-rose), var(--accent-violet));
      animation: progressAnim 2.5s infinite linear;
    }
    @keyframes progressAnim {
      0% { width: 0%; transform: translateX(-100%); }
      50% { width: 100%; transform: translateX(0%); }
      100% { width: 100%; transform: translateX(100%); }
    }
    .results-panel { display: flex; flex-direction: column; }
    .empty-results-card, .scanning-card, .results-card {
      padding: 2.25rem;
    }
    .empty-results-card {
      text-align: center;
      padding: 4rem 2rem;
    }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
    .scanning-card { text-align: center; padding: 4rem 2rem; }
    .spinner-large {
      width: 54px;
      height: 54px;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-top-color: var(--accent-rose);
      border-radius: 50%;
      margin: 0 auto 1.5rem;
      animation: spin 1s linear infinite;
    }
    .scanning-step {
      font-size: 0.88rem;
      color: var(--accent-rose);
      margin-top: 0.5rem;
      font-weight: 600;
    }
    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.5rem;
    }
    .confidence-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.78rem;
      font-weight: 700;
      color: #6EE7B7;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      margin-bottom: 0.5rem;
    }
    .results-title { font-size: 1.6rem; color: #FFFFFF; }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 1.75rem;
    }
    .metric-card {
      padding: 1.15rem;
      border-radius: 1rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
    }
    .metric-lbl {
      font-size: 0.72rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
      display: block;
      margin-bottom: 0.35rem;
    }
    .metric-val { font-size: 1.25rem; font-weight: 800; }
    .metric-sub { font-size: 0.75rem; color: var(--text-secondary); display: block; margin-top: 0.25rem; }
    .form-control-sm { padding: 0.4rem 0.75rem; font-size: 0.85rem; }
    .palette-section, .tips-section {
      margin-bottom: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid var(--border-subtle);
    }
    .palette-title {
      font-size: 1rem;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .palette-swatches {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    .palette-pill {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.35rem 0.85rem;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      font-size: 0.82rem;
      font-weight: 600;
      color: #FFFFFF;
    }
    .swatch-circle { width: 12px; height: 12px; border-radius: 50%; }
    .contrast-advice { font-size: 0.82rem; color: var(--text-secondary); }
    .tips-list {
      padding-left: 1.25rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
      line-height: 1.6;
    }
    .disclaimer-box {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 1rem;
      border-radius: 0.85rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      font-size: 0.78rem;
      color: var(--text-muted);
      line-height: 1.5;
      margin-bottom: 1.5rem;
    }
    .disclaimer-box i { margin-top: 0.15rem; color: var(--accent-gold); }
    .btn-block { width: 100%; }
    @media (max-width: 900px) {
      .analysis-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ImageAnalysisComponent implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;

  previewUrl: string | null = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80';
  isCameraActive = false;
  mediaStream: MediaStream | null = null;
  isAnalyzing = false;
  scanningStepText = 'Scanning facial complexion and dermal undertones...';

  analysis: UserAnalysis | null = null;
  editableAnalysis: any = {};
  isEditMode = false;

  availableSkinTones: SkinTone[] = ['Very Fair', 'Fair', 'Medium', 'Olive', 'Brown', 'Deep'];
  availableBodyTypes: BodyType[] = ['Rectangle', 'Triangle', 'Inverted Triangle', 'Oval', 'Hourglass'];
  availableFitnessLevels: FitnessLevel[] = ['Lean', 'Average', 'Athletic', 'Muscular', 'Plus-size'];
  availableStyles: FashionStyle[] = ['Casual', 'Formal', 'Smart Casual', 'Streetwear', 'Traditional', 'Sporty', 'Minimalist', 'Trendy'];

  constructor(private analysisService: AnalysisService, private toast: ToastService) {}

  ngOnInit(): void {
    this.analysisService.getLatestAnalysis().subscribe((a: UserAnalysis | null) => {
      if (a) {
        this.analysis = a;
        this.editableAnalysis = { ...a };
        if (a.photoUrl) this.previewUrl = a.photoUrl;
      }
    });
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }

  onFileSelected(event: any): void {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
      this.stopCamera();
    };
    reader.readAsDataURL(file);
  }

  startCamera(): void {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'user' } })
        .then((stream) => {
          this.mediaStream = stream;
          this.isCameraActive = true;
          setTimeout(() => {
            if (this.videoElement) {
              this.videoElement.nativeElement.srcObject = stream;
            }
          }, 100);
        })
        .catch((err) => {
          this.toast.error('Camera Access Denied', 'Please allow camera permissions or upload from gallery.');
        });
    }
  }

  stopCamera(): void {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }
    this.isCameraActive = false;
  }

  capturePhoto(): void {
    if (!this.videoElement) return;
    const video = this.videoElement.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      this.previewUrl = canvas.toDataURL('image/jpeg');
      this.stopCamera();
      this.toast.success('Photo Captured', 'Ready for AI stylistic analysis.');
    }
  }

  runAnalysis(): void {
    if (!this.previewUrl) return;
    this.isAnalyzing = true;
    this.scanningStepText = 'Scanning facial complexion and dermal undertones...';

    setTimeout(() => {
      this.scanningStepText = 'Computing silhouette geometry and shoulder-to-waist ratios...';
    }, 900);

    setTimeout(() => {
      this.scanningStepText = 'Synthesizing harmonic color palettes and fashion style match...';
    }, 1800);

    this.analysisService.analyzePhoto(this.previewUrl).subscribe({
      next: (res: UserAnalysis | null) => {
        this.isAnalyzing = false;
        if (res) {
          this.analysis = res;
          this.editableAnalysis = { ...res };
        }
      },
      error: () => {
        this.isAnalyzing = false;
      },
    });
  }

  toggleEditMode(): void {
    if (this.isEditMode) {
      // Save manual corrections
      this.analysisService.updateCorrections(this.editableAnalysis).subscribe((res: UserAnalysis | null) => {
        if (res) {
          this.analysis = res;
          this.isEditMode = false;
        }
      });
    } else {
      this.isEditMode = true;
      this.editableAnalysis = { ...this.analysis };
    }
  }

  getColorHex(colorName: string): string {
    const map: Record<string, string> = {
      'Navy Blue': '#1E3A8A',
      'Navy': '#1E3A8A',
      'Burgundy': '#881337',
      'Emerald': '#047857',
      'Emerald Green': '#047857',
      'White': '#FFFFFF',
      'Charcoal': '#374151',
      'Forest Green': '#14532D',
      'Soft Rose': '#FDA4AF',
      'Slate Gray': '#64748B',
      'Olive Green': '#4D7C0F',
      'Warm Terracotta': '#C2410C',
      'Mustard Yellow': '#D97706',
      'Deep Teal': '#0F766E',
      'Cream Ivory': '#FEF3C7',
      'Cobalt Blue': '#1D4ED8',
      'Bright Gold': '#F59E0B',
      'Pure White': '#FFFFFF',
      'Fuchsia': '#C026D3',
    };
    return map[colorName] || '#94A3B8';
  }
}
