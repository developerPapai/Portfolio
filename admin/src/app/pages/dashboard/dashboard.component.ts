import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AnalyticsService, AnalyticsStats } from '../../core/services/analytics.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private analyticsService = inject(AnalyticsService);

  stats = { projects: 0, skills: 0, unreadMessages: 0 };
  analytics: AnalyticsStats | null = null;
  isLoadingAnalytics = true;

  ngOnInit() {
    this.fetchStats();
    this.fetchAnalytics();
  }

  fetchStats() {
    this.http.get<any>(`${environment.apiUrl}/projects/all`).subscribe(res => this.stats.projects = res.count);
    this.http.get<any>(`${environment.apiUrl}/skills/all`).subscribe(res => this.stats.skills = res.count);
    this.http.get<any>(`${environment.apiUrl}/messages?read=false`).subscribe(res => this.stats.unreadMessages = res.count);
  }

  fetchAnalytics() {
    this.isLoadingAnalytics = true;
    this.analyticsService.getStats().subscribe({
      next: (res) => {
        this.analytics = res.stats;
        this.isLoadingAnalytics = false;
      },
      error: () => this.isLoadingAnalytics = false
    });
  }
}
