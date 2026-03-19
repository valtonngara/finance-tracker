import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '@env/environment';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '@app/models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'finance_tracker_token';
  private readonly apiUrl = environment.apiUrl;

  currentUser = signal<User | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    if (this.isLoggedIn()) {
      this.loadUser();
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const body: LoginRequest = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, body).pipe(
      tap((response) => {
        localStorage.setItem(this.TOKEN_KEY, response.access_token);
        this.loadUser();
      })
    );
  }

  register(email: string, password: string, name: string): Observable<AuthResponse> {
    const body: RegisterRequest = { email, password, name };
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, body).pipe(
      tap((response) => {
        localStorage.setItem(this.TOKEN_KEY, response.access_token);
        this.loadUser();
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp * 1000;
      return Date.now() < expiry;
    } catch {
      return false;
    }
  }

  loadUser(): void {
    const token = this.getToken();
    if (!token) {
      this.currentUser.set(null);
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user: User = {
        id: payload.sub || payload.id,
        email: payload.email || '',
        name: payload.name || '',
        currency: payload.currency || 'USD',
        theme: payload.theme || 'dark',
        created_at: payload.created_at || ''
      };
      this.currentUser.set(user);
    } catch {
      this.currentUser.set(null);
    }
  }
}
