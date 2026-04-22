import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SkillsService extends ApiService {
  
  getSkills(category?: string): Observable<{success: boolean, data: Skill[]}> {
    let params: any = {};
    if (category) params.category = category;
    
    return this.http.get<{success: boolean, data: Skill[]}>('/skills', { params });
  }
}
