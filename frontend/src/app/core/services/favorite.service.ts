import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { FavoriteOutfit } from '../models/outfit.model';
import { ApiResponse } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private apiUrl = `${environment.apiUrl}/favorites`;

  constructor(private http: HttpClient, private toast: ToastService) {}

  getFavorites(): Observable<FavoriteOutfit[]> {
    return this.http.get<ApiResponse<FavoriteOutfit[]>>(this.apiUrl).pipe(
      map((res) => (res.success && res.data ? res.data : [])),
      catchError(() => of([]))
    );
  }

  addFavorite(outfitId: string, notes?: string, tags?: string[]): Observable<boolean> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/${outfitId}`, { notes, tags }).pipe(
      map((res) => {
        if (res.success) {
          this.toast.success('Saved to Favorites', 'Outfit added to your personal collection.');
          return true;
        }
        return false;
      }),
      catchError(() => {
        this.toast.error('Error', 'Failed to bookmark outfit.');
        return of(false);
      })
    );
  }

  removeFavorite(outfitId: string): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${outfitId}`).pipe(
      map((res) => {
        if (res.success) {
          this.toast.info('Removed', 'Outfit removed from favorites.');
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }
}
