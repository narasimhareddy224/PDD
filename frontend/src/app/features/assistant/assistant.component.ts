import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AssistantService, ChatMessage } from '../../core/services/assistant.service';

@Component({
  selector: 'app-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="container assistant-page">
      <div class="assistant-wrapper glass-card">
        <!-- Chat Header -->
        <div class="chat-header">
          <div class="header-stylist">
            <div class="stylist-avatar">
              <i class="fa-solid fa-robot"></i>
            </div>
            <div>
              <h2 class="stylist-name">NextFit AI Fashion Stylist</h2>
              <span class="online-status"><span class="pulse-dot"></span> Online • Personalized Style Advisor</span>
            </div>
          </div>

          <div class="header-tags">
            <span class="badge badge-violet"><i class="fa-solid fa-wand-magic-sparkles"></i> Context Aware</span>
          </div>
        </div>

        <!-- Messages History Stream -->
        <div class="messages-container" #scrollContainer>
          <!-- Welcome Message -->
          <div class="msg-row assistant">
            <div class="msg-avatar"><i class="fa-solid fa-sparkles"></i></div>
            <div class="msg-bubble">
              <p>Hello! I am your NextFit AI personal fashion stylist. How can I assist with your wardrobe today?</p>
              <p class="msg-meta">Ask about occasion styling, color compatibility, weather-friendly fabrics, or budget looks!</p>
            </div>
          </div>

          <!-- Dynamic Chat Messages -->
          <div
            *ngFor="let msg of messages"
            class="msg-row"
            [ngClass]="msg.sender"
          >
            <div class="msg-avatar" *ngIf="msg.sender === 'assistant'">
              <i class="fa-solid fa-robot"></i>
            </div>

            <div class="msg-bubble">
              <div class="msg-text" [innerHTML]="formatMessage(msg.text)"></div>

              <!-- Suggested Outfits / Products Tags -->
              <div *ngIf="msg.outfitSuggestions?.length" class="suggestions-box">
                <span class="sugg-heading"><i class="fa-solid fa-shirt"></i> Curated Outfit Options:</span>
                <div class="sugg-chips">
                  <a
                    *ngFor="let outfitTitle of msg.outfitSuggestions"
                    routerLink="/recommendations"
                    class="sugg-chip"
                  >
                    {{ outfitTitle }} <i class="fa-solid fa-arrow-right"></i>
                  </a>
                </div>
              </div>

              <span class="msg-time">{{ msg.timestamp | date:'shortTime' }}</span>
            </div>
          </div>

          <!-- Typing Spinner Indicator -->
          <div class="msg-row assistant" *ngIf="isThinking">
            <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-bubble typing-bubble">
              <span class="dot-typing"></span>
              <span class="dot-typing"></span>
              <span class="dot-typing"></span>
            </div>
          </div>
        </div>

        <!-- Quick Suggestion Chips -->
        <div class="quick-chips-row">
          <button
            *ngFor="let prompt of quickPrompts"
            class="quick-chip"
            (click)="sendQuickPrompt(prompt)"
            [disabled]="isThinking"
          >
            {{ prompt }}
          </button>
        </div>

        <!-- Chat Input Bar -->
        <div class="chat-input-bar">
          <input
            type="text"
            [(ngModel)]="userInput"
            (keyup.enter)="sendMessage()"
            placeholder="Ask anything... (e.g. What should I wear for an interview tomorrow?)"
            class="chat-input"
            [disabled]="isThinking"
          />
          <button
            class="btn btn-primary btn-send"
            (click)="sendMessage()"
            [disabled]="!userInput.trim() || isThinking"
          >
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .assistant-page { padding: 2.5rem 0 4rem; }
    .assistant-wrapper {
      max-width: 920px;
      margin: 0 auto;
      height: 78vh;
      min-height: 600px;
      display: flex;
      flex-direction: column;
      border-radius: 1.5rem;
      overflow: hidden;
      border: 1px solid var(--border-subtle);
    }
    .chat-header {
      padding: 1.25rem 1.75rem;
      background: var(--bg-surface-elevated);
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .header-stylist { display: flex; align-items: center; gap: 1rem; }
    .stylist-avatar {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--accent-violet), var(--accent-rose));
      color: #FFFFFF;
      font-size: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 15px rgba(139, 92, 246, 0.4);
    }
    .stylist-name { font-size: 1.15rem; font-weight: 700; color: #FFFFFF; }
    .online-status { font-size: 0.78rem; color: var(--text-secondary); display: flex; align-items: center; gap: 0.4rem; }
    .pulse-dot { width: 8px; height: 8px; border-radius: 50%; background: #10B981; animation: pulseGlow 2s infinite; }
    .messages-container {
      flex: 1;
      padding: 1.75rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .msg-row {
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      max-width: 82%;
    }
    .msg-row.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    .msg-row.assistant { align-self: flex-start; }
    .msg-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--accent-violet);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
    }
    .msg-bubble {
      padding: 1rem 1.25rem;
      border-radius: 1.25rem;
      line-height: 1.6;
      font-size: 0.92rem;
    }
    .msg-row.assistant .msg-bubble {
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
      border-top-left-radius: 0.25rem;
    }
    .msg-row.user .msg-bubble {
      background: linear-gradient(135deg, var(--accent-rose), #BE123C);
      color: #FFFFFF;
      border-top-right-radius: 0.25rem;
      box-shadow: 0 4px 15px var(--accent-rose-glow);
    }
    .msg-meta { font-size: 0.82rem; color: var(--text-muted); margin-top: 0.4rem; }
    .msg-time { font-size: 0.7rem; color: var(--text-muted); display: block; text-align: right; margin-top: 0.4rem; }
    .suggestions-box {
      margin-top: 0.85rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
    }
    .sugg-heading { font-size: 0.78rem; font-weight: 700; color: var(--accent-gold); display: block; margin-bottom: 0.4rem; }
    .sugg-chips { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .sugg-chip {
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      font-size: 0.78rem;
      color: #FFFFFF;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }
    .sugg-chip:hover { border-color: var(--accent-rose); color: var(--accent-rose); }
    .quick-chips-row {
      display: flex;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: rgba(0, 0, 0, 0.2);
      overflow-x: auto;
      border-top: 1px solid var(--border-subtle);
    }
    .quick-chip {
      padding: 0.4rem 0.9rem;
      border-radius: 9999px;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.8rem;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
      transition: var(--transition-fast);
    }
    .quick-chip:hover { border-color: var(--accent-rose); color: #FFFFFF; }
    .chat-input-bar {
      padding: 1.25rem 1.5rem;
      background: var(--bg-surface);
      border-top: 1px solid var(--border-subtle);
      display: flex;
      gap: 0.75rem;
    }
    .chat-input {
      flex: 1;
      padding: 0.85rem 1.25rem;
      border-radius: 0.85rem;
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-subtle);
      color: #FFFFFF;
      font-size: 0.95rem;
    }
    .chat-input:focus { outline: none; border-color: var(--accent-rose); }
    .btn-send { width: 50px; height: 50px; border-radius: 0.85rem; padding: 0; }
    .typing-bubble { display: flex; gap: 0.35rem; align-items: center; padding: 0.85rem 1.25rem; }
    .dot-typing {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent-rose);
      animation: dotPulse 1.2s infinite ease-in-out;
    }
    .dot-typing:nth-child(2) { animation-delay: 0.2s; }
    .dot-typing:nth-child(3) { animation-delay: 0.4s; }
    @keyframes dotPulse {
      0%, 100% { opacity: 0.2; transform: translateY(0); }
      50% { opacity: 1; transform: translateY(-4px); }
    }
  `]
})
export class AssistantComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  messages: ChatMessage[] = [];
  userInput = '';
  isThinking = false;

  quickPrompts = [
    'What should I wear for an interview?',
    'What should I wear to a wedding?',
    'What colors suit my style?',
    'What should I wear to college?',
    'Find me a budget-friendly outfit',
    'What should I wear today based on the weather?',
  ];

  constructor(private assistantService: AssistantService) {}

  ngOnInit(): void {
    this.assistantService.getChatHistory().subscribe((history: ChatMessage[]) => {
      this.messages = history;
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch {}
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text || this.isThinking) return;

    this.messages.push({
      sender: 'user',
      text,
      timestamp: new Date(),
    });

    this.userInput = '';
    this.isThinking = true;

    this.assistantService.sendMessage(text).subscribe({
      next: (res: any) => {
        this.isThinking = false;
        if (res) {
          this.messages.push({
            sender: 'assistant',
            text: res.reply,
            timestamp: new Date(),
            outfitSuggestions: res.suggestedOutfits,
            productSuggestions: res.suggestedProducts,
          });
        }
      },
      error: () => {
        this.isThinking = false;
      },
    });
  }

  sendQuickPrompt(prompt: string): void {
    this.userInput = prompt;
    this.sendMessage();
  }

  formatMessage(text: string): string {
    return text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  }
}
