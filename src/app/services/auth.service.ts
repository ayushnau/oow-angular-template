import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthActions } from '../store/slices/auth.slice';

export interface UserAddress {
  _id: string;
  details: {
    address: string;
    id: string;
    location: {
      lat: number;
      lng: number;
    };
    houseFloor: string;
    buildingName: string;
  };
  addressString: string;
  type: string;
  isActive: boolean;
}

export interface User {
  _id: string;
  userCodeId: string;
  phone: string;
  countryCode: string;
  address: UserAddress[];
}

export interface AuthResponse {
  results: {
    token: string;
    user: User;
  };
  message: string;
  code: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'https://themeonestaging.petpooja.com/api/auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private store: Store
  ) {}

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  login(countryCode: string, phone: string): Observable<any> {
    this.store.dispatch(AuthActions.setPhone({ phone, countryCode }));
    return this.http.post(`${this.API_URL}/login`, { countryCode, phone });
  }

  verifyOtp(countryCode: string, phone: string, token: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/verify`, {
      countryCode,
      phone,
      token
    }).pipe(
      tap(response => {
        if (response.results?.token) {
          localStorage.setItem('token', response.results.token);
          this.store.dispatch(AuthActions.setUser({ user: response.results.user }));
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.store.dispatch(AuthActions.clearAuth());
  }
} 