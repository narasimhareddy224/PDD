import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Outfit } from '../models/outfit.model';
import { ApiResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  private apiUrl = `${environment.apiUrl}/recommendations`;

  constructor(private http: HttpClient) {}

  getRecommendations(filters?: {
    occasion?: string;
    style?: string;
    budget?: string;
    weather?: string;
    temperature?: number;
  }): Observable<Outfit[]> {
    let params = new HttpParams();
    if (filters?.occasion) params = params.set('occasion', filters.occasion);
    if (filters?.style) params = params.set('style', filters.style);
    if (filters?.budget) params = params.set('budget', filters.budget);
    if (filters?.weather) params = params.set('weather', filters.weather);
    if (filters?.temperature) params = params.set('temperature', filters.temperature.toString());

    return this.http.get<ApiResponse<Outfit[]>>(this.apiUrl, { params }).pipe(
      map((res) => (res.success && res.data ? res.data : [])),
      catchError(() => of([]))
    );
  }

  getRecommendationById(id: string): Observable<Outfit | null> {
    return this.http.get<ApiResponse<Outfit>>(`${this.apiUrl}/${id}`).pipe(
      map((res) => (res.success && res.data ? res.data : null)),
      catchError(() => of(null))
    );
  }
}
