import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserAnalysis } from '../models/analysis.model';
import { ApiResponse } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AnalysisService {
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient, private toast: ToastService) {}

  uploadPhoto(file: File): Observable<string | null> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post<ApiResponse<{ photoUrl: string }>>(`${this.apiUrl}/images/upload`, formData).pipe(
      map((res) => {
        if (res.success && res.data?.photoUrl) {
          return res.data.photoUrl;
        }
        return null;
      }),
      catchError((err) => {
        this.toast.error('Upload Failed', 'Failed to upload photo for analysis.');
        return of(null);
      })
    );
  }

  analyzePhoto(photoUrl: string): Observable<UserAnalysis | null> {
    return this.http.post<ApiResponse<UserAnalysis>>(`${this.apiUrl}/analysis`, { photoUrl }).pipe(
      map((res) => {
        if (res.success && res.data) {
          this.toast.success('Analysis Complete', 'AI successfully detected your skin tone and body styling metrics.');
          return res.data;
        }
        return null;
      }),
      catchError((err) => {
        this.toast.error('Analysis Error', 'Failed to analyze photo.');
        return of(null);
      })
    );
  }

  getLatestAnalysis(): Observable<UserAnalysis | null> {
    return this.http.get<ApiResponse<UserAnalysis>>(`${this.apiUrl}/analysis`).pipe(
      map((res) => (res.success ? res.data : null)),
      catchError(() => of(null))
    );
  }

  updateCorrections(corrections: Partial<UserAnalysis>): Observable<UserAnalysis | null> {
    return this.http.put<ApiResponse<UserAnalysis>>(`${this.apiUrl}/analysis`, corrections).pipe(
      map((res) => {
        if (res.success && res.data) {
          this.toast.success('Preferences Updated', 'Your manual corrections have been applied.');
          return res.data;
        }
        return null;
      }),
      catchError(() => {
        this.toast.error('Update Failed', 'Could not save corrections.');
        return of(null);
      })
    );
  }
}
