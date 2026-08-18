import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ScheduleEvent } from '../models/schedule.model';
import { ApiResponse } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private apiUrl = `${environment.apiUrl}/schedules`;

  constructor(private http: HttpClient, private toast: ToastService) {}

  getSchedules(upcomingOnly: boolean = false): Observable<ScheduleEvent[]> {
    return this.http.get<ApiResponse<ScheduleEvent[]>>(`${this.apiUrl}?upcoming=${upcomingOnly}`).pipe(
      map((res) => (res.success && res.data ? res.data : [])),
      catchError(() => of([]))
    );
  }

  scheduleOutfit(payload: {
    outfitId: string;
    occasion: string;
    scheduleDate: string;
    scheduleTime?: string;
    notes?: string;
    reminderInterval?: string;
  }): Observable<ScheduleEvent | null> {
    return this.http.post<ApiResponse<ScheduleEvent>>(this.apiUrl, payload).pipe(
      map((res) => {
        if (res.success && res.data) {
          this.toast.success('Outfit Scheduled!', `Your outfit is booked for ${res.data.occasion}.`);
          return res.data;
        }
        return null;
      }),
      catchError((err) => {
        this.toast.error('Scheduling Failed', 'Unable to schedule outfit.');
        return of(null);
      })
    );
  }

  deleteSchedule(id: string): Observable<boolean> {
    return this.http.delete<ApiResponse<any>>(`${this.apiUrl}/${id}`).pipe(
      map((res) => {
        if (res.success) {
          this.toast.info('Schedule Removed', 'Event deleted from calendar.');
          return true;
        }
        return false;
      }),
      catchError(() => of(false))
    );
  }
}
