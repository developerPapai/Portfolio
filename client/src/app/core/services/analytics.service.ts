import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService extends ApiService {
  private router = inject(Router);
  
  private sessionIdKey = 'portfolio_session_id';
  private sessionId: string = '';

  constructor() {
    super();
    this.initSession();
    this.trackNavigation();
    this.trackClicks();
  }

  private initSession() {
    if (!this.isBrowser) return;

    let id = localStorage.getItem(this.sessionIdKey);
    if (!id) {
      id = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
      localStorage.setItem(this.sessionIdKey, id);
    }
    this.sessionId = id;
  }

  private trackNavigation() {
    if (!this.isBrowser) return;

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.logVisit(event.urlAfterRedirects);
    });

    // Initial load
    this.logVisit(this.router.url);
  }

  private trackClicks() {
    if (!this.isBrowser) return;

    window.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target) return;

      const clickData = {
        elementId: target.id || '',
        elementClass: target.className.toString() || '',
        text: target.innerText?.substring(0, 50) || '',
        path: this.router.url,
        timestamp: new Date()
      };

      // Only log meaningful clicks (buttons, links, etc.)
      if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('a')) {
        this.logClick(clickData);
      }
    });
  }

  private logVisit(path: string) {
    if (!this.isBrowser) return;
    
    const url = '/analytics/visit'; 
    this.http.post(url, { sessionId: this.sessionId, path }).subscribe({
      error: () => {} // Silent fail for analytics
    });
  }

  private logClick(clickData: any) {
    if (!this.isBrowser) return;

    const url = '/analytics/click';
    this.http.post(url, { sessionId: this.sessionId, clickData }).subscribe({
      error: () => {} 
    });
  }
}
