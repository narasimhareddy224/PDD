import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toasts$ = new BehaviorSubject<ToastMessage[]>([]);

  getToasts(): Observable<ToastMessage[]> {
    return this.toasts$.asObservable();
  }

  show(type: 'success' | 'error' | 'info' | 'warning', title: string, message: string, durationMs: number = 4000): void {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: ToastMessage = { id, type, title, message };
    const current = this.toasts$.value;
    this.toasts$.next([...current, toast]);

    setTimeout(() => {
      this.remove(id);
    }, durationMs);
  }

  success(title: string, message: string): void {
    this.show('success', title, message);
  }

  error(title: string, message: string): void {
    this.show('error', title, message, 5000);
  }

  info(title: string, message: string): void {
    this.show('info', title, message);
  }

  warning(title: string, message: string): void {
    this.show('warning', title, message);
  }

  remove(id: string): void {
    const filtered = this.toasts$.value.filter((t) => t.id !== id);
    this.toasts$.next(filtered);
  }
}
