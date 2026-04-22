import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.checkToken();
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get token(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_token');
    }
    return null;
  }

  login(credentials: { email: string, password: string }) {
    return this.http.post<{success: boolean, token: string, user: User}>(
      `${environment.apiUrl}/auth/login`, 
      credentials
    ).pipe(
      tap(res => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', res.token);
          this.currentUserSubject.next(res.user);
        }
      })
    );
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token');
      this.currentUserSubject.next(null);
      this.router.navigate(['/login']);
    }
  }

  private checkToken() {
    if (typeof window !== 'undefined' && this.token) {
      // Decode token to get user info or verify on backend
      this.http.get<{success: boolean, user: User}>(`${environment.apiUrl}/auth/me`).subscribe({
        next: (res) => this.currentUserSubject.next(res.user),
        error: () => this.logout() // invalid token
      });
    }
  }
}
