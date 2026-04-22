import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface AnalyticsStats {
  totalVisitors: number;
  totalPageViews: number;
  deviceStats: { _id: string; count: number }[];
  browserStats: { _id: string; count: number }[];
  topPages: { _id: string; count: number }[];
}

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService extends ApiService {
  
  getStats(): Observable<{success: boolean; stats: AnalyticsStats}> {
    return this.http.get<{success: boolean; stats: AnalyticsStats}>('/analytics/stats');
  }
}
