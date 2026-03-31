import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { RunningService } from './running.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const API = 'http://localhost:8080/api/auth';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  provider: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http       = inject(HttpClient);
  private router     = inject(Router);
  private runService = inject(RunningService);

  currentUser = signal<AuthUser | null>(null);
  loading     = signal(false);
  error       = signal<string | null>(null);

  readonly isLoggedIn = computed(() => this.currentUser() !== null);

  register(email: string, password: string, name: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.post<AuthUser>(`${API}/register`, { email, password, name }).subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.loading.set(false);
        this.runService.loadAll();
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.error.set(e.error?.message || 'Registration failed');
        this.loading.set(false);
      }
    });
  }

  login(email: string, password: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.http.post<AuthUser>(`${API}/login`, { email, password },
      { withCredentials: true }
    ).subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.loading.set(false);
        this.runService.loadAll();
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.error.set(e.error?.message || 'Invalid email or password');
        this.loading.set(false);
      }
    });
  }

  loginWithGoogle(): void {
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  logout(): void {
    this.http.post(`${API}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.currentUser.set(null);
        this.router.navigate(['/login']);
      },
      error: () => {
        this.currentUser.set(null);
        this.router.navigate(['/login']);
      }
    });
  }

  checkSession(): void {
    this.http.get<AuthUser>(`${API}/me`, { withCredentials: true }).subscribe({
      next: (user) => {
        this.currentUser.set(user);
        this.runService.loadAll();
      },
      error: () => {
        this.currentUser.set(null);
      }
    });
  }

  restoreSession(): Observable<boolean> {
    return this.http.get<AuthUser>(`${API}/me`, { withCredentials: true }).pipe(
      map((user) => {
        this.currentUser.set(user);
        this.runService.loadAll();
        return true;
      }),
      catchError(() => {
        return of(false);
      })
    );
  }
}