import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/user.model';

export interface WeatherInfo {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  isRainy: boolean;
  isHot: boolean;
  isCold: boolean;
  stylingAdvice: string;
  recommendedFabrics: string[];
}

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = `${environment.apiUrl}/weather`;

  constructor(private http: HttpClient) {}

  getWeather(city?: string, lat?: number, lon?: number): Observable<WeatherInfo | null> {
    let params = new HttpParams();
    if (city) params = params.set('city', city);
    if (lat) params = params.set('lat', lat.toString());
    if (lon) params = params.set('lon', lon.toString());

    return this.http.get<ApiResponse<WeatherInfo>>(this.apiUrl, { params }).pipe(
      map((res) => (res.success && res.data ? res.data : null)),
      catchError(() => of(null))
    );
  }
}
