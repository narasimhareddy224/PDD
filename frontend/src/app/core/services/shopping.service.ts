import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ShoppingProduct, ProductComparisonResult } from '../models/shopping.model';
import { ApiResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingService {
  private apiUrl = `${environment.apiUrl}/shopping`;

  constructor(private http: HttpClient) {}

  searchProducts(query: string, category?: string, platform?: string, maxPrice?: number): Observable<ShoppingProduct[]> {
    let params = new HttpParams().set('query', query);
    if (category) params = params.set('category', category);
    if (platform) params = params.set('platform', platform);
    if (maxPrice) params = params.set('maxPrice', maxPrice.toString());

    return this.http.get<ApiResponse<ShoppingProduct[]>>(`${this.apiUrl}/search`, { params }).pipe(
      map((res) => (res.success && res.data ? res.data : [])),
      catchError(() => of([]))
    );
  }

  comparePrices(title: string, category?: string): Observable<ProductComparisonResult | null> {
    let params = new HttpParams().set('title', title);
    if (category) params = params.set('category', category);

    return this.http.get<ApiResponse<ProductComparisonResult>>(`${this.apiUrl}/compare`, { params }).pipe(
      map((res) => (res.success && res.data ? res.data : null)),
      catchError(() => of(null))
    );
  }
}
