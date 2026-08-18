import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { User, UserProfile, ApiResponse } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private userProfileSubject = new BehaviorSubject<UserProfile | null>(null);
  public userProfile$ = this.userProfileSubject.asObservable();

  private tokenKey = 'nextfit_auth_token';

  constructor(private http: HttpClient, private toast: ToastService) {
    this.checkInitialSession();
  }

  public getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  public setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  public isAuthenticated(): boolean {
    return !!this.getToken();
  }

  private checkInitialSession(): void {
    const token = this.getToken();
    if (token) {
      this.syncUserSession().subscribe({
        error: () => this.logout(false),
      });
    } else {
      // Default demo login for instant frictionless experience
      const demoToken = 'mock-token-demo-user-1';
      this.setToken(demoToken);
      this.syncUserSession().subscribe();
    }
  }

  public syncUserSession(): Observable<any> {
    return this.http.post<ApiResponse<{ user: User; profile: UserProfile }>>(`${this.apiUrl}/auth/sync`, {}).pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.currentUserSubject.next(res.data.user);
          this.userProfileSubject.next(res.data.profile);
        }
      }),
      catchError((err) => {
        return of(null);
      })
    );
  }

  public login(email: string, _password: string): Observable<boolean> {
    const mockUid = 'user_' + btoa(email).replace(/=/g, '').substring(0, 10);
    const token = `mock-token-${mockUid}`;
    this.setToken(token);

    return this.syncUserSession().pipe(
      map(() => {
        this.toast.success('Welcome back!', 'Successfully signed in to NextFit AI');
        return true;
      }),
      catchError((err) => {
        this.toast.error('Login Failed', 'Unable to sign in. Please try again.');
        return of(false);
      })
    );
  }

  public register(name: string, email: string, _password: string): Observable<boolean> {
    const mockUid = 'user_' + btoa(email).replace(/=/g, '').substring(0, 10);
    const token = `mock-token-${mockUid}`;
    this.setToken(token);

    return this.syncUserSession().pipe(
      tap(() => {
        this.updateProfile({ name }).subscribe();
        this.toast.success('Account Created!', 'Welcome to NextFit AI fashion experience.');
      }),
      map(() => true),
      catchError(() => {
        this.toast.error('Registration Error', 'Unable to create account.');
        return of(false);
      })
    );
  }

  public updateProfile(profileData: Partial<UserProfile>): Observable<UserProfile | null> {
    return this.http.put<ApiResponse<UserProfile>>(`${this.apiUrl}/users/me`, profileData).pipe(
      map((res) => {
        if (res.success && res.data) {
          this.userProfileSubject.next(res.data);
          this.toast.success('Profile Saved', 'Your fashion preferences have been updated.');
          return res.data;
        }
        return null;
      }),
      catchError((err) => {
        this.toast.error('Update Failed', 'Could not save profile changes.');
        return of(null);
      })
    );
  }

  public updateFcmToken(fcmToken: string): Observable<boolean> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/auth/fcm-token`, { fcmToken }).pipe(
      map((res) => res.success),
      catchError(() => of(false))
    );
  }

  public logout(notify: boolean = true): void {
    localStorage.removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
    this.userProfileSubject.next(null);
    if (notify) {
      this.toast.info('Signed Out', 'You have been safely signed out.');
    }
  }
}
