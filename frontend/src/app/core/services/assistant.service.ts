import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/user.model';

export interface ChatMessage {
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: Date;
  outfitSuggestions?: string[];
  productSuggestions?: string[];
  weatherSnapshot?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AssistantService {
  private apiUrl = `${environment.apiUrl}/assistant`;

  constructor(private http: HttpClient) {}

  sendMessage(
    message: string,
    context?: { occasion?: string; weather?: string; temperature?: number; currentOutfitId?: string }
  ): Observable<{
    reply: string;
    suggestedOutfits: string[];
    suggestedProducts: string[];
    chatHistory: ChatMessage[];
  } | null> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/chat`, { message, context }).pipe(
      map((res) => (res.success && res.data ? res.data : null)),
      catchError(() => of(null))
    );
  }

  getChatHistory(): Observable<ChatMessage[]> {
    return this.http.get<ApiResponse<ChatMessage[]>>(`${this.apiUrl}/history`).pipe(
      map((res) => (res.success && res.data ? res.data : [])),
      catchError(() => of([]))
    );
  }
}
